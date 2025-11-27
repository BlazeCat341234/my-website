const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new database file or open existing
const dbPath = path.resolve(__dirname, 'orders.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database at", dbPath);
  }
});

// Create orders table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'current'
    )
  `, (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Orders table ready.");
    }
  });
});

module.exports = db;
