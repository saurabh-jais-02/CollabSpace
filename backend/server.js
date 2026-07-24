const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const PORT = 3000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());
app.use(cors());

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

// ===============================
// MYSQL CONNECTION
// ===============================

const db = mysql.createConnection({
  host: "localhost",

  user: "root",

  password: "Saurabh022005",

  database: "collabspace",
});

db.connect((err) => {
  if (err) {
    console.log("MySQL connection failed ❌");

    console.log(err);
  } else {
    console.log("MySQL connected successfully ✅");
  }
});

// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send("CollabSpace Backend is Running 🚀");
});

// ===============================
// TEST API
// ===============================

app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working successfully 🚀",
  });
});

// ===============================
// SIGNUP API
// ===============================

app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required ❌",
    });
  }

  const sql = `

    INSERT INTO users
    (name, email, password)

    VALUES (?, ?, ?)

  `;

  db.query(
    sql,

    [name, email, password],

    (err, result) => {
      if (err) {
        console.log(err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            message: "Email already registered ❌",
          });
        }

        return res.status(500).json({
          message: "Signup failed ❌",
        });
      }

      res.status(201).json({
        message: "Signup successful ✅",
      });
    },
  );
});

// ===============================
// GET ALL USERS
// ===============================

app.get("/api/users", (req, res) => {
  const sql = `

    SELECT
      id,
      name,
      email

    FROM users

    ORDER BY id DESC

  `;

  db.query(
    sql,

    (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Users fetch failed ❌",
        });
      }

      res.json(results);
    },
  );
});

// ===============================
// LOGIN API
// ===============================

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const sql = `

    SELECT *

    FROM users

    WHERE email = ?

    AND password = ?

  `;

  db.query(
    sql,

    [email, password],

    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Login failed ❌",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: "Invalid email or password ❌",
        });
      }

      res.json({
        message: "Login successful ✅",

        user: {
          id: results[0].id,

          name: results[0].name,

          email: results[0].email,
        },
      });
    },
  );
});

// ===============================
// SOCKET.IO REAL-TIME CHAT
// ===============================

io.on(
  "connection",

  (socket) => {
    console.log("User connected:", socket.id);

    // JOIN USER ROOM

    socket.on(
      "join",

      (userId) => {
        socket.join("user_" + userId);

        console.log("User joined room:", userId);
      },
    );

    // SEND MESSAGE

    socket.on(
      "sendMessage",

      (data) => {
        console.log("Message received:", data);

        io.to("user_" + data.receiverId).emit(
          "receiveMessage",

          data,
        );

        socket.emit(
          "messageSent",

          data,
        );
      },
    );

    // DISCONNECT

    socket.on(
      "disconnect",

      () => {
        console.log("User disconnected:", socket.id);
      },
    );
  },
);

// ===============================
// START SERVER
// ===============================

server.listen(
  PORT,

  () => {
    console.log(`Server running at http://localhost:${PORT}`);
  },
);
