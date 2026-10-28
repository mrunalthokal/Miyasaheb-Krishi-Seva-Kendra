const Inquiry = require('../models/Inquiry');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendMessage } = require('../services/whatsappService');
const { sendInquiryNotification } = require('../services/emailService');

// POST /api/inquiries  (Farmer, FR7)
exports.createInquiry = async (req, res, next) => {
  try {
    const { productId, quantity, remarks, paymentMethod = 'online' } = req.body;
    if (!productId || !Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      return res.status(400).json({ message: 'Product and quantity are required.' });
    }
    if (!['online', 'cod'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method.' });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const inquiry = await Inquiry.create({
      userId: req.user.id,
      productId,
      quantity: Number(quantity),
      remarks: remarks || '',
      total: product.price * Number(quantity),
      paymentMethod,
      status: paymentMethod === 'cod' ? 'Fulfilled' : 'Pending',
    });

    // Send notifications
    const user = await User.findById(req.user.id);
    if (user?.mobile) {
      const paymentNote = paymentMethod === 'cod'
        ? 'Please pay the delivery person in cash when your order arrives.'
        : 'Please complete your payment to confirm the order.';
      const msg = `🌾 Thank you for visiting Krishi Seva Kendra!\n\nYour request for *${product.name}* (Qty: ${quantity} ${product.unit}) has been received.\n💰 Total: ₹${inquiry.total}\n\n${paymentNote}\n\n- Miyasaheb Krishi Seva Kendra`;
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
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const inquiries = await Inquiry.find({ userId: req.user.id, createdAt: { $gte: oneWeekAgo } })
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
    const { status, adminRemarks, paymentStatus } = req.body;
    const allowed = ['Pending', 'Approved', 'Fulfilled', 'Rejected'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }
    if (paymentStatus && !['pending', 'paid'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status.' });
    }
    const update = {};
    if (status) update.status = status;
    if (adminRemarks !== undefined) update.adminRemarks = adminRemarks;

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Request not found.' });
    if (
      status === 'Fulfilled' &&
      inquiry.paymentMethod === 'cod' &&
      inquiry.paymentStatus !== 'paid' &&
      paymentStatus !== 'paid'
    ) {
      return res.status(400).json({ message: 'Record the Cash on Delivery payment before completing this request.' });
    }
    if (paymentStatus) {
      if (paymentStatus === 'paid' && inquiry.paymentMethod !== 'cod') {
        return res.status(400).json({ message: 'Only Cash on Delivery payments can be recorded here.' });
      }
      if (paymentStatus === 'pending' && inquiry.paymentMethod === 'cod' && inquiry.paymentStatus === 'paid') {
        return res.status(400).json({ message: 'A recorded cash payment cannot be changed back to pending.' });
      }
      update.paymentStatus = paymentStatus;
      if (paymentStatus === 'paid') update.cashReceivedAt = new Date();
    }
    Object.assign(inquiry, update);
    await inquiry.save();
    await inquiry.populate('productId', 'name price unit');
    await inquiry.populate('userId', 'name mobile');
    res.json({ message: 'Request updated.', inquiry });
  } catch (err) {
    next(err);
  }
};
