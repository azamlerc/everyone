# CLAUDE.md

Notes to Claude on what this project is, how it was built, and how to pick up context quickly for future sessions.

## What this project is

**"AI ❤️ Databases, for everyone!"** is a Medium blog post written as a series of scripted chat transcripts between a curious non-programmer and Claude. The thesis: connecting Claude to MongoDB via MCP lets anyone — with no coding experience and no database background — build a genuinely sophisticated full-stack application, entirely through conversation.

The human character is based on the real author (Andrew, they/them), a hybrid PM/DevRel/engineer with deep travel experience and a personal MongoDB database of ~36,000 entities at andrewzc.net. The bucket list data (96 places) is real. The conversations are dramatized and compressed from real multi-session work, written as a "based on true events" director's cut — same story, pacing fixed, false starts removed, best moments kept.

The target audience is twofold: curious non-programmers (specifically the author's adult son as the primary reader), and MongoDB people who might want to hire Andrew. The post is intended to demonstrate Andrew's ability to explain MongoDB's headline features — MCP, Atlas Vector Search, GeoJSON radius search, tool use — clearly and accessibly.

## Repository structure

```
/
├── README.md                  — project intro and table of contents
├── chats/                     — the seven chat transcripts (the actual blog post)
│   ├── database.md            — setting up MongoDB Atlas, Compass, MCP
│   ├── enhance.md             — flags, Wikipedia links, coordinates, challenge scores
│   ├── website.md             — Express server, API, frontend
│   ├── map.md                 — Leaflet map, clustering, radius search
│   ├── search.md              — vector embeddings, Atlas Vector Search
│   ├── chat.md                — Claude chatbot with tool use
│   └── wrapup.md              — reflection, next steps, closing
├── context/                   — context files Claude reads to stay oriented
│   ├── about-me.md            — the human character's background
│   ├── database-project.md    — full schema, field descriptions, website architecture
│   └── CLAUDE.md              — this file
├── data/
│   └── bucket.csv             — the original 96-place bucket list (name, been)
├── scripts/                   — Node.js enrichment scripts
│   ├── add-coords.mjs         — fetches Wikipedia coords → writes GeoJSON location
│   ├── add-embeddings.mjs     — fetches Wikipedia summary → generates OpenAI embedding
│   ├── package.json           — mongodb, dotenv, openai
│   └── .env.example           — MONGODB_URI, OPENAI_API_KEY
├── website/                   — the full-stack web application
│   ├── server.mjs             — Express server with 4 API endpoints
│   ├── chat.mjs               — Claude chatbot handler with 3 tools
│   ├── package.json           — mongodb, express, dotenv, openai, @anthropic-ai/sdk
│   ├── .env.example           — MONGODB_URI, OPENAI_API_KEY, ANTHROPIC_API_KEY
│   └── public/
│       ├── index.html         — main page
│       ├── chat.html          — chat page
│       ├── styles.css         — shared styles (Avenir, dark mode, map, chat bubbles)
│       ├── bucket.js          — map + list + toggles + near me + semantic search
│       └── chat.js            — chat UI with markdown rendering
└── screenshots/               — screenshots used in the blog post
```

## The database

- **Atlas cluster**: free M0 tier
- **Database**: `everyone`
- **Collection**: `bucket` (96 documents)
- **Key fields**: `name`, `been`, `flag`, `link`, `location` (GeoJSON), `challenge` (1–5), `wikiSummary`, `wikiEmbedding` (512-dim OpenAI)
- **Indexes**: `location` (2dsphere, auto-created on server start), `wikiEmbedding` (Atlas Vector Search index named `vector_index`, 512 dims, cosine similarity, created via Atlas UI)
- **Note**: `coords` (human-readable string) was used during enrichment but later removed — only `location` (GeoJSON) is stored

For full schema documentation see `context/database-project.md`.

## How the chats were written — division of labor

This evolved naturally across several weeks of real sessions:

**Chat 1 (database.md):** Andrew wrote the first full draft himself in the transcript format, then Claude revised for tone and filled in the TODO sections (Atlas setup, Compass setup, MCP config) as complete multi-turn exchanges with accurate step-by-step instructions.

**Chats 2–6 (enhance, website, map, search, chat):** Written live — Andrew played the human character in real time, Claude responded as itself, and we actually did the work (running scripts, writing code, updating the database via MCP). At the end of each session Claude saved a cleaned-up transcript, compressing the messy reality into readable storytelling: false starts removed, rate limit errors elided, the best moments kept. The Null Island coordinates returning 0.00000000 stayed in. The tank at the Transnistrian border stayed in. The "hallelujah, choir of angels" moment stayed in.

**Chat 7 (wrapup.md):** Claude wrote this entirely, synthesizing the arc of the whole project into a reflective closing conversation.

The meta-layer: Andrew wrote both characters' lines (playing Claude), Claude wrote both characters' lines (playing Andrew), and in the live sessions each wrote the other's lines in real time. "Based on true events" fictional summary of actual chats over several weeks.

## Key technical decisions and conventions

- **GeoJSON coordinates**: always `[longitude, latitude]` — longitude first. This trips everyone up.
- **Embeddings**: OpenAI `text-embedding-3-small` at 512 dimensions (not the default 1536, to keep storage light)
- **MCP**: MongoDB MCP Server configured in Claude Desktop via Settings → Developer → Edit Config
- **Server**: ESM modules throughout (`.mjs` extension), `type: "module"` not used to avoid package.json complexity for readers
- **Credentials**: always in `.env` files, never hardcoded, `.env.example` provided for readers
- **No CORS**: frontend and backend are served from the same Express server (`/public` static files), so no cross-origin issues
- **Chatbot model**: `claude-haiku-4-5-20251001` for fast responses; three tools: `getPlaces`, `semanticSearch`, `findNearby`

## Production database cheat codes

The `everyone` database was enriched partly by copying data from Andrew's production `andrewzc` database (same Atlas cluster). Specifically:
- Wikipedia links for obscure entries were cross-referenced against the production `entities` collection where `list: "bucket"`
- `wikiSummary` and `wikiEmbedding` for entries where the script failed were copied via `copy-embeddings.mjs` (not published in the repo — internal migration script)

None of this is mentioned in the transcripts. The blog post presents the enrichment as if it all happened organically, which is true in spirit.

## Things to know about Andrew

- Pronouns: they/them
- Based in France (Guise, northern France), French citizen
- Deep expertise in transit systems, geographic curiosities, border oddities
- The bucket list reflects this: Pyongyang Metro, Saatse Boot, Dieveniškės, Null Island, Agloe NY
- Former Synamedia (Senza platform) — hybrid PM/DevRel/Sales Engineer
- Actively job searching, targeting MongoDB among others — this project is partly an audition
- Two former direct reports currently at MongoDB
- Prefers Claude for architecture and reasoning, Codex for mechanical implementation

## Resuming work

If picking this up in a new session:
1. Read this file
2. Read `context/database-project.md` for the full schema and website architecture
3. The MongoDB MCP server is connected — you can query the `everyone.bucket` collection directly
4. The repo lives at `/Users/andrewzc/Context/everyone/` on Andrew's Mac
5. The blog post is not yet published to Medium — still being polished
