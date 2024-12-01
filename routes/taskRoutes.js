// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Task routes
router.get('/', taskController.getTasks); // Get all tasks
router.get('/:id', taskController.getTaskById); // Get a single task by ID
router.get('/user/:userId', taskController.getTasksByUser); // Get tasks by userId (optional)
router.post('/', taskController.createTask); // Create a new task
router.patch('/:id', taskController.updateTask); // Update a task
router.delete('/:id', taskController.deleteTask); // Delete a task

module.exports = router;
