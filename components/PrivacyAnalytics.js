import Script from 'next/script';

export default function PrivacyAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const src = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const domains = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;

  if (!websiteId || !src) return null;

  return (
    <Script
      id="kiwango-privacy-analytics"
      src={src}
      strategy="afterInteractive"
      data-website-id={websiteId}
      data-do-not-track="true"
      data-exclude-search="true"
      data-exclude-hash="true"
      data-performance="true"
      {...(domains ? { 'data-domains': domains } : {})}
    />
  );
}
