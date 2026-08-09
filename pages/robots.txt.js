const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kiwango.vercel.app').replace(/\/$/, '');

export default function Robots() { return null; }

export async function getServerSideProps({ res }) {
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.write(body);
  res.end();
  return { props: {} };
}
