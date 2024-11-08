<!-- src/lib/GoBackButton.svelte -->
<script>
    import { goto } from '$app/navigation';
  
    function goBack() {
      goto('/');
    }
  </script>
  
  <button
    on:click={goBack}
    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-6"
  >
    Regresar al Menu Principal de la DEMO
  </button>
  