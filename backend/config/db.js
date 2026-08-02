// ===============================
// config/db.js
// MySQL Database Connection Pool
// Auto-reconnects on disconnect
// ===============================

const mysql = require("mysql2");

// Use createPool instead of createConnection for:
// 1. Auto-reconnect on failure
// 2. Multiple simultaneous queries
// 3. Connection reuse (no "connection closed" errors)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

// Test connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    console.error("   Make sure MySQL is running and .env credentials are correct.");
    // Don't crash the server — just log the error
  } else {
    console.log("✅ MySQL Pool connected successfully");
    connection.release(); // Release back to pool
  }
});

// Export promise-based pool for async/await support
module.exports = pool;
