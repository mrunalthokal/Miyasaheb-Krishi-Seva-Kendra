const jwt = require('jsonwebtoken');

// Verifies JWT and attaches { id, role } to req.user
function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired or invalid. Please log in again.' });
  }
}

// Restricts route to a given role ('Farmer' or 'Admin')
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'You do not have permission to access this.' });
    }
    next();
  };
}

// Allows the route through with req.user set if a valid token is present,
// but does not block the request if it's absent (for mixed-access routes).
function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // ignore invalid token for optional routes
  }
  next();
}

module.exports = { verifyToken, requireRole, optionalAuth };
