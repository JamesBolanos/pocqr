// src/routes/api/db/eu/+server.js
import { supabase } from '$lib/supabaseClient';
import { json } from '@sveltejs/kit';

const fecha_garantia = new Date().toISOString();

// GET: Returns true, false or "Error 500".
// This is triggered by the on mount process in the warranty registration form.
// to Check if there is a warranty record on file and if the warranty is active.
export async function GET({ url }) {
  const dominio = url.searchParams.get('dominio');
  const gtin = url.searchParams.get('gtin');
  const serie = url.searchParams.get('serie');
  const fecha_produccion = url.searchParams.get('fecha_produccion');

  // Check if a specific warranty exists, and if it is already registered!
  const { data, error } = await supabase
    .from('warranties')
    .select('*')
    .eq('dominio', dominio)
    .eq('gtin', gtin)
    .eq('serie', serie)
    .eq('fecha_produccion',fecha_produccion)
    .eq('garantia_registrada', true);
      
  if (error) {
    console.error('Database query error check if a specific warranty exist:', error);
    return json({ error: 'Database error' }, { status: 500 });
  }

  const exists = data.length > 0;
  
  return json({ exists });
  
}


// POST: WARANTY REGISTRATION - THIS IS AN ENDPOINT THAT DOES NOT NEED AUTHORIZACION, 
// SO WE NEED TO LIMIT FROM IP ADDRESS AND COUNTRY AND DAILY HITS. ETC. BE AWARE!!!!
// WHY TO CHECK AGAIN? AND THIS WILL HAVE TO BE IN A STORE PROCEDURE SO I CHECK AND IF NOT I INSERT
export async function POST ({request}) {
  const { data: existingWarranty, error: warrantyFetchError } = await supabase
    .from('warranties')
    .select('*')
    .eq('dominio', dominio)
    .eq('gtin', gtin)
    .eq('serie', serie)
    .eq('fecha_produccion', fecha_produccion);

  if (warrantyFetchError) {
    console.error('Database query error on warranty check:', warrantyFetchError);
    return json({ error: 'Database error' }, { status: 500 });
  }

  //here existingWarranty should be false but is true even if there is no record, so we create another variable to check the variable length.
  const recordExists = existingWarranty.length > 0;

  //DEBUG MODE
  console.log(`Warranty already exists: ${recordExists}`);
  //DEBUG MODE


  if (recordExists) {
    
    //DEBUB MODE
    console.log('Warranty already registered');
    //DEBUG MODE

    return json({ message: 'La garantia de este producto ya ha sido registrada' });
  } else  {
    
    // Update record with warranty information

    const { error: updateWarrantyError } = await supabase
      .from('warranties')
      .update({ cliente, fecha_compra, correo, garantia_registrada: true })
      .eq('dominio',dominio)
      .eq('gtin', gtin)
      .eq('serie', serie)
      .eq('fecha_produccion', fecha_produccion);

    if (updateWarrantyError) {
      console.error('Database update error:', updateWarrantyError);
      return json({ error: 'Database error' }, { status: 500 });
    }

    return json({ success: true, message: 'Warranty registered' });
  }
} 

