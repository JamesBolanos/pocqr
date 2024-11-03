// init-db.js
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('warranty.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS warranties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gtin TEXT NOT NULL,
      serial TEXT NOT NULL,
      cliente TEXT NOT NULL,
      fechaDeCompra TEXT NOT NULL,
      customer_email TEXT,
      warranty_registered boolean default 0,
      date_last_inventory text
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:.exit', err);
    } else {
      console.log('Table created successfully.');
    }
  });
});

db.close();
