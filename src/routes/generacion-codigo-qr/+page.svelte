<script>

  import GoBackButton from '$lib/GoBackButton.svelte';
  let domain ='https://poqr.vercel.app/';
  let gtin = '7430042900007';
  let serial = '';
  let action = 'create_new';
  
  async function generateQRCode() {
    const response = await fetch('/api/generate-qr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({domain, gtin, serial }),
    });

    console.log(JSON.stringify({domain, gtin,serial}));


    const blob = await response.blob();
    const filename = `GTIN_${gtin}_Serial_${serial}.png`;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);

    createNew();

  }

    //I will add the record to the database
    async function createNew() {
      try {
        const response = await fetch('/api/db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain, gtin, serial, action })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          console.log('new record added');
          
          
        } else {
          console.log('Post response was not ok');
        }

      } catch (error) {
        console.error(error);
      }
    }

</script>

<main class="min-h-screen bg-gray-100 flex items-center justify-center">
  <div class="bg-white p-8 shadow-md rounded-lg max-w-md w-full">
    <h1 class="text-2xl font-bold mb-6 text-center">Generación de Código QR Powered by GS1 Digital Link</h1>
    <h2 class="mb-6 text-center">formato png</h2>
    
    <form>
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
          <label for="serial" class="block text-gray-700 font-medium mb-2">Numero de serie:</label>
          <input id="serial" type="text" bind:value={serial} maxlength="20" class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none" required />
        </div>
      </div>
     

      
      <button type="button" on:click={generateQRCode} class="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
        Generar Código QR
      </button>
    </form>
    <!-- Go Back Button -->
    <GoBackButton />
  </div>

</main>
