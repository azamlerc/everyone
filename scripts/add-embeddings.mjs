// add-embeddings.mjs
// Fetches a Wikipedia summary for each bucket list entry and generates
// an OpenAI embedding, storing both back in the database.
//
// Setup:
//   cd scripts
//   npm install
//   # add OPENAI_API_KEY to your .env file
//   node add-embeddings.mjs
//
// Skips entries that already have a wikiSummary. Safe to re-run.

import { MongoClient } from "mongodb";
import OpenAI from "openai";
import { config } from "dotenv";

config();

const DELAY_MS = 2000;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWikiSummary(url) {
  if (!url.includes("wikipedia.org")) return null;

  const { hostname, pathname } = new URL(url);
  const lang  = hostname.match(/^([a-z]{2})\.wikipedia\.org/)?.[1] ?? "en";
  const title = decodeURIComponent(pathname.split("/").at(-1));
  const apiUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json` +
    `&prop=extracts&exintro=true&explaintext=true&redirects=true&titles=${encodeURIComponent(title)}`;

  const res = await fetch(apiUrl, {
    headers: { "User-Agent": "BucketListEnricher/1.0 (https://andrewzc.net)" }
  });
  if (!res.ok) { console.warn(`  HTTP ${res.status}`); return null; }

  const data    = await res.json();
  const extract = Object.values(data.query?.pages ?? {})[0]?.extract;
  if (!extract) return null;

  // Take the first three substantive paragraphs
  return extract.split("\n")
    .filter(p => p.trim().length > 50)
    .filter(p => !/<[a-z]/i.test(p))
    .slice(0, 3).join(" ") || null;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error("Missing MONGODB_URI"); process.exit(1); }
  if (!process.env.OPENAI_API_KEY) { console.error("Missing OPENAI_API_KEY"); process.exit(1); }

  const client = new MongoClient(uri);
  await client.connect();
  const col    = client.db("everyone").collection("bucket");
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const docs = await col.find({ link: { $exists: true }, wikiSummary: { $exists: false } }).toArray();
  console.log(`Found ${docs.length} documents to enrich.`);

  let ok = 0, failed = 0;

  for (const doc of docs) {
    console.log(`\n[${ok + failed + 1}/${docs.length}] ${doc.name}`);

    const summary = await fetchWikiSummary(doc.link);
    if (!summary) {
      console.warn("  No summary found — skipping");
      failed++;
      await sleep(DELAY_MS);
      continue;
    }

    console.log(`  Summary: ${summary.slice(0, 80)}…`);

    const res       = await openai.embeddings.create({ model: "text-embedding-3-small", input: summary, dimensions: 512 });
    const embedding = res.data[0].embedding;

    await col.updateOne({ _id: doc._id }, { $set: { wikiSummary: summary, wikiEmbedding: embedding } });
    console.log(`  ✓ embedding saved (${embedding.length} dimensions)`);
    ok++;

    await sleep(DELAY_MS);
  }

  console.log(`\nDone. ${ok} enriched, ${failed} skipped.`);
  await client.close();
}

main().catch(err => { console.error(err); process.exit(1); });
