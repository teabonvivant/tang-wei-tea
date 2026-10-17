import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkSite from './plugins/remark-site.mjs';

// BASE / SITE 由環境變數覆蓋：預覽版 BASE=/tang-wei-tea-preview，正式版用預設值
const base = (process.env.BASE ?? '/tang-wei-tea').replace(/\/$/, '');
const site = process.env.SITE ?? 'https://teabonvivant.github.io';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  prefetch: false,
  markdown: {
    processor: unified({ remarkPlugins: [remarkSite] }),
  },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
