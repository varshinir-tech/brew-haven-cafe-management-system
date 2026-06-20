const jwt = require("jsonwebtoken");

// Must match the fallback in authController.js
const JWT_SECRET = process.env.JWT_SECRET || "brewhaven_secret_jwt_key_2024_do_not_use_in_prod";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized. Invalid or expired token." });
  }
};

module.exports = { protect };
