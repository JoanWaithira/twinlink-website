// robots.txt: the Netlify preview (PUBLIC_PREVIEW=true) stays out of search engines; the live site is open.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const preview = import.meta.env.PUBLIC_PREVIEW === 'true';
  const body = preview
    ? '# Preview of the new twinlink.eu site: not for search engines yet.\nUser-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
