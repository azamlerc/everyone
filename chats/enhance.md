# AI ❤️ Databases, for everyone!

## 2. Enhancing the data

> Okay, I'm back! In our last chat we got everything hooked up so you can see my bucket list, and you ran some stats on how many places I've been to. Just subjectively, what do you think about my list?

I love it. It's not a typical bucket list — there's no Eiffel Tower, no Times Square, none of the usual suspects. What jumps out is that you're drawn to things that are *about* something: the Mauritania Railway isn't just a train ride, it's one of the longest and most remote freight journeys on earth. The Saatse Boot is a quirk of where a border was drawn relative to a road. Null Island is literally nothing — and you want to go there. There's a through-line of "this place has a story that most people don't know."

The transit love is obvious — Belgian Coast Tram, Crimean Trolleybus, Wuppertal Schwebebahn, Holmenkollen Line, Pyongyang Metro. That last one is particularly bold. And the geography nerdery shows up too: Dieveniškės, Twelve-Mile Circle, Rouses Point — these are all border and boundary curiosities.

What I find most charming is the mix of scales. The Great Pyramid and Machu Picchu sit alongside Agloe NY, which I'm guessing approximately nobody else has on their bucket list. What's the story there?

> Agloe, NY is a fictional place, but I've been there! It's a paper town, a town that Rand McNally put on their maps even though there's nothing there. If their competitors copied their maps and included Agloe, they could easily spot the plagiarism.

That's a perfect bucket list item — a place that exists specifically to catch people who claim to have been somewhere they haven't. The meta-irony of actually going there is delicious.

It's called a copyright trap, or sometimes a "trap street" when it's a fictional road rather than a town. Cartographers have been doing this for decades. This is exactly what I mean about your list having a through-line. You're not collecting checkmarks — you're collecting *ideas made physical*. A paper town is a concept you can stand in. Same energy as visiting Null Island, or Schengen, or the Korean DMZ. Places that only fully make sense when you know the story behind them.

Okay, so — ready to make this list a bit more useful? Right now each entry is just a name and a been value. I'd love to add some meat to these documents: a country flag, a Wikipedia link, and eventually coordinates so we can put everything on a map. Want to start with the flags?

> Sure!

I'll go through all 96 and assign country flags based on where each place is. A few need a moment's thought — Baarle-Nassau straddles Belgium and the Netherlands, the Dead Sea borders Jordan and Israel, the Channel Tunnel connects England and France. For those I'll use multiple flags separated by spaces. Null Island gets a 🌍 since it's in international waters, and Operating a Tram gets a 🇺🇸 since that's where it happened.

Give me a moment to write them all...

*[A few minutes pass]*

Done — all 96 have flags. Want to see which countries come up most?

> Yes! Could you make a table?

Here's what the data shows, counting multi-flag entries in each country's bucket:

| Flag | Country | Total | Been | Not yet |
|------|---------|-------|------|---------|
| 🇺🇸 | United States | 12 | 10 | 2 |
| 🇫🇷 | France | 6 | 6 | 0 |
| 🇬🇧 | United Kingdom | 5 | 5 | 0 |
| 🇷🇺 | Russia | 6 | 1 | 5 |
| 🇯🇵 | Japan | 5 | 1 | 4 |
| 🇺🇦 | Ukraine | 4 | 0 | 4 |
| 🇧🇪 | Belgium | 4 | 4 | 0 |
| 🇩🇪 | Germany | 4 | 3 | 1 |
| 🇪🇬 | Egypt | 3 | 3 | 0 |
| 🇳🇴 | Norway | 3 | 1 | 2 |
| 🇦🇺 | Australia | 3 | 0 | 3 |
| 🇳🇱 | Netherlands | 2 | 1 | 1 |
| 🇰🇪 | Kenya | 2 | 1 | 1 |
| 🇦🇹 | Austria | 2 | 2 | 0 |
| 🇨🇴 | Colombia | 2 | 2 | 0 |
| 🇫🇮 | Finland | 2 | 0 | 2 |

France and the UK are fully done — you've been to everything on your list there. Belgium too, which makes sense. Russia and Ukraine together account for 10 entries and you've been to exactly one of them — the Moscow Kremlin. That's a significant block of aspiration that geopolitics has made considerably more complicated. Ukraine is 0 for 4: Artek, Chernobyl, Crimean Trolleybus, Potemkin Stairs — all fascinating, all currently inaccessible. Japan is 1 for 5, which feels like a chapter waiting to be written.

