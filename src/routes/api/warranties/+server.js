// src/routes/api/warranties/+server.js
import sqlite3 from 'sqlite3';
import { json } from '@sveltejs/kit';

const db = new sqlite3.Database('warranty.db');

// GET: Retrieve all warranties or check if a specific warranty exists
export async function GET({ url }) {
  const gtin = url.searchParams.get('gtin');
  const serial = url.searchParams.get('serial');


  if (gtin && serial) {
    // Check if a specific warranty exists based on gtin and serial
    console.log("somebody is querying a specific item");
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM warranties WHERE gtin = ? AND serial = ?`,
        [gtin, serial],
        (err, row) => {
          if (err) {
            console.error('Database query error:', err);
            reject(json({ error: 'Database error' }, { status: 500 }));
          } else {
            resolve(json({ exists: row !== undefined }));
          }
        }
      );
    });
  } else {
    // Retrieve all warranties if no specific gtin/serial provided
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

// POST: Save a new warranty
export async function POST({ request }) {
  try {
    const { gtin, serial, cliente, fechaDeCompra, customer_email } = await request.json();

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO warranties (gtin, serial, cliente, fechaDeCompra, customer_email, warranty_registered) VALUES (?, ?, ?, ?, ?, 1)`,
        [gtin, serial, cliente, fechaDeCompra, customer_email],
        function (err) {
          if (err) {
            console.error('Database error:', err);
            reject(json({ error: 'Database error' }, { status: 500 }));
          } else {
            resolve(json({ success: true }));
          }
        }
      );
    });
  } catch (error) {
    console.error('Request handling error:', error);
    return json({ error: 'Request handling error' }, { status: 500 });
  }
}
