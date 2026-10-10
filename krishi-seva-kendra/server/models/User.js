const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, default: '' },
    password: { type: String, required: true },
    village: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    landSize: { type: Number, default: null },
    status: { type: String, enum: ['Active', 'Deactivated'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
