const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    unit: { type: String, required: true, default: 'unit' },
    stockStatus: { type: String, enum: ['Available', 'Out of Stock'], default: 'Available' },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
