const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔐 protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 🔥 get token from cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // if no token
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get full user (important for roles, branch etc.)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

// 🔐 role-based access
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // extra safety check
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
