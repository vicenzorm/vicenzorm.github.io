import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vicenzorm.github.io',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
