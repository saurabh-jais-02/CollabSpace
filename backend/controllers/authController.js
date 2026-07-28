// ===============================
// controllers/authController.js
// Signup & Login Logic
// ===============================

const db = require("../config/db");

// ===============================
// SIGNUP
// ===============================
const signup = (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required ❌",
    });
  }

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error("Signup error:", err);

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
  });
};

// ===============================
// LOGIN
// ===============================
const login = (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required ❌",
    });
  }

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({
        message: "Login failed ❌",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password ❌",
      });
    }

    const user = results[0];

    res.status(200).json({
      message: "Login successful ✅",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
};

module.exports = { signup, login };
