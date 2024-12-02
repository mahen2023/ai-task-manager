// // controllers/userController.js
// const User = require('../models/User');

// // Get all users
// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update a user
// exports.updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       { ...req.body, updatedAt: new Date() }, // Update `updatedAt` timestamp
//       { new: true } // Return the updated user document
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.status(200).json(updatedUser);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Delete a user
// exports.deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedUser = await User.findByIdAndDelete(id);
//     if (!deletedUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.status(204).send(); // No content response
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const User = require('../models/User');

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

