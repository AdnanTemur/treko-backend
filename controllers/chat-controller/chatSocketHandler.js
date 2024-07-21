const ChatModel = require("../../models/chat-model");

function initializeChatSocket(io) {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("sendMessage", async ({ senderId, receiverId, messageText }) => {
      console.log("Message received: ", { senderId, receiverId, messageText });

      try {
        // Find chat document for the sender
        let chat = await ChatModel.findOne({ userId: senderId });

        if (!chat) {
          // Create a new chat document for the sender
          chat = new ChatModel({
            userId: senderId,
            coworkerChats: [],
            bossChats: [],
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
            bossChats: [],
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
        io.to(senderId).emit("receiveMessage", {
          senderId,
          receiverId,
          message: { text: messageText, timestamp: new Date() },
        });
        io.to(receiverId).emit("receiveMessage", {
          senderId,
          receiverId,
          message: { text: messageText, timestamp: new Date() },
        });
      } catch (error) {
        console.error("Error saving message: ", error);
        socket.emit("error", { message: "Error saving message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

module.exports = { initializeChatSocket };
