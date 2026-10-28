// Read-only mirror of the main backend's Product schema (same collection:
// "products"), so the bot can answer catalog questions from live data.
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  unit: String,
  stockStatus: String,
  desc: String,
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
