require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use('/api/users', userRoutes);

// Serve static files
app.use(express.static("client/dist"));
app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "client", "dist", "index.html")));

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
