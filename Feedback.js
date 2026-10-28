const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['Product', 'Service', 'Website', 'Chatbot', 'Other']
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);