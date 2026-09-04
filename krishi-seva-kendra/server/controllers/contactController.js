const ContactQuery = require('../models/ContactQuery');

// POST /api/contact  (FR12)
exports.submitQuery = async (req, res, next) => {
  try {
    const { name, mobile, message } = req.body;
    if (!name || !mobile || !message) {
      return res.status(400).json({ message: 'Name, mobile number and message are required.' });
    }
    const query = await ContactQuery.create({ name, mobile, message });
    res.status(201).json({ message: 'Your message has been sent. The center will get back to you soon.', query });
  } catch (err) {
    next(err);
  }
};

// GET /api/contact  (Admin)
exports.listQueries = async (req, res, next) => {
  try {
    const queries = await ContactQuery.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    next(err);
  }
};
