import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vicenzomasera.com',
  integrations: [sitemap()],
  build: { format: 'directory', inlineStylesheets: 'always' },
});
