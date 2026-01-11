// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.matiasfernandez.me',
  devToolbar: {
    enabled: false // Desactiva el toolbar de desarrollo de Astro
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});