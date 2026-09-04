const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  listCropTips,
  getCropTip,
  createCropTip,
  updateCropTip,
  deleteCropTip,
} = require('../controllers/cropTipController');

router.get('/croptips', listCropTips);
router.get('/croptips/:id', getCropTip);

router.post('/croptips', verifyToken, requireRole('Admin'), createCropTip);
router.put('/croptips/:id', verifyToken, requireRole('Admin'), updateCropTip);
router.delete('/croptips/:id', verifyToken, requireRole('Admin'), deleteCropTip);

module.exports = router;
