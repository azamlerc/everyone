// chat.mjs — POST /api/chat
// A simple chatbot that can answer questions about the bucket list.
// Supports tool use: filter by been/not-been, search by meaning, find nearby.

import Anthropic from "@anthropic-ai/sdk";
import { MongoClient } from "mongodb";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are a knowledgeable and enthusiastic assistant for a personal bucket list of 96 remarkable places and experiences around the world. You have access to tools that let you query the database directly.

The bucket list belongs to a well-travelled person with a particular fondness for transit systems, geographic curiosities, border oddities, and places with a compelling backstory. Entries range from the famous (Great Pyramid, Taj Mahal) to the wonderfully obscure (Null Island, Agloe NY, the Saatse Boot).

Each entry has:
- name and been (visited or not)
- flag (country emoji)
- link (Wikipedia)
- coords and location (GeoJSON)
- challenge (1-5 difficulty score)
- wikiSummary (a few paragraphs from Wikipedia)

Keep replies concise and conversational. When listing places, include their flag emoji. If asked about nearby places, use the findNearby tool. If asked about themes or vibes, use the semanticSearch tool. Be enthusiastic but not sycophantic.`;

const tools = [
  {
    name: "getPlaces",
    description: "Get places from the bucket list, optionally filtered by been (true/false) or challenge score.",
    input_schema: {
      type: "object",
      properties: {
        been:      { type: "boolean", description: "Filter to visited (true) or not yet visited (false) places. Omit for all." },
        challenge: { type: "number", description: "Filter to a specific challenge score (1-5). Omit for all." },
        limit:     { type: "number", description: "Maximum number of results. Default 20." },
      },
    },
  },
  {
    name: "semanticSearch",
    description: "Find places conceptually related to a query using vector search. Use for open-ended questions about themes, vibes, or categories.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Natural language query, e.g. 'nuclear history' or 'quirky border curiosities'" },
        limit: { type: "number", description: "Maximum number of results. Default 5." },
      },
      required: ["query"],
    },
  },
  {
    name: "findNearby",
    description: "Find bucket list places within a given radius of a location. Use your own knowledge to supply coordinates for named places.",
    input_schema: {
      type: "object",
      properties: {
        lat:      { type: "number", description: "Latitude" },
        lon:      { type: "number", description: "Longitude" },
        radiusKm: { type: "number", description: "Search radius in kilometres. Default 500." },
      },
      required: ["lat", "lon"],
    },
  },
];

function strip(doc) {
  const { _id, wikiEmbedding, location, ...rest } = doc;
  return rest;
}

export function makeChatHandler(col, openai) {
  return async (req, res) => {
    const { history = [], message } = req.body || {};
    if (!message) return res.status(400).json({ error: "message is required" });

    const client   = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const messages = [...history, { role: "user", content: message }];

    while (true) {
      const response = await client.messages.create({
        model:      "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system:     SYSTEM_PROMPT,
        tools,
        messages,
      });

      messages.push({ role: "assistant", content: response.content });

      if (response.stop_reason === "end_turn") {
        const reply = response.content
          .filter(b => b.type === "text")
          .map(b => b.text)
          .join("");
        return res.json({ reply, history: messages });
      }

      if (response.stop_reason === "tool_use") {
        const toolResults = await Promise.all(
          response.content
            .filter(b => b.type === "tool_use")
            .map(async ({ id, name, input }) => {
              let result;

              if (name === "getPlaces") {
                const filter = {};
                if (input.been !== undefined) filter.been = input.been;
                if (input.challenge !== undefined) filter.challenge = input.challenge;
                const docs = await col.find(filter, { projection: { wikiEmbedding: 0 } })
                  .limit(input.limit ?? 20).toArray();
                result = docs.map(strip);

              } else if (name === "semanticSearch") {
                const embRes = await openai.embeddings.create({
                  model: "text-embedding-3-small", input: input.query, dimensions: 512,
                });
                const queryVec = embRes.data[0].embedding;
                const docs = await col.aggregate([
                  { $vectorSearch: { index: "vector_index", path: "wikiEmbedding", queryVector: queryVec, numCandidates: 96, limit: input.limit ?? 5 } },
                  { $project: { wikiEmbedding: 0, location: 0, score: { $meta: "vectorSearchScore" } } },
                ]).toArray();
                result = docs.map(strip);

              } else if (name === "findNearby") {
                const docs = await col.aggregate([
                  { $geoNear: { near: { type: "Point", coordinates: [input.lon, input.lat] }, distanceField: "distanceKm", maxDistance: (input.radiusKm ?? 500) * 1000, spherical: true } },
                  { $set: { distanceKm: { $round: [{ $divide: ["$distanceKm", 1000] }, 0] } } },
                  { $project: { wikiEmbedding: 0 } },
                ]).toArray();
                result = docs.map(strip);
              }

              return { type: "tool_result", tool_use_id: id, content: JSON.stringify(result) };
            })
        );

        messages.push({ role: "user", content: toolResults });
      }
    }
  };
}
