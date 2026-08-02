// ===============================
// controllers/authController.js
// Signup & Login Logic
// ===============================

const db     = require("../config/db");
const crypto = require("crypto");

// ===============================
// GENERATE UNIQUE USER ID
// Format: CS-XXXXXX (e.g. CS-A3K9XZ)
// ===============================
function generateUID() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No confusing chars (0,O,I,1)
  let uid = "CS-";
  for (let i = 0; i < 6; i++) {
    uid += chars[Math.floor(Math.random() * chars.length)];
  }
  return uid;
}

// Ensure UID is unique in DB (retry if collision)
function createUniqueUID(callback) {
  const uid = generateUID();
  db.query("SELECT id FROM users WHERE uid = ?", [uid], (err, rows) => {
    if (err) return callback(err);
    if (rows.length > 0) return createUniqueUID(callback); // retry
    callback(null, uid);
  });
}

// ===============================
// SIGNUP
// ===============================
const signup = (req, res) => {
  const { name, email, password, customUID } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required ❌" });
  }

  // If user provided a custom UID, validate & use it
  if (customUID) {
    const trimmedUID = customUID.trim().toUpperCase();

    // Format: CS- followed by 4-12 alphanumeric chars
    const uidRegex = /^CS-[A-Z0-9]{4,12}$/;
    if (!uidRegex.test(trimmedUID)) {
      return res.status(400).json({
        message: "Invalid User ID format. Use CS- followed by 4–12 letters/numbers (e.g. CS-MYNAME) ❌",
      });
    }

    // Check uniqueness in DB
    db.query("SELECT id FROM users WHERE uid = ?", [trimmedUID], (err, rows) => {
      if (err) return res.status(500).json({ message: "Signup failed ❌" });
      if (rows.length > 0) {
        return res.status(409).json({ message: "This User ID is already taken. Please choose another one ❌" });
      }

      // Insert with custom UID
      const sql = "INSERT INTO users (name, email, password, uid) VALUES (?, ?, ?, ?)";
      db.query(sql, [name, email, password, trimmedUID], (err, result) => {
        if (err) {
          console.error("Signup error:", err);
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already registered ❌" });
          }
          return res.status(500).json({ message: "Signup failed ❌" });
        }
        res.status(201).json({ message: "Signup successful ✅", uid: trimmedUID });
      });
    });

  } else {
    // Auto-generate UID (fallback)
    createUniqueUID((err, uid) => {
      if (err) {
        console.error("UID generation error:", err);
        return res.status(500).json({ message: "Signup failed ❌" });
      }

      const sql = "INSERT INTO users (name, email, password, uid) VALUES (?, ?, ?, ?)";
      db.query(sql, [name, email, password, uid], (err, result) => {
        if (err) {
          console.error("Signup error:", err);
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already registered ❌" });
          }
          return res.status(500).json({ message: "Signup failed ❌" });
        }
        res.status(201).json({ message: "Signup successful ✅", uid: uid });
      });
    });
  }
};

// ===============================
// LOGIN
// ===============================
const login = (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required ❌" });
  }

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Login failed ❌" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password ❌" });
    }

    const user = results[0];

    res.status(200).json({
      message: "Login successful ✅",
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        uid:   user.uid,
      },
    });
  });
};

// ===============================
// CHECK UID AVAILABILITY
// GET /api/check-uid/:uid
// ===============================
const checkUID = (req, res) => {
  const raw = (req.params.uid || '').trim().toUpperCase();

  // Validate format
  const uidRegex = /^CS-[A-Z0-9]{4,12}$/;
  if (!uidRegex.test(raw)) {
    return res.status(400).json({
      available: false,
      message: "Invalid format. Use CS- followed by 4–12 letters/numbers.",
    });
  }

  db.query("SELECT id FROM users WHERE uid = ?", [raw], (err, rows) => {
    if (err) return res.status(500).json({ available: false, message: "Server error" });
    if (rows.length > 0) {
      return res.status(200).json({ available: false, message: "This ID is already taken ❌" });
    }
    return res.status(200).json({ available: true, message: "This ID is available ✅" });
  });
};

module.exports = { signup, login, checkUID };

