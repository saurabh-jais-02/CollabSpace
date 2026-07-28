// ===============================
// routes/authRoutes.js
// Auth Routes: /api/signup, /api/login
// ===============================

const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");

// POST /api/signup
router.post("/signup", signup);

// POST /api/login
router.post("/login", login);

module.exports = router;
