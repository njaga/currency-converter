import { fetchCountryDirectory, countrySlug } from '../lib/countries-server';
import { TRAVEL_DESTINATIONS } from '../lib/travel';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kiwango.vercel.app').replace(/\/$/, '');

const escapeXml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const localCountryName = (code, fallback) => {
  try { return new Intl.DisplayNames(['fr'], { type: 'region' }).of(code) || fallback; } catch { return fallback; }
};

export default function Sitemap() { return null; }

export async function getServerSideProps({ res }) {
  const remote = await fetchCountryDirectory();
  const countries = remote.countries.length
    ? remote.countries
    : TRAVEL_DESTINATIONS.map((item) => ({ code: item.code, name: item.country }));

  const staticUrls = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/convertisseur', priority: '0.9', changefreq: 'daily' },
    { loc: '/voyage', priority: '0.9', changefreq: 'weekly' },
    { loc: '/outils', priority: '0.8', changefreq: 'weekly' },
    { loc: '/mentions-legales', priority: '0.2', changefreq: 'yearly' },
  ];

  const destinationUrls = countries.map((country) => ({
    loc: `/voyage/${countrySlug(localCountryName(country.code, country.name))}`,
    priority: '0.7',
    changefreq: 'weekly',
  }));

  const urls = [...staticUrls, ...destinationUrls];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((item) => `  <url>\n    <loc>${escapeXml(`${SITE_URL}${item.loc}`)}</loc>\n    <changefreq>${item.changefreq}</changefreq>\n    <priority>${item.priority}</priority>\n  </url>`).join('\n')}\n</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.write(xml);
  res.end();
  return { props: {} };
}
