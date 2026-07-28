// ===============================
// controllers/userController.js
// User-related Logic
// ===============================

const db = require("../config/db");

// ===============================
// GET ALL USERS
// ===============================
const getAllUsers = (req, res) => {
  const sql = "SELECT id, name, email FROM users ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Get users error:", err);
      return res.status(500).json({
        message: "Failed to fetch users ❌",
      });
    }

    res.status(200).json(results);
  });
};

module.exports = { getAllUsers };
