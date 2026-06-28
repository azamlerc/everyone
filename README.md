# AI ❤️ Databases, for everyone!

## Chats

1. [Creating a database](chats/database.md) — learn what a database is and how to create your own
2. [Enhancing the data](chats/enhance.md) — add more properties to the data, like country and location
3. [Building a website](chats/website.md) — build a full stack website to display the data
4. [Adding a map](chats/map.md) — show the places on a map, and show nearby places
5. [Natural language search](chats/search.md) — learn how to use MongoDB Atlas Vector Search
6. [Chat interface](chats/chat.md) — build a chatbot that can answer questions about the data
7. [Wrapup](chats/wrapup.md) — reflect on the journey and where to go next

## Context

1. [About Me](context/about-me.md) — some stuff about me
2. [Database Project](context/database-project.md) — plan for building this stuff

## Data

1. [Bucket List](data/bucket.csv) — places I've been and want to go

## Scripts

1. [add-coords.mjs](scripts/add-coords.mjs) — fetches coordinates from Wikipedia for each bucket list entry and writes coords + GeoJSON location to the database
2. [add-embeddings.mjs](scripts/add-embeddings.mjs) — fetches Wikipedia summaries and generates OpenAI embeddings for semantic search

## Website

- [server.mjs](website/server.mjs) — Express server; serves the frontend and API endpoints
- [chat.mjs](website/chat.mjs) — chatbot handler with tool use (filter, semantic search, nearby)
- [public/index.html](website/public/index.html) — main page structure
- [public/chat.html](website/public/chat.html) — chat page
- [public/styles.css](website/public/styles.css) — styles
- [public/bucket.js](website/public/bucket.js) — map, list, toggles, near me, search
- [public/chat.js](website/public/chat.js) — chat UI

## Screenshots

- [Compass](screenshots/compass.png) — the initial data import
- [API](screenshots/api.png) — the /bucket API JSON response
- [Website](screenshots/website.png) — the first version of the website with a list of places
- [Map](screenshots/map.png) — the palces displayed with pins on a map
- [Near Me](screenshots/near-me.png) — places near the current location sorted by distance
- [Search](screenshots/search.png) — natural language search interface
- [Chat](screenshots/chat.png) — the chat interface on the website
- [Compass Enhanced](screenshots/compass-enhanced.png) — the database after enhancing the data





