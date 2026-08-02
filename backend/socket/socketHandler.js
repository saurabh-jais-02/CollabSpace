// ===============================
// socket/socketHandler.js
// Socket.IO Real-Time Chat Logic
// ===============================

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ===============================
    // JOIN USER ROOM
    // ===============================
    socket.on("join", (userId) => {
      socket.join("user_" + userId);
      console.log(`User ${userId} joined room: user_${userId}`);
    });

    // ===============================
    // SEND MESSAGE
    // ===============================
    socket.on("sendMessage", (data) => {
      console.log("Message received:", data);

      // Deliver to receiver's room
      io.to("user_" + data.receiverId).emit("receiveMessage", data);

      // ✓✓ Double tick — confirm delivery back to sender
      socket.emit("messageDelivered", { msgId: data.msgId });
    });

    // ===============================
    // READ RECEIPT
    // When receiver opens a chat, tell the original sender their msgs are read
    // ===============================
    socket.on("messageRead", (data) => {
      // data: { originalSenderId, readBy }
      io.to("user_" + data.originalSenderId).emit("messagesRead", {
        readBy: data.readBy,
      });
      console.log(`Messages read: user_${data.readBy} read messages from user_${data.originalSenderId}`);
    });

    // ===============================
    // DISCONNECT
    // ===============================
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = socketHandler;
