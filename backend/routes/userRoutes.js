// ===============================
// routes/userRoutes.js
// User Routes
// ===============================

const express = require("express");
const router  = express.Router();

const { getAllUsers, findByUID } = require("../controllers/userController");

// GET /api/users — all users list
router.get("/users", getAllUsers);

// GET /api/users/find/:uid — find user by unique ID
router.get("/users/find/:uid", findByUID);

module.exports = router;
