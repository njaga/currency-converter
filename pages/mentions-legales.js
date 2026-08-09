import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Database, ExternalLink, Link2, MapPin, Scale, ShieldCheck, WifiOff } from 'lucide-react';
import Logo from '../components/Logo';

const sections = [
  {
    icon: ShieldCheck,
    title: 'Protection des données',
    content: "Kiwango ne nécessite aucun compte pour convertir des devises. L'historique, les favoris, les voyages préparés, budgets, Cash Wallet, alertes locales et taux terrain sont enregistrés sur votre appareil. Ces données ne servent pas à établir un profil utilisateur.",
  },
  {
    icon: Database,
    title: 'Sources des taux',
    content: "Les taux variables proviennent des fournisseurs configurés par l'application. Les parités EUR/XOF et EUR/XAF sont gérées séparément comme parités fixes. La source et la fraîcheur des données sont indiquées dans l'interface.",
  },
  {
    icon: WifiOff,
    title: 'Fonctionnement hors connexion',
    content: "Après une synchronisation réussie, les derniers taux disponibles peuvent être conservés sur l'appareil afin de continuer les conversions hors connexion. Un taux ancien ou indisponible n'est jamais présenté comme une donnée de marché en direct.",
  },
  {
    icon: MapPin,
    title: 'Géolocalisation et services autour de vous',
    content: "Kiwango demande votre position uniquement lorsque vous lancez volontairement la recherche « Autour de moi ». Les coordonnées servent alors à rechercher des ATM, banques, bureaux de change ou points de transfert via le fournisseur cartographique configuré. Kiwango ne conserve pas votre position dans votre profil.",
  },
  {
    icon: Link2,
    title: 'Liens affiliés et partenaires',
    content: "Certaines cartes de préparation de voyage peuvent pointer vers des partenaires externes (vols, hébergements, eSIM, activités, transferts ou assurance). Lorsqu'un lien est affilié, Kiwango peut percevoir une commission si vous effectuez un achat, sans coût supplémentaire pour vous. Les liens affiliés sont signalés comme liens partenaires et n'influencent pas les calculs de taux ou les résultats financiers de Kiwango.",
  },
  {
    icon: Scale,
    title: 'Limitation de responsabilité',
    content: "Les conversions, comparaisons de taux, estimations de frais et budgets sont fournis à titre indicatif. Kiwango ne constitue ni un service de change, ni un conseil financier, ni une garantie du taux appliqué par un tiers.",
  },
];

export default function MentionsLegales() {
  return <>
    <Head>
      <title>Mentions légales | Kiwango</title>
      <meta name="description" content="Mentions légales, confidentialité, géolocalisation, affiliation et fonctionnement des données de Kiwango." />
      <meta name="robots" content="index, follow" />
    </Head>
    <div className="min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#ffffff_0%,#f8faf9_100%)] text-slate-950 dark:bg-[linear-gradient(180deg,#020617_0%,#07110d_100%)] dark:text-white">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_4px_24px_rgba(15,23,42,.04)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95"><div className="mx-auto flex h-[68px] w-full max-w-4xl items-center justify-between gap-4 px-4 md:px-6"><Logo size="md"/><Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"><ArrowLeft className="h-4 w-4"/>Retour</Link></div></header>
      <main className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6 md:py-16"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700 dark:text-emerald-400">Informations</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.045em] md:text-5xl">Mentions légales & confidentialité</h1><p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">Comment Kiwango traite vos données, d'où viennent les taux, comment fonctionnent les liens partenaires et quelles sont les limites du service.</p></div><div className="mt-10 overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/85 shadow-[0_20px_60px_rgba(15,23,42,.05)] dark:border-white/10 dark:bg-white/[.035]">{sections.map((section,index)=>{const Icon=section.icon;return <section key={section.title} className={`grid gap-5 p-6 md:grid-cols-[52px_1fr] md:p-8 ${index?'border-t border-slate-200/80 dark:border-white/10':''}`}><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"><Icon className="h-5 w-5"/></div><div><h2 className="text-lg font-semibold tracking-[-.02em]">{section.title}</h2><p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">{section.content}</p></div></section>})}</div><div className="mt-6 rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-6 text-sm dark:border-white/10 dark:bg-white/[.025]"><p className="font-semibold">Éditeur & développement</p><p className="mt-2 leading-7 text-slate-500 dark:text-slate-400">Projet conçu et développé par <a href="https://ndiagandiaye.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline dark:text-emerald-400">Ndiaga Ndiaye <ExternalLink className="h-3.5 w-3.5"/></a>.</p></div></main>
      <footer className="border-t border-slate-200/70 dark:border-white/10"><div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-7 text-xs text-slate-500 md:px-6"><span>© {new Date().getFullYear()} Kiwango</span><Link href="/" className="hover:text-emerald-700">Accueil</Link></div></footer>
    </div>
  </>;
}
