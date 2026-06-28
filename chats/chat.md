# AI ❤️ Databases, for everyone!

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

![Chat](screenshots/chat.png) — the chat interface on the website

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

*Next: [Wrapup](wrapup.md) — reflect on the journey and where to go next.*
