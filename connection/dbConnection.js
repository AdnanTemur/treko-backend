const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("🔥 MongoDB connected to server 🔥");
  } catch (err) {
    console.log("MongoDB isn't connected to server ", err);
  }
};

module.exports = { connectToDatabase };
