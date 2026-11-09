// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// twinlink.eu: static site (any web host). Change SITE_URL if the domain changes.
const SITE_URL = (process.env.SITE_URL || 'https://twinlink.eu').replace(/\/$/, '');

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  build: { format: 'directory', inlineStylesheets: 'never' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
