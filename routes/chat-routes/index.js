// routes/chat.js
const express = require("express");
const ChatRouter = express.Router();
const { isAuthenticated } = require("../../middlewares/authenticated");

const {
  GetCoworkerChatsWithMessages,
} = require("../../controllers/chat-controller/chatSocketHandler");

// get my message with coo-workers
ChatRouter.get(
  "/coworker-chats/:userId/messages",
  isAuthenticated,
  GetCoworkerChatsWithMessages
);

module.exports = { ChatRouter };
