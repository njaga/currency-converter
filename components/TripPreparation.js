import React from 'react';
import { BedDouble, Car, ExternalLink, Plane, ShieldCheck, Smartphone, Ticket } from 'lucide-react';

const SERVICES = [
  { id: 'flights', label: 'Vols', description: 'Comparer les options pour rejoindre votre destination.', icon: Plane },
  { id: 'hotels', label: 'Hébergements', description: 'Trouver un hôtel ou un hébergement adapté à votre budget.', icon: BedDouble },
  { id: 'esim', label: 'eSIM', description: 'Préparer votre connexion mobile avant l’arrivée.', icon: Smartphone },
  { id: 'transfer', label: 'Transfert', description: 'Organiser un transfert depuis l’aéroport ou la gare.', icon: Car },
  { id: 'activities', label: 'Activités', description: 'Réserver visites, expériences et activités sur place.', icon: Ticket },
  { id: 'insurance', label: 'Assurance', description: 'Comparer une couverture voyage avant le départ.', icon: ShieldCheck },
];

export default function TripPreparation({ country, lang = 'fr' }) {
  if (!country) return null;
  const currency = country.primaryCurrency?.code || '';
  const query = new URLSearchParams({
    countryCode: country.code,
    country: country.name,
    currency,
    lang,
  }).toString();

  return <section className="mt-6 min-w-0 rounded-[30px] border border-slate-200/80 bg-slate-950 p-5 text-white shadow-[0_22px_70px_rgba(15,23,42,.14)] sm:p-7 dark:border-white/10">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-emerald-400">Préparer le départ</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-.035em] sm:text-3xl">Tout préparer pour {country.name}, au même endroit.</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">Ces services s’ouvrent chez des partenaires externes. Lorsqu’un lien est affilié, Kiwango peut recevoir une commission sans coût supplémentaire pour vous.</p>
      </div>
      <span className="text-xs text-slate-500">Liens partenaires · transparence incluse</span>
    </div>

    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map(({ id, label, description, icon: Icon }) => <a key={id} href={`/go/${id}?${query}`} target="_blank" rel="sponsored noopener noreferrer" className="group min-w-0 rounded-[22px] border border-white/10 bg-white/[.055] p-4 transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-white/[.08]">
        <div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300"><Icon className="h-5 w-5"/></span><ExternalLink className="h-4 w-4 text-slate-600 transition group-hover:text-emerald-400"/></div>
        <h3 className="mt-5 text-sm font-semibold">{label}</h3><p className="mt-2 text-xs leading-5 text-slate-400">{description}</p>
      </a>)}
    </div>
  </section>;
}
