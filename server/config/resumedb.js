require("dotenv").config();
const mongoose = require("mongoose");

const connectToMongo = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error(" MONGODB_URI is not defined in the .env file. Please check your environment variables.");
    }

    // Prevent multiple connections
    if (mongoose.connection.readyState !== 0) {
      console.log(" MongoDB is already connected.");
      return;
    }

    await mongoose.connect(uri);
    console.log(" MongoDB Connected Successfully");

    // Event listeners for better debugging
    mongoose.connection.on("connected", () => console.log(" MongoDB Connection Established"));
    mongoose.connection.on("error", (err) => console.error(" MongoDB Connection Error:", err));
    mongoose.connection.on("disconnected", () => console.warn(" MongoDB Disconnected"));

  } catch (error) {
    console.error(" Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the application on failure
  }
};

// Export the function
module.exports = connectToMongo;