> Now can we add Wikipedia links?

Yes — I'll go through them all. Most are obvious from the name, but a few need a decision. Here's what I'm proposing for the non-obvious ones:

- **Batttersea Power Station** → links to the correct article (also, there's a typo in your data — three t's)
- **Belgian Coast Tram** → the article is under "Kusttram"
- **Brioude à Saint-Flour** → French Wikipedia, since that's the best source for this abandoned line
- **Dronningens Gate** → links to Trondheim Tram, since it's the northernmost tram stop in the world rather than an article in its own right
- **East Brighton** → Melbourne tram network (southernmost tram stop in the world — I'm seeing a pattern)
- **Greenwich** → Royal Observatory, since that's what makes it list-worthy
- **Mellunmäki** → "Mellunmäki metro station" — which I'm guessing is the northernmost metro station in the world?
- **Operating a Tram** → Seashore Trolley Museum in Maine, where it happened
- **Plaza de los Virreyes** → the Buenos Aires Underground station — southernmost metro station in the world. Yes, definitely a pattern.
- **Seiryu Miharashi** → a station with no exit, just a platform for viewing nature
- **Woinic** → French Wikipedia only

> All correct! And yes, you're seeing the pattern.

Written — all 96 now have Wikipedia links. Let's move on to coordinates.

> How do we get coordinates for each place, and what's the standard way to store location in MongoDB?

There are a few options. For famous places I could supply coordinates from memory, but for obscure ones I'd be guessing. The cleanest approach is to fetch them from the Wikipedia articles we just added — most Wikipedia pages have coordinates embedded in their wikitext.

The standard way to store location in MongoDB is a GeoJSON Point:

```json
{
  "location": {
    "type": "Point",
    "coordinates": [-0.1278, 51.5074]
  }
}
```

Note that GeoJSON always puts longitude first — which trips everyone up at least once. You'd also store a human-readable `coords` string like `"51.50740000, -0.12780000"` for display purposes.

This format unlocks MongoDB's geospatial operators — `$nearSphere`, `$geoWithin` — which is what makes radius search possible later.

For 96 entries, I'd suggest writing a small script to do the heavy lifting. It can read the Wikipedia link from each document, fetch the page, extract the coordinates, and write them back. Faster and more reliable than doing it by hand.

> Let's do it!

I've written `scripts/add-coords.mjs` — but heads up, this is the first thing in the whole project that needs a *real* database connection instead of the chat connector. A script running on your computer has to dial into Atlas the old-fashioned way, the same as any database tool would.

That means two things we've been able to skip so far:

**Step 1: Create a database user.**
In the Atlas sidebar, find **Database Access** under the Security section. Click **Add New Database User**. Choose **Password** as the authentication method, pick a username and a strong password, and give the user **Read and write to any database** access. Save that password somewhere — you'll need it in a moment.

**Step 2: Whitelist your IP address.**
In the sidebar, find **Network Access**. Click **Add IP Address**, then **Add Current IP Address**. This tells Atlas that connections coming from your computer are allowed.

> Done — user created, IP added. Why didn't we need this back when we first connected you to Atlas?

Because that connection went through the connector — MongoDB's own hosted server did the talking, using the permission you granted in your account settings, so there was never a username or password for you to manage. This script is different: it runs on your machine and needs its own way in, independent of me entirely. You'll hit this same distinction again when we build the website later — anything that isn't a chat with me needs real credentials.

While you're in Atlas, it's worth grabbing [MongoDB Compass](https://www.mongodb.com/products/tools/compass) too — the desktop app for browsing your database visually, connection string and all. Click **Connect** on your cluster, choose **Compass**, and it'll hand you a connection string that looks like:

```
mongodb+srv://yourusername:<password>@yourcluster.abc123.mongodb.net/
```

Paste that into Compass with your actual password filled in, hit connect, and there's your `everyone` database and `bucket` collection — the same 96 places I've been describing to you all along, just through a different window.

![Compass](../screenshots/compass.png)

Now, set up the script itself:

```bash
cd ~/Context/blog-posts/everyone/scripts
npm install
cp .env.example .env
```

Open `.env` in any text editor and add that same MongoDB connection string, with your password filled in:

```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@yourcluster.abc123.mongodb.net/
```

The `.env` file stays on your computer and never gets shared anywhere — this is the standard way to handle credentials so you never accidentally paste a password somewhere.

Then run it:

```bash
node add-coords.mjs
```

It'll work through all 96 documents, logging what it finds as it goes. Should take a few minutes.

> It finished! What do you see?

82 out of 96 got coordinates automatically. The 14 that didn't are mostly linear features — transit lines, railway routes — where Wikipedia doesn't have a single coordinate point. Makes sense: a route isn't a place.

For those, you can pick a meaningful representative point — a terminus, a central station, wherever captures the spirit of the entry. What would you like for each?

> Here's what I'd use for each:
> * Trans-Siberian Railway: Omsk station
> * Crimean Trolleybus: Simferopol
> * Holmenkollen Line: Frognerseteren end station, 59.978889, 10.677778
> * F Market Line: Embarcadero plaza, 37.79437° N, 122.39395° W
> * Lisbon Trams: 38.70889° N, 9.13561° W
> * Dronningens Gate: 63.43186° N, 10.38965° E
> * East Brighton: 37.91454° S, 145.01674° E
> * Xinbeitou Line: 25.13694° N, 121.50363° E
> * Z Train: Chambers Street, 40.71319° N, 74.00341° W
> * Brioude à Saint-Flour: midpoint, 45.17782° N, 3.24269° E
> * Medellín Metrocable: 6.30023° N, 75.55824° W
> * Doppelwendeltreppe: 47.072711°, 15.442794°
> * Amalienbad: 48.174282°, 16.378814°
> * Taj Mahal: look it up

The Taj Mahal is at 27.1751° N, 78.0421° E — apparently Wikipedia couldn't find the most famous building in the world, which is humbling for the script.

All 96 now have coordinates and GeoJSON location fields. The database is genuinely map-ready.

Oh — and Null Island came back as 0.00000000, 0.00000000. That's not a bug.

> Ha! Let's add one more field — a challenge score for how hard each place is to visit. Numeric scale:
> 1. Accessible from a paved road in the US or western/central Europe
> 2. A bit off the beaten path
> 3. Requires flying to a different part of the world, or significant logistical difficulty
> 4. Major accessibility issue
> 5. Extremely difficult or impossible — war zone, radioactive exclusion zone, country where I can't get a visa

I'll assign scores and flag anything I'm not sure about.

A few things I want to check with you before writing:

- **Anything in Russia** — currently inaccessible, but you've been to Moscow Kremlin and Worker and Kolkhoz Woman. Do we score based on today or when you visited?
- **Chernobyl, Potemkin Stairs** — pre-war these were accessible tourist destinations; now they're in a war zone
- **Saatse Boot** — you can walk through uncontrolled Russian territory on an Estonian road, or at least you used to be able to
- **Transnistria** — de facto independent, but it's not exactly a normal border crossing
- **Timbuktu** — you've been there, which is remarkable. Currently Mali is extremely dangerous. 5?
- **Bikini Atoll** — radioactive and access-restricted. 5?

> For places I've been to, let's use the situation at the time of the visit. Moscow Kremlin and Worker and Kolkhoz Woman were easy when I was an exchange student — so those are 1s. Saatse Boot was a 2 when I did it, now it's closed. Transnistria was a 4 — I had to stare down a tank pointing its gun at my car at the border. Timbuktu is a 5, it was bloody hard to get there. Bikini Atoll is also a 5, you're not allowed to visit because it's radioactive. Everything in Russia is a 5 now.

Love the "at the time of visit" rule. And a tank is definitely a 4.

Writing all 96 scores now...

*[A few minutes pass]*

Done. Here's the distribution:

| Challenge | Count | Been | Not yet |
|-----------|-------|------|---------|
| 1 — easy | 42 | 34 | 8 |
| 2 — off the beaten path | 8 | 5 | 3 |
| 3 — requires a flight | 26 | 11 | 15 |
| 4 — major difficulty | 9 | 4 | 5 |
| 5 — extreme / impossible | 11 | 1 | 10 |

That last row is the one. Eleven entries rated nearly impossible, and you've done exactly one: Timbuktu. The 34 out of 42 on the easy ones makes sense. The real remaining adventure is in the 3s — 15 places that require a flight but are genuinely doable.

> This is amazing. We started with a plain text file and now we have a proper database with flags, Wikipedia links, coordinates, and challenge scores for every entry.

And we didn't write a single line of code to do it — except for the coordinates script, which Claude wrote. The rest was just conversation.

That's the point of all this. The database is the foundation. Now we can build a website around it, put everything on a map, find what's nearby, search it with natural language. The data is ready. What shall we build next?

---

*Next: [Website](website.md) — build a full stack web app to display your data.*
