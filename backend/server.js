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
app.use(cors());
app.use(express.json());

// ===============================
// ROUTES
// ===============================
app.get("/", (req, res) => {
  res.send("CollabSpace Backend is Running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working successfully 🚀" });
});

app.use("/api", authRoutes);
app.use("/api", userRoutes);

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
});

socketHandler(io);

// ===============================
// START SERVER
// ===============================
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
