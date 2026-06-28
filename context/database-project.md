# Database Project

## Intro

This file describes what we're building together — a bucket list tracker backed by MongoDB, enriched with geographic and contextual data, and displayed on a website with a map and natural language search.

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
| `coords` | string | Human-readable decimal coordinates, e.g. `"48.85341000, 2.34880000"` | Script (`add-coords.mjs`) + manual for lines/routes |
| `location` | GeoJSON Point | `{ type: "Point", coordinates: [lon, lat] }` | Same as coords — note longitude comes first |
| `challenge` | number (1–5) | Subjective difficulty of visiting | Set via Claude + MCP |

### Challenge Score Scale

- **1** — Accessible from a paved road in the US or western/central Europe; or has a dedicated metro stop in those regions
- **2** — A bit off the beaten path
- **3** — Requires flying to a different part of the world, or significant logistical effort
- **4** — Major accessibility issue (remote, restricted, politically difficult)
- **5** — Extremely difficult or impossible: war zone, radioactive exclusion zone, country where entry is blocked, or requires a ship to reach open ocean

For places that have been visited, the challenge score reflects conditions at the time of the visit, not necessarily today.

### Data Population Notes

- **flag** and **link**: Set conversationally via Claude using MCP write operations. Multi-country entries use space-separated flag emoji (e.g. `"🇬🇧 🇫🇷"` for the Channel Tunnel).
- **coords** and **location**: Mostly populated by running `scripts/add-coords.mjs`, which fetches Wikipedia wikitext and extracts coordinates using a multi-strategy cascade. About a dozen entries (transit lines, routes) needed manual coordinates set to a meaningful representative point (a terminus, a central station, etc.).
- **challenge**: Set conversationally via Claude using the scale above. Timbuktu is a 5 (and has been visited). Null Island is a 4 (it's a buoy).

### Indexes

- `location` — `2dsphere` index, required for geospatial queries (`$geoNear`, radius search). Created automatically on server startup.

## Website

A simple full-stack web app in the `website/` folder. The server is Express + Node.js; the frontend is plain HTML, CSS and JavaScript.

### Files

| File | Purpose |
|------|---------|
| `server.mjs` | Express server; connects to MongoDB, serves the frontend, exposes API endpoints |
| `public/index.html` | Page structure |
| `public/styles.css` | Styles, based on a subset of andrewzc.net |
| `public/bucket.js` | Fetches data from the API, renders the map and list, handles toggles |

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/bucket` | All 96 documents sorted by name |
| `GET /api/nearby?lat=&lon=&km=` | Documents within `km` kilometres of a point, sorted by distance. Requires the `2dsphere` index. |

### Features

- World map with green (been) and red (to do) pins, using Leaflet and MarkerCluster
- Country flag emoji displayed inside each map pin
- Click a pin for the place name, Wikipedia link, and challenge stars
- Been / To do toggle pills filter both the map and the list simultaneously
- 📍 Near me button uses the browser's geolocation API to find places within 500km, zooms the map to show them, and lists them by distance
- Dark mode support

## Next Steps

- Add natural language / semantic search using MongoDB Atlas Vector Search
- Build a chatbot that can answer questions about the data
