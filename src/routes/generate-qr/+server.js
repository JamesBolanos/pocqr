import QRCode from 'qrcode';

export async function POST({ request }) {
  const { gtin, lotNumber, date } = await request.json();

  // Generate the data string following GS1 standards
  const qrData = `01${gtin}10${lotNumber}11${date}`;

  // Create a dynamic filename based on the input values
  const filename = `GTIN_${gtin}_Lot_${lotNumber}_Date_${date}.png`;

  // Generate QR code as a PNG buffer
  const qrCodeImage = await QRCode.toBuffer(qrData, { type: 'png' });

  // Return the QR code with a dynamic filename in the headers
  return new Response(qrCodeImage, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${filename}"`,
    }
  });
}
