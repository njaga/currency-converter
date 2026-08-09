import { useEffect } from 'react';
import Script from 'next/script';
import { trackEvent } from '../lib/telemetry';

const TOOL_LABELS = new Map([
  ['Vérifier un taux','rate-check'],['Frais réels','fees'],['Budget','budget'],['Cash Wallet','wallet'],['Calculatrice','calculator'],['Retrait ATM','atm'],['Alertes','alerts'],['Scan & Convert','scan'],['Taux terrain','field'],
  ['Rate Check','rate-check'],['Real fees','fees'],['Travel budget','budget'],['Calculator','calculator'],['ATM withdrawal','atm'],['Alerts','alerts'],['Field rates','field'],
]);

export default function PrivacyAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const src = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const domains = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;

  useEffect(() => {
    const onClick = (event) => {
      const button = event.target?.closest?.('button');
      if (!button) return;
      const label = String(button.textContent || '').trim().replace(/\s+/g, ' ');
      const tool = TOOL_LABELS.get(label);
      if (tool) { trackEvent('tool_open', { tool }); return; }
      if (/^(Préparer .+ hors connexion|Prepare .+ offline)$/.test(label)) trackEvent('travel_pack_prepare');
      if (/^(Mettre à jour le Travel Pack|Update Travel Pack)$/.test(label)) trackEvent('travel_pack_refresh');
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  if (!websiteId || !src) return null;
  return <Script id="kiwango-privacy-analytics" src={src} strategy="afterInteractive" data-website-id={websiteId} data-do-not-track="true" data-exclude-search="true" data-exclude-hash="true" data-performance="true" {...(domains ? { 'data-domains': domains } : {})}/>;
}
