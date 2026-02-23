const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// DB stored at: /resolveit-api/data/tickets.db
const dbPath = path.resolve(__dirname, '../data/tickets.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'Open',
      priority TEXT DEFAULT 'Normal',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
      if (err) console.error("Create table error:", err.message);
  });
});

module.exports = db;
