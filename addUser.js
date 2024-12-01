const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Adjust the path to your User model
require("dotenv").config(); // Load environment variables

// Connect to the database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

// Create a new user
const createUser = async (name, email, password, role = "USER") => {
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user instance
    const user = new User({ name, email, passwordHash, role });

    // Save the user to the database
    await user.save();
    console.log("User created successfully:", user);
    mongoose.connection.close(); // Close the connection after saving
  } catch (error) {
    console.error("Error creating user:", error.message);
    mongoose.connection.close();
  }
};

// Command-line arguments
const [name, email, password, role] = process.argv.slice(2);
// const [name, email, password, role] = [];

if (!name || !email || !password) {
  console.error("Usage: node addUser.js <name> <email> <password> [role]");
  process.exit(1);
}

// Call the function to create a user
createUser(name, email, password, role);
