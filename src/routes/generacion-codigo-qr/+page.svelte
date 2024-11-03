<script>

  import GoBackButton from '$lib/GoBackButton.svelte';
  let domain ='https://resolver-st.gs1.org/';
  let gtin = '7430042900007';
  let serialNumber = '';
  
  async function generateQRCode() {
    const response = await fetch('/generate-qr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({domain, gtin, serialNumber }),
    });

    const blob = await response.blob();

    const filename = `GTIN_${gtin}_Serial_${serialNumber}.png`;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
</script>

<main class="min-h-screen bg-gray-100 flex items-center justify-center">
  <div class="bg-white p-8 shadow-md rounded-lg max-w-md w-full">
    <h1 class="text-2xl font-bold mb-6 text-center">Generación de Código QR Powered by GS1 Digital Link</h1>
    <h2 class="mb-6 text-center">formato png</h2>
    
    <form on:submit|preventDefault={generateQRCode}>
      <div class="grid grid-cols-1 sm:grid-cols-1 gap-6 mb-6">
        <div>
          <label for="domain" class="block text-gray-700 font-medium mb-2">Dominio:</label>
          <input id="domain" type="text" bind:value={domain} maxlength="30" class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none" required />
        </div>
        <div>
          <label for="gtin" class="block text-gray-700 font-medium mb-2">EAN/UPC:</label>
          <input id="gtin" type="text" bind:value={gtin} maxlength="13" class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none" required />
        </div>
        <div>
          <label for="serialNumber" class="block text-gray-700 font-medium mb-2">Numero de serie:</label>
          <input id="serialNumber" type="text" bind:value={serialNumber} maxlength="20" class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none" required />
        </div>
      </div>
     

      
      <button type="submit" class="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
        Generar Código QR
      </button>
        <!-- Go Back Button -->
  <GoBackButton />
    </form>
  </div>


</main>
