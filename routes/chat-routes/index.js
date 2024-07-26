// routes/chat.js
const express = require("express");
const ChatRouter = express.Router();
const { isAuthenticated } = require("../../middlewares/authenticated");

const {
  GetCoworkerChatsWithMessages,
  BossChatsTracer,
} = require("../../controllers/chat-controller/chatSocketHandler");

// get my message with coo-workers
ChatRouter.get(
  "/coworker-chats/messages",
  isAuthenticated,
  GetCoworkerChatsWithMessages
);

ChatRouter.get("/trace-employees-chats", isAuthenticated, BossChatsTracer);

module.exports = { ChatRouter };
