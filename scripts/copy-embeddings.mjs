// copy-embeddings.mjs
// Copies wikiSummary and wikiEmbedding from the production andrewzc DB
// to the everyone/bucket collection, matched by name.
//
// Usage: node copy-embeddings.mjs
// Requires MONGODB_URI (points at the everyone DB) and
//          ANDREWZC_URI (points at the production andrewzc DB) in .env

import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

async function main() {
  const everyoneUri  = process.env.MONGODB_URI;
  const andrewzcUri  = process.env.ANDREWZC_URI;
  if (!everyoneUri) { console.error("Missing MONGODB_URI"); process.exit(1); }
  if (!andrewzcUri) { console.error("Missing ANDREWZC_URI"); process.exit(1); }

  const everyoneClient = new MongoClient(everyoneUri);
  const andrewzcClient = new MongoClient(andrewzcUri);
  await Promise.all([everyoneClient.connect(), andrewzcClient.connect()]);

  const target = everyoneClient.db("everyone").collection("bucket");
  const source = andrewzcClient.db("andrewzc").collection("entities");

  const bucketDocs = await target.find({ wikiSummary: { $exists: false } }).toArray();
  console.log(`Found ${bucketDocs.length} documents needing enrichment.`);

  let ok = 0, missing = 0;

  for (const doc of bucketDocs) {
    const prod = await source.findOne(
      { list: "bucket", name: doc.name },
      { projection: { wikiSummary: 1, wikiEmbedding: 1 } }
    );

    if (!prod?.wikiSummary || !prod?.wikiEmbedding) {
      console.warn(`  No production data for: ${doc.name}`);
      missing++;
      continue;
    }

    await target.updateOne(
      { _id: doc._id },
      { $set: { wikiSummary: prod.wikiSummary, wikiEmbedding: prod.wikiEmbedding } }
    );
    console.log(`  ✓ ${doc.name}`);
    ok++;
  }

  console.log(`\nDone. ${ok} copied, ${missing} not found in production.`);
  await Promise.all([everyoneClient.close(), andrewzcClient.close()]);
}

main().catch(err => { console.error(err); process.exit(1); });
