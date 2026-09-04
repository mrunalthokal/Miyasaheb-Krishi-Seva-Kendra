const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  getMyProfile,
  updateMyProfile,
  listFarmers,
  updateFarmerStatus,
} = require('../controllers/userController');

router.get('/users/me', verifyToken, requireRole('Farmer'), getMyProfile);
router.put('/users/me', verifyToken, requireRole('Farmer'), updateMyProfile);

router.get('/farmers', verifyToken, requireRole('Admin'), listFarmers);
router.put('/farmers/:id/status', verifyToken, requireRole('Admin'), updateFarmerStatus);

module.exports = router;
