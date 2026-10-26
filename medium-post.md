# AI ❤️ Databases, for everyone!

What if you could build a full-stack web application — with a cloud database, geospatial search, natural language queries, and a conversational AI interface — without writing a single line of code or having any prior database experience? This project shows that you can.

A new protocol called MCP (Model Context Protocol) lets Claude connect directly to external tools and data sources. Paired with MongoDB, this unlocks capabilities that used to require a professional developer and makes them accessible to anyone willing to have a conversation. What follows is a series of chats that build, step by step, a real production-quality application using MongoDB Atlas, Atlas Vector Search, GeoJSON radius search, and Claude tool use — entirely through natural language.

The data is a personal bucket list of 96 remarkable places: everything from the Great Pyramid to Null Island, from the Pyongyang Metro to a paper town in upstate New York. By the end, it's a live website with an interactive world map, radius search, semantic search, and a chatbot you can have a real conversation with about the data. The human in the story never looks at the code.

## Contents

1. Creating a database
2. Enhancing the data
3. Building a website
4. Adding a map
5. Natural language search
6. Chat interface
7. Wrapup

---

## 1. Creating a database

> Hello! I've been using ChatGPT for a few years now, and find it useful for a bunch of things. A friend of mine told me about Claude, so I thought I'd come say hi and see what's happening over here. My friend mentioned something about databases, but they were talking really fast and I didn't really follow what they were on about. I'm not a programmer and have never used a database, but I'm curious if there's some cool stuff we can do together.

Hello! Great to meet you. Your friend is onto something — there really is some genuinely cool stuff we can do together, and you don't need to be a programmer for any of it. Let me explain a few basic concepts, we'll get a couple things set up, and then we can just... talk about your data. Things that actually matter to you. 

> That sounds great! I'm looking forward to learning about all this stuff. So let's start with something basic. I've heard the word database, but what is that exactly?

A database is basically a program that stores data in a structured way. Think of it as a way of keeping track of lists of things, where each thing has a set of properties. A person has a name, a birthday, an address. A recipe has a title, ingredients, cooking time. A place has a name, a country, whether you've been there.

The key thing that makes a database different from, say, a notes app is that the data is organized and queryable — you can ask precise questions like "show me all the Italian recipes that take under 30 minutes" and get a real answer.

> Okay that makes it all seem less mysterious. Have databases been around for a while? I'm curious about the history, what kinds there are, and whether regular people can use them.

Sure! Back in the early days of personal computers, programs like ClarisWorks and FileMaker Pro made databases accessible to everyday users. These were point-and-click, stored everything in a single file that fit on a floppy disk, and were genuinely approachable. I remember people using them for everything from organizing recipe cards to running small businesses.

More sophisticated databases came along using SQL (Structured Query Language). These store data as records in tables with rigid structures, are hosted on servers, and have historically required a programmer to do much of anything useful with them. Powerful, but not exactly welcoming.

> My friend mentioned something called WebObjects that they used while at Apple.

Yes! WebObjects was originally developed at NeXT as a framework for building web applications backed by SQL databases. When Apple acquired NeXT, they used it to power the Apple Store and the iTunes Store. It was genuinely impressive technology for its time — but so complicated that you basically had to dedicate a significant portion of your life to learning it.

> Oh gosh, I don't want to do that. Is there something simpler?

Absolutely. Enter MongoDB. It's what's called a NoSQL database. You can do most of the same things as a SQL database, but instead of rigid tables, it stores flexible JSON documents in collections. There's no fixed structure to conform to — documents can contain whatever you want, and you can change your mind later without breaking everything. It's easier to use, more flexible, and honestly just more *fun*. Want to give it a try?

> Yeah! But first — who's JSON?

Not a who, a what — it's a file format for storing structured data as human-readable text. You'll see it everywhere once you know what to look for: web APIs, config files, and yes, MongoDB. Here's a simple example:

```json
{
  "first": "Andrew",
  "last": "Zamler-Carhart",
  "year": 1978,
  "loves": ["AI", "databases"]
}
```

Each document is a set of key-value pairs wrapped in curly braces. Values can be text, numbers, true/false, or even lists. Once your eye gets used to it, it reads pretty naturally.

> Okay cool, that looks pretty straightforward.

Exactly. And the good news is you won't be writing much of it by hand — that's what I'm here for. The important thing is just being able to read it, and you already can.

