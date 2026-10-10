const express = require('express');

const {
  createFeedback,
  getFeedback
} = require('../controllers/feedbackController');

const router = express.Router();

router.post('/feedback', createFeedback);

router.get('/feedback', getFeedback);

module.exports = router;