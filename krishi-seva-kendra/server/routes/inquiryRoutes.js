const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  createInquiry,
  myInquiries,
  listInquiries,
  updateInquiry,
} = require('../controllers/inquiryController');

router.post('/inquiries', verifyToken, requireRole('Farmer'), createInquiry);
router.get('/inquiries/me', verifyToken, requireRole('Farmer'), myInquiries);

router.get('/inquiries', verifyToken, requireRole('Admin'), listInquiries);
router.put('/inquiries/:id', verifyToken, requireRole('Admin'), updateInquiry);

module.exports = router;
