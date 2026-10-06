const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema({
  title: String,
  description: String,
  eligibility: String,
  benefits: String,
}, { timestamps: true });

module.exports = mongoose.models.Scheme || mongoose.model("Scheme", schemeSchema);
