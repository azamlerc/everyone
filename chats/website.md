# AI ❤️ Databases, for everyone!

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

![API](screenshots/api.png) — the /bucket API JSON response

> Oh wow, that's really cool! All my data right there in the browser. And the emoji look great in there. Okay now I'm going to the main page...

![Website](screenshots/website.png) — the first version of the website with a list of places

> Wow, amazing! I ran the server with node, went to that link in my browser, and there was my new website! I like how you added the toggle buttons and showed the challenges with stars.
>
> I set aside the whole evening for this like it was going to be some kind of big project and you just went and did all the work with one command. I didn't even look at the code. This is insanely cool.

That's the whole point — the code is there if you ever want to look at it, but you don't have to. The website has your full bucket list with country flags, Wikipedia links for every entry, and the challenge stars so you can see at a glance which ones are the adventurous ones. The Been and To Do toggles let you filter to just what you're planning next or reminisce about what you've done.

And this is just the beginning. The server we built is a foundation — we can add new API endpoints for anything: a map view, radius search to find what's on your list near wherever you're traveling, natural language search. Each one is just a new route on the same server, a few more lines of JavaScript.

The database does the heavy lifting. The website is just a window into it.

> What's next?

A map. Those coordinates we added are just sitting there waiting to be used — let's put everything on a map with green pins for places you've been and red pins for places still on the list. And once we have a map, we can add something really fun: sort the list by distance from wherever you are right now.

---

*Next: [Map](map.md) — put everything on an interactive map with radius search.*
