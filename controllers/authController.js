const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (email) => jwt.sign({ email }, process.env.JWT_SECRET || "your_secret_key", { expiresIn: "1h" });

exports.register = async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    const passwordHash = await bcrypt.hash(password, 10);
    // const newUser = new User({ name, email, passwordHash, role });
      // Set default role to 'USER' if none is provided
    const newUser = new User({
          name,
          email,
          passwordHash,
          role: role || 'USER', // Default to 'USER'
    });
    await newUser.save();

    const token = generateToken(email);
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found." });

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid password." });

    const token = generateToken(email);
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role:user.role } });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found." });

    res.json({ email: user.email, name: user.name });
  } catch (err) {
    console.error("Error fetching current user:", err);
    res.status(500).json({ message: "Server error." });
  }
};
