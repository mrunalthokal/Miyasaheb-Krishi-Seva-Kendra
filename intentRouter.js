const { isInScope, classifyIntent } = require("./topicGuard");
const kb = require("./knowledgeBase");
const context = require("./contextService");
const llm = require("./llmService");

const OFF_TOPIC_REPLY =
  "I'm Krishi Mitra, and I can only help with farming questions — crops, seeds, fertilisers, pests, irrigation, weather for farming, government schemes, equipment or our products. Could you ask me something about agriculture?";

const ABOUT_BOT_REPLY =
  "I'm Krishi Mitra, the farming assistant for Miyasaheb Krishi Seva Kendra. Ask me about crops, seeds, fertilisers, pests and diseases, irrigation, government schemes, weather, or anything in our product catalog.";

const FALLBACK_REPLY =
  "I don't have a specific answer for that yet. You're welcome to visit the center or call us, and our staff can help directly — or try rephrasing your question about the crop, scheme or product you mean.";

async function handleMessage(message, history) {
  const scope = isInScope(message);
  if (!scope.inScope) {
    return { reply: OFF_TOPIC_REPLY, intent: "off_topic", source: "guard" };
  }

  const intent = classifyIntent(message);

  if (intent === "greeting") {
    return { reply: kb.greeting(), intent, source: "knowledge_base" };
  }
  if (intent === "about_bot") {
    return { reply: ABOUT_BOT_REPLY, intent, source: "static" };
  }

  // Try live center data first for these intents — it's more useful than
  // generic knowledge when we actually have it.
  let dbAnswer = null;
  try {
    if (intent === "schemes") dbAnswer = await context.answerSchemes(message);
    else if (intent === "products") dbAnswer = await context.answerProducts(message);
    else if (intent === "crop_tips") dbAnswer = await context.answerCropTips(message);
  } catch (err) {
    dbAnswer = null; // DB hiccup shouldn't break the conversation — fall through
  }

  if (dbAnswer) {
    return { reply: dbAnswer, intent, source: "database" };
  }

  // No DB match — try the local knowledge base.
  const kbMatch = kb.findBestMatch(message);
  if (kbMatch) {
    // If an LLM is configured, let it rephrase/expand using the KB answer as
    // grounding context so responses feel more natural without inventing facts.
    if (llm.isConfigured()) {
      try {
        const reply = await llm.generateAnswer(message, kbMatch.answer, history);
        if (reply) return { reply, intent, source: "llm+knowledge_base" };
      } catch (err) {
        // fall through to the raw KB answer if the LLM call fails
      }
    }
    return { reply: kbMatch.answer, intent, source: "knowledge_base" };
  }

  // Nothing matched locally — ask the LLM directly if configured, since the
  // topic guard has already confirmed this is an agriculture question.
  if (llm.isConfigured()) {
    try {
      const reply = await llm.generateAnswer(message, null, history);
      if (reply) return { reply, intent, source: "llm" };
    } catch (err) {
      // fall through to the static fallback
    }
  }

  return { reply: FALLBACK_REPLY, intent, source: "fallback" };
}

module.exports = { handleMessage };
