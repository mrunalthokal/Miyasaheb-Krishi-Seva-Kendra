# Krishi Mitra — Agriculture-Only Chatbot for Miyasaheb Krishi Seva Kendra

A standalone chatbot service, kept in its own folder on purpose so you can build
and test it independently before wiring it into the main website. It answers
**only** agriculture-related questions — anything else gets a polite decline.

## What's inside

```
mksk-chatbot/
├── server.js                  Express app entry point
├── package.json
├── .env.example                Copy to .env — every value is optional
├── controllers/chatController.js
├── routes/chatRoutes.js
├── services/
│   ├── topicGuard.js            Decides if a message is agriculture-related
│   ├── knowledgeBase.js          Matches questions to data/knowledgeBase.js
│   ├── contextService.js          Live lookups against the site's MongoDB (optional)
│   ├── llmService.js               Optional OpenAI/Anthropic call for richer answers
│   └── intentRouter.js               Ties the above together — the bot's "brain"
├── data/
│   ├── keywords.js               Agriculture vocabulary used by the topic guard
│   └── knowledgeBase.js           ~15 general farming Q&A pairs used offline
├── models/                     Read-only copies of Product/Scheme/CropTip
│                                  (point MONGO_URI at the SAME database the
│                                   main site uses and the bot reads live data)
├── public/                     Standalone test page — open this first
├── widget/                     Drop-in floating chat widget for later integration
└── __smoke__/chat.smoke.js     Automated tests — `npm run smoke-test`
```

## How it decides what to answer

1. **Topic guard** (`services/topicGuard.js`) checks the message against an
   agriculture keyword list before anything else runs. Off-topic questions
   never reach a knowledge lookup or an LLM call — they get an immediate,
   polite decline.
2. **Live database** (optional) — if `MONGO_URI` is set and points at the same
   database as the main site, questions about schemes, products or crop tips
   are answered from the real, current data.
3. **Local knowledge base** — ~15 general farming Q&A pairs (sowing times,
   irrigation, pests, fertiliser, storage, schemes, etc.) answer common
   questions with zero setup and zero cost.
4. **Optional LLM** — if you add an OpenAI or Anthropic API key, the bot uses
   it to phrase fuller answers for questions the knowledge base doesn't cover
   well. The topic guard still runs first, so the LLM never even sees an
   off-topic message, and the system prompt additionally forbids inventing
   scheme details or exact chemical dosages.

None of steps 2–4 are required — the bot is fully functional and testable
with **zero configuration**.

## Run it (standalone — no website, no MongoDB, no API key needed)

```bash
cd mksk-chatbot
npm install
npm start
```

Open **http://localhost:5050** — a self-contained test chat page loads (not
part of the main site). Try the suggestion chips, including the "off-topic"
one, to see the guard in action.

Run the automated checks any time with:

```bash
npm run smoke-test
```

## Optional: connect it to live site data

Point it at the same MongoDB the main backend uses (see `../server/.env`) so
questions like *"what fertilizers do you have"* or *"tell me about PM-KISAN"*
pull real, current answers:

```
MONGO_URI=mongodb://127.0.0.1:27017/mksk
```

No schema changes needed — the chatbot's models read the same `products`,
`schemes` and `croptips` collections the main site writes to.

## Optional: enable richer LLM-generated answers

Add **one** of these to `.env` (OpenAI is checked first):

```
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...
```

The guard and refusal behavior are unchanged either way — this only affects
how *in-scope* answers are phrased when the local knowledge base doesn't have
a good match.

## Integrating with the main website (when you're ready)

Two options:

**A — Floating widget (fastest):** copy `widget/chatbot-widget.js` and
`widget/chatbot-widget.css` into the main site's `client/` folder, then add
to the bottom of any page (e.g. right before `</body>` in each `.html` file):

```html
<link rel="stylesheet" href="widget/chatbot-widget.css">
<script src="widget/chatbot-widget.js" data-api-base="http://localhost:5050"></script>
```

That's it — a chat bubble appears bottom-right on every page it's added to.
Change `data-api-base` to wherever you deploy this chatbot folder.

**B — Same server as the main site:** if you'd rather not run a second
server, copy the `routes/`, `controllers/`, `services/`, `data/` and `models/`
folders' *contents* into the main `server/` project under a `/api/chat`
route, reusing the main backend's existing Mongoose models instead of the
read-only copies here. The widget files work unchanged either way — just
point `data-api-base` at the main site's own origin (or leave it blank).

## Notes

- The bot never gives an exact pesticide/fertiliser dosage — it always points
  the farmer to the product label or center staff, matching how a real
  extension worker would answer.
- `data/knowledgeBase.js` and `data/keywords.js` are plain data files —
  extend them with more Q&A pairs or vocabulary without touching any logic.