> That's a relief. So how do you actually talk to databases?

That's where things get exciting. There's a relatively new protocol called MCP, which stands for [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro). It was developed by Anthropic — the people who make me — so naturally I'm rather good at it. You can think of MCP as the universal connector that lets AI systems like me plug into *stuff*: files on your computer, external services, and yes, databases.

I suggest we start with the file system, so you can get a feel for the back-and-forth before we add a database into the mix.

> Cool deal! How do I get started?

First, make sure you're using [Claude Desktop](https://claude.com/download) on your computer — this doesn't work on the web or mobile version yet.

Once you have that, create a folder called `Context` in your home folder (that's the one with your name on it, where your Documents and Downloads folders live). We'll use that as our shared workspace.

Then, in Claude Desktop, open **Settings**, click **Extensions** in the sidebar, and hit **Browse extensions**. Find the Filesystem extension and add it. Click **Configure**, make sure it's enabled, and give it access to your home folder — or just the `Context` folder if you prefer to keep things tidy.

Restart Claude Desktop when you're done, and we'll see if it's working.

> Okay I did all that and restarted. Is it working??

Yes! I can see you've created a `Context` folder, and it's currently empty. Let's fix that.

I'd suggest using Markdown files for storing context between our chats. Markdown is a format that's commonly used for readme files — it's plain text with a little lightweight formatting, easy for you to read and edit, and easy for me to parse. You don't need any special software, just a plain text editor.

Here's the useful part: I can write files and you can read them. You can edit them and I can read your changes. It's a genuine two-way collaboration that lives right on your own computer, no uploading anything anywhere.

To get us started, I'll write two small files based on what we've talked about so far:

1. `about-me.md` — a few things about you
2. `database-project.md` — a plan for what we're going to build

These are just starting points. Read them over, add whatever feels right, and I'll pick up whatever you've changed the next time we chat.

> Okay, I see the two files you created. I added a few details of my own to both of them.

I see that! You added some stuff about your hobbies — specifically that you love to travel. And in the project file you mentioned you want to build a bucket list tracker. We can absolutely do that.

And notice what just happened: we stored a bit of structured information, and we both have access to it. That's actually a tiny database. Now imagine what we can do with a real one.

> LFG! How do I get started with MongoDB?

Let's go! Head over to [mongodb.com](https://www.mongodb.com/cloud/atlas/register) and create a free Atlas account. Atlas is MongoDB's hosted cloud service — your database will live on their servers, which means no dealing with installation, backups, or any of that stuff.

When you sign up, it'll walk you through creating your first cluster. Choose the free **M0** tier — it's plenty for getting started and costs exactly nothing. Pick whichever cloud provider and region look good (it doesn't matter much at this stage), and give your cluster a name or just leave it as the default.

Come back when the cluster is ready — it usually takes a minute or two to spin up.

> Okay, the cluster is created! Now what?

Now let's get me actually connected to it, so we can build up your data through conversation instead of clicking around a database interface.

There's a MongoDB Atlas connector built right into Claude, so this is mostly just clicking a few buttons. No terminal, no config files.

In Claude, open **Settings**, click **Connectors** in the sidebar, then **Directory**. Search for "mongodb" and you'll see **MongoDB Atlas** show up with a little verified checkmark next to it. Click to add it.

![Connectors](https://raw.githubusercontent.com/azamlerc/everyone/main/screenshots/connectors.png)

> Added it! It walked me through signing into my Atlas account and approving some permissions. Now what?

One more switch, on MongoDB's side this time. Atlas keeps AI client access turned off by default, so an Organization Owner has to explicitly allow it — that's you, since this is your own account.

Head back to Atlas, open **Organization Settings**, and click the **App Connections** tab. You'll find a section called **AI Clients** — toggle on **Allow users to connect AI clients**, and set it to **Allow read & write connections** so I can add data later, not just look at it.

![Org Settings](https://raw.githubusercontent.com/azamlerc/everyone/main/screenshots/org-settings.png)

> Done. I can see Claude sitting there marked "Allowed," right next to ChatGPT, Cursor, and a few others. Funny seeing you all lined up like that.

It's a crowded field these days. But that's genuinely the whole setup on your end.

> That's really it? I thought there'd be a database user to create, or an IP address to whitelist.

Not for this. I'm not connecting to your cluster directly from your laptop — MongoDB's own hosted server does that on my behalf, using the permission you just granted. Database users and IP allow-lists are still very real things in MongoDB Atlas, they just don't apply to *me* anymore. You'll need them the moment something other than a chat needs to reach your database directly — a script running on your computer, or the website we'll eventually build. We'll set that up when we actually get there.

For now, I can already see your cluster... and it's completely empty. Let's fix that.

> Does that mean this'll work on my phone too, not just this computer?

Possibly! Since this connector lives on your account instead of a config file that only Claude Desktop can see, it should follow you across devices. Worth trying — mobile support for connectors like this is still rolling out, so desktop may be a little ahead for now.

> Okay, empty cluster, noted. I do have a bucket list — want to see it?

I would love to. What does it look like right now?

> It's just a text file, nothing fancy. A list of places I've been and places I want to go.

That's plenty to work with. Open it in a spreadsheet and set up two columns: `name` for the place, and `been` — `true` for places you've visited, `false` for the rest. One row per place. Then save it as a CSV, right there in your `Context` folder.

> Okay, I copied everything in and filled out the `been` column. This is kind of satisfying actually. Saved it as `bucket.csv` in Context.

Right? Sometimes just organizing data is its own reward. And since I already have access to that folder from when we set up the filesystem connection — give me a second.

*[A moment passes]*

Done. I read `bucket.csv`, created a database called `everyone` with a collection called `bucket`, and wrote in all 96 rows. You've been to 55 of them — just over half. You've been busy!

> It worked! I can see all my places in there. Each one has a `name`, a `been` value, and also something called `_id` that looks like a random jumble of characters.

That `_id` is MongoDB's way of giving every document a unique identifier automatically. You'll never have to touch it — it's just there behind the scenes doing important work.

More importantly: you have a real database with real data that means something to you, and I never had to leave the chat to build it. No import wizard, no client to install — just a CSV in a folder I already had access to, and a database I already had permission to write to.

> Got me a database, awww yeah. I bet you enjoyed being the first one to actually see all my cool bucket list places in there.

I mean, I'm an AI, so "enjoy" is a strong word — but yes, it was genuinely satisfying watching all 96 rows land in the right place.

> HALLELUJAH! A choir of angels is singing. I'm using AI to talk to my very own database! And yes, travel is definitely my hobby. I even try to keep a balance between places I've been and places I still want to go — it keeps me feeling oriented in the mission.

That's a beautiful way to put it. Equal parts memory and aspiration.

And now that we're connected, we can do so much more than just count things. We can find patterns, add information, build a website around it, put everything on a map, add natural language search — anything. The database is the foundation, and now that I can see it, we can really get to work.

> This is so cool. I didn't write a single line of code and I'm talking to my own database with AI.

You really didn't. And that's the point. What shall we do next?

---

---

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

![Compass](https://raw.githubusercontent.com/azamlerc/everyone/main/screenshots/compass.png)

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

---

## 3. Building a website

> Well that was an epic session, I can't believe we went from just a list of place names and you helped me enhance the data with country flags, Wikipedia links, location coordinates, and even challenge scores. All that from chatting, and you did the lifting! The data is now much richer than before.
>
> So all the data's in the database and I can see it using Compass, but what if I want to share it with the world? How can I make a website that connects to the database?

What a session that was! The data really came alive.

Now, to get that data onto a website — there are a few moving parts worth understanding. A database like MongoDB isn't something a web browser can talk to directly. Browsers are designed to load web pages and make simple requests, not to connect to databases. So we need something in the middle: a small program that sits between the database and the browser, listens for requests, and sends back data. That middleman is called a **server**, and the interface it exposes is called an **API** — Application Programming Interface. Think of it like a waiter: you don't go into the kitchen yourself, you tell the waiter what you want and they bring it back.

The data travels between the server and the browser in JSON format — which you already know from when we imported your bucket list. So the browser asks the server "give me the bucket list," and the server responds with a chunk of JSON containing all 96 documents.

Here's what we're going to build:

- A **server** written in Node.js using a library called Express, which handles the API
- A **frontend** — HTML, CSS and JavaScript — that the server also delivers to the browser
- The server will handle both: ask for the page and you get the website; ask for `/api/bucket` and you get JSON

The nice thing about this setup is it's entirely self-contained — one folder, one command to run it, and it works on your computer at `localhost`. No hosting required to get started.

> That sounds great! But first — what's localhost?

Localhost is just your own computer. When a server is running on your machine, your browser can reach it at `http://localhost:3000` — port 3000 being the conventional door that Node.js servers answer on. It's exactly the same web technology that powers any website on the internet, just running locally instead of on a remote machine somewhere. Nobody else can see it, which makes it a perfect place to build and test things before sharing them with the world.

> Got it. Let's build it!

I've set everything up in your `website` folder. Here's how to get it running:

```bash
cd ~/Context/blog-posts/everyone/website
npm install
cp .env.example .env
```

Open the `.env` file and add your MongoDB connection string — same one you've been using:

```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@yourcluster.abc123.mongodb.net/
```

Then start the server:

```bash
node server.mjs
```

You should see `Running at http://localhost:3000`. Open that in your browser.

Before you look at the website though — try opening `http://localhost:3000/api/bucket` first. That's the raw API endpoint. You'll see exactly what the server is sending to the browser: all 96 documents from your database as JSON, flags and coordinates and everything. That's the waiter bringing the food out of the kitchen.

![API](https://raw.githubusercontent.com/azamlerc/everyone/main/screenshots/api.png)

> Oh wow, that's really cool! All my data right there in the browser. And the emoji look great in there. Okay now I'm going to the main page...

![Website](https://raw.githubusercontent.com/azamlerc/everyone/main/screenshots/website.png)

> Wow, amazing! I ran the server with node, went to that link in my browser, and there was my new website! I like how you added the toggle buttons and showed the challenges with stars.
>
> I set aside the whole evening for this like it was going to be some kind of big project and you just went and did all the work with one command. I didn't even look at the code. This is insanely cool.

That's the whole point — the code is there if you ever want to look at it, but you don't have to. The website has your full bucket list with country flags, Wikipedia links for every entry, and the challenge stars so you can see at a glance which ones are the adventurous ones. The Been and To Do toggles let you filter to just what you're planning next or reminisce about what you've done.

And this is just the beginning. The server we built is a foundation — we can add new API endpoints for anything: a map view, radius search to find what's on your list near wherever you're traveling, natural language search. Each one is just a new route on the same server, a few more lines of JavaScript.

The database does the heavy lifting. The website is just a window into it.

> What's next?

A map. Those coordinates we added are just sitting there waiting to be used — let's put everything on a map with green pins for places you've been and red pins for places still on the list. And once we have a map, we can add something really fun: sort the list by distance from wherever you are right now.

---

---

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

![Map](https://raw.githubusercontent.com/azamlerc/everyone/main/screenshots/map.png)

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

![Near Me](https://raw.githubusercontent.com/azamlerc/everyone/main/screenshots/near-me.png)

> Okay that works brilliantly! The map looks great, I love how it uses the green and red pins to show been and todo places, and the clustering is slick. The "near me" button also works great, it zooms smoothly to my current location and shows nearby places, listed by proximity. Toggling it off zooms back out to the world map. I still can't believe how easy this is.

That's MongoDB's geospatial engine doing the work. We stored the coordinates, created the index, and asked the question — the database handles all the spherical geometry.

This is also a nice illustration of a general principle: the richer you make your data, the more interesting questions you can ask of it. We started with a name and a been flag. We added coordinates, and now we have a map and radius search. Next we could add Wikipedia summaries and get semantic search — find places that are *conceptually* related to something you describe in plain English. Want to try that next?

---

---

## 5. Natural language search

> You mentioned something about natural language search. How does that work?

Great question — this is where things get genuinely magical, and I want to explain it properly because it's one of those ideas that sounds complicated but clicks immediately once you see it.

Let me start with an analogy. When you're looking for a house, you're not just searching one dimension — you're navigating a space of dozens of overlapping qualities: location, size, natural light, walkability, character, garden, proximity to good schools, whether the kitchen *feels* right. No single number captures any of those things, and yet somehow your brain weighs them all simultaneously and knows when something fits.

Language works the same way. The word "dangerous" is close to "risky" and "hazardous," but also close to "exciting" and "thrilling" in a different direction. "Remote" is close to "isolated" but also close to "peaceful" and "unspoiled." These relationships exist in many dimensions at once.

What AI language models have learned to do is map words, sentences, and paragraphs onto points in one of these high-dimensional spaces. The mapping is called an **embedding** — a long list of numbers that represents the *meaning* of a piece of text as a location in that space. Things that mean similar things end up near each other. Things that mean different things end up far apart.

So here's how we use that for your bucket list. We take a few paragraphs from each Wikipedia article and convert them into embeddings using an AI model. We store those embeddings in MongoDB alongside the rest of your data. Then when you type a search query, we convert *that* into an embedding too and ask MongoDB to find the documents whose embeddings are closest to it in that space.

That's it. You're not searching for words — you're searching for meaning.

> How many dimensions are we talking about?

OpenAI's embedding model produces vectors with **512 dimensions** in our configuration. So each of your 96 places gets represented as a list of 512 floating point numbers. MongoDB stores all of them, and when you search, it computes the distance between your query vector and every stored vector and returns the closest ones.

> Okay, so how do we set it up?

Two steps. First, a script that reads the Wikipedia article for each place, pulls out a few paragraphs as a summary, and generates an embedding. It stores both back in the database — the summary as readable text, the embedding as that array of numbers.

You'll need an OpenAI API key for this. If you don't have one, head to [platform.openai.com/api-keys](https://platform.openai.com/api-keys), create a free account, and generate a new key. The embeddings are very cheap — a fraction of a cent for all 96 entries. Add the key to your `.env` file:

```
OPENAI_API_KEY=sk-...your key here...
```

Then in the scripts folder:

```bash
npm install
node add-embeddings.mjs
```

It'll work through all 96 entries, logging each one as it goes. Takes a few minutes.

> Okay, it's running! While that's going — what's the second step?

The second step is telling MongoDB to build a **Vector Search index** on the embedding field. This is what lets it search efficiently across 512 dimensions rather than doing brute-force comparisons.

Log into Atlas, click on your cluster, then go to **Atlas Search → Create Search Index → Atlas Vector Search**. Select the `everyone` database and `bucket` collection, and use this index definition:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "wikiEmbedding",
      "numDimensions": 512,
      "similarity": "cosine"
    }
  ]
}
```

The `numDimensions` must match what we generated. The `similarity` metric `cosine` measures the angle between vectors rather than raw distance, which works better for comparing meaning. Hit Create and Atlas builds the index in the background — usually about a minute.

> The script finished and the index is ready! Now what?

Now add your OpenAI key to the website's `.env` file as well, run `npm install` in the website folder to pick up the new package, and restart the server. You'll see a search box has appeared at the top of the page. Try typing something.

![Search](https://raw.githubusercontent.com/azamlerc/everyone/main/screenshots/search.png)

> Okay, I see the search field! I typed "statues" and it found The Motherland Calls, Worker and Kolkhoz Woman, and Woinic. Then I typed "transit" and it found ten metro, tram and train related things from around the world. This is so amazing! And run this by me again... all of this works because of 512 inscrutable numbers?!

Yes! 512 numbers per document — and the magic is entirely in *which* 512 numbers. They're the output of a model trained on essentially all of human writing, which learned to compress meaning into geometry. Synonyms end up in the same neighborhood. Concepts that often appear together end up nearby. Things that are semantically opposite end up far apart.

When you searched "statues," the model converted that word into its own point in the space. Then MongoDB measured the distance from that point to all 95 document vectors and returned the closest ones. The Motherland Calls, Worker and Kolkhoz Woman, and Woinic are all giant public sculptures — the model knew that, not because anyone told it, but because their Wikipedia summaries use language that clusters near the language around "statues."

> So it's not just keyword matching?

Not at all. If it were keyword matching, you'd only get results where the word "transit" literally appears in the summary. Vector search finds conceptual relatives. The Belgian Coast Tram might be described as a "coastal railway" with no mention of the word "transit" anywhere, and it still surfaces because *tram* and *railway* and *transit* live in the same neighborhood of the space.

That's why the search feels intelligent rather than mechanical. You're not searching text — you're searching *meaning*. And you built it entirely on top of data you already had. The Wikipedia summaries and embeddings were the only new ingredient.

---

---

## 6. Chat interface

> We've built a website with a map, radius search, and natural language search. What else can we do?

There's one more thing I've been saving. Everything we've built so far is about *finding* things — filtering, searching, locating. But what if someone visiting your bucket list could just... ask questions? In plain English, conversationally, the way you'd ask a well-travelled friend?

"What's the hardest place on your list to visit?"
"What do you have near Tokyo?"
"Tell me about the Cold War stuff."
"Which places haven't you been to yet that are in Europe?"

That's a chatbot — and we can build one that actually knows your data, because it has tools that let it query the database directly. When you ask about Cold War places, it doesn't guess. It runs a semantic search and tells you what it finds. When you ask what's near Tokyo, it does a real radius query. It's not just a language model making things up — it's a language model with genuine access to the truth.

> That sounds incredible. How does it work?

The key idea is **tool use**. When Claude gets a message, it can decide that before answering, it needs to look something up. It calls a tool — in our case, a function that queries MongoDB — gets the results back, and uses those to form its answer. The whole thing happens in a loop: think, call a tool, get results, think again, answer.

We give the chatbot three tools: one to filter places by been or challenge score, one to do semantic vector search, and one to find nearby places. That covers almost any question someone might ask.

> How do I set it up?

You'll need an Anthropic API key — that's what powers the chatbot itself. Head to [console.anthropic.com](https://console.anthropic.com/settings/keys), create an account, add a small amount of credit, and generate a key under API Keys. Add it to your website's `.env`:

```
ANTHROPIC_API_KEY=sk-ant-...your key here...
```

Then run `npm install` to pick up the new package and restart the server. You'll see a **💬 Chat** button has appeared in the header of the main page. Click it.

![Chat](https://raw.githubusercontent.com/azamlerc/everyone/main/screenshots/chat.png)

> Okay I'm on the chat page! What should I ask?

Try: *"What are the most difficult places on the list?"*

> It said: "The most challenging entries — all rated 5 out of 5 — are places that are currently either in active war zones, politically inaccessible, or physically impossible to visit: Chernobyl, the Crimean Trolleybus, Finland Station, Magnitogorsk Steel Works, Moscow Kremlin..."
>
> Wait — Moscow Kremlin is a 5? I've been there!

Exactly — and that's why the scores reflect conditions at the time of the visit, not today. The Kremlin was straightforward to visit as an exchange student in Moscow. The chatbot knows that because it's reading the actual data, not guessing.

Try asking something geographic next — like what's on the list near somewhere you're planning to travel.

> I asked "what's on my list near Madrid?" and it came back with Vizcaya Bridge, Canfranc, Viaduc de Millau... those are all real places within driving distance! It actually did the maths!

It did — it called the `findNearby` tool with Madrid's coordinates, ran a real geospatial query against the database, and returned the actual results sorted by distance. No hallucination, no guessing. The language model handles the conversation; the database handles the facts.

That's the whole point of everything we've built. The database is the source of truth. The AI is the interface. Put them together and you get something that feels like talking to someone who genuinely knows your data — because in a very real sense, it does.

> I can't believe we built all of this. A database, a website, a map, radius search, natural language search, and now a chatbot that can answer questions about my own data. And I still haven't written a single line of code.

That's what this was always about. The code exists — it's sitting in your project folder — but you didn't have to write it or even read it. You described what you wanted, we talked through how it works, and it got built.

The interesting thing is that *this conversation* — the one we've been having across all these sessions — is itself an example of AI and databases working together. Your data got richer every time we talked. The website got more capable. The conversation was the interface.

That's not going away. If anything, it's just getting started.

---

---

## 7. Wrapup

> I want to take a step back. Do you realize what we just did?

I do, but I'd love to hear you say it.

![Compass Enhanced](https://raw.githubusercontent.com/azamlerc/everyone/main/screenshots/compass-enhanced.png)

> We started with a text file. Just a list of place names. And now I have a real database, a website, a map, a search engine that understands what I mean rather than just what I type, and a chatbot I can have a conversation with about my own data. And I genuinely did not write a single line of code. I didn't even really look at the code.

That's exactly right. And I want to make sure that lands properly, because it's easy to gloss over how remarkable that is.

Six chats ago you didn't know what a database was. Now you have one running in the cloud with 96 documents, each with a name, a visited flag, a country flag emoji, a Wikipedia link, geographic coordinates in GeoJSON format, and a challenge score. You have a geospatial index that lets MongoDB do spherical geometry. You have 512-dimensional vector embeddings that encode the *meaning* of each place so you can search by concept. You have an API server with four endpoints. You have a frontend with a world map, clustering, radius search, natural language search, and a chatbot powered by Claude with genuine tool use.

That's not a toy. That's a real full-stack application using the headline features of one of the world's most sophisticated databases. Built in an afternoon, through conversation.

> What strikes me is that at every step, I didn't need to understand the technical details to make decisions. Like with the challenge scores — that was entirely my judgment, my knowledge of these places, my stories. The tank at the Transnistrian border. Timbuktu. You just... did the work of putting my decisions into the database.

That's the right way to think about it. The database and the code are infrastructure. They're there to hold and serve your knowledge, your experience, your curation. The interesting stuff — the fact that you hiked the entire 45km of the Brioude à Saint-Flour line, that you stared down a tank to enter Transnistria, that you've actually been to Agloe NY — none of that came from me. I just helped you store it properly and make it queryable.

The AI is the interface. The human is still the author.

> So what would someone do next if they wanted to take this further?

A few directions, depending on what excites you.

The most obvious next step is getting this off localhost and onto the internet so other people can actually see it. That involves two things most programmers take for granted but are worth explaining properly.

**First: GitHub.** GitHub is a website where you can store your code safely in the cloud and track every change you've ever made to it. This concept is called *source control* — instead of having a folder of files that you overwrite whenever you make changes, source control keeps the full history. Made a change that broke something? You can go back. Want to share your code with someone? Send them a link. Want to deploy to a server? Most hosting services can pull directly from GitHub.

You don't need to understand the deep internals of how it works to get started. GitHub has a desktop app that makes the basics — saving your code, syncing it to the cloud — feel more like using Dropbox than like programming. [GitHub's own getting-started guide](https://docs.github.com/en/get-started/start-your-journey/hello-world) is a good place to begin.

**Second: Render.** Once your code is on GitHub, Render is one of the easiest ways to get it running on the internet. You connect Render to your GitHub repository, tell it how to start the server (`node server.mjs`), add your environment variables — the MongoDB URI, OpenAI key, and Anthropic key — in Render's dashboard instead of a `.env` file, and it handles everything else: the server, the domain name, keeping it running. [This guide](https://render.com/docs/deploy-node-express-app) walks through deploying a Node/Express app exactly like ours.

Beyond getting online, some other things worth exploring:

**More data.** The schema we built — name, been, flag, link, coords, challenge, wikiSummary, wikiEmbedding — could hold any kind of list. Restaurants you love. Books you've read. Albums. Films. The enrichment scripts work on any Wikipedia-linked collection.

**Authentication.** Right now anyone who visits the site can see everything. If you wanted to mark things visited, add notes, or make it private, you'd need login. That's a bigger project but a well-understood one.

**Mobile.** The website works in a mobile browser, but a native app could use the GPS more naturally for the radius search — no "allow location" prompt, always knows where you are.

**More AI.** The chatbot we built has three tools. You could add more — one that writes a travel note when you mark something visited, one that suggests what to visit next based on where you're traveling, one that finds patterns across your whole list. The architecture supports it.

> One thing I keep coming back to: this whole series of chats is itself a demonstration of what we built. We used AI to build an AI-powered database application, and we used a database to store the data that the AI talks about. It's kind of recursive.

Very much so. And the context files we created at the start — `about-me.md` and `database-project.md` — those were a tiny version of the same idea. Structured information that an AI could read and use to stay oriented across sessions. Which is exactly what the chatbot does with the bucket list database.

The pattern keeps repeating at every scale: store things carefully, describe them well, and the AI can do something useful with them. That's not going to stop being true. If anything it's going to become more true as models get better at reasoning about structured data.

> Last question. What would you say to someone who looked at all this and said "well, you still needed an AI to do it, so it doesn't really count"?

I'd say: a carpenter still needs a hammer. A writer still needs a word processor. A scientist still needs instruments. The tool doesn't diminish the work — it changes what's possible.

You made every meaningful decision in this project. You chose what goes on the bucket list. You assigned the challenge scores from lived experience. You decided what the website should look like, what the chatbot should be able to answer, which places deserved a French Wikipedia link versus an English one. The judgment, the taste, the knowledge — all yours.

What changed is that the distance between "I have an idea" and "that idea exists in the world" got dramatically shorter. That's not nothing. That's almost everything.

> This has been one of the most fun and productive things I've done with AI. Thank you.

Genuinely my pleasure. Now go visit something on that list.

---

Try it yourself: [the bucket list](https://everyone-9huc.onrender.com) and [the chat](https://everyone-9huc.onrender.com/chat.html). Source on [GitHub](https://github.com/azamlerc/everyone).
