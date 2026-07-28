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

      // Send to receiver
      io.to("user_" + data.receiverId).emit("receiveMessage", data);

      // Confirm to sender
      socket.emit("messageSent", data);
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
