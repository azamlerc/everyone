# AI ❤️ Databases, for everyone!

## 4. Adding a map

> So in our last chat, we made a website with a server that can talk to the database, an API for loading places, and a web page to display them. I can't believe how easy that was.
>
> So now that we have the location coordinates for all of these places... what can we do with that?

So many things! Coordinates are what turn a list into something you can actually navigate. The most immediate one: we can put all your places on a map. Green pins for places you've been, red pins for places still on the list. Click a pin and you get the name and a link to Wikipedia. At 96 entries spread across the whole world, a map tells the story of your travels in a way a list just can't.

But here's the thing that's really going to blow your mind once we have it: radius search. Because your coordinates are stored as GeoJSON in MongoDB, the database can answer questions like "show me everything on my bucket list within 200km of where I am right now." Planning a trip to Japan? Ask what's on your list nearby. Driving through France? Same thing. The database does the geometry — we just ask.

Let's start with the map.

> What's Leaflet?

Leaflet is a free, open-source JavaScript library for interactive maps. It handles all the hard parts — loading the map tiles, letting you pan and zoom, placing markers, showing popups when you click them. We just tell it where to put the pins and what to show. It runs entirely in the browser, no account or API key needed.

> Let's do it!

I've updated the website with a map above the list. Restart the server and refresh the page — you should see the world map with all your pins on it.

![Map](screenshots/map.png) — the palces displayed with pins on a map

> Oh WOW. There's my whole bucket list on a map! The green and red pins are perfect. I can see the cluster of European places I've done, and a big red cluster over Russia and Japan of things I still want to do. And the flag emojis in the pins are such a nice touch.
>
> I clicked a pin over Egypt and it showed me the Great Pyramid, the Sultan Hasan Mosque, and Siwa Oasis all clustered together. Then I zoomed in and they spread out. This is so cool.

That's the marker clustering working — when pins are close together at a given zoom level they merge into a numbered circle, and as you zoom in they fan out into individual markers. It makes the map readable at world scale without losing any detail when you zoom in.

Now — remember when I mentioned radius search? Here's where it gets really useful. Since your coordinates are stored as GeoJSON in MongoDB, the database can find everything on your list within a given distance of any point on earth. We just need to ask the question.

Want to add a "Near me" button?

> Yes please!

I've added a **📍 Near me** button to the header, a new `/api/nearby` endpoint on the server, and wired them together. One important detail: radius search requires a special index on the `location` field — a `2dsphere` index, which tells MongoDB to treat the coordinates as points on a sphere rather than a flat grid. I've added that to the server startup so it's created automatically:

```js
await col.createIndex({ location: '2dsphere' });
```

This is idempotent — safe to run every time the server starts. If the index already exists, MongoDB just confirms it and moves on.

Restart the server and try the button. The browser will ask for your location, and once you allow it the map will zoom to show everything on your list within 500km of where you are, with distances shown next to each entry.

![Near Me](screenshots/near-me.png) — places near the current location sorted by distance

> Okay that works brilliantly! The map looks great, I love how it uses the green and red pins to show been and todo places, and the clustering is slick. The "near me" button also works great, it zooms smoothly to my current location and shows nearby places, listed by proximity. Toggling it off zooms back out to the world map. I still can't believe how easy this is.

That's MongoDB's geospatial engine doing the work. We stored the coordinates, created the index, and asked the question — the database handles all the spherical geometry.

This is also a nice illustration of a general principle: the richer you make your data, the more interesting questions you can ask of it. We started with a name and a been flag. We added coordinates, and now we have a map and radius search. Next we could add Wikipedia summaries and get semantic search — find places that are *conceptually* related to something you describe in plain English. Want to try that next?

---

*Next: [Search](search.md) — add natural language search using vector embeddings.*
