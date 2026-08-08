import Link from 'next/link';
import Logo from './Logo';

export default function SiteFooter({ lang = 'fr' }) {
  const fr = lang === 'fr';
  const groups = [
    { title: fr ? 'Explorer' : 'Explore', links: [
      [fr ? 'Convertisseur' : 'Converter', '/app?tab=converter'],
      [fr ? 'Destinations' : 'Destinations', '/app?tab=travel'],
      [fr ? 'Outils' : 'Tools', '/app?tab=tools'],
      [fr ? 'Devises' : 'Currencies', '/app?tab=rates'],
    ]},
    { title: fr ? 'Voyage' : 'Travel', links: [
      [fr ? 'Préparer un voyage' : 'Prepare a trip', '/app?tab=travel'],
      ['Rate Check', '/app?tab=tools'],
      [fr ? 'Budget voyage' : 'Travel budget', '/app?tab=tools'],
      ['Cash Wallet', '/app?tab=tools'],
    ]},
    { title: fr ? 'Ressources' : 'Resources', links: [
      [fr ? 'Mentions légales' : 'Legal', '/mentions-legales'],
      [fr ? 'Confidentialité' : 'Privacy', '/mentions-legales'],
      ['GitHub', 'https://github.com/njaga/currency-converter'],
      [fr ? 'Développeur' : 'Developer', 'https://ndiagandiaye.com'],
    ]},
  ];
  return <footer className="border-t border-slate-200/80 bg-white dark:border-white/10 dark:bg-slate-950">
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_2fr] md:px-6 lg:py-16">
      <div><Logo size="md" showText/><p className="mt-4 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">{fr ? 'Le compagnon financier de voyage : devises, taux, budget, cash et préparation hors connexion.' : 'Your travel-money companion for currencies, rates, budgets, cash and offline preparation.'}</p><div className="mt-6 inline-flex rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">PWA · Web · Offline-first</div></div>
      <div className="grid gap-8 sm:grid-cols-3">{groups.map((group)=><div key={group.title}><h3 className="text-xs font-bold uppercase tracking-[.16em] text-slate-900 dark:text-white">{group.title}</h3><div className="mt-4 space-y-3">{group.links.map(([label,href])=>href.startsWith('http')?<a key={label} href={href} target="_blank" rel="noreferrer" className="block text-sm text-slate-500 transition hover:text-emerald-700 dark:text-slate-400">{label}</a>:<Link key={label} href={href} className="block text-sm text-slate-500 transition hover:text-emerald-700 dark:text-slate-400">{label}</Link>)}</div></div>)}</div>
    </div>
    <div className="border-t border-slate-200/70 dark:border-white/10"><div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between md:px-6"><span>© {new Date().getFullYear()} Kiwango. {fr ? 'Données indicatives à vérifier avant toute opération.' : 'Indicative data; verify before any transaction.'}</span><span>{fr ? 'Conçu et développé par' : 'Designed and developed by'} <a href="https://ndiagandiaye.com" className="font-semibold text-slate-600 hover:text-emerald-700 dark:text-slate-300">Ndiaga Ndiaye</a></span></div></div>
  </footer>;
}
