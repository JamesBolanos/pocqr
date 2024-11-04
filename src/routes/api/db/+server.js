// src/routes/api/db/+server.js
import { supabase } from '$lib/supabaseClient';
import { json } from '@sveltejs/kit';

// Initialize warranties table in Supabase if not done already
// This would typically be done in the Supabase dashboard directly

// GET: Retrieve all warranties or check if a specific warranty exists
export async function GET({ url }) {
  const gtin = url.searchParams.get('gtin');
  const serial = url.searchParams.get('serial');

  if (gtin && serial) {
    // Check if a specific warranty exists
    const { data, error } = await supabase
      .from('warranties')
      .select('*')
      .eq('gtin', gtin)
      .eq('serial', serial)
      .eq('garantia_registrada', true);
      

    if (error) {
      console.error('Database query error check if a specific warranty exist:', error);
      return json({ error: 'Database error' }, { status: 500 });
    }

    const exists = data.length >0;

    
    return json({ exists });
  } else {
    // Retrieve all warranties
    
    const { data, error } = await supabase
      .from('warranties')
      .select('*');

    if (error) {
      console.error('Database query error retrieving all warranties:', error);
      return json({ error: 'Database error' }, { status: 500 });
    }
    
    return json(data);
  }
}

// POST: Handle both warranty registration and inventory update
export async function POST({ request }) {
  const { gtin, serial, cliente, fecha_compra, correo, action } = await request.json();

  if (!gtin || !serial) {
    console.error('Missing GTIN or Serial in request');
    return json({ error: 'GTIN and Serial are required' }, { status: 400 });
  }

  if (action === 'inventory') {
    const fecha_inventario = new Date().toISOString();

    // Check if the item exists and update or insert inventory record
    const { data: existingRecord, error: fetchError } = await supabase
      .from('warranties')
      .select('*')
      .eq('gtin', gtin)
      .eq('serial', serial);
      

    if (fetchError) {
      console.error('Database query error on inventory check:', fetchError);
      return json({ error: 'Database error' }, { status: 500 });
    }

    if (existingRecord) {
      // Update existing record

      const { error: updateError } = await supabase
        .from('warranties')
        .update({ fecha_inventario })
        .eq('gtin', gtin)
        .eq('serial', serial);

      if (updateError) {
        console.error('Database update error:', updateError);
        return json({ error: 'Database error' }, { status: 500 });
      }

      return json({ message: 'Inventory date updated', fecha_inventario, gtin, serial });
    } else {
      // Insert new inventory record
      const { error: insertError } = await supabase
        .from('warranties')
        .insert({ gtin, serial, fecha_inventario, garantia_registrada: false });

      if (insertError) {
        console.error('Database insert error:', insertError);
        return json({ error: 'Database error' }, { status: 500 });
      }

      return json({ message: 'New inventory record added', fecha_inventario, gtin, serial });
    }
  } else if (action === 'register_warranty') {
    // Check if warranty is already registered
    const { data: existingWarranty, error: warrantyFetchError } = await supabase
      .from('warranties')
      .select('*')
      .eq('gtin', gtin)
      .eq('serial', serial);

    if (warrantyFetchError) {
      console.error('Database query error on warranty check:', warrantyFetchError);
      return json({ error: 'Database error' }, { status: 500 });
    }

    //here existingWarranty should be false but is true even if there is no record
    const recordExists = existingWarranty.length >0;

    console.log(`Warranty already exists to update?: ${recordExists}`);
    

    if (recordExists && existingWarranty.garantia_registrada) {
      console.log('Warranty already registered');
      return json({ message: 'Warranty already registered' });
    } else if (recordExists && !existingWarranty.garantia_registrada) {
      console.log("paso por aqui asomandome");
      // Update existing record with warranty information
      const { error: updateWarrantyError } = await supabase
        .from('warranties')
        .update({ cliente, fecha_compra, correo, garantia_registrada: true })
        .eq('gtin', gtin)
        .eq('serial', serial);

      if (updateWarrantyError) {
        console.error('Database update error:', updateWarrantyError);
        return json({ error: 'Database error' }, { status: 500 });
      }

      return json({ success: true, message: 'Warranty registered' });
    } else {
      // Insert new warranty record
      const { error: insertWarrantyError } = await supabase
        .from('warranties')
        .insert({ gtin, serial, cliente, fecha_compra, correo, garantia_registrada: true });

      if (insertWarrantyError) {
        console.error('Database insert error:', insertWarrantyError);
        return json({ error: 'Database error' }, { status: 500 });
      }
      console.log('New warranty record added successfully');
      return json({ success: true, message: 'Warranty registered' });
    }
  } else {
    console.error('Invalid action parameter');
    return json({ error: 'Invalid action parameter' }, { status: 400 });
  }
}
