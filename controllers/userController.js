const User = require('../models/User');
const bcrypt = require("bcryptjs");

// Helper function to transform user objects
const transformUser = (user) => {
  if (!user) return null; // Handle case where user is null or undefined
  const { _id, ...rest } = user.toObject(); // Convert mongoose document to plain object
  return { id: _id, ...rest }; // Replace _id with id
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    const transformedUsers = users.map(transformUser);
    res.status(200).json(transformedUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() }, // Update `updatedAt` timestamp
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transformedUser = transformUser(updatedUser);
    res.status(200).json(transformedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).send(); // No content response
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, name, password, role  } = req.body;

    // Validate required fields
    if (!email || !name || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = new User({
      email,
      name,
      passwordHash,
      role,
    });

    await user.save();

    // Respond with the created user (excluding the password)
    const { password: _, ...userData } = user.toObject();
    res.status(201).json(userData);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

