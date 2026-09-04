const CropTip = require('../models/CropTip');

exports.listCropTips = async (req, res, next) => {
  try {
    const { season } = req.query;
    const filter = season ? { season } : {};
    const tips = await CropTip.find(filter).sort({ createdAt: -1 });
    res.json(tips);
  } catch (err) {
    next(err);
  }
};

exports.getCropTip = async (req, res, next) => {
  try {
    const tip = await CropTip.findById(req.params.id);
    if (!tip) return res.status(404).json({ message: 'Crop tip not found.' });
    res.json(tip);
  } catch (err) {
    next(err);
  }
};

// Admin, FR16
exports.createCropTip = async (req, res, next) => {
  try {
    const { cropName, season, tipContent } = req.body;
    if (!cropName || !season || !tipContent) {
      return res.status(400).json({ message: 'Crop name, season and tip content are required.' });
    }
    const tip = await CropTip.create({ cropName, season, tipContent });
    res.status(201).json({ message: 'Crop tip added.', tip });
  } catch (err) {
    next(err);
  }
};

exports.updateCropTip = async (req, res, next) => {
  try {
    const tip = await CropTip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tip) return res.status(404).json({ message: 'Crop tip not found.' });
    res.json({ message: 'Crop tip updated.', tip });
  } catch (err) {
    next(err);
  }
};

exports.deleteCropTip = async (req, res, next) => {
  try {
    const tip = await CropTip.findByIdAndDelete(req.params.id);
    if (!tip) return res.status(404).json({ message: 'Crop tip not found.' });
    res.json({ message: 'Crop tip deleted.' });
  } catch (err) {
    next(err);
  }
};
