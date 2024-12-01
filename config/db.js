const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/candidateAssessmentDB";
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
