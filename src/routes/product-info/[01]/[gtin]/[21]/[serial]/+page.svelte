<!-- src/routes/product-info/[01]/[gtin]/[21]/[serial]/+page.svelte -->
<script>
    export let data;
    let gtin = data.gtin;
    let serial = data.serial;
  
    // You can load additional product information here as needed
  </script>
  
  <div class="max-w-lg mx-auto p-8">
    <h2 class="text-2xl font-bold mb-4">Product Information</h2>
    <p><strong>GTIN:</strong> {gtin}</p>
    <p><strong>Serial Number:</strong> {serial}</p>
    <p>Warranty is already registered for this product.</p>
  </div>
  