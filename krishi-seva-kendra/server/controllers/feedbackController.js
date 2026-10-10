const Feedback = require('../models/Feedback');

const createFeedback = async (req, res, next) => {
  try {
    const { category, rating, message } = req.body;

    if (!category || !rating || !message) {
      return res.status(400).json({
        message: 'Category, rating and message are required'
      });
    }

    const feedback = await Feedback.create({
      category,
      rating,
      message
    });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    next(error);
  }
};

const getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFeedback,
  getFeedback
};