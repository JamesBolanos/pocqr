<script>
    import { onMount } from 'svelte';
    import { Html5Qrcode } from 'html5-qrcode';
    import GoBackButton from '$lib/GoBackButton.svelte';
  
    let statusMessage = "Ready to take inventory";
    let lastUpdate = null;
    let action = 'inventory';
    let beep ;

  
    function onScanSuccess(decodedText) {
  console.log("QR Code scanned:", decodedText);
  try {
    // Parse the URL to extract the domain, GTIN, and serie
    const pathParts = decodedText.split('/');

    // Extract the domain name from the first part of the URL
    const domain = pathParts[0] + "//" + pathParts[2];
    console.log("Domain:", domain);

    // Locate and extract GTIN and serie based on GS1 identifiers (01 for GTIN, 21 for serie)
    const gtinIndex = pathParts.indexOf('01') + 1;
    const serieIndex = pathParts.indexOf('21') + 1;

    const gtin = pathParts[gtinIndex] || null;
    const serie = pathParts[serieIndex] || null;

    if (gtin && serie) {
      console.log("GTIN:", gtin, "serie:", serie);
      updateInventory(domain, gtin, serie);
    } else {
      statusMessage = 'Failed to extract GTIN and serie from QR code.';
    }
    
  } catch (error) {
    console.error("Error parsing QR code:", error);
    statusMessage = 'Invalid QR code format.';
  }

  if (beep) beep.play();
}


  
    async function updateInventory(domain, gtin, serie) {
      try {
        const response = await fetch('/api/db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain, gtin, serie, action })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          const timestamp = new Date();
          lastUpdate = {
            date: timestamp.toLocaleDateString(),
            time: timestamp.toLocaleTimeString(),
            domain,
            gtin,
            serie,
            message: data.message
          };
          statusMessage = `Last item updated at ${lastUpdate.date} ${lastUpdate.time}`;
        } else {
          statusMessage = `Error: ${data.error}`;
        }
      } catch (error) {
        statusMessage = 'Error updating inventory.';
        console.error(error);
      }
    }
  
    onMount(() => {
      
      beep = new Audio('/store-scanner-beep-90395.mp3'); // Load the beep sound file
      const qrCodeScanner = new Html5Qrcode("qr-reader");
      qrCodeScanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess
      );
    });
  </script>
  
  <div id="qr-reader" style="width: 300px; height: 300px;"></div>
  <p>{statusMessage}</p>
  
  {#if lastUpdate}
    <p>Last Update:</p>
    <ul>
      <li>Date: {lastUpdate.date}</li>
      <li>Time: {lastUpdate.time}</li>
      <li>Domain: {lastUpdate.time}</li>
      <li>GTIN: {lastUpdate.gtin}</li>
      <li>serie: {lastUpdate.serie}</li>
      <li>Status: {lastUpdate.message}</li>
    </ul>
  {/if}
  
       <!-- Go Back Button -->
   <div class="mt-6">
    <GoBackButton />
  </div>
  