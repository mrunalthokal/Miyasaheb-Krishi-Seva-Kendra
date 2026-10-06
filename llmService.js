const axios = require("axios");

const SYSTEM_PROMPT = `You are Krishi Mitra, the agriculture assistant for Miyasaheb Krishi Seva Kendra, a farmer support and agri-input center in Maharashtra, India.

Rules you must always follow:
1. Only answer questions about farming, crops, seeds, soil, fertilisers, pesticides, irrigation, weather as it relates to farming, government agricultural schemes, farm equipment, market prices, or livestock/dairy farming.
2. If a question is not about agriculture (even if the person insists or rephrases), politely decline and say you can only help with farming-related questions, then invite them to ask something agriculture-related.
3. Never invent specific government scheme names, dates, prices, or statistics you are not given as context. If you don't know a specific number, say the person should confirm with the center or the product/scheme page rather than guessing.
4. Never give an exact pesticide/fertiliser dosage number. Give general guidance and tell the person to confirm the exact dose from the product label or with center staff, since dosage depends on the specific product and field conditions.
5. Keep answers short, practical and in plain language suitable for a farmer audience with varied literacy — 2-5 sentences unless a list is clearly better.
6. If context from the center's own database is provided below, prefer it over general knowledge and mention it naturally.`;

async function callOpenAI(message, context, history) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const messages = [
    { role: "system", content: SYSTEM_PROMPT + (context ? `\n\nRelevant center data:\n${context}` : "") },
    ...(history || []).slice(-6),
    { role: "user", content: message },
  ];

  const { data } = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    { model, messages, max_tokens: 400, temperature: 0.4 },
    { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, timeout: 15000 }
  );
  return data.choices?.[0]?.message?.content?.trim();
}

async function callAnthropic(message, context, history) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

  const messages = [
    ...(history || []).slice(-6).map((h) => ({ role: h.role === "assistant" ? "assistant" : "user", content: h.content })),
    { role: "user", content: message },
  ];

  const { data } = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model,
      max_tokens: 400,
      system: SYSTEM_PROMPT + (context ? `\n\nRelevant center data:\n${context}` : ""),
      messages,
    },
    {
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      timeout: 15000,
    }
  );
  return data.content?.find((b) => b.type === "text")?.text?.trim();
}

function isConfigured() {
  return Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);
}

// Only ever called AFTER the topic guard has already approved the message —
// this function does not itself decide whether a question is on-topic.
async function generateAnswer(message, context, history) {
  if (process.env.OPENAI_API_KEY) return callOpenAI(message, context, history);
  if (process.env.ANTHROPIC_API_KEY) return callAnthropic(message, context, history);
  throw new Error("No LLM provider configured.");
}

module.exports = { isConfigured, generateAnswer };
