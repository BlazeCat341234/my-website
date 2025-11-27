const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./orders.db', (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'current'
)`);

// Get all orders
app.get('/orders', (req, res) => {
  db.all("SELECT * FROM orders", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add order
app.post('/orders', (req, res) => {
  const { customer_name, email, price, description } = req.body;
  db.run(
    `INSERT INTO orders (customer_name, email, price, description, status) VALUES (?, ?, ?, ?, 'current')`,
    [customer_name, email, price, description],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Update order
app.put('/orders/:id', (req, res) => {
  const { customer_name, email, price, description } = req.body;
  db.run(
    `UPDATE orders SET customer_name = ?, email = ?, price = ?, description = ? WHERE id = ?`,
    [customer_name, email, price, description, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Update status
app.put('/orders/:id/status', (req, res) => {
  const { status } = req.body;
  db.run(
    `UPDATE orders SET status = ? WHERE id = ?`,
    [status, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Delete single order
app.delete('/orders/:id', (req, res) => {
  db.run(
    `DELETE FROM orders WHERE id = ?`,
    [req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ deleted: this.changes });
    }
  );
});

// Delete all orders
app.delete('/orders', (req, res) => {
  db.run(`DELETE FROM orders`, [], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
