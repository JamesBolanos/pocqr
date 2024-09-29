<script>
    let gtin = '';
    let lotNumber = '';
    let date = '';
  
    async function generateQRCode() {
      const response = await fetch('/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gtin, lotNumber, date }),
      });
  
      const blob = await response.blob();
  
      // Dynamically set the filename
      const filename = `GTIN_${gtin}_Lot_${lotNumber}_Date_${date}.png`;
  
      // Create a link element to trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename; // Set the dynamic filename here
      link.click();
      window.URL.revokeObjectURL(url);
    }
  </script>
  
  <main>
    <!-- Your form inputs for gtin, lotNumber, date -->
    <!-- Generate QR Code Button -->
     <h1>Generador de Codigos QR para Lotes de Produccion</h1>
     <h2>Digitar GTIN, Numero de Lote y fecha</h2>
    <form on:submit|preventDefault={generateQRCode}>
      <div>
        <label for="gtin">GTIN:</label>
        <input id="gtin" type="text" bind:value={gtin} />
      </div>
      <div>
        <label for="lotNumber">Lot Number:</label>
        <input id="lotNumber" type="text" bind:value={lotNumber} />
      </div>
      <div>
        <label for="date">Date (YYMMDD):</label>
        <input id="date" type="text" bind:value={date} />
      </div>
      <button type="submit">Generate QR Code</button>
    </form>
  </main>
  