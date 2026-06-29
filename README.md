# AI ❤️ Databases, for everyone!

What if you could build a full-stack web application — with a cloud database, geospatial search, natural language queries, and a conversational AI interface — without writing a single line of code or having any prior database experience? This project shows that you can.

A new protocol called MCP (Model Context Protocol) lets Claude connect directly to external tools and data sources. Paired with MongoDB, this unlocks capabilities that used to require a professional developer and makes them accessible to anyone willing to have a conversation. What follows is a series of chats that build, step by step, a real production-quality application using MongoDB Atlas, Atlas Vector Search, GeoJSON radius search, and Claude tool use — entirely through natural language.

The data is a personal bucket list of 96 remarkable places: everything from the Great Pyramid to Null Island, from the Pyongyang Metro to a paper town in upstate New York. By the end, it's a live website with an interactive world map, radius search, semantic search, and a chatbot you can have a real conversation with about the data. The human in the story never looks at the code.

## Chats

1. [Creating a database](chats/database.md) — learn what a database is and how to create your own
2. [Enhancing the data](chats/enhance.md) — add more properties to the data, like country and location
3. [Building a website](chats/website.md) — build a full stack website to display the data
4. [Adding a map](chats/map.md) — show the places on a map, and show nearby places
5. [Natural language search](chats/search.md) — learn how to use MongoDB Atlas Vector Search
6. [Chat interface](chats/chat.md) — build a chatbot that can answer questions about the data
7. [Wrapup](chats/wrapup.md) — reflect on the journey and where to go next

## Context

1. [About Me](context/about-me.md) — context file about our fictional user
2. [Database Project](context/database-project.md) — plan for building this stuff
2. [Claude](CLAUDE.md) — repo notes for Claude to resume context

## Data

1. [Bucket List](data/bucket.csv) — places I've been and want to go

## Scripts

1. [add-coords.mjs](scripts/add-coords.mjs) — fetches coordinates from Wikipedia for each bucket list entry and writes GeoJSON location to the database
2. [add-embeddings.mjs](scripts/add-embeddings.mjs) — fetches Wikipedia summaries and generates OpenAI embeddings for semantic search

## Website

- [server.mjs](website/server.mjs) — Express server; serves the frontend and API endpoints
- [chat.mjs](website/chat.mjs) — chatbot handler with tool use (filter, semantic search, nearby)
- [public/index.html](website/public/index.html) — main page structure
- [public/chat.html](website/public/chat.html) — chat page
- [public/styles.css](website/public/styles.css) — styles
- [public/bucket.js](website/public/bucket.js) — map, list, toggles, near me, search
- [public/chat.js](website/public/chat.js) — chat UI

## Try it!

- [Bucket List](https://everyone-9huc.onrender.com)
- [Chat](https://everyone-9huc.onrender.com/chat.html)

## Screenshots

- [Compass](screenshots/compass.png) — the initial data import
- [API](screenshots/api.png) — the /bucket API JSON response
- [Website](screenshots/website.png) — the first version of the website with a list of places
- [Map](screenshots/map.png) — the places displayed with pins on a map
- [Near Me](screenshots/near-me.png) — places near the current location sorted by distance
- [Search](screenshots/search.png) — natural language search interface
- [Chat](screenshots/chat.png) — the chat interface on the website
- [Compass Enhanced](screenshots/compass-enhanced.png) — the database after enhancing the data
