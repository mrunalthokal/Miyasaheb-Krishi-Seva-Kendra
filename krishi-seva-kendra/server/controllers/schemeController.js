const Scheme = require('../models/Scheme');

exports.listSchemes = async (req, res, next) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    res.json(schemes);
  } catch (err) {
    next(err);
  }
};

exports.getScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found.' });
    res.json(scheme);
  } catch (err) {
    next(err);
  }
};

// Admin, FR16
exports.createScheme = async (req, res, next) => {
  try {
    const { title, description, eligibility, benefits } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }
    const scheme = await Scheme.create({ title, description, eligibility, benefits });
    res.status(201).json({ message: 'Scheme added.', scheme });
  } catch (err) {
    next(err);
  }
};

exports.updateScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!scheme) return res.status(404).json({ message: 'Scheme not found.' });
    res.json({ message: 'Scheme updated.', scheme });
  } catch (err) {
    next(err);
  }
};

exports.deleteScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found.' });
    res.json({ message: 'Scheme deleted.' });
  } catch (err) {
    next(err);
  }
};
