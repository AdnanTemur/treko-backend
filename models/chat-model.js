const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  coworkerChats: [
    {
      coworkerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
      },
      messageSent: [MessageSchema],
      messageReceived: [MessageSchema],
    },
  ],
});

const ChatModel = mongoose.model("Chat", ChatSchema);

module.exports = ChatModel;
