// server.mjs — Express server for the bucket list website
//
// Serves the frontend from /public and exposes four API endpoints:
//   GET  /api/bucket                →  all 96 bucket list documents as JSON
//   GET  /api/nearby?lat=&lon=&km=  →  documents within km kilometres of a point
//   POST /api/search                →  semantic search using Atlas Vector Search
//   POST /api/chat                  →  chatbot powered by Claude + tool use
//
// Setup:
//   npm install
//   cp .env.example .env   # fill in MONGODB_URI, OPENAI_API_KEY, ANTHROPIC_API_KEY
//   node server.mjs

import express from 'express';
import { MongoClient } from 'mongodb';
import OpenAI from 'openai';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { makeChatHandler } from './chat.mjs';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const uri  = process.env.MONGODB_URI;

if (!uri)                         { console.error('Missing MONGODB_URI');         process.exit(1); }
if (!process.env.OPENAI_API_KEY)  { console.error('Missing OPENAI_API_KEY');      process.exit(1); }
if (!process.env.ANTHROPIC_API_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }

const client = new MongoClient(uri);
await client.connect();
const db     = client.db('everyone');
const col    = db.collection('bucket');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

await col.createIndex({ location: '2dsphere' });

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

app.get('/api/bucket', async (_req, res) => {
  const items = await col
    .find({}, { projection: { _id: 0, wikiEmbedding: 0 } })
    .sort({ name: 1 })
    .toArray();
  res.json(items);
});

app.get('/api/nearby', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  const km  = parseFloat(req.query.km) || 500;
  if (!isFinite(lat) || !isFinite(lon)) return res.status(400).json({ error: 'lat and lon are required' });
  const items = await col.aggregate([
    { $geoNear: { near: { type: 'Point', coordinates: [lon, lat] }, distanceField: 'distanceKm', maxDistance: km * 1000, spherical: true } },
    { $set:     { distanceKm: { $round: [{ $divide: ['$distanceKm', 1000] }, 0] } } },
    { $project: { _id: 0, wikiEmbedding: 0 } }
  ]).toArray();
  res.json(items);
});

app.post('/api/search', async (req, res) => {
  const query = req.body?.query?.trim();
  if (!query) return res.status(400).json({ error: 'query is required' });
  const embRes   = await openai.embeddings.create({ model: 'text-embedding-3-small', input: query, dimensions: 512 });
  const queryVec = embRes.data[0].embedding;
  const items = await col.aggregate([
    { $vectorSearch: { index: 'vector_index', path: 'wikiEmbedding', queryVector: queryVec, numCandidates: 96, limit: 10 } },
    { $project: { _id: 0, wikiEmbedding: 0, score: { $meta: 'vectorSearchScore' } } }
  ]).toArray();
  res.json(items);
});

app.post('/api/chat', makeChatHandler(col, openai));

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
