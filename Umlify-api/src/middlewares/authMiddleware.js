// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Extract token from standard Authorization: Bearer <token> header format
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: "Access Denied",
      message: "Authentication signature token missing from request headers."
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: "Forbidden Token",
        message: "Session token signature is invalid or expired."
      });
    }
    
    // Bind token payload directly into request pointer for cascading router execution
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };