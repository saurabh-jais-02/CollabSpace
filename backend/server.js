// ===============================
// server.js — Entry Point
// ===============================

require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express = require("express");
const cors    = require("cors");
const http    = require("http");
const { Server } = require("socket.io");

// ===============================
// IMPORT MODULES
// ===============================
const db            = require("./config/db");
const authRoutes    = require("./routes/authRoutes");
const userRoutes    = require("./routes/userRoutes");
const socketHandler = require("./socket/socketHandler");

// ===============================
// APP SETUP
// ===============================
const app  = express();
const PORT = process.env.PORT || 3000;

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// ===============================
// SERVE FRONTEND (Static Files)
// ===============================
const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend")));

// ===============================
// ROUTES
// ===============================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working successfully 🚀" });
});

app.use("/api", authRoutes);
app.use("/api", userRoutes);

// ===============================
// 404 HANDLER
// ===============================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found ❌" });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error("❌ Unhandled express error:", err.message);
  res.status(500).json({ message: "Internal server error ❌" });
});

// ===============================
// HTTP SERVER
// ===============================
const server = http.createServer(app);

// ===============================
// SOCKET.IO
// ===============================
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

socketHandler(io);

// ===============================
// START SERVER
// ===============================
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// ===============================
// CRASH PREVENTION
// Prevents server from dying on unhandled errors
// ===============================
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception (server kept alive):", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("💥 Unhandled Promise Rejection (server kept alive):", reason);
});
