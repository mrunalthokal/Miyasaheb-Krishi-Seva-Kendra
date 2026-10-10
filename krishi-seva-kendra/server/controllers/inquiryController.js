const Inquiry = require('../models/Inquiry');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendMessage } = require('../services/whatsappService');
const { sendInquiryNotification } = require('../services/emailService');

// POST /api/inquiries  (Farmer, FR7)
exports.createInquiry = async (req, res, next) => {
  try {
    const { productId, quantity, remarks, userId, total } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product and quantity are required.' });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const inquiry = await Inquiry.create({
      userId: req.user?.id || userId || undefined,
      productId,
      quantity,
      remarks: remarks || '',
      total: total || product.price * quantity,
    });

    // Send notifications
    const user = await User.findById(req.user?.id || userId);
    if (user?.mobile) {
      const msg = `🌾 Thank you for visiting Krishi Seva Kendra!\n\nYour request for *${product.name}* (Qty: ${quantity} ${product.unit}) has been received.\n💰 Total: ₹${inquiry.total}\n\nPlease complete your payment to confirm the order.\n\n- Miyasaheb Krishi Seva Kendra`;
      sendMessage(user.mobile, msg).catch(console.error);
    }
    if (user) sendInquiryNotification(user, product, inquiry).catch(console.error);

    res.status(201).json({ message: 'Your request has been submitted.', ...inquiry.toObject() });
  } catch (err) {
    next(err);
  }
};

// GET /api/inquiries/me  (Farmer, FR8)
exports.myInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ userId: req.user.id })
      .populate('productId', 'name price unit imageUrl')
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    next(err);
  }
};

// GET /api/inquiries  (Admin, FR14)
exports.listInquiries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const inquiries = await Inquiry.find(filter)
      .populate('productId', 'name price unit')
      .populate('userId', 'name mobile village')
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    next(err);
  }
};

// PUT /api/inquiries/:id  (Admin, FR14)
exports.updateInquiry = async (req, res, next) => {
  try {
    const { status, adminRemarks } = req.body;
    const allowed = ['Pending', 'Approved', 'Fulfilled', 'Rejected'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }
    const update = {};
    if (status) update.status = status;
    if (adminRemarks !== undefined) update.adminRemarks = adminRemarks;

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('productId', 'name price unit')
      .populate('userId', 'name mobile');
    if (!inquiry) return res.status(404).json({ message: 'Request not found.' });
    res.json({ message: 'Request updated.', inquiry });
  } catch (err) {
    next(err);
  }
};
