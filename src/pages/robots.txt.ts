import type { APIRoute } from 'astro';
import { SITE, BASE, IS_PREVIEW } from '../lib/site';
export const GET: APIRoute = () =>
  new Response(
    IS_PREVIEW
      ? 'User-agent: *\nDisallow: /\n'
      : `User-agent: *\nAllow: /\nSitemap: ${SITE}${BASE}/sitemap.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
