const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    remarks: { type: String, default: '' },
    total: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ['online', 'cod'], default: 'online' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    paymentId: { type: String, default: '' },
    paymentOrderId: { type: String, default: '' },
    cashReceivedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Fulfilled', 'Rejected'],
      default: 'Pending',
    },
    adminRemarks: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
