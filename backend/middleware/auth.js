const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  let token;

  token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token " });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token " });
  }
};

module.exports = { auth };
