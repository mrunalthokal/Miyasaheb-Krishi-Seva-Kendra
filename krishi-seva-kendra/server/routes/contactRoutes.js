const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { submitQuery, listQueries } = require('../controllers/contactController');

router.post('/contact', submitQuery);
router.get('/contact', verifyToken, requireRole('Admin'), listQueries);

module.exports = router;
