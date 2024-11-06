<script>
  import { onMount } from 'svelte';
  import GoBackButton from '$lib/GoBackButton.svelte';
  let warranties = [];

  onMount(async () => {
    try {
      const response = await fetch('/api/db');
      warranties = await response.json();
    } catch (error) {
      console.error('Error fetching warranties:', error);
    }
  });
</script>

<div class="max-w-4xl mx-auto p-8">
  <h2 class="text-2xl font-bold mb-4">Reporte de Garantías</h2>

  {#if warranties.length > 0}
    <table class="min-w-full bg-white border border-gray-300 mt-4">
      <thead>
        <tr class="bg-gray-100">
          <th class="py-2 px-4 border-b text-left">Dominio</th>
          <th class="py-2 px-4 border-b text-left">EAN/UPC</th>
          <th class="py-2 px-4 border-b text-left">Número de Serie</th>
          <th class="py-2 px-4 border-b text-left">Fecha de Ingreso</th>
          <th class="py-2 px-4 border-b text-left">Fecha de Inventario</th>
          <th class="py-2 px-4 border-b text-left">Fecha de Compra</th>
          <th class="py-2 px-4 border-b text-left">Registro de Garantía</th>
          <th class="py-2 px-4 border-b text-left">Cliente</th>
          <th class="py-2 px-4 border-b text-left">Correo Electrónico</th>
        </tr>
      </thead>
      <tbody>
        {#each warranties as warranty}
          <tr class="hover:bg-gray-50">
            <td class="py-2 px-4 border-b">{warranty.domain}</td>
            <td class="py-2 px-4 border-b">{warranty.gtin}</td>
            <td class="py-2 px-4 border-b">{warranty.serial}</td>
            <td class="py-2 px-4 border-b">{warranty.fecha_ingreso}</td>
            <td class="py-2 px-4 border-b">{warranty.fecha_inventario || 'N/A'}</td>
            <td class="py-2 px-4 border-b">{warranty.fecha_compra}</td>
            <td class="py-2 px-4 border-b">{warranty.garantia_registrada ? 'Yes' : 'No'}</td>
            <td class="py-2 px-4 border-b">{warranty.cliente}</td>
            <td class="py-2 px-4 border-b">{warranty.correo || 'N/A'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p class="mt-4">No warranties found.</p>
  {/if}

   <!-- Go Back Button -->
   <div class="mt-6">
    <GoBackButton />
  </div>
</div>
