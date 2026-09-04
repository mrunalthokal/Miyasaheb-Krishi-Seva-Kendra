const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  listSchemes,
  getScheme,
  createScheme,
  updateScheme,
  deleteScheme,
} = require('../controllers/schemeController');

router.get('/schemes', listSchemes);
router.get('/schemes/:id', getScheme);

router.post('/schemes', verifyToken, requireRole('Admin'), createScheme);
router.put('/schemes/:id', verifyToken, requireRole('Admin'), updateScheme);
router.delete('/schemes/:id', verifyToken, requireRole('Admin'), deleteScheme);

module.exports = router;
