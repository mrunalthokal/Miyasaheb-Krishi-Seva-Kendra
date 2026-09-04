const mongoose = require('mongoose');

const cropTipSchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true, trim: true },
    season: { type: String, required: true, trim: true },
    tipContent: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CropTip', cropTipSchema);
