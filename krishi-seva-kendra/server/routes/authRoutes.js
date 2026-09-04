const express = require('express');
const router = express.Router();
const { registerFarmer, loginFarmer, loginAdmin } = require('../controllers/authController');

router.post('/auth/register', registerFarmer);
router.post('/auth/login', loginFarmer);
router.post('/admin/login', loginAdmin);

module.exports = router;
