const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const router = express.Router();

const { verifyToken: protect, requireRole } = require('../middleware/auth');
const Inquiry = require('../models/Inquiry');                  // ← adjust to your model name
const { sendTemplate } = require('../services/whatsappService');
const { sendPaymentSuccess } = require('../services/emailService');

const getRzp = () => new Razorpay({
  key_id: process.env.RZP_KEY_ID || 'dummy_key',
  key_secret: process.env.RZP_KEY_SECRET || 'dummy_secret',
});

router.post('/create-order', protect, requireRole('Farmer'), async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findOne({ _id: req.body.inquiryId, userId: req.user.id });
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    if (inquiry.paymentMethod !== 'online' || inquiry.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'This request is not awaiting online payment.' });
    }
    const order = await getRzp().orders.create({
      amount: Math.round(inquiry.total * 100),   // paise; price comes from the DB, not the client
      currency: 'INR',
      receipt: String(inquiry._id),
    });
    inquiry.paymentOrderId = order.id;
    await inquiry.save();
    res.json({ orderId: order.id, amount: order.amount, key: process.env.RZP_KEY_ID });
  } catch (e) { next(e); }
});

router.post('/verify', protect, requireRole('Farmer'), async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, inquiryId } = req.body;
    const inq = await Inquiry.findOne({ _id: inquiryId, userId: req.user.id });
    if (!inq || inq.paymentMethod !== 'online' || inq.paymentOrderId !== razorpay_order_id) {
      return res.status(400).json({ message: 'Payment does not match this request.' });
    }
    if (!process.env.RZP_KEY_SECRET || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification details are incomplete.' });
    }
    const expected = crypto.createHmac('sha256', process.env.RZP_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    const expectedBuffer = Buffer.from(expected);
    const signatureBuffer = Buffer.from(razorpay_signature);
    if (expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    inq.paymentStatus = 'paid';
    inq.paymentId = razorpay_payment_id;
    await inq.save();
    await inq.populate('userId');

    if (inq.userId?.whatsappOptIn)
      sendTemplate(inq.userId.mobile, 'payment_success', [inq.userId.name, inq.total]).catch(console.error);
    if (inq.userId) sendPaymentSuccess(inq.userId, inq).catch(console.error);

    res.json({ success: true });
  } catch (e) { next(e); }
});

module.exports = router;