// ===============================
// routes/authRoutes.js
// Auth Routes: /api/signup, /api/login
// ===============================

const express = require("express");
const router = express.Router();

const { signup, login, checkUID } = require("../controllers/authController");

// POST /api/signup
router.post("/signup", signup);

// POST /api/login
router.post("/login", login);

// GET /api/check-uid/:uid — check if UID is available
router.get("/check-uid/:uid", checkUID);

module.exports = router;
