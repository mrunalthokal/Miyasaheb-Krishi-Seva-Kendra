const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    eligibility: { type: String, default: '' },
    benefits: { type: String, default: '' },
    officialLink: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scheme', schemeSchema);
