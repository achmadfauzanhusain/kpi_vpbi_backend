// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Middleware autentikasi
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Format: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied: token missing or malformed",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
      division_id: decoded.division_id || null,
    };

    next();
  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};

// Middleware autorisasi berdasarkan role
const authorizeRoles = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You don't have access",
        yourRole: req.user?.role || "unknown",
        requiredRoles: roles,
      });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
