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
  // Tools, projects and resources now share one page: /toolkit.
  redirects: {
    '/tools': '/toolkit?type=tool',
    '/projects': '/toolkit?type=project',
    '/resources': '/toolkit?type=resource',
  },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
