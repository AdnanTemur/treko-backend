const ChatModel = require("../../models/chat-model");
const SocketEvents = require("../../utils/socketEvents");
const asyncHandler = require("express-async-handler");

function initializeChatSocket(io) {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on(
      SocketEvents.SEND_MESSAGE,
      async ({ senderId, receiverId, messageText }) => {
        console.log("Message received: ", {
          senderId,
          receiverId,
          messageText,
        });

        try {
          // Find chat document for the sender
          let chat = await ChatModel.findOne({ userId: senderId });

          if (!chat) {
            // Create a new chat document for the sender
            chat = new ChatModel({
              userId: senderId,
              coworkerChats: [],
            });
          }

          // Find or create a coworkerChat entry for the receiver
          let coworkerChat = chat.coworkerChats.find(
            (chat) => chat.coworkerId.toString() === receiverId
          );

          if (!coworkerChat) {
            coworkerChat = {
              coworkerId: receiverId,
              messageSent: [],
              messageReceived: [],
            };
            chat.coworkerChats.push(coworkerChat);
          }

          // Add the message to the sent messages
          coworkerChat.messageSent.push({
            text: messageText,
            timestamp: new Date(),
          });

          await chat.save();

          // Find chat document for the receiver
          let receiverChat = await ChatModel.findOne({ userId: receiverId });

          if (!receiverChat) {
            // Create a new chat document for the receiver
            receiverChat = new ChatModel({
              userId: receiverId,
              coworkerChats: [],
            });
          }

          // Find or create a coworkerChat entry for the sender
          let coworkerReceiverChat = receiverChat.coworkerChats.find(
            (chat) => chat.coworkerId.toString() === senderId
          );

          if (!coworkerReceiverChat) {
            coworkerReceiverChat = {
              coworkerId: senderId,
              messageSent: [],
              messageReceived: [],
            };
            receiverChat.coworkerChats.push(coworkerReceiverChat);
          }

          // Add the message to the received messages
          coworkerReceiverChat.messageReceived.push({
            text: messageText,
            timestamp: new Date(),
          });

          await receiverChat.save();

          // Emit the message to both sender and receiver
          io.to(senderId).emit(SocketEvents.RECEIVE_MESSAGE, {
            senderId,
            receiverId,
            message: { text: messageText, timestamp: new Date() },
          });
          io.to(receiverId).emit(SocketEvents.RECEIVE_MESSAGE, {
            senderId,
            receiverId,
            message: { text: messageText, timestamp: new Date() },
          });
        } catch (error) {
          console.error("Error saving message: ", error);
          socket.emit(SocketEvents.ERROR, { message: "Error saving message" });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

const GetCoworkerChatsWithMessages = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find the chat document for the specified userId
    const chat = await ChatModel.findOne({ userId })
      .populate("coworkerChats.coworkerId", "_id") // Populate only _id of coworkerId
      .lean(); // Use lean to get plain JavaScript objects

    if (!chat) {
      return res.status(404).json({ message: "No chat found for this user" });
    }

    // Return the coworkerChats data exactly as needed
    res.status(200).json({ coworkerChats: chat.coworkerChats });
  } catch (error) {
    console.error("Error retrieving coworker chats with messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = { initializeChatSocket, GetCoworkerChatsWithMessages };
