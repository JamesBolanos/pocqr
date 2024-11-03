// src/routes/api/inventory/+server.js
import sqlite3 from 'sqlite3';
import { json } from '@sveltejs/kit';

const dbPath = process.env.IN_MEMORY_DB === 'true' ? ':memory:' : './warranty.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log(`Connected to the SQLite database at ${dbPath === ':memory:' ? 'in-memory' : dbPath}`);
  }
});

export async function POST({ request }) {
  const { gtin, serial } = await request.json();

  if (!gtin || !serial) {
    console.error('Invalid parameters:', { gtin, serial });
    return new Response(JSON.stringify({ error: 'Invalid parameters' }), { status: 400 });
  }

  const date_last_inventory = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM warranties WHERE gtin = ? AND serial = ?`, [gtin, serial], (err, row) => {
      if (err) {
        console.error('Database query error:', err);
        reject(new Response(JSON.stringify({ error: 'Database error' }), { status: 500 }));
      } else if (row) {
        console.log(`Updating existing record for GTIN: ${gtin}, Serial: ${serial}`);
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
        console.log(`Inserting new record for GTIN: ${gtin}, Serial: ${serial}`);
        db.run(
          `INSERT INTO warranties (gtin, serial, date_last_inventory,warranty_registered) VALUES (?, ?, ?, false)`,
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
}
