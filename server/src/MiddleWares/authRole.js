const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
      const { token } = req.cookies;
      if (!token) {
        return res.status(401).json({
          error: "JWT not found",
        });
      }
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (!verifiedToken) {
        return res.status(401).json({
          error: "User not authorised",
        });
      }
      // Check if the token's role is one of the allowed staff roles
      const allowedStaffRoles = ['admin','staff','customer'];
      if (!allowedStaffRoles.includes(verifiedToken.role)) {
        return res.status(401).json({
          error: "Access denied",
        });
      }
      req.user = {
        id: verifiedToken.id,
        role: verifiedToken.role,
      };
      next();
    } catch (error) {
      res.status(error.status || 401).json({
        error: error.message || "User authorization failed",
      });
    }
  };

  const authRole = (...allowedRoles) => {
    return (req, res, next) => {
      // Since verifyToken already sets req.role, we check it here
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: "Access denied: You do not have permission to access this resource",
        });
      }
      next();
    };
  };

module.exports = { verifyToken, authRole };