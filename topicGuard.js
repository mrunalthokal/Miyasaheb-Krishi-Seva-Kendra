const {
  AGRICULTURE_KEYWORDS, GREETINGS, ABOUT_BOT, BUSINESS,
} = require("../data/keywords");

function normalize(text) {
  return String(text || "").toLowerCase().trim();
}

function containsAny(text, list) {
  return list.some((kw) => text.includes(kw));
}

// A message is in-scope if it mentions any agriculture-domain keyword, is a
// greeting/small-talk opener, or is asking about the bot/kendra itself.
// Deliberately permissive on greetings so the conversation doesn't feel
// broken for a normal "hi" — but the FIRST substantive question still has to
// pass the agriculture check.
function isInScope(message) {
  const text = normalize(message);
  if (!text) return { inScope: false, reason: "empty" };

  if (containsAny(text, GREETINGS)) return { inScope: true, reason: "greeting" };
  if (containsAny(text, ABOUT_BOT)) return { inScope: true, reason: "about_bot" };
  if (containsAny(text, AGRICULTURE_KEYWORDS)) return { inScope: true, reason: "agriculture_keyword" };

  return { inScope: false, reason: "off_topic" };
}

function classifyIntent(message) {
  const text = normalize(message);

  if (containsAny(text, GREETINGS) && text.split(" ").length <= 4) return "greeting";
  if (containsAny(text, ABOUT_BOT)) return "about_bot";

  if (/scheme|subsid|yojana|pm-kisan|pmkisan|kcc|kisan credit|insurance|fasal bima|anudan/.test(text)) {
    return "schemes";
  }
  if (/tip|advice|grow|cultivat|when (should|to) (i )?sow|sowing|spacing|season for/.test(text)) {
    return "crop_tips";
  }
  if (/price|cost|₹|rupee|buy|available|stock|product|catalog|catalogue/.test(text)) {
    return "products";
  }
  if (/weather|rain|forecast|monsoon|temperature|humidity/.test(text)) {
    return "weather";
  }
  if (/pest|disease|fungus|blight|wilt|insect|infestation|borer|aphid/.test(text)) {
    return "pest_disease";
  }
  return "general_agri";
}

module.exports = { isInScope, classifyIntent, normalize };
