<!-- src/routes/product-info/[01]/[gtin]/[21]/[serie]/+page.svelte -->
<script>
    export let data;
    let gtin = data.gtin;
    let serie = data.serie;
    import GoBackButton from '$lib/GoBackButton.svelte';
  
    // You can load additional product information here as needed
  </script>
  
  <div class="max-w-lg mx-auto p-8">
    <h2 class="text-2xl font-bold mb-4">Product Information</h2>
    <p><strong>GTIN:</strong> {gtin}</p>
    <p><strong>serie Number:</strong> {serie}</p>
    <p>La garantia de este producto ya ha sido registrada.</p>
  </div>
  
  <div>

     <!-- Go Back Button -->
    <GoBackButton />
  </div>