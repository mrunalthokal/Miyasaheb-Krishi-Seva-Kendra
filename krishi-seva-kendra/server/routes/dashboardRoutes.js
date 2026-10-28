const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { getSummary, getLatestInquiries } = require('../controllers/dashboardController');

router.get('/admin/summary', verifyToken, requireRole('Admin'), getSummary);
router.get('/admin/latest-inquiries', verifyToken, requireRole('Admin'), getLatestInquiries);

module.exports = router;
