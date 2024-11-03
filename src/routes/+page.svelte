<!-- src/routes/+page.svelte -->
<div class="flex flex-col min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-blue-600 text-white py-6 shadow-md">
      <h1 class="text-3xl font-bold text-center">Demo</h1>
      <p class="text-center text-lg mt-2">Manejo de Garantias utilizando Codigos QR</p>
    </header>
  
    <!-- Main Content Area -->
    <main class="flex-grow flex justify-center items-center p-8">
      <div class="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-semibold mb-6 text-center">Main Menu</h2>
        <nav class="flex flex-col gap-6">
          <a href="/generacion-codigo-qr" class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center shadow-lg transition duration-200">
            Generación de Código QR Powered by GS1 Digital Link
          </a>
          <a href="/escaneo-inventario" class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center shadow-lg transition duration-200">
            Escaneo de Inventario en Display
          </a>
          <a href="/reporte-garantias" class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center shadow-lg transition duration-200">
            Reporte de Garantías
          </a>
        </nav>
      </div>
    </main>
  
    <!-- Footer -->
    <footer class="bg-gray-200 text-gray-700 text-center py-4">
      © 2023 Your Company
    </footer>
  </div>
  