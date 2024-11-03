<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import confetti from 'canvas-confetti';
  
    // Access URL parameters
    let gtin = get(page).params.gtin;
    let serial = get(page).params.serial;
  
    // Form fields
    let cliente = '';
    let fechaDeCompra = new Date().toISOString().split('T')[0];
    let customer_email = '';
    let action = 'register_warranty';
  
    // Check if the warranty exists when the component loads
    onMount(async () => {
      try {
        // Fetch from the API to check if the warranty exists
        const response = await fetch(`/api/db?gtin=${gtin}&serial=${serial}`);
        const result = await response.json();
  
        if (result.exists) {
          // Redirect to product information page if warranty exists
          goto(`/product-info/01/${gtin}/21/${serial}`);
        }
      } catch (error) {
        console.error('Error al buscar garantias existentes', error);
      }
    });
  
    // Function to save the warranty
    async function saveWarranty() {
      try {
        const response = await fetch('/api/db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gtin, serial, cliente, fechaDeCompra, customer_email, action })
        });
  
        if (response.ok) {
          // Trigger confetti animation
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
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
  
      <!-- Serial Number Field -->
      <div class="mb-4">
        <label for="serial" class="block text-sm font-medium text-gray-700">Número de Serie</label>
        <input id="serial" type="text" readonly bind:value={serial} class="border p-2 rounded w-full" />
      </div>
  
      <!-- Customer Name Field -->
      <div class="mb-4">
        <label for="cliente" class="block text-sm font-medium text-gray-700">Cliente</label>
        <input id="cliente" type="text" placeholder="Cliente" bind:value={cliente} class="border p-2 rounded w-full" required />
      </div>
  
      <!-- Customer Email Field (Optional) -->
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input id="email" type="email" placeholder="Correo Electrónico" bind:value={customer_email} class="border p-2 rounded w-full" />
      </div>
  
      <!-- Purchase Date Field -->
      <div class="mb-4">
        <label for="fechaDeCompra" class="block text-sm font-medium text-gray-700">Fecha de Compra</label>
        <input id="fechaDeCompra" type="date" bind:value={fechaDeCompra} class="border p-2 rounded w-full" required />
      </div>
  
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Registrar Garantia
      </button>
    </form>
  </div>
  