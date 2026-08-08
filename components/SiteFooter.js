import Link from 'next/link';
import Logo from './Logo';

export default function SiteFooter({ lang = 'fr' }) {
  const fr = lang === 'fr';
  const popular = [
    ['Gambie','GM'],
    ['Sénégal','SN'],
    ["Côte d’Ivoire",'CI'],
    ['Ghana','GH'],
    ['Maroc','MA'],
    ['Kenya','KE'],
  ];
  const groups = [
    { title: fr ? 'Explorer' : 'Explore', links: [
      [fr ? 'Convertisseur' : 'Converter', '/app?tab=converter'],
      [fr ? 'Toutes les destinations' : 'All destinations', '/app?tab=travel'],
      [fr ? 'Outils financiers' : 'Money tools', '/app?tab=tools'],
      [fr ? 'Devises' : 'Currencies', '/app?tab=rates'],
    ]},
    { title: fr ? 'Destinations populaires' : 'Popular destinations', links: popular.map(([label,code]) => [label, `/app?tab=travel&country=${code}`]) },
    { title: fr ? 'Ressources' : 'Resources', links: [
      ['Rate Check', '/app?tab=tools'],
      [fr ? 'Budget voyage' : 'Travel budget', '/app?tab=tools'],
      ['Cash Wallet', '/app?tab=tools'],
      [fr ? 'Mentions légales & confidentialité' : 'Legal & privacy', '/mentions-legales'],
    ]},
  ];
  return <footer className="border-t border-slate-200/80 bg-[#fbfcfb] dark:border-white/10 dark:bg-slate-950">
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.15fr_2fr] md:px-6 lg:py-16">
      <div><Logo size="md" showText/><p className="mt-4 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">{fr ? 'Le compagnon financier de voyage : devise locale, taux, budget, cash et préparation hors connexion avant de partir.' : 'Your travel-money companion for local currencies, rates, budgets, cash and offline preparation.'}</p><div className="mt-6 flex flex-wrap gap-2"><span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5">PWA</span><span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5">Offline-first</span><span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5">FR / EN</span></div></div>
      <div className="grid gap-8 sm:grid-cols-3">{groups.map((group)=><div key={group.title}><h3 className="text-xs font-bold uppercase tracking-[.16em] text-slate-900 dark:text-white">{group.title}</h3><div className="mt-4 space-y-3">{group.links.map(([label,href])=><Link key={`${label}-${href}`} href={href} className="block text-sm text-slate-500 transition hover:text-emerald-700 dark:text-slate-400">{label}</Link>)}</div></div>)}</div>
    </div>
    <div className="border-t border-slate-200/70 dark:border-white/10"><div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between md:px-6"><span>© {new Date().getFullYear()} Kiwango. {fr ? 'Données indicatives à vérifier avant toute opération.' : 'Indicative data; verify before any transaction.'}</span><span>{fr ? 'Conçu et développé par' : 'Designed and developed by'} <a href="https://ndiagandiaye.com" target="_blank" rel="noreferrer" className="font-semibold text-slate-600 hover:text-emerald-700 dark:text-slate-300">Ndiaga Ndiaye</a></span></div></div>
  </footer>;
}
