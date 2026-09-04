const User = require('../models/User');
const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');
const ContactQuery = require('../models/ContactQuery');

// GET /api/admin/summary  (Admin Dashboard quick counts)
exports.getSummary = async (req, res, next) => {
  try {
    const [totalFarmers, totalProducts, pendingInquiries, totalQueries] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Inquiry.countDocuments({ status: 'Pending' }),
      ContactQuery.countDocuments(),
    ]);
    res.json({ totalFarmers, totalProducts, pendingInquiries, totalQueries });
  } catch (err) {
    next(err);
  }
};
