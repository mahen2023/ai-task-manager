const Task = require('../models/Task');

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, userId } = req.body;
    console.log(req.body);
    const task = new Task({
      title,
      description,
      dueDate,
      status: status || 'PENDING', // Default to PENDING if not provided
      userId,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() }, // Update updatedAt timestamp
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get tasks by userId (optional feature)
exports.getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ userId });
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'No tasks found for this user' });
    }
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
