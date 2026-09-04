const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { getSummary } = require('../controllers/dashboardController');

router.get('/admin/summary', verifyToken, requireRole('Admin'), getSummary);

module.exports = router;
