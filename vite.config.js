import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss'; // Import Tailwind CSS
import autoprefixer from 'autoprefixer'; // Import Autoprefixer

export default defineConfig({
  plugins: [sveltekit()],
  css: {
    postcss: {
      plugins: [
        tailwindcss, // Use the imported Tailwind CSS
        autoprefixer, // Use the imported Autoprefixer
      ],
    },
  },
});
