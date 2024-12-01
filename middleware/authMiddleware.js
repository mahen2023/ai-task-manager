const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Authorization header missing." });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
