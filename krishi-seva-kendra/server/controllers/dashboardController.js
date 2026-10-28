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

// GET /api/admin/latest-inquiries (Admin dashboard; last 7 days)
exports.getLatestInquiries = async (req, res, next) => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const inquiries = await Inquiry.find({ createdAt: { $gte: oneWeekAgo } })
      .populate('productId', 'name')
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(inquiries);
  } catch (err) {
    next(err);
  }
};
