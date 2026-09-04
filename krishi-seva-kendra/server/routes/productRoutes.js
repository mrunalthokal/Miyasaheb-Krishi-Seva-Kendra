const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  listProducts,
  getProduct,
  listCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

router.get('/products', listProducts);
router.get('/categories', listCategories);
router.get('/products/:id', getProduct);

router.post('/products', verifyToken, requireRole('Admin'), createProduct);
router.put('/products/:id', verifyToken, requireRole('Admin'), updateProduct);
router.delete('/products/:id', verifyToken, requireRole('Admin'), deleteProduct);

module.exports = router;
