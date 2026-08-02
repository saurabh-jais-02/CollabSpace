// ===============================
// controllers/userController.js
// User-related Logic
// ===============================

const db = require("../config/db");

// ===============================
// GET ALL USERS
// ===============================
const getAllUsers = (req, res) => {
  const sql = "SELECT id, name, email, uid FROM users ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Get users error:", err);
      return res.status(500).json({ message: "Failed to fetch users ❌" });
    }
    res.status(200).json(results);
  });
};

// ===============================
// FIND USER BY UID
// GET /api/users/find/:uid
// ===============================
const findByUID = (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ message: "UID is required ❌" });
  }

  const sql = "SELECT id, name, email, uid FROM users WHERE uid = ?";

  db.query(sql, [uid.toUpperCase().trim()], (err, results) => {
    if (err) {
      console.error("Find by UID error:", err);
      return res.status(500).json({ message: "Search failed ❌" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No user found with this ID ❌" });
    }

    res.status(200).json({ user: results[0] });
  });
};

module.exports = { getAllUsers, findByUID };
