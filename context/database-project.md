# Database Project

## Intro

This file describes what we built together — a bucket list tracker backed by MongoDB, enriched with geographic and contextual data, displayed on a website with a map, natural language search, and a chatbot.

## MongoDB

We set up MongoDB Atlas (free M0 tier) as our hosted database. The database is called `everyone` and contains a single collection called `bucket`. We connected Claude to it using the MongoDB MCP Server configured in Claude Desktop.

## Bucket List Collection

The `bucket` collection contains 96 documents, each representing a place or experience on the bucket list. Here's the full schema:

### Fields

| Field | Type | Description | How populated |
|-------|------|-------------|---------------|
| `name` | string | Display name of the place | Imported from CSV |
| `been` | boolean | Whether it's been visited | Imported from CSV |
| `flag` | string | One or more country flag emoji, space-separated for multi-country entries | Set via Claude + MCP |
| `link` | string | Wikipedia URL (English or French for some entries) | Set via Claude + MCP |
| `location` | GeoJSON Point | `{ type: "Point", coordinates: [lon, lat] }` | Script (`add-coords.mjs`) + manual for lines/routes — note longitude comes first |
| `challenge` | number (1–5) | Subjective difficulty of visiting | Set via Claude + MCP |
| `wikiSummary` | string | First few paragraphs of the Wikipedia article | Script (`add-embeddings.mjs`) |
| `wikiEmbedding` | array (512 floats) | OpenAI text-embedding-3-small vector for semantic search | Script (`add-embeddings.mjs`) |

### Challenge Score Scale

- **1** — Accessible from a paved road in the US or western/central Europe; or has a dedicated metro stop in those regions
- **2** — A bit off the beaten path
- **3** — Requires flying to a different part of the world, or significant logistical effort
- **4** — Major accessibility issue (remote, restricted, politically difficult)
- **5** — Extremely difficult or impossible: war zone, radioactive exclusion zone, country where entry is blocked, or requires a ship to reach open ocean

For places that have been visited, the challenge score reflects conditions at the time of the visit, not necessarily today.

### Data Population Notes

- **flag** and **link**: Set conversationally via Claude using MCP write operations. Multi-country entries use space-separated flag emoji (e.g. `"🇬🇧 🇫🇷"` for the Channel Tunnel).
- **location**: Populated by running `scripts/add-coords.mjs`, which fetches Wikipedia wikitext and extracts coordinates using a multi-strategy cascade. About a dozen entries (transit lines, routes) needed manual coordinates set to a meaningful representative point (a terminus, a central station, etc.).
- **challenge**: Set conversationally via Claude using the scale above. Timbuktu is a 5 (and has been visited). Null Island is a 4 (it's a buoy).
- **wikiSummary** and **wikiEmbedding**: Populated by running `scripts/add-embeddings.mjs`, which fetches the Wikipedia intro text and generates a 512-dimension embedding via the OpenAI API. 95 of 96 entries have embeddings; Dronningens Gate was skipped as its link points to the Trondheim Tram network page rather than a specific article.

### Indexes

- `location` — `2dsphere` index, required for geospatial queries (`$geoNear`, radius search). Created automatically on server startup.
- `wikiEmbedding` — Atlas Vector Search index (`vector_index`), configured via the Atlas UI with 512 dimensions and cosine similarity. Required for semantic search.

## Website

A simple full-stack web app in the `website/` folder. The server is Express + Node.js; the frontend is plain HTML, CSS and JavaScript.

### Files

| File | Purpose |
|------|---------|
| `server.mjs` | Express server; connects to MongoDB, serves the frontend, exposes API endpoints |
| `chat.mjs` | Chatbot handler; Claude tool use with three tools (filter, semantic search, nearby) |
| `public/index.html` | Main page structure |
| `public/chat.html` | Chat page |
| `public/styles.css` | Styles, based on a subset of andrewzc.net |
| `public/bucket.js` | Fetches data from the API, renders the map and list, handles toggles and search |
| `public/chat.js` | Chat UI; renders markdown, sends messages to `/api/chat` |

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/bucket` | All 96 documents sorted by name |
| `GET /api/nearby?lat=&lon=&km=` | Documents within `km` kilometres of a point, sorted by distance. Requires the `2dsphere` index. |
| `POST /api/search` | Semantic search via Atlas Vector Search. Body: `{ query: string }`. Requires the vector index. |
| `POST /api/chat` | Chatbot endpoint. Body: `{ message: string, history: [] }`. Returns `{ reply, history }`. |

### Features

- World map with green (been) and red (to do) pins, using Leaflet and MarkerCluster
- Country flag emoji displayed inside each map pin
- Click a pin for the place name, Wikipedia link, and challenge stars
- Been / To do toggle pills filter both the map and the list simultaneously
- 📍 Near me button uses the browser's geolocation API to find places within 500km, zooms the map to show them, and lists them by distance
- Natural language search box using Atlas Vector Search and OpenAI embeddings
- 💬 Chat page with a Claude-powered chatbot that can filter, search semantically, and find nearby places using tool use
- Dark mode support
