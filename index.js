require("dotenv").config();
const { app } = require("./app.js");
const { connectToDatabase } = require("./connection/dbConnection.js");

async function startServer() {
  try {
    // Establish MongoDB connection
    await connectToDatabase();

    // Start the server only if not in production
    if (process.env.NODE_ENV !== "production") {
      const port = process.env.PORT || 5000;
      app.listen(port, () => {
        console.log(`⚡ Server is running on port ${port} ⚡`);
      });
    }
  } catch (error) {
    // Handle MongoDB connection error
    console.error("Error connecting to MongoDB:", error);
  }
}

// Start the server locally
startServer();

// Export the app for serverless deployment
module.exports = app;
