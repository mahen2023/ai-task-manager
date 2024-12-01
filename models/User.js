const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "USER"], default: "USER" }, // Enum for role
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

module.exports = mongoose.model("User", userSchema);
