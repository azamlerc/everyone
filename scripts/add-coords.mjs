// add-coords.mjs
// Fetches coordinates for each entity in the bucket collection from its
// Wikipedia link, then writes coords (human-readable string) and location
// (GeoJSON Point) back to the database.
//
// Setup:
//   cd scripts
//   npm install
//   cp .env.example .env   # then fill in your connection string
//   node add-coords.mjs
//
// Skips entities that already have coords. Logs progress as it goes.

import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

// ─── helpers ──────────────────────────────────────────────────────────────────

function toGeoJSON(lat, lon) {
  return { type: "Point", coordinates: [lon, lat] };
}

function formatDecimal(lat, lon) {
  return `${lat.toFixed(8)}, ${lon.toFixed(8)}`;
}

function makeResult(lat, lon) {
  return {
    coords: formatDecimal(lat, lon),
    location: toGeoJSON(lat, lon),
  };
}

// ─── coordinate parsers ───────────────────────────────────────────────────────

function parseWikiCoord(inner) {
  let parts = inner.split("|").map(s => s.trim());
  if (parts.length > 2 && /^display=/i.test(parts[0])) parts.shift();
  if (parts.length > 2 && /^display=/i.test(parts[parts.length - 1])) parts.pop();
  parts = parts.filter(p => !/^(type:|region:|scale:|name=)/i.test(p));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { lat: parseFloat(parts[0]), lon: parseFloat(parts[1]) };
  }
  const normDir = p => p === "O" ? "W" : p;
  const latDirIdx = parts.findIndex(p => p === "N" || p === "S");
  const lonDirIdx = parts.findIndex((p, i) => (p === "E" || p === "W" || p === "O") && i > latDirIdx);
  if (latDirIdx === -1 || lonDirIdx === -1) return null;
  function dms(degIdx, dirIdx) {
    const sign = (normDir(parts[dirIdx]) === "S" || normDir(parts[dirIdx]) === "W") ? -1 : 1;
    const count = dirIdx - degIdx;
    const deg = parseFloat(parts[degIdx]) || 0;
    const min = count >= 2 ? (parseFloat(parts[degIdx + 1]) || 0) : 0;
    const sec = count >= 3 ? (parseFloat(parts[degIdx + 2]) || 0) : 0;
    return sign * (deg + min / 60 + sec / 3600);
  }
  const lat = dms(0, latDirIdx);
  const lon = dms(latDirIdx + 1, lonDirIdx);
  if (isNaN(lat) || isNaN(lon)) return null;
  return { lat, lon };
}

function parseInfoboxFields(wikitext) {
  const fields = {};
  for (const line of wikitext.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(1, eqIdx).trim().toLowerCase();
    fields[key] = trimmed.slice(eqIdx + 1).trim();
  }
  return fields;
}

function getCoordTemplates(wikitext) {
  const results = [];
  const re = /\{\{(?:[Cc]oord(?:enadas|s)?)\|([^}]+)\}\}/g;
  let m;
  while ((m = re.exec(wikitext)) !== null) results.push(m[1]);
  return results;
}

// ─── fetch helpers ─────────────────────────────────────────────────────────────

const HEADERS = {
  "User-Agent": "everyone-bucket-enricher/1.0 (https://andrewzc.net)",
};

async function fetchJSON(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (res.status === 429) { console.warn(`  429 rate limited — skipping`); return null; }
  if (!res.ok) { console.warn(`  HTTP ${res.status} for ${url}`); return null; }
  return res.json();
}

// ─── Wikipedia ────────────────────────────────────────────────────────────────

