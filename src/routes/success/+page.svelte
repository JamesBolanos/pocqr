<!-- src/routes/success/+page.svelte -->
<script>
    import { goto } from '$app/navigation';
  
    function goBack() {
      goto('/'); // Adjust the path if you want to navigate to a specific part of your site
    }
  </script>
  
  <div class="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mt-10 text-center">
    <h1 class="text-2xl font-bold text-green-600 mb-4">Success!</h1>
    <p class="text-gray-700">Your warranty registration has been saved successfully.</p>
    
    <button
      on:click={goBack}
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
    >
      Go Back
    </button>
  </div>
  