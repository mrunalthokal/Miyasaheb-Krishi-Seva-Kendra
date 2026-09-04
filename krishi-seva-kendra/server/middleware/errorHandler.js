// Central error handler — keeps controllers free of repetitive try/catch noise.
function errorHandler(err, req, res, next) {
  console.error(err.stack || err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ message: `That ${field} is already registered.` });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }

  res.status(err.status || 500).json({ message: err.message || 'Something went wrong on the server.' });
}

module.exports = errorHandler;
