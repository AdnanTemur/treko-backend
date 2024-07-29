require("dotenv").config();
const { app, server } = require("./app.js");
const { connectToDatabase } = require("./connection/dbConnection.js");

async function startServer() {
  try {
    await connectToDatabase();
    const port = process.env.PORT || 8000;
    server.listen(port, () => {
      console.log(`⚡ Server is running on port ${port} ⚡`);
    });
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
}

startServer();

module.exports = app;
