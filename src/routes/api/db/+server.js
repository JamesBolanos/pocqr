// src/routes/api/db/+server.js
import sqlite3 from 'sqlite3';
import { json } from '@sveltejs/kit';

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to the in-memory SQLite database.');
  }
});

// Initialize the warranties table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS warranties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gtin TEXT,
    serial TEXT,
    cliente TEXT,
    fechaDeCompra TEXT,
    customer_email TEXT,
    warranty_registered INTEGER,
    date_last_inventory TEXT
  )`);
});

// GET: Retrieve all warranties or check if a specific warranty exists
export async function GET({ url }) {
  const gtin = url.searchParams.get('gtin');
  const serial = url.searchParams.get('serial');

  if (gtin && serial) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM warranties WHERE gtin = ? AND serial = ?`,
        [gtin, serial],
        (err, row) => {
          if (err) {
            console.error('Database query error:', err);
            reject(json({ error: 'Database error' }, { status: 500 }));
          } else {
            resolve(json({ exists: !!row }));
          }
        }
      );
    });
  } else {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM warranties`, (err, rows) => {
        if (err) {
          reject(json({ error: 'Database error' }, { status: 500 }));
        } else {
          resolve(json(rows));
        }
      });
    });
  }
}

// POST: Handle both warranty registration and inventory update
export async function POST({ request }) {
  const { gtin, serial, cliente, fechaDeCompra, customer_email, action } = await request.json();

  if (!gtin || !serial) {
    return new Response(JSON.stringify({ error: 'GTIN and Serial are required' }), { status: 400 });
  }

  if (action === 'inventory') {
    // Inventory update logic
    const date_last_inventory = new Date().toISOString();

    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM warranties WHERE gtin = ? AND serial = ?`, [gtin, serial], (err, row) => {
        if (err) {
          console.error('Database query error:', err);
          reject(new Response(JSON.stringify({ error: 'Database error' }), { status: 500 }));
        } else if (row) {
          db.run(
            `UPDATE warranties SET date_last_inventory = ? WHERE gtin = ? AND serial = ?`,
            [date_last_inventory, gtin, serial],
            function (err) {
              if (err) {
                console.error('Database update error:', err);
                reject(new Response(JSON.stringify({ error: 'Database error' }), { status: 500 }));
              } else {
                resolve(new Response(JSON.stringify({ message: 'Inventory date updated', date_last_inventory, gtin, serial }), { status: 200 }));
              }
            }
          );
        } else {
          db.run(
            `INSERT INTO warranties (gtin, serial, date_last_inventory, warranty_registered) VALUES (?, ?, ?, 0)`,
            [gtin, serial, date_last_inventory],
            function (err) {
              if (err) {
                console.error('Database insert error:', err);
                reject(new Response(JSON.stringify({ error: 'Database error' }), { status: 500 }));
              } else {
                resolve(new Response(JSON.stringify({ message: 'New inventory record added', date_last_inventory, gtin, serial }), { status: 201 }));
              }
            }
          );
        }
      });
    });
  } else if (action === 'register_warranty') {
    // Warranty registration logic
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO warranties (gtin, serial, cliente, fechaDeCompra, customer_email, warranty_registered) VALUES (?, ?, ?, ?, ?, 1)`,
        [gtin, serial, cliente, fechaDeCompra, customer_email],
        function (err) {
          if (err) {
            console.error('Database insert error:', err);
            reject(json({ error: 'Database error' }, { status: 500 }));
          } else {
            resolve(json({ success: true, message: 'Warranty registered' }));
          }
        }
      );
    });
  } else {
    return new Response(JSON.stringify({ error: 'Invalid action parameter' }), { status: 400 });
  }
}
