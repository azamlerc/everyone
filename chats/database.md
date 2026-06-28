# AI ❤️ Databases, for everyone!

## 1. Creating a database

*For a few years now, we've been using AI chatbots like ChatGPT to do all kinds of amazing things. However, we've been limited by the way that we exchange information with AI, such as copying and pasting content in and out of a chat window. Recently, a new protocol called MCP has made it possible to connect chatbots like Claude to other data sources, such as the file system on your computer or databases like MongoDB. This evolution is so game changing, the moment when you start talking with AI about your data feels as profound as using the internet for the first time.*

*These techniques are quite new, and while many developers are learning to take advantage of them, it's not exactly obvious for people who aren't programmers or don't have database experience what kind of amazing things are possible. What follows is a chat between a curious computer user and Claude that shows how non-programmers can take full advantage of using natural language to chat about their data, and can even build websites that take advantage of some advanced database features without even looking at code. Follow along, and I hope you'll learn something new!*


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

Great! Now there are two quick security things to set up before you can actually connect to it. MongoDB Atlas is locked down by default — which is good — but we need to give you the keys.

**Step 1: Create a database user.**
In the Atlas sidebar, find **Database Access** under the Security section. Click **Add New Database User**. Choose **Password** as the authentication method, pick a username and a strong password, and give the user **Read and write to any database** access. Save that password somewhere — you'll need it in a moment.

**Step 2: Whitelist your IP address.**
In the sidebar, find **Network Access**. Click **Add IP Address**, then **Add Current IP Address**. This tells Atlas that connections coming from your computer are allowed. Confirm it.

Once both of those are done, let me know!

> Done! The user is created and my IP is added.

Perfect. Now let's get you connected with [MongoDB Compass](https://www.mongodb.com/products/tools/compass) — that's the desktop app for working with your database visually. Download and install it.

Once it's running, go back to Atlas and click the **Connect** button on your cluster. Choose **Compass** as the connection method, and it'll give you a connection string — a URL-like thing that looks something like this:

```
mongodb+srv://yourusername:<password>@yourcluster.abc123.mongodb.net/
```

Copy that string, replace `<password>` with the actual password you set earlier, then paste it into Compass and click **Connect**. You should see your cluster appear in the left sidebar.

> Okay I did all that, and I've got Compass up and running! I can see my cluster, and I made a database called `everyone` and a collection called `bucket` for my bucket list.

Look at you — you just created your own database! Told you it would be easier than WebObjects.

Now all that's missing is data. You mentioned you love to travel — do you have a bucket list going?

> Of course I do! It's just a text file, nothing fancy. A list of places I've been and places I want to go.

That's perfect. The easiest way to get it into MongoDB is to open it in a spreadsheet first. Create two columns: one called `name` for the place name, and one called `been` — put `true` for places you've visited and `false` for places still on the list. One row per place.

> Okay, I copied everything in and filled out the `been` column. This is kind of satisfying actually.

Right? Sometimes just organizing data is its own reward. Now save the spreadsheet as a CSV file.

Then in Compass, click on your `bucket` collection in the left sidebar, and look for the **Import data** button. Select your CSV file. Compass will ask you to confirm the field types — `name` should be a String and `been` should be a Boolean, and it's usually smart enough to figure that out on its own. Accept the suggested formats and hit import.

![Compass](screenshots/compass.png) — the initial data import

> It worked! I can see all my places in there. Each one has a `name`, a `been` value, and also something called `_id` that looks like a random jumble of characters.

That `_id` is MongoDB's way of giving every document a unique identifier automatically. You'll never have to touch it — it's just there behind the scenes doing important work.

More importantly: you have a real database with real data that means something to you. That's genuinely exciting.

> Got me a database, awww yeah. I bet you want to see all my cool bucket list places.

I mean, I'm an AI, so "want" is a strong word — but yes, if you want to give me access, I would very much enjoy having a look.

> Just teasing. That's the whole point of this chat. What do I do?

We're going to install the [MongoDB MCP Server](https://www.mongodb.com/docs/mcp-server/get-started/), which is what lets me connect to your database from inside our chat.

It requires Node.js to be installed on your computer — that's a JavaScript runtime that a lot of developer tools depend on. You can check whether you already have it by opening Terminal (search for it in Spotlight with `Cmd+Space`) and typing:

```
node --version
```

If you see a version number like `v22.x.x`, you're good. If you get an error, head to [nodejs.org](https://nodejs.org) and download the LTS version — just run the installer like any other app. Come back when that's sorted.

> I ran that command and I've got v22 — I'm good!

Excellent. Now we need to edit Claude Desktop's configuration file to tell it about the MongoDB MCP server. This is a JSON file that lives in a slightly hidden location on your Mac.

The easiest way to open it: in Claude Desktop, go to **Settings → Developer → Edit Config**. This will open the file in your default text editor.

You'll see something like this already in there:

```json
{
  "mcpServers": {
    "filesystem": {
      ...
    }
  }
}
```

We need to add a MongoDB entry. Add the following inside the `mcpServers` block, after the filesystem section (make sure there's a comma separating them):

```json
"mongodb": {
  "command": "npx",
  "args": [
    "-y",
    "mongodb-mcp-server",
    "--connectionString",
    "mongodb+srv://yourusername:yourpassword@yourcluster.abc123.mongodb.net/"
  ]
}
```

Replace the connection string with the one from Compass — with your actual password filled in, not `<password>`.

When the file is saved, restart Claude Desktop.

> Okay I think I did it — I saved the file and restarted. Can you see it?

I can! I can see you have 96 places on your bucket list. You've been to 55 of them — just over half. You've been busy!

> HALLELUJAH! A choir of angels is singing. I'm using AI to talk to my very own database! And yes, travel is definitely my hobby. I even try to keep a balance between places I've been and places I still want to go — it keeps me feeling oriented in the mission.

That's a beautiful way to put it. Equal parts memory and aspiration.

And now that we're connected, we can do so much more than just count things. We can find patterns, add information, build a website around it, put everything on a map, add natural language search — anything. The database is the foundation, and now that I can see it, we can really get to work.

> This is so cool. I didn't write a single line of code and I'm talking to my own database with AI.

You really didn't. And that's the point. What shall we do next?

---

*Next: [Enhance](enhance.md) — add flags, Wikipedia links, coordinates, and challenge scores to your data.*
