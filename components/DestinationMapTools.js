import { useState } from 'react';
import { Banknote, Clock3, HardDriveDownload, Landmark, MapPin, ShieldCheck } from 'lucide-react';

const TOOLS = [
  { id: 'banks', icon: Landmark, fr: 'DAB & banques', en: 'ATMs & banks' },
  { id: 'exchange', icon: Banknote, fr: 'Bureaux de change', en: 'Exchange offices' },
];

const formatSyncDate = (timestamp, lang) => {
  if (!timestamp) return null;
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(new Date(timestamp));
};

export default function DestinationMapTools({ destination, lang = 'fr', offlineServices = null }) {
  const fr = lang === 'fr';
  const [active, setActive] = useState('banks');
  const places = Array.isArray(offlineServices?.[active]) ? offlineServices[active] : [];
  const hasSnapshot = Boolean(offlineServices && offlineServices.syncState !== 'unavailable');
  const syncDate = formatSyncDate(offlineServices?.fetchedAt, lang);
  const needsRefresh = ['partial', 'stale'].includes(offlineServices?.syncState);

  return <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/10">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{fr ? 'Repères financiers hors connexion' : 'Offline financial references'}</p>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">{fr ? `Kiwango peut enregistrer les DAB, banques et bureaux de change de ${destination} dans votre Travel Pack. Aucun itinéraire n’est calculé.` : `Kiwango can save ATMs, banks and exchange offices in ${destination} to your Travel Pack. No route is calculated.`}</p>
      </div>
      {hasSnapshot && <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold ${needsRefresh ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'}`}>{needsRefresh ? <Clock3 className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}{needsRefresh ? (fr ? 'Mise à jour recommandée' : 'Refresh recommended') : (fr ? 'Disponible hors connexion' : 'Available offline')}</span>}
    </div>

    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        const selected = active === tool.id;
        const count = Array.isArray(offlineServices?.[tool.id]) ? offlineServices[tool.id].length : 0;
        return <button key={tool.id} type="button" onClick={() => setActive(tool.id)} aria-pressed={selected} className={`flex items-center gap-2 border px-3 py-3 text-left text-xs font-semibold transition ${selected ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100' : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-white/10 dark:hover:bg-emerald-950/20'}`}><Icon className="h-4 w-4 flex-none text-emerald-700" /><span className="flex-1">{fr ? tool.fr : tool.en}</span><span className="flex h-6 min-w-6 items-center justify-center bg-white px-1.5 text-[10px] text-slate-500 shadow-sm dark:bg-slate-900">{count}</span></button>;
      })}
    </div>

    {!hasSnapshot && <div className="mt-4 flex items-start gap-3 border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100"><HardDriveDownload className="mt-1 h-4 w-4 flex-none" /><span>{fr ? 'Mettez à jour le Travel Pack de cette destination pour télécharger ces repères et les consulter sans connexion.' : 'Update this destination’s Travel Pack to download these references and view them offline.'}</span></div>}

    {hasSnapshot && places.length > 0 && <div className="mt-4 grid gap-2 sm:grid-cols-2">{places.map((place) => <article key={place.id} className="flex min-w-0 items-start gap-3 border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[.025]"><span className="flex h-9 w-9 flex-none items-center justify-center bg-emerald-100 text-emerald-800"><MapPin className="h-4 w-4" /></span><div className="min-w-0"><h4 className="text-sm font-semibold">{place.name}</h4><p className="mt-1 text-xs leading-5 text-slate-500">{place.address || destination}</p><div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[.08em] text-slate-400">{place.rating && <span>{place.rating}/5</span>}{place.openNow !== null && place.openNow !== undefined && <span className={place.openNow ? 'text-emerald-700' : 'text-rose-600'}>{place.openNow ? (fr ? 'Ouvert lors de la synchro' : 'Open when synced') : (fr ? 'Fermé lors de la synchro' : 'Closed when synced')}</span>}</div></div></article>)}</div>}
    {hasSnapshot && !places.length && <p className="mt-4 border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[.025]">{fr ? 'Aucun résultat n’a été trouvé pour cette catégorie lors de la dernière synchronisation.' : 'No result was found for this category during the last sync.'}</p>}
    {hasSnapshot && <p className="mt-3 text-[10px] leading-5 text-slate-400">{fr ? `Copie locale Google Places${syncDate ? ` · synchronisée le ${syncDate}` : ''} · informations indicatives à vérifier sur place.` : `Local Google Places copy${syncDate ? ` · synced ${syncDate}` : ''} · indicative information to verify locally.`}</p>}
  </div>;
}
