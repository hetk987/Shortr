const path = require("path");
const fs = require("fs");
const os = require("os");
const Database = require("better-sqlite3");

// Determine correct writable path
const isPkg = typeof process.pkg !== "undefined";
const baseDir = isPkg ? path.dirname(process.execPath) : __dirname;

// Define consistent shared location: ~/.shortr/shortr.db
const sharedDir = path.join(os.homedir(), ".shortr");
const dbPath = path.join(sharedDir, "shortr.db");

// Ensure directory exists
fs.mkdirSync(sharedDir, { recursive: true });

// Initialize database
const db = new Database(dbPath);

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS shortlink (
    alias TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = {
  createLink: (alias, url) => {
    const stmt = db.prepare("INSERT INTO shortlink (alias, url) VALUES (?, ?)");
    return stmt.run(alias, url);
  },

  getAll: () => {
    const stmt = db.prepare("SELECT * FROM shortlink");
    return stmt.all();
  },

  getLink: (alias) => {
    const stmt = db.prepare("SELECT * FROM shortlink WHERE alias = ?");
    return stmt.get(alias);
  },

  deleteLink: (alias) => {
    const stmt = db.prepare("DELETE FROM shortlink WHERE alias = ?");
    return stmt.run(alias);
  },
  dbPath,
};
