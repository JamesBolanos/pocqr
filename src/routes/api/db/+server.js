// src/routes/api/db/+server.js
import { supabase } from '$lib/supabaseClient';
import { json } from '@sveltejs/kit';

// Initialize warranties table in Supabase if not done already
// This would typically be done in the Supabase dashboard directly

// GET: Retrieve all warranties or check if a specific warranty exists
export async function GET({ url }) {
  const domain = url.searchParams.get('domain');
  const gtin = url.searchParams.get('gtin');
  const serie = url.searchParams.get('serie');

  if (gtin && serie) {
    // Check if a specific warranty exists
    const { data, error } = await supabase
      .from('warranties')
      .select('*')
      .eq('domain', domain)
      .eq('gtin', gtin)
      .eq('serie', serie)
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

// POST: Handle qr code creation (new item), warranty registration and inventory update.
export async function POST({ request }) {
  const { domain, gtin, serie, fecha_produccion, fecha_garantia, cliente, fecha_compra, correo, action } = await request.json();

  if (!gtin || !serie) {
    console.log(gtin);
    console.log(serie);
    console.log(fecha_compra);
    console.error('Missing GTIN or serie in request');
    return json({ error: 'GTIN and serie are required' }, { status: 400 });
  }
  //////////////////////////////////////////////////////////////////////
  if (action === 'create_new') {
    const fecha_ingreso = new Date().toISOString(); 

    // Check if the item exists.
    const { data: existingRecord, error: fetchError } = await supabase
      .from('warranties')
      .select('*')
      .eq('domain',domain)
      .eq('gtin', gtin)
      .eq('serie', serie)
      
      
    console.log('checking if the item exists...');

    if (fetchError) {
      console.error('Database query error on inventory check:', fetchError);
      return json({ error: 'Database error' }, { status: 500 });
    }

    //This is because the object existingRecord always is true even if there is no rows on the database
    
    const existInventoryRecord = existingRecord.length > 0;

    if (existInventoryRecord) {
      // Log the error 

      console.log('the create_new action is trying to add an item that already exists...');
      return json({ message: 'The item already exists in the table', domain, gtin, serie });
    } else {
      // Insert new record
      
      const { error: insertError } = await supabase
        .from('warranties')
        .insert({ domain, gtin, serie, fecha_garantia, fecha_ingreso, garantia_registrada: false });

      if (insertError) {
        console.error('Database insert error:', insertError);
        return json({ error: 'Database error' }, { status: 500 });
      }

      return json({ message: 'New record added', domain, gtin, serie });
    }
    ///////////////////////////////////////

  } else if (action === 'inventory') {
    const fecha_inventario = new Date().toISOString();

    // Check if the item exists and update or insert inventory record
    const { data: existingRecord, error: fetchError } = await supabase
      .from('warranties')
      .select('*')
      .eq('domain',domain)
      .eq('gtin', gtin)
      .eq('serie', serie);
      
    console.log('checking if the item exists');

    if (fetchError) {
      console.error('Database query error on inventory check:', fetchError);
      return json({ error: 'Database error' }, { status: 500 });
    }

    //This is because the object existingRecord always is true even if there is no rows on the database
    const existInventoryRecord = existingRecord.length > 0;


    if (existInventoryRecord) {
      // Update existing record

      console.log('supposedly the item exists..');

      const { error: updateError } = await supabase
        .from('warranties')
        .update({ fecha_inventario })
        .eq('domain', domain)
        .eq('gtin', gtin)
        .eq('serie', serie);

      if (updateError) {
        console.error('Database update error:', updateError);
        return json({ error: 'Database error' }, { status: 500 });
      }

      return json({ message: 'Inventory date updated', fecha_inventario, gtin, serie });
    } else {
      // Insert new inventory record
      // THIS WILL NOT BE POSSIBLE YOU NEED TO DOBULE CHECK THE FLOW
      const { error: insertError } = await supabase
        .from('warranties')
        .insert({ domain, gtin, serie, fecha_inventario, garantia_registrada: false });

      if (insertError) {
        console.error('Database insert error:', insertError);
        return json({ error: 'Database error' }, { status: 500 });
      }

      return json({ message: 'New inventory record added', fecha_inventario, gtin, serie });
    }
  } else if (action === 'register_warranty') {
    // Check if warranty is already registered
    const { data: existingWarranty, error: warrantyFetchError } = await supabase
      .from('warranties')
      .select('*')
      .eq('domain',domain)
      .eq('gtin', gtin)
      .eq('serie', serie);

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
      
      // Update record with warranty information

      const { error: updateWarrantyError } = await supabase
        .from('warranties')
        .update({ cliente, fecha_compra, correo, garantia_registrada: true })
        .eq('domain',domain)
        .eq('gtin', gtin)
        .eq('serie', serie);

      if (updateWarrantyError) {
        console.error('Database update error:', updateWarrantyError);
        return json({ error: 'Database error' }, { status: 500 });
      }

      return json({ success: true, message: 'Warranty registered' });
    } else {
      // Insert new warranty record
      // this code will be eliminated because the flow now creates a new record when creating the qr code
      const { error: insertWarrantyError } = await supabase
        .from('warranties')
        .insert({ domain, gtin, serie, cliente, fecha_compra, correo, garantia_registrada: true });

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
