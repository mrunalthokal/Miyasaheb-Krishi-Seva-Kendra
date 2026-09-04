const Product = require('../models/Product');
const Category = require('../models/Category');

// GET /api/products  (FR4, FR5) — search by keyword, filter by category/availability/price
exports.listProducts = async (req, res, next) => {
  try {
    const { q, category, availability, minPrice, maxPrice } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    if (category) filter.categoryId = category;
    if (availability) filter.stockStatus = availability;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).populate('categoryId', 'name').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id  (FR6)
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// GET /api/categories
exports.listCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// POST /api/products  (Admin, FR13)
exports.createProduct = async (req, res, next) => {
  try {
    const { name, categoryId, description, price, unit, stockStatus, imageUrl } = req.body;
    if (!name || !categoryId || price === undefined || !unit) {
      return res.status(400).json({ message: 'Name, category, price and unit are required.' });
    }
    const product = await Product.create({ name, categoryId, description, price, unit, stockStatus, imageUrl });
    res.status(201).json({ message: 'Product added.', product });
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id  (Admin, FR13)
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product updated.', product });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id  (Admin, FR13)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
};