function wikiApiUrl(link) {
  const parts = link.replace(/^https?:\/\//, "").split("/");
  const lang  = parts[0].split(".")[0];
  const page  = parts[parts.length - 1];
  return `https://api.wikimedia.org/core/v1/wikipedia/${lang}/page/${page}`;
}

function wikiBaseUrl(link) {
  try { const u = new URL(link); return `${u.protocol}//${u.host}`; }
  catch { return "https://en.wikipedia.org"; }
}

const DELAY_MS = 2000;
let lastFetch  = 0;

async function loadWikipediaContent(link) {
  const now     = Date.now();
  const elapsed = now - lastFetch;
  if (elapsed < DELAY_MS) await new Promise(r => setTimeout(r, DELAY_MS - elapsed));
  lastFetch = Date.now();

  const json = await fetchJSON(wikiApiUrl(link));
  if (!json || json.errorKey) return null;
  return (json.source ?? null)?.replace(/\{\{coord\|qid=/gi, "{{xxxxx|qid=");
}

// ─── Wikidata fallback ────────────────────────────────────────────────────────

async function fetchWikidataCoords(entityId) {
  const url  = `https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&props=claims&entity=${entityId}&origin=*`;
  const json = await fetchJSON(url);
  const snak = json?.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
  if (!snak) return null;
  const { latitude: lat, longitude: lon } = snak;
  return (lat != null && lon != null) ? { lat, lon } : null;
}

async function wikidataSearchByTitle(link) {
  const parts = link.replace(/^https?:\/\//, "").split("/");
  const lang  = parts[0].split(".")[0];
  const page  = decodeURIComponent(parts[parts.length - 1]).replace(/_/g, " ");
  const url   = `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&search=${encodeURIComponent(page)}&language=${lang}&origin=*`;
  const json  = await fetchJSON(url);
  const id    = json?.search?.[0]?.id;
  return id?.startsWith("Q") ? id : null;
}

// ─── main coord extraction ────────────────────────────────────────────────────

async function getCoordsFromUrl(link) {
  if (!link.includes("wikipedia.org")) {
    console.warn(`  Skipping non-Wikipedia link: ${link}`);
    return null;
  }

  const content = await loadWikipediaContent(link);
  if (!content) return null;

  // Follow redirects
  const redirectMatch = content.match(/^#[Rr][Ee][Dd][Ii][Rr][Ee][Cc][Tt]\s+\[\[([^\]]+)\]\]/m);
  if (redirectMatch) {
    const base       = wikiBaseUrl(link);
    const redirected = `${base}/wiki/${encodeURIComponent(redirectMatch[1].replace(/ /g, "_"))}`;
    if (redirected !== link) return getCoordsFromUrl(redirected);
  }

  // {{coord|...}} template
  const templates = getCoordTemplates(content);
  if (templates.length > 0) {
    const parsed = parseWikiCoord(templates[0]);
    if (parsed) { console.log(`  coord template: ${parsed.lat}, ${parsed.lon}`); return makeResult(parsed.lat, parsed.lon); }
  }

  // latitude= / longitude= infobox fields
  const latMatch = content.match(/latitude\s*=\s*([-+]?\d*\.?\d+)/i);
  const lonMatch = content.match(/longitude\s*=\s*([-+]?\d*\.?\d+)/i);
  if (latMatch && lonMatch) {
    const lat = parseFloat(latMatch[1]), lon = parseFloat(lonMatch[1]);
    if (!isNaN(lat) && !isNaN(lon)) { console.log(`  lat/lon fields: ${lat}, ${lon}`); return makeResult(lat, lon); }
  }

  // German infobox fields
  const fields = parseInfoboxFields(content);
  if (fields["breitengrad"] && fields["längengrad"]) {
    const lat = parseFloat(fields["breitengrad"]), lon = parseFloat(fields["längengrad"]);
    if (!isNaN(lat) && !isNaN(lon)) { console.log(`  German fields: ${lat}, ${lon}`); return makeResult(lat, lon); }
  }

  // lat_deg / lon_deg DMS fields
  if (fields["lat_deg"] && fields["lon_deg"]) {
    const latNS = (fields["lat_ns"] || fields["lat_dir"] || "N").toUpperCase();
    const lonEW = (fields["lon_ew"] || fields["lon_dir"] || "E").toUpperCase();
    let lat = (parseFloat(fields["lat_deg"]) || 0) + (parseFloat(fields["lat_min"]) || 0) / 60 + (parseFloat(fields["lat_sec"]) || 0) / 3600;
    let lon = (parseFloat(fields["lon_deg"]) || 0) + (parseFloat(fields["lon_min"]) || 0) / 60 + (parseFloat(fields["lon_sec"]) || 0) / 3600;
    if (latNS === "S") lat = -lat;
    if (lonEW === "W") lon = -lon;
    if (!isNaN(lat) && !isNaN(lon)) { console.log(`  DMS fields: ${lat}, ${lon}`); return makeResult(lat, lon); }
  }

  // Wikidata fallback
  const qdMatch = content.match(/\{\{[Ww]ikidata[Cc]oord\|([^|}\s]+)/);
  let qid = qdMatch?.[1]?.replace(/^Q=/, "Q") ?? null;
  if (!qid) { qid = await wikidataSearchByTitle(link); if (qid) console.log(`  Wikidata key: ${qid}`); }
  if (qid?.startsWith("Q")) {
    const result = await fetchWikidataCoords(qid);
    if (result) { console.log(`  Wikidata coords: ${result.lat}, ${result.lon}`); return makeResult(result.lat, result.lon); }
  }

  console.warn(`  No coordinates found.`);
  return null;
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error("Missing MONGODB_URI — copy .env.example to .env and fill it in."); process.exit(1); }

  const client = new MongoClient(uri);
  await client.connect();
  const col = client.db("everyone").collection("bucket");

  const docs = await col.find({ link: { $exists: true }, coords: { $exists: false } }).toArray();
  console.log(`Found ${docs.length} documents to enrich.`);

  let ok = 0, skipped = 0, failed = 0;

  for (const doc of docs) {
    console.log(`\n[${ok + skipped + failed + 1}/${docs.length}] ${doc.name}`);
    console.log(`  ${doc.link}`);

    const result = await getCoordsFromUrl(doc.link);
    if (!result) { failed++; continue; }

    await col.updateOne({ _id: doc._id }, { $set: { coords: result.coords, location: result.location } });
    console.log(`  ✓ ${result.coords}`);
    ok++;
  }

  console.log(`\nDone. ${ok} updated, ${failed} failed, ${skipped} skipped.`);
  await client.close();
}

main().catch(err => { console.error(err); process.exit(1); });
