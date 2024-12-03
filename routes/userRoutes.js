// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define user routes
router.get('/', userController.getUsers); // Get all users
router.patch('/:id', userController.updateUser); // Update a user
router.delete('/:id', userController.deleteUser); // Delete a user
router.post('/', userController.createUser); // Create a user

module.exports = router;
