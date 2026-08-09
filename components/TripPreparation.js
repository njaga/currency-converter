import React, { useEffect, useMemo, useState } from 'react';
import { Banknote, CalendarDays, Check, ExternalLink, Landmark, Plane, Route, Users } from 'lucide-react';
import PlaceAutocompleteInput from './PlaceAutocompleteInput';

const TASKS = [
  { id: 'documents', fr: 'Vérifier les documents de voyage', en: 'Check travel documents' },
  { id: 'currency', fr: 'Préparer la devise locale', en: 'Prepare local currency' },
  { id: 'offline', fr: 'Synchroniser le Travel Pack', en: 'Sync the Travel Pack' },
  { id: 'budget', fr: 'Définir le budget du séjour', en: 'Set the trip budget' },
  { id: 'cash', fr: 'Prévoir le cash à l’arrivée', en: 'Plan arrival cash' },
  { id: 'connection', fr: 'Préparer la connexion mobile', en: 'Prepare mobile connectivity' },
];

export default function TripPreparation({ country, lang = 'fr', activeTrip = null }) {
  const fr = lang === 'fr';
  const storageKey = country?.code ? `kiwango_departure_plan_${country.code}` : null;
  const [origin, setOrigin] = useState('');
  const [originPlace, setOriginPlace] = useState(null);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travellers, setTravellers] = useState('1');
  const [completed, setCompleted] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const plan = JSON.parse(localStorage.getItem(storageKey));
      const matchingTrip = activeTrip?.destinationCode === country?.code ? activeTrip : null;
      setOrigin(plan?.origin || matchingTrip?.originName || '');
      setOriginPlace(plan?.originPlace || matchingTrip?.originPlace || null);
      setDepartureDate(plan?.departureDate || matchingTrip?.departureDate || '');
      setReturnDate(plan?.returnDate || matchingTrip?.returnDate || '');
      setTravellers(String(plan?.travellers || 1));
      setCompleted(Array.isArray(plan?.completed) ? plan.completed : []);
    } catch {
      const matchingTrip = activeTrip?.destinationCode === country?.code ? activeTrip : null;
      setOrigin(matchingTrip?.originName || '');
      setOriginPlace(matchingTrip?.originPlace || null);
      setDepartureDate(matchingTrip?.departureDate || '');
      setReturnDate(matchingTrip?.returnDate || '');
      setTravellers('1');
      setCompleted([]);
    }
    setSaved(false);
  }, [storageKey, activeTrip, country?.code]);

  const progress = useMemo(() => Math.round((completed.length / TASKS.length) * 100), [completed]);

  if (!country) return null;

  const toggleTask = (id) => {
    setSaved(false);
    setCompleted((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };

  const savePlan = () => {
    if (!origin.trim() || !departureDate || !storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify({
      origin: origin.trim(),
      originPlace,
      destination: country.name,
      destinationCode: country.code,
      departureDate,
      returnDate,
      travellers: Math.max(1, Number(travellers) || 1),
      completed,
      updatedAt: Date.now(),
    }));
    if (activeTrip?.destinationCode === country.code) {
      localStorage.setItem('kiwango_active_trip', JSON.stringify({
        ...activeTrip,
        originName: origin.trim(),
        originPlace,
        departureDate,
        returnDate,
        updatedAt: Date.now(),
      }));
    }
    setSaved(true);
  };

  const valid = origin.trim() && departureDate;
  const mapsSearch = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query} ${country.name}`)}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin.trim())}&destination=${encodeURIComponent(country.name)}`;

  return (
    <section className="mt-6 min-w-0 border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[.03]">
      <div className="grid lg:grid-cols-[.78fr_1.22fr]">
        <div className="border-b border-slate-200 p-5 sm:p-7 lg:border-b-0 lg:border-r dark:border-white/10">
          <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-emerald-700">{fr ? 'Préparer le départ' : 'Prepare departure'}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-.035em]">{fr ? `Votre trajet vers ${country.name}` : `Your trip to ${country.name}`}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{fr ? 'Recherchez votre point de départ avec Google Maps, indiquez vos dates et conservez ce plan uniquement sur cet appareil.' : 'Find your departure point with Google Maps, add your dates and keep this plan only on this device.'}</p>

          <div className="mt-6 space-y-4">
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">{fr ? 'Ville ou pays de départ' : 'Departure city or country'}</span><PlaceAutocompleteInput value={origin} selectedPlace={originPlace} lang={lang} onChange={(nextValue, place) => { setOrigin(nextValue); setOriginPlace(place); setSaved(false); }} /></label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">{fr ? 'Départ' : 'Departure'}</span><div className="flex items-center gap-2 border border-slate-200 px-3 dark:border-white/10"><CalendarDays className="h-4 w-4 text-slate-400"/><input type="date" value={departureDate} onChange={(event) => { setDepartureDate(event.target.value); setSaved(false); }} className="w-full bg-transparent py-3 text-sm outline-none"/></div></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">{fr ? 'Retour facultatif' : 'Optional return'}</span><input type="date" min={departureDate} value={returnDate} onChange={(event) => { setReturnDate(event.target.value); setSaved(false); }} className="w-full border border-slate-200 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10"/></label>
            </div>
            <label><span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">{fr ? 'Voyageurs' : 'Travellers'}</span><div className="flex items-center gap-2 border border-slate-200 px-3.5 dark:border-white/10"><Users className="h-4 w-4 text-slate-400"/><input type="number" min="1" max="20" value={travellers} onChange={(event) => { setTravellers(event.target.value); setSaved(false); }} className="w-full bg-transparent py-3 text-sm outline-none"/></div></label>
          </div>

          <button type="button" onClick={savePlan} disabled={!valid} className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40">
            <Plane className="h-4 w-4"/>{saved ? (fr ? 'Plan enregistré' : 'Plan saved') : (fr ? 'Enregistrer le départ' : 'Save departure')}
          </button>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{fr ? 'Liste de préparation' : 'Preparation checklist'}</p><h3 className="mt-2 text-xl font-semibold">{fr ? 'Les essentiels avant de partir' : 'Essentials before leaving'}</h3></div>
            <strong className="text-2xl text-emerald-700">{progress}%</strong>
          </div>
          <div className="mt-4 h-1.5 bg-slate-100 dark:bg-white/10"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }}/></div>
          <div className="mt-5 divide-y divide-slate-200 dark:divide-white/10">
            {TASKS.map((task) => {
              const checked = completed.includes(task.id);
              return <button key={task.id} type="button" onClick={() => toggleTask(task.id)} aria-pressed={checked} className="flex w-full items-center gap-3 py-4 text-left"><span className={`flex h-6 w-6 items-center justify-center border ${checked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 text-transparent dark:border-white/20'}`}><Check className="h-4 w-4"/></span><span className={`text-sm font-medium ${checked ? 'text-slate-400 line-through' : ''}`}>{fr ? task.fr : task.en}</span></button>;
            })}
          </div>
          <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/10">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{fr ? `Raccourcis utiles pour ${country.name}` : `Useful shortcuts for ${country.name}`}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{fr ? 'Ouvrez directement Google Maps pour préparer votre itinéraire et repérer les services financiers essentiels. Kiwango ne reçoit aucune commission.' : 'Open Google Maps directly to prepare your route and find essential financial services. Kiwango receives no commission.'}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <a href={directionsUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-2 border border-slate-200 px-3 py-3 text-xs font-semibold transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-white/10 dark:hover:bg-emerald-950/20"><Route className="h-4 w-4 text-emerald-700" />{fr ? 'Itinéraire' : 'Directions'}<ExternalLink className="ml-auto h-3 w-3 text-slate-300" /></a>
              <a href={mapsSearch(fr ? 'distributeur automatique banque' : 'ATM bank')} target="_blank" rel="noreferrer" className="group flex items-center gap-2 border border-slate-200 px-3 py-3 text-xs font-semibold transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-white/10 dark:hover:bg-emerald-950/20"><Landmark className="h-4 w-4 text-emerald-700" />{fr ? 'DAB & banques' : 'ATMs & banks'}<ExternalLink className="ml-auto h-3 w-3 text-slate-300" /></a>
              <a href={mapsSearch(fr ? 'bureau de change' : 'currency exchange')} target="_blank" rel="noreferrer" className="group flex items-center gap-2 border border-slate-200 px-3 py-3 text-xs font-semibold transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-white/10 dark:hover:bg-emerald-950/20"><Banknote className="h-4 w-4 text-emerald-700" />{fr ? 'Bureaux de change' : 'Exchange offices'}<ExternalLink className="ml-auto h-3 w-3 text-slate-300" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
