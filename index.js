require("dotenv").config();
const { app } = require("./app.js");
const { connectToDatabase } = require("./connection/dbConnection.js");

async function startServer() {
  try {
    await connectToDatabase();

    if (process.env.NODE_ENV !== "production") {
      const port = process.env.PORT || 5000;
      app.listen(port, () => {
        console.log(`⚡ Server is running on port ${port} ⚡`);
      });
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

startServer();

module.exports = app;
