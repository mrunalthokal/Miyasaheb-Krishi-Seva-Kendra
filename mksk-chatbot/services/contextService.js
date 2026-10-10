const { dbAvailable } = require("../config/db");
const Product = require("../models/Product");
const Scheme = require("../models/Scheme");
const CropTip = require("../models/CropTip");

function extractSearchTerm(message, stripWords) {
  let text = message.toLowerCase();
  stripWords.forEach((w) => { text = text.replace(new RegExp(`\\b${w}\\b`, "g"), " "); });
  return text.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2);
}

async function answerProducts(message) {
  if (!dbAvailable()) return null;
  const words = extractSearchTerm(message, [
    "price", "cost", "of", "for", "do", "you", "have", "is", "the", "a", "an",
    "what", "how", "much", "product", "products", "buy", "available", "stock",
  ]);
  if (!words.length) {
    const products = await Product.find({}).limit(5);
    if (!products.length) return null;
    return `Here are a few items we currently stock: ${products.map((p) => `${p.name} (${formatMoney(p.price)} ${p.unit})`).join(", ")}. Ask about a specific product for more detail.`;
  }

  const regex = new RegExp(words.join("|"), "i");
  const matches = await Product.find({ $or: [{ name: regex }, { category: regex }] }).limit(5);
  if (!matches.length) return null;

  return matches.map((p) => {
    const stock = p.stockStatus === "Available" ? "in stock" : "currently out of stock";
    return `${p.name} (${p.category}) — ${formatMoney(p.price)} ${p.unit}, ${stock}.`;
  }).join("\n");
}

async function answerSchemes(message) {
  if (!dbAvailable()) return null;
  const words = extractSearchTerm(message, [
    "scheme", "schemes", "about", "tell", "me", "what", "is", "the", "a", "an",
    "eligibility", "for", "yojana", "subsidy",
  ]);

  let matches;
  if (words.length) {
    const regex = new RegExp(words.join("|"), "i");
    matches = await Scheme.find({ $or: [{ title: regex }, { description: regex }] }).limit(3);
  }
  if (!matches || !matches.length) {
    matches = await Scheme.find({}).limit(3);
  }
  if (!matches.length) return null;

  return matches.map((s) =>
    `**${s.title}** — ${s.description} Eligibility: ${s.eligibility} Benefit: ${s.benefits}`
  ).join("\n\n");
}

async function answerCropTips(message) {
  if (!dbAvailable()) return null;
  const words = extractSearchTerm(message, [
    "tip", "tips", "advice", "for", "about", "how", "to", "grow", "growing",
    "cultivate", "when", "should", "i", "sow", "sowing", "the", "a", "an", "of",
  ]);
  if (!words.length) return null;

  const regex = new RegExp(words.join("|"), "i");
  const matches = await CropTip.find({ $or: [{ cropName: regex }, { tipContent: regex }] }).limit(3);
  if (!matches.length) return null;

  return matches.map((t) => `${t.cropName} (${t.season}): ${t.tipContent}`).join("\n\n");
}

function formatMoney(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

module.exports = { answerProducts, answerSchemes, answerCropTips };
