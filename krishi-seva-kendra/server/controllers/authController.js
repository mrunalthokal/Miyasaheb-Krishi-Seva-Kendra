const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

function signToken(id, role) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// POST /api/auth/register  (FR1)
exports.registerFarmer = async (req, res, next) => {
  try {
    const { name, mobile, password, village, address, landSize } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ message: 'Name, mobile number and password are required.' });
    }
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ message: 'Enter a valid 10-digit mobile number.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ mobile });
    if (existing) {
      return res.status(409).json({ message: 'This mobile number is already registered. Try logging in.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      mobile,
      password: hashed,
      village: village || '',
      address: address || '',
      landSize: landSize || null,
    });

    const token = signToken(user._id, 'Farmer');
    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: { id: user._id, name: user.name, mobile: user.mobile, role: 'Farmer' },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login  (FR2)
exports.loginFarmer = async (req, res, next) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile number and password are required.' });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(401).json({ message: 'Incorrect mobile number or password.' });
    }
    if (user.status === 'Deactivated') {
      return res.status(403).json({ message: 'Your account has been deactivated. Contact the center.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect mobile number or password.' });
    }

    const token = signToken(user._id, 'Farmer');
    res.json({
      message: 'Login successful.',
      token,
      user: { id: user._id, name: user.name, mobile: user.mobile, role: 'Farmer' },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/login
exports.loginAdmin = async (req, res, next) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile number and password are required.' });
    }

    const admin = await Admin.findOne({ mobile });
    if (!admin) {
      return res.status(401).json({ message: 'Incorrect admin credentials.' });
    }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect admin credentials.' });
    }

    const token = signToken(admin._id, 'Admin');
    res.json({
      message: 'Login successful.',
      token,
      user: { id: admin._id, name: admin.name, mobile: admin.mobile, role: 'Admin' },
    });
  } catch (err) {
    next(err);
  }
};
