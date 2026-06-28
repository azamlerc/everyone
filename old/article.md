# AI ❤️ Databases, for everyone!

## Intro

Like me, you've probably been chatting with AI systems like ChatGPT for a few years now. They help us do all sorts of amazing things. But a significant limitation in the way that many of us interact with chatbots is that we get data in and out using copy and paste, which isn't very sophisiticated. 

A big change has come along relatively recently: the ability for AI to connect to other systems using the [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro), or MCP. It lets chatbots like Claude interact with files on your computer, and connect to data stored in databases such as MongoDB.

The first time I used Claude to talk about data in my own database reminded me of the first time I used the internet. I couldn't even believe it was happening, it was that profound. It changed everything. Now most of what I do with my computer involves using AI to talk about data. 

Instead of writing large programs to manipulate data, now I just say what I want: look for interesting patterns, add data from other sources, modify data like this. Sometimes AI can manipulate the data directly, or other times it makes more sense for AI to write a small program that I can run to do something more complex. Software becomes something single-use and disposable. 

Which got me to thinking: even though I have a software development background, I'm not looking at code anymore. So why would you need to be a developer to hook up AI to a database? 

The thesis of this article is that anyone who uses AI can up their game by connecting to a database. Come along and I'll show you how to get started. I hope it will change your world like it's changed mine.

## Audience

I'm going to assume that you're familiar with AI chatbots like ChatGPT, but that you aren't a programmer and it may be your first time using a database. If you do have some experience with databases, there's still something useful here—you can just skip over some of the basic explanations. 

We might have AI write some code for us, but we're not even going to look at it. So if you're not a programmer you can call it vibe coding, if you are then you can call it agent-assisted engineering. Either way, coding isn't the point of this article. 

This post will require running some commands in the Terminal, but I'll explain what you need to do. The examples will be from a Mac, but you can adapt as needed. 

## Tools

This article will demonstrate how to connect Claude with MongoDB, and all the magical things that will happen when you do.

### Claude

We're going to use [Claude](https://claude.ai/) because it currently has the best support for MCP of the mainstream chatbots. That's no surprise, since MCP was developed by [Anthropic](https://www.anthropic.com), the makers of Claude. We're going to use the desktop version, as MCP is currently not supported on web or mobile. The free version is fine for getting started, but the pro version will support more usage. 

### MongoDB

We're going to use [MongoDB](https://www.mongodb.com), a simple yet powerful database that has excellent support for AI. Their [MongoDB Atlas] product is hosted in the cloud as a service, so you don't need to think about running your own server. The free version lets you create a database to get started, and there are paid tiers as you add more data. 

## What is a database? 

A [database](https://en.wikipedia.org/wiki/Database) is an organized collection of structured information or data stored in a computer system. You can use it for storing recipies, pesky household chores, or [running a small steel mill](https://www.youtube.com/watch?v=cHM_w6ZkAik). Pretty much any collection of data, large or small, can be practically stored in a database.

The first database I used was [FileMaker Pro](https://en.wikipedia.org/wiki/FileMaker), on a Macintosh Classic with 1 MB of RAM. I used it to organize the pieces in my school's art exhibit, and print out the placards for each piece. The ClarisWorks office suite also included a simple database similar to FileMaker. It was simple to use, stored data in a flat file, and was entirely graphical—no programming necessary. 

More sophisticated databases based on [SQL](https://en.wikipedia.org/wiki/SQL) (Structured Query Language) are more likely to be used for enterprise purposes. They store records in tables using a structured schema, like a spreadsheet on steroids. They're connected to the internet and power things like websites, but generally require a higher level of expertise to use. 

MongoDB is an example of a NoSQL database. Unlike a SQL database, it doesn't force you to store records in tables using a fixed schema. Instead, it just stores JSON documents in collections, so it's super flexible and adapts to your needs as they evolve. It's powerful enough to power enterprise websites, but simple enough that I'll show you how to get started super easy.

## What is JSON?

JSON is a standard format for storing structured data in plain text. It's human readable once you get used to it. 

```
{
	"first": "Andrew",
	"last": "Zamler-Carhart",
	"year": 1978,
	"loves": ["AI", "databases"]
}
```

JSON is commonly used as a data interchange format on the internet. It also happens to be the native data format in MongoDB. The advantage there is that the same JSON document can be stored in the database, loaded by a backend service, transmitted via an API, and processed by a web page. 

## What is MCP?

According to Wikipedia, [Model Context Protocol](https://en.wikipedia.org/wiki/Model_Context_Protocol) "is an open standard and open-source framework introduced by Anthropic in November 2024 to standardize the way artificial intelligence (AI) systems like large language models (LLMs) integrate and share data with external tools, systems, and data sources. MCP provides a standardized interface for reading files, executing functions, and handling contextual prompts." You can think of MCP as the way that AI connects to stuff.

Claude can use MCP to read and write files on your own computer. You can truly collaborate with AI, as it can write files that you can read, but then you can also edit them and it can read your changes. It's common to use [Markdown](https://en.wikipedia.org/wiki/Markdown), a lightweight plain text format, for a variety of purposes: readme files, instructions, contextual information, status files, basically anything you want to write down. I'm even using Markdown to collaborate with AI on this article! 

Claude really shines when using MCP to connect to a database like MongoDB. It can use natural language to perform a variety of operations, like reading, searching, filtering, creating new documents, or modifying existing ones. You can think of it like a superhuman intelligence that can see everything—a database can store your data, but AI can *think* about it.

## Getting started

First, download [Claude Desktop](https://claude.com/download) and create an account. If you've used ChatGPT before, Claude will be quite familar. Once difference is that by default, Claude doesn't persist memory between chats. This gives you a little more control and focus, but requires you to be a bit more deliberate about managing context—what Claude is thinking about.

Next, create a [Mongo Atlas](https://www.mongodb.com/cloud/atlas/register) account. You'll also want to download [MongoDB Compass](https://www.mongodb.com/products/tools/compass), their desktop app for connecting to MongoDB databases including Atlas. 

*TODO:* how to configure Mongo Atlas with the necessary security so you can connect with Compass. 

## Importing data

What do you want to use your database for? You can keep track of people, places, things, ideas, basically anything that you can store in a list. If you already have some data in another system, you can export it in JSON or CSV format. 

If you're starting from scratch, you could throw some data into a spreadsheet. Make sure to give each column a name in the header row, and export the sheet as a CSV file. 

*TODO:* example of saving data from a spreadsheet

*TODO:* how to import JSON or CSV file in MongoDB Compass

## Get connected! 

Here's where the magic happens: we're going to connect Claude to MongoDB using the [MongoDB MCP Server](https://www.mongodb.com/docs/mcp-server/get-started/).

*TODO:* instructions for configuring MongoDB MCP Server

