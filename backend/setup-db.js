// ===============================
// setup-db.js
// Run this ONCE to create the database & table
// Command: node backend/setup-db.js
// ===============================

require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const mysql = require("mysql2");

console.log("\n🔧 CollabSpace Database Setup\n");
console.log("Connecting to MySQL...");
console.log(`  Host: ${process.env.DB_HOST}`);
console.log(`  User: ${process.env.DB_USER}`);
console.log(`  DB:   ${process.env.DB_NAME}\n`);

const conn = mysql.createConnection({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// UID generator
function generateUID() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let uid = "CS-";
  for (let i = 0; i < 6; i++) uid += chars[Math.floor(Math.random() * chars.length)];
  return uid;
}

conn.connect((err) => {
  if (err) {
    console.error("❌ Cannot connect to MySQL:", err.message);
    console.error("\n💡 Fix: Make sure XAMPP/WAMP MySQL is running!\n");
    process.exit(1);
  }
  console.log("✅ MySQL connected!\n");

  // Step 1: Create database
  conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``, (err) => {
    if (err) { console.error("❌ Create DB error:", err.message); process.exit(1); }
    console.log(`✅ Database '${process.env.DB_NAME}' ready`);

    conn.query(`USE \`${process.env.DB_NAME}\``, (err) => {
      if (err) { console.error("❌ USE DB error:", err.message); process.exit(1); }

      // Step 2: Create users table with uid column
      const createTable = `
        CREATE TABLE IF NOT EXISTS users (
          id         INT AUTO_INCREMENT PRIMARY KEY,
          name       VARCHAR(100)  NOT NULL,
          email      VARCHAR(150)  NOT NULL UNIQUE,
          password   VARCHAR(255)  NOT NULL,
          uid        VARCHAR(20)   UNIQUE DEFAULT NULL,
          created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
        )
      `;

      conn.query(createTable, (err) => {
        if (err) { console.error("❌ Create table error:", err.message); process.exit(1); }
        console.log("✅ Table 'users' ready");

        // Step 3: Add uid column if it doesn't exist (migration for existing tables)
        conn.query(`SHOW COLUMNS FROM users LIKE 'uid'`, (err, cols) => {
          if (err) { console.error("❌ Column check error:", err.message); process.exit(1); }

          const addCol = (next) => {
            if (cols.length === 0) {
              conn.query(`ALTER TABLE users ADD COLUMN uid VARCHAR(20) UNIQUE DEFAULT NULL`, (err) => {
                if (err) { console.error("❌ Add column error:", err.message); process.exit(1); }
                console.log("✅ Column 'uid' added to existing table");
                next();
              });
            } else {
              next();
            }
          };

          addCol(() => {
            // Step 4: Assign UIDs to users who don't have one
            conn.query("SELECT id FROM users WHERE uid IS NULL", (err, rows) => {
              if (err) { console.error("❌ Fetch users error:", err.message); process.exit(1); }

              if (rows.length === 0) {
                console.log("ℹ️  All users already have UIDs");
                insertDemoAndFinish();
              } else {
                console.log(`🔄 Assigning UIDs to ${rows.length} existing user(s)...`);
                let done = 0;
                rows.forEach((row) => {
                  const uid = generateUID();
                  conn.query("UPDATE users SET uid = ? WHERE id = ?", [uid, row.id], () => {
                    done++;
                    if (done === rows.length) {
                      console.log(`✅ UIDs assigned to ${done} user(s)`);
                      insertDemoAndFinish();
                    }
                  });
                });
              }
            });
          });
        });
      });
    });
  });
});

function insertDemoAndFinish() {
  // Insert demo user (ignore if already exists)
  const uid = generateUID();
  conn.query(
    "INSERT IGNORE INTO users (name, email, password, uid) VALUES (?, ?, ?, ?)",
    ["Demo User", "demo@collabspace.io", "Demo@1234", uid],
    (err, result) => {
      if (err) console.error("❌ Insert demo user error:", err.message);
      else if (result.affectedRows > 0) console.log(`✅ Demo user created (UID: ${uid})`);
      else console.log("ℹ️  Demo user already exists");

      // Show demo user's UID
      conn.query("SELECT uid FROM users WHERE email = 'demo@collabspace.io'", (err, rows) => {
        const demoUID = rows && rows[0] ? rows[0].uid : "CS-XXXXXX";

        console.log("\n🎉 Database setup complete!\n");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("  Demo Login Credentials:");
        console.log("  Email:    demo@collabspace.io");
        console.log("  Password: Demo@1234");
        console.log(`  User ID:  ${demoUID}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        console.log("Now run: node backend\\server.js\n");

        conn.end();
        process.exit(0);
      });
    }
  );
}
