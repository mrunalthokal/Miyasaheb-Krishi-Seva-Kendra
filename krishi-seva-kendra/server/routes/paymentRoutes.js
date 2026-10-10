const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const router = express.Router();

const { verifyToken: protect } = require('../middleware/auth');
const Inquiry = require('../models/Inquiry');                  // ← adjust to your model name
const { sendTemplate } = require('../services/whatsappService');
const { sendPaymentSuccess } = require('../services/emailService');

const getRzp = () => new Razorpay({
  key_id: process.env.RZP_KEY_ID || 'dummy_key',
  key_secret: process.env.RZP_KEY_SECRET || 'dummy_secret',
});

router.post('/create-order', protect, async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.body.inquiryId);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    const order = await getRzp().orders.create({
      amount: Math.round(inquiry.total * 100),   // paise; price comes from the DB, not the client
      currency: 'INR',
      receipt: String(inquiry._id),
    });
    res.json({ orderId: order.id, amount: order.amount, key: process.env.RZP_KEY_ID });
  } catch (e) { next(e); }
});

router.post('/verify', protect, async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, inquiryId } = req.body;
    const expected = crypto.createHmac('sha256', process.env.RZP_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    if (expected !== razorpay_signature) return res.status(400).json({ message: 'Invalid signature' });

    const inq = await Inquiry.findByIdAndUpdate(
      inquiryId, { paymentStatus: 'paid', paymentId: razorpay_payment_id }, { new: true }
    ).populate('userId');

    if (inq.userId?.whatsappOptIn)
      sendTemplate(inq.userId.mobile, 'payment_success', [inq.userId.name, inq.total]).catch(console.error);
    if (inq.userId) sendPaymentSuccess(inq.userId, inq).catch(console.error);

    res.json({ success: true });
  } catch (e) { next(e); }
});

module.exports = router;