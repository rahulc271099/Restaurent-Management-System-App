const jwt = require('jsonwebtoken');
const userDB = require('../Models/userModel');

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

  const verifyUser = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userDB.findById(decoded.id).select("-password");
  
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
  
      res.status(200).json({ user: { id: user._id, role: user.role, email: user.email,name:user.name },token });
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };
  

module.exports = { verifyToken, authRole, verifyUser };