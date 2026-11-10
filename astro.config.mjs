import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig(({ command }) => ({
  site: 'https://lottu-bonus.com',
  trailingSlash: command === 'dev' ? 'ignore' : 'always',
  server: {
    host: true,
    allowedHosts: true,
  },
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
}));
