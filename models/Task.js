// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date }, // Optional dueDate field
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'], // Updated status enum values
    default: 'PENDING',
  },
  userId: { type: String, required: true }, // User ID associated with the task
  createdAt: { type: Date, default: Date.now }, // Automatically set creation time
  updatedAt: { type: Date, default: Date.now }, // Automatically set update time
});

module.exports = mongoose.model('Task', taskSchema);
