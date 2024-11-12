<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import confetti from 'canvas-confetti';
  
    // Access URL parameters according to GS1 APPLICATION IDENTIFICATION RULES: (01) GTIN / (11) PRODUCTION DATE / (21) SERIAL NUMBER
    let dominio;
    // Extract the domain
    dominio = get(page).url.origin;
    let gtin = get(page).params.gtin;
    let fecha_produccion = get(page).params.production_date;
    let serie = get(page).params.serial;



    //DEBUG
    console.log("Domain:", dominio);
    console.log("GTIN:", gtin);
    console.log("FECHA PRODUCCION:", fecha_produccion);
    console.log("serie:", serie);
    //DEBUG

  
    // CAMPOS A SER LLENADOS POR EL USUARIO
    let cliente = '';
    let fecha_compra = new Date().toISOString().split('T')[0];
    let correo = '';

  
    // Check if the warranty exists when the component loads
    // THIS IS A GET METHOD (QUERY)
    onMount(async () => {
      try {
        // Fetch from the API to check if the warranty exists
        const response = await fetch(`/api/db/eu/?dominio=${dominio}&gtin=${gtin}&serie=${serie}&{fecha_produccion=${fecha_produccion}}`);
        const result = await response.json();
  
        if (result.exists) {
          // Redirect to product information page if warranty exists
          goto(`/product-info/01/${gtin}/11/${fecha_produccion}/21/${serie}`);
        }
      } catch (error) {
        console.error('Error al buscar garantias existentes', error);
      }
    });
  
    // Function to save the warranty

    async function saveWarranty() {
      // Trigger confetti animation. this should go before the alert, but because saveWarranty is async() first shows the alert, and the confetti is shown after the redirection
      // There msust be a better place to put this animation.
      confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
      });

      try {
        const response = await fetch('/api/db/eu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dominio, gtin, serie, fecha_produccion, cliente, fecha_compra, correo })
        });
  
        if (response.ok) {
          
          alert('Garantia registrada correctamente!');
        } else {
          alert('Fallo al registrar la garantia.');
        }
      } catch (error) {
        console.error('Request failed:', error);
        alert('An error occurred while saving warranty.');
      }

      //Send the customer to the main page
      goto(`/`);
    }

    
  </script>
  
  <div class="max-w-lg mx-auto p-8">
    <h2 class="text-2xl font-bold mb-4">Warranty Registration</h2>
    <form on:submit|preventDefault={saveWarranty}>
      <!-- GTIN Field -->
      <div class="mb-4">
        <label for="gtin" class="block text-sm font-medium text-gray-700">EAN/UPC</label>
        <input id="gtin" type="text" readonly bind:value={gtin} class="border p-2 rounded w-full" />
      </div>
  
      <!-- serie Number Field -->
      <div class="mb-4">
        <label for="serie" class="block text-sm font-medium text-gray-700">Número de Serie</label>
        <input id="serie" type="text" readonly bind:value={serie} class="border p-2 rounded w-full" />
      </div>
  
      <!-- Customer Name Field -->
      <div class="mb-4">
        <label for="cliente" class="block text-sm font-medium text-gray-700">Cliente</label>
        <input id="cliente" type="text" placeholder="Cliente" bind:value={cliente} class="border p-2 rounded w-full" required />
      </div>
  
      <!-- Customer Email Field (Optional) -->
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input id="email" type="email" placeholder="Correo Electrónico" bind:value={correo} class="border p-2 rounded w-full" />
      </div>
  
      <!-- Purchase Date Field -->
      <div class="mb-4">
        <label for="fecha_compra" class="block text-sm font-medium text-gray-700">Fecha de Compra</label>
        <input id="fecha_compra" type="date" bind:value={fecha_compra} class="border p-2 rounded w-full" required />
      </div>
  
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Registrar Garantia
      </button>
    </form>
  </div>
  