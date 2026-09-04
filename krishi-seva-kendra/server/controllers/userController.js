const User = require('../models/User');
const Inquiry = require('../models/Inquiry');

// GET /api/users/me  (FR3)
exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Profile not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/me  (FR3)
exports.updateMyProfile = async (req, res, next) => {
  try {
    const { name, village, address, landSize } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, village, address, landSize } },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'Profile not found.' });
    res.json({ message: 'Profile updated.', user });
  } catch (err) {
    next(err);
  }
};

// GET /api/farmers  (Admin, FR15)
exports.listFarmers = async (req, res, next) => {
  try {
    const farmers = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(farmers);
  } catch (err) {
    next(err);
  }
};

// PUT /api/farmers/:id/status  (Admin, FR15)
exports.updateFarmerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Deactivated'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Active or Deactivated.' });
    }
    const farmer = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    if (!farmer) return res.status(404).json({ message: 'Farmer not found.' });
    res.json({ message: `Farmer account ${status.toLowerCase()}.`, farmer });
  } catch (err) {
    next(err);
  }
};
