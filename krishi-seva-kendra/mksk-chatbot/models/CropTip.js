const mongoose = require("mongoose");

const cropTipSchema = new mongoose.Schema({
  cropName: String,
  season: String,
  tipContent: String,
}, { timestamps: true });

module.exports = mongoose.models.CropTip || mongoose.model("CropTip", cropTipSchema);
