import QRCode from 'qrcode';

export async function POST({ request }) {
  const { domain, gtin, serie, fecha_produccion } = await request.json();

  // Validate GTIN length
  if (gtin.length !== 13) {
    return new Response('GTIN must be exactly 13 characters long.', { status: 400 });
  }

  // Generate the data string following GS1 standards
  const qrData = `${domain}01/${gtin}/12/${fecha_produccion}/21/${serie}`; 

  // Create a dynamic filename based on the input values
  const filename = `GTIN_${gtin}_SERIE_${serie}_FECHAP_${fecha_produccion}.png`;

  // Generate QR code as a PNG buffer
  const qrCodeImage = await QRCode.toBuffer(qrData, { type: 'png' })

  // Return the QR code with a dynamic filename in the headers
  return new Response(qrCodeImage, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${filename}"`,
    }
  });
}
