const KB = require("../data/knowledgeBase");
const { normalize } = require("./topicGuard");

const GREETING_ENTRY = KB.find((e) => e.question === "__greeting__");

function tokenize(text) {
  return normalize(text).split(/[^a-z0-9]+/).filter(Boolean);
}

function stem(word) {
  return word.slice(0, Math.min(5, word.length));
}

// A phrase keyword matches if every word in it has a stem-match among the
// message's tokens (order-independent, tolerant of plurals/verb endings —
// e.g. "irrigate" and "irrigation" share the stem "irrig").
function phraseHits(messageTokens, keyword) {
  const kwWords = tokenize(keyword);
  if (!kwWords.length) return false;
  return kwWords.every((kw) => {
    const kwStem = stem(kw);
    return messageTokens.some((t) => stem(t) === kwStem);
  });
}

// Primary keywords are strong signals (weight 2, one hit is enough to match).
// Secondary keywords are weaker/generic (weight 1, need to combine with
// something else to cross the threshold). This keeps matching forgiving
// without letting generic words fire a match on their own.
function scoreEntry(messageTokens, entry) {
  let score = 0;
  for (const kw of entry.primary) if (phraseHits(messageTokens, kw)) score += 2;
  for (const kw of entry.secondary) if (phraseHits(messageTokens, kw)) score += 1;
  return score;
}

function findBestMatch(message) {
  const tokens = tokenize(message);
  if (!tokens.length) return null;

  let best = null;
  let bestScore = 0;

  for (const entry of KB) {
    if (entry.question === "__greeting__") continue;
    const score = scoreEntry(tokens, entry);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore >= 2 ? best : null;
}

function greeting() {
  return GREETING_ENTRY.answer;
}

module.exports = { findBestMatch, greeting };
