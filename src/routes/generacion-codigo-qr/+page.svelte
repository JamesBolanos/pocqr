<script>

  import GoBackButton from '$lib/GoBackButton.svelte';
  let domain ='https://poqr.vercel.app/';
  let gtin = '7430042900007'; //GS1 AI 01 GTIN 13
  let serie = ''; //GS1 AI (21) 
  let fecha_produccion = '';  //GS1 AI (11) FORMAT YYMMDD
  let action = 'create_new';
  
  async function generateQRCode() {
    const response = await fetch('/api/generate-qr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({domain, gtin, serie, fecha_produccion }),
    });

    //DEBUG
    console.log(JSON.stringify({domain, gtin, serie, fecha_produccion}));
    //DEBUG


    const blob = await response.blob();
    const filename = `GTIN_${gtin}_SERIE_${serie}_FECHAP_${fecha_produccion}.png`;
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
          body: JSON.stringify({ domain, gtin, serie, fecha_produccion, action })
        });
  
        const data = await response.json();
  
        if (response.ok) {

          //DEBUG
          console.log('new record added');
          //DEBUG
          
          
        } else {
          //DEBUG
          console.log('Post response was not ok');
          //DEBUG
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
          <label for="serie" class="block text-gray-700 font-medium mb-2">Numero de serie:</label>
          <input id="serie" type="text" bind:value={serie} maxlength="20" class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none" required />
        </div>
        <div>
          <label for="fecha_produccion" class="block text-gray-700 font-medium mb-2">Fecha de Produccion (AAMMDD):</label>
          <input id="fecha_produccion" type="text" bind:value={fecha_produccion} maxlength="20" class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none" required />
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
