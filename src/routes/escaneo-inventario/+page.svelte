<script>
    import { onMount } from 'svelte';
    import { Html5Qrcode } from 'html5-qrcode';
    import GoBackButton from '$lib/GoBackButton.svelte';
  
    let statusMessage = "Ready to take inventory";
    let lastUpdate = null;
    let beep ;

  
    function onScanSuccess(decodedText) {
  
  
  try {
    // Parse the URL directly to extract GTIN and Serial
    const pathParts = decodedText.split('/');
    const gtinIndex = pathParts.indexOf('01') + 1;
    const serialIndex = pathParts.indexOf('21') + 1;

    const gtin = pathParts[gtinIndex] || null;
    const serial = pathParts[serialIndex] || null;

    if (gtin && serial) {
      updateInventory(gtin, serial);
    } else {
      statusMessage = 'Failed to extract GTIN and Serial from QR code.';
    }
  } catch (error) {
    console.error("Error parsing QR code:", error);
    statusMessage = 'Invalid QR code format.';
  }

  if (beep) beep.play();
}


  
    async function updateInventory(gtin, serial) {
      try {
        const response = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gtin, serial })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          const timestamp = new Date();
          lastUpdate = {
            date: timestamp.toLocaleDateString(),
            time: timestamp.toLocaleTimeString(),
            gtin,
            serial,
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
      <li>GTIN: {lastUpdate.gtin}</li>
      <li>Serial: {lastUpdate.serial}</li>
      <li>Status: {lastUpdate.message}</li>
    </ul>
  {/if}
  
       <!-- Go Back Button -->
   <div class="mt-6">
    <GoBackButton />
  </div>
  