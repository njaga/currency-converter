import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Bell, Calculator, Camera, CircleDollarSign, Landmark, MapPin, PiggyBank, ReceiptText, ScanLine, Trash2, WalletCards } from 'lucide-react';
import { calculateCrossRate } from '../lib/rates';

const TOOLS = [
  { id: 'rate-check', fr: 'Vérifier un taux', en: 'Check a rate', descFr: 'Comparer une offre au taux du marché', descEn: 'Compare an offer with the market rate', icon: CircleDollarSign },
  { id: 'fees', fr: 'Calculer les frais', en: 'Calculate fees', descFr: 'Voir le montant réellement reçu', descEn: 'See the amount actually received', icon: ReceiptText },
  { id: 'budget', fr: 'Budget voyage', en: 'Travel budget', descFr: 'Suivre dépenses et solde restant', descEn: 'Track spending and remaining balance', icon: PiggyBank },
  { id: 'wallet', fr: 'Argent liquide', en: 'Cash wallet', descFr: 'Suivre le cash disponible', descEn: 'Track available cash', icon: WalletCards },
  { id: 'calculator', fr: 'Calculatrice devises', en: 'Currency calculator', descFr: 'Calculer puis convertir un total', descEn: 'Calculate and convert a total', icon: Calculator },
  { id: 'atm', fr: 'Retrait au distributeur', en: 'ATM withdrawal', descFr: 'Estimer frais bancaires et ATM', descEn: 'Estimate bank and ATM fees', icon: Landmark },
  { id: 'alerts', fr: 'Alerte de taux', en: 'Rate alert', descFr: 'Définir un seuil à surveiller', descEn: 'Set a rate threshold', icon: Bell },
  { id: 'scan', fr: 'Scanner un prix', en: 'Scan a price', descFr: 'Lire ou saisir un montant à convertir', descEn: 'Read or enter an amount to convert', icon: ScanLine },
  { id: 'field', fr: 'Taux observé', en: 'Observed rate', descFr: 'Noter une offre trouvée sur place', descEn: 'Save an offer found locally', icon: MapPin },
];

const read = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const write = (key, value) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};
const parseNumber = (value) => {
  const raw = String(value ?? '').trim().replace(/\s/g, '').replace(',', '.');
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};
const positive = (value) => { const n = parseNumber(value); return n !== null && n > 0 ? n : null; };
const nonNegative = (value) => { const n = parseNumber(value); return n !== null && n >= 0 ? n : null; };
const fmt = (value, locale = 'fr-FR', digits = 2) => Number.isFinite(value)
  ? new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(value)
  : '—';

function safeCalculate(expression) {
  const raw = String(expression).replace(/\s+/g, '');
  if (!raw) return null;
  const tokens = raw.match(/\d+(?:\.\d+)?|[()+\-*/]/g);
  if (!tokens || tokens.join('') !== raw) return null;
  let index = 0;
  const factor = () => {
    if (tokens[index] === '-') { index += 1; return -factor(); }
    if (tokens[index] === '(') {
      index += 1;
      const value = expressionParser();
      if (tokens[index] !== ')') throw new Error('parenthesis');
      index += 1;
      return value;
    }
    const value = Number(tokens[index++]);
    if (!Number.isFinite(value)) throw new Error('number');
    return value;
  };
  const term = () => {
    let value = factor();
    while (tokens[index] === '*' || tokens[index] === '/') {
      const op = tokens[index++];
      const rhs = factor();
      if (op === '/' && rhs === 0) throw new Error('division-by-zero');
      value = op === '*' ? value * rhs : value / rhs;
    }
    return value;
  };
  const expressionParser = () => {
    let value = term();
    while (tokens[index] === '+' || tokens[index] === '-') {
      const op = tokens[index++];
      const rhs = term();
      value = op === '+' ? value + rhs : value - rhs;
    }
    return value;
  };
  try {
    const result = expressionParser();
    return index === tokens.length && Number.isFinite(result) ? result : null;
  } catch { return null; }
}

function Shell({ title, subtitle, accent, children }) {
  return <section className="min-w-0 overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,.055)] dark:border-white/10 dark:bg-white/[.035]">
    <div className="border-b border-slate-200/70 p-5 sm:p-7 dark:border-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 className="text-2xl font-semibold tracking-[-.035em]">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p></div>
        {accent}
      </div>
    </div>
    <div className="p-5 sm:p-7">{children}</div>
  </section>;
}
function Input({ label, className = '', value = '', onChange, onBlur, ...props }) {
  const [draft, setDraft] = useState(String(value ?? ''));
  const timerRef = useRef(null);

  useEffect(() => { setDraft(String(value ?? '')); }, [value]);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const commit = (next) => {
    clearTimeout(timerRef.current);
    onChange?.({ target: { value: next } });
  };

  const handleChange = (event) => {
    const next = event.target.value;
    setDraft(next);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => commit(next), 350);
  };

  const handleBlur = (event) => {
    commit(draft);
    onBlur?.(event);
  };

  return <label className="block min-w-0">{label && <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.12em] text-slate-400">{label}</span>}<input {...props} value={draft} onChange={handleChange} onBlur={handleBlur} className={`w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-slate-950 ${className}`} /></label>;
}
function Select({ label, children, ...props }) {
  return <label className="block min-w-0">{label && <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.12em] text-slate-400">{label}</span>}<select {...props} className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-slate-950">{children}</select></label>;
}
function Stat({ label, value, accent = false }) {
  return <div className={`rounded-2xl p-4 ${accent ? 'bg-emerald-50 dark:bg-emerald-950/25' : 'bg-slate-50 dark:bg-white/[.035]'}`}><p className="text-xs text-slate-500">{label}</p><p className="mt-1 break-words text-lg font-semibold">{value}</p></div>;
}
function ErrorNote({ children }) {
  return <div className="mt-4 flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><AlertTriangle className="mt-0.5 h-4 w-4 flex-none"/><span>{children}</span></div>;
}
function Pair({ base, quote, setBase, setQuote, options, lang = 'fr' }) {
  return <div className="grid gap-3 sm:grid-cols-2"><Select label={lang === 'fr' ? 'Devise de départ' : 'From currency'} value={base} onChange={(e) => setBase(e.target.value)}>{options}</Select><Select label={lang === 'fr' ? 'Devise reçue' : 'To currency'} value={quote} onChange={(e) => setQuote(e.target.value)}>{options}</Select></div>;
}

function RateCheck(props) {
  const { marketRate, base, quote, locale, lang } = props;
  const fr = lang !== 'en';
  const [mode, setMode] = useState('rate');
  const [offered, setOffered] = useState('');
  const [amount, setAmount] = useState('100');
  const [received, setReceived] = useState('');
  const amt = positive(amount);
  const receivedValue = positive(received);
  const directRate = positive(offered);
  const offer = mode === 'received' && amt && receivedValue ? receivedValue / amt : mode === 'rate' ? directRate : null;
  const valid = amt && offer && Number.isFinite(marketRate) && marketRate > 0;
  const diff = valid ? ((offer - marketRate) / marketRate) * 100 : null;
  const expected = amt && marketRate ? amt * marketRate : null;
  const loss = valid ? Math.max(0, amt * (marketRate - offer)) : null;
  const verdict = diff === null ? null : diff >= -1 ? (fr ? 'Bon taux' : 'Good rate') : diff >= -3 ? (fr ? 'Acceptable' : 'Fair') : (fr ? 'Défavorable' : 'Poor rate');
  return <Shell title="Rate Check" subtitle={fr ? 'Comparez une offre réelle au taux de référence.' : 'Compare a real offer with the reference rate.'} accent={verdict && <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold dark:bg-white/10">{verdict}</span>}>
    <Pair {...props}/><div className="mt-4 flex flex-wrap gap-2">{[['rate',fr ? 'Je connais le taux' : 'I know the rate'],['received',fr ? 'Je connais le montant reçu' : 'I know the received amount']].map(([id, label]) => <button key={id} onClick={() => setMode(id)} className={`rounded-full px-3 py-2 text-xs font-semibold ${mode === id ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-100 text-slate-500 dark:bg-white/5'}`}>{label}</button>)}</div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2"><Input label={`${fr ? 'Montant donné' : 'Amount given'} (${base})`} value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal"/>{mode === 'rate' ? <Input label={`${fr ? 'Taux proposé' : 'Offered rate'} (1 ${base})`} value={offered} onChange={(e) => setOffered(e.target.value)} inputMode="decimal"/> : <Input label={`${fr ? 'Montant reçu' : 'Amount received'} (${quote})`} value={received} onChange={(e) => setReceived(e.target.value)} inputMode="decimal"/>}</div>
    <div className="mt-5 grid gap-3 sm:grid-cols-3"><Stat label={fr ? 'Référence' : 'Reference'} value={`1 ${base} = ${fmt(marketRate, locale, 4)} ${quote}`}/><Stat label={fr ? 'Attendu' : 'Expected'} value={`${fmt(expected, locale)} ${quote}`} accent/><Stat label={fr ? 'Écart' : 'Difference'} value={diff === null ? '—' : `${diff >= 0 ? '+' : ''}${fmt(diff, locale)} %`}/></div>
    {((mode === 'rate' && offered && directRate === null) || (mode === 'received' && received && receivedValue === null)) && <ErrorNote>{fr ? 'Entrez une valeur strictement positive.' : 'Enter a value greater than zero.'}</ErrorNote>}
    {loss > 0 && <ErrorNote>{fr ? 'Perte estimée' : 'Estimated loss'} : {fmt(loss, locale)} {quote}.</ErrorNote>}
  </Shell>;
}

function Fees(props) {
  const { marketRate, base, quote, locale } = props;
  const [amount, setAmount] = useState('100');
  const [pct, setPct] = useState('2');
  const [fixed, setFixed] = useState('0');
  const a = positive(amount); const pc = nonNegative(pct); const fx = nonNegative(fixed);
  const valid = a !== null && pc !== null && fx !== null;
  const fee = valid ? a * pc / 100 + fx : null;
  const net = valid ? Math.max(0, a - fee) : null;
  const result = net !== null && marketRate ? net * marketRate : null;
  const noFee = a && marketRate ? a * marketRate : null;
  return <Shell title="Frais réels" subtitle="Les commissions négatives sont refusées et les champs incomplets ne produisent plus de faux résultats."><Pair {...props}/><div className="mt-4 grid gap-3 sm:grid-cols-3"><Input label={`Montant (${base})`} value={amount} onChange={(e) => setAmount(e.target.value)}/><Input label="Commission (%)" value={pct} onChange={(e) => setPct(e.target.value)}/><Input label={`Frais fixes (${base})`} value={fixed} onChange={(e) => setFixed(e.target.value)}/></div><div className="mt-3 flex flex-wrap gap-2">{[0,1,2,2.5,3,5].map((value) => <button key={value} onClick={() => setPct(String(value))} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs dark:bg-white/5">{value}%</button>)}</div>{!valid && <ErrorNote>Montant positif requis ; frais et commission doivent être supérieurs ou égaux à zéro.</ErrorNote>}<div className="mt-5 grid gap-3 sm:grid-cols-4"><Stat label="Sans frais" value={`${fmt(noFee, locale)} ${quote}`}/><Stat label="Frais" value={`${fmt(fee, locale)} ${base}`}/><Stat label="Net" value={`${fmt(net, locale)} ${base}`}/><Stat label="Vous recevez" value={`${fmt(result, locale)} ${quote}`} accent/></div></Shell>;
}

function Budget({ locale }) {
  const [budget, setBudget] = useState(() => read('kiwango_budget', { name: 'Mon voyage', currency: 'XOF', total: 150000, expenses: [] }));
  const [label, setLabel] = useState(''); const [amount, setAmount] = useState(''); const [category, setCategory] = useState('Autre');
  const expenses = Array.isArray(budget.expenses) ? budget.expenses : [];
  const total = nonNegative(budget.total) ?? 0;
  const spent = expenses.reduce((sum, item) => sum + (nonNegative(item.amount) ?? 0), 0);
  const save = (next) => { setBudget(next); write('kiwango_budget', next); };
  const add = () => { const value = positive(amount); if (!label.trim() || value === null) return; save({ ...budget, expenses: [{ id: Date.now(), label: label.trim(), category, amount: value }, ...expenses] }); setLabel(''); setAmount(''); };
  return <Shell title="Budget Voyage" subtitle="Ajouts et suppressions persistent localement."><div className="grid gap-3 sm:grid-cols-3"><Input label="Voyage" value={budget.name || ''} onChange={(e) => save({ ...budget, name: e.target.value })}/><Input label="Budget total" value={budget.total ?? ''} onChange={(e) => save({ ...budget, total: nonNegative(e.target.value) ?? 0 })}/><Input label="Devise" value={budget.currency || 'XOF'} onChange={(e) => save({ ...budget, currency: e.target.value.toUpperCase() })}/></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><Stat label="Budget" value={`${fmt(total, locale)} ${budget.currency}`}/><Stat label="Dépensé" value={`${fmt(spent, locale)} ${budget.currency}`}/><Stat label="Restant" value={`${fmt(total - spent, locale)} ${budget.currency}`} accent/></div><div className="mt-5 grid gap-2 sm:grid-cols-[1fr_130px_130px_auto]"><Input label="Dépense" value={label} onChange={(e) => setLabel(e.target.value)}/><Select label="Catégorie" value={category} onChange={(e) => setCategory(e.target.value)}>{['Transport','Repas','Hôtel','Shopping','Activité','Autre'].map((x) => <option key={x}>{x}</option>)}</Select><Input label="Montant" value={amount} onChange={(e) => setAmount(e.target.value)}/><button onClick={add} className="self-end rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">Ajouter</button></div><Rows rows={expenses} currency={budget.currency} locale={locale} remove={(id) => save({ ...budget, expenses: expenses.filter((item) => item.id !== id) })}/></Shell>;
}
function Rows({ rows, currency, locale, remove }) {
  return <div className="mt-5 divide-y divide-slate-100 dark:divide-white/10">{rows.slice(0,12).map((item) => <div key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm"><span className="min-w-0 truncate">{item.label || item.note}</span><span className="flex items-center gap-2"><strong>{fmt(item.amount, locale)} {currency}</strong><button onClick={() => remove(item.id)} className="p-2 text-slate-400"><Trash2 className="h-3.5 w-3.5"/></button></span></div>)}{!rows.length && <p className="py-7 text-center text-sm text-slate-400">Aucun mouvement enregistré.</p>}</div>;
}

function Wallet({ locale }) {
  const [wallet, setWallet] = useState(() => read('kiwango_wallet', { currency: 'GMD', balance: 0, entries: [] }));
  const [amount, setAmount] = useState(''); const [note, setNote] = useState(''); const [error, setError] = useState('');
  const entries = Array.isArray(wallet.entries) ? wallet.entries : [];
  const balance = Number.isFinite(Number(wallet.balance)) ? Number(wallet.balance) : 0;
  const save = (next) => { setWallet(next); write('kiwango_wallet', next); };
  const add = (sign) => { const value = positive(amount); if (value === null) { setError('Entrez un montant positif.'); return; } if (sign < 0 && value > balance) { setError('Cette dépense dépasse le cash disponible.'); return; } setError(''); save({ ...wallet, balance: balance + sign * value, entries: [{ id: Date.now(), amount: sign * value, note: note.trim() || (sign > 0 ? 'Ajout cash' : 'Dépense') }, ...entries] }); setAmount(''); setNote(''); };
  const remove = (id) => { const entry = entries.find((item) => item.id === id); if (!entry) return; save({ ...wallet, balance: balance - Number(entry.amount || 0), entries: entries.filter((item) => item.id !== id) }); };
  return <Shell title="Cash Wallet" subtitle="Une dépense ne peut plus créer un solde cash négatif."><div className="rounded-[26px] bg-slate-950 p-6 text-white"><p className="text-xs text-slate-400">Solde cash</p><p className="mt-2 text-4xl font-semibold">{fmt(balance, locale)} <span className="text-lg text-slate-400">{wallet.currency}</span></p></div><div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]"><Input label="Libellé" value={note} onChange={(e) => setNote(e.target.value)}/><Input label="Montant" value={amount} onChange={(e) => setAmount(e.target.value)}/><button onClick={() => add(1)} className="self-end rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">+ Cash</button><button onClick={() => add(-1)} className="self-end rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold dark:bg-white/10">Dépense</button></div>{error && <ErrorNote>{error}</ErrorNote>}<Rows rows={entries} currency={wallet.currency} locale={locale} remove={remove}/></Shell>;
}

function Calc(props) {
  const { base, quote, marketRate, locale } = props;
  const [expr, setExpr] = useState('450 * 3 + 120');
  const result = safeCalculate(expr);
  const converted = result !== null && marketRate ? result * marketRate : null;
  return <Shell title="Calculatrice multi-devise" subtitle="Expressions arithmétiques simples uniquement ; division par zéro et syntaxe non supportée sont rejetées."><Pair {...props}/><Input label="Expression" value={expr} onChange={(e) => setExpr(e.target.value.replace(',','.'))} className="mt-4 font-mono text-lg"/>{expr.trim() && result === null && <ErrorNote>Expression invalide ou non supportée.</ErrorNote>}<div className="mt-5 grid gap-3 sm:grid-cols-2"><Stat label={`Total en ${base}`} value={`${fmt(result, locale)} ${base}`}/><Stat label={`Équivalent en ${quote}`} value={`${fmt(converted, locale)} ${quote}`} accent/></div></Shell>;
}
function Atm(props) {
  const { base, quote, marketRate, locale } = props;
  const [need, setNeed] = useState('100'); const [atmFee, setAtmFee] = useState('0'); const [bankPct, setBankPct] = useState('2');
  const n = positive(need); const af = nonNegative(atmFee); const bp = nonNegative(bankPct); const valid = n !== null && af !== null && bp !== null;
  const cash = valid && marketRate ? n * marketRate : null; const bank = cash !== null ? cash * bp / 100 : null; const total = cash !== null ? cash + af + bank : null;
  return <Shell title="Retrait ATM" subtitle="Le cash demandé, les frais ATM et les frais bancaires restent séparés."><Pair {...props}/><div className="mt-4 grid gap-3 sm:grid-cols-3"><Input label={`Besoin en ${base}`} value={need} onChange={(e) => setNeed(e.target.value)}/><Input label={`Frais ATM (${quote})`} value={atmFee} onChange={(e) => setAtmFee(e.target.value)}/><Input label="Frais banque (%)" value={bankPct} onChange={(e) => setBankPct(e.target.value)}/></div>{!valid && <ErrorNote>Le besoin doit être positif et les frais ne peuvent pas être négatifs.</ErrorNote>}<div className="mt-5 grid gap-3 sm:grid-cols-4"><Stat label="Cash demandé" value={`${fmt(cash, locale)} ${quote}`}/><Stat label="Frais ATM" value={`${fmt(af, locale)} ${quote}`}/><Stat label="Frais banque" value={`${fmt(bank, locale)} ${quote}`}/><Stat label="Coût total estimé" value={`${fmt(total, locale)} ${quote}`} accent/></div></Shell>;
}

function Alerts(props) {
  const { allRates, base, quote, locale } = props;
  const [alerts, setAlerts] = useState(() => read('kiwango_alerts', []));
  const [target, setTarget] = useState(''); const [direction, setDirection] = useState('above'); const [error, setError] = useState('');
  const save = (next) => { setAlerts(next); write('kiwango_alerts', next); };
  const add = () => { const value = positive(target); if (value === null) { setError('Le seuil doit être strictement positif.'); return; } setError(''); save([{ id: Date.now(), base, quote, target: value, direction }, ...alerts]); setTarget(''); };
  return <Shell title="Alertes de taux" subtitle="Seuils locaux strictement positifs."><Pair {...props}/><div className="mt-4 grid gap-2 sm:grid-cols-[150px_1fr_auto]"><Select label="Condition" value={direction} onChange={(e) => setDirection(e.target.value)}><option value="above">Au-dessus de</option><option value="below">En dessous de</option></Select><Input label={`Seuil en ${quote}`} value={target} onChange={(e) => setTarget(e.target.value)}/><button onClick={add} className="self-end rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">Créer</button></div>{error && <ErrorNote>{error}</ErrorNote>}<div className="mt-5 space-y-2">{alerts.map((alert) => { const current = calculateCrossRate(alert.base, alert.quote, allRates, 'EUR'); const hit = Number.isFinite(current) && (alert.direction === 'below' ? current <= alert.target : current >= alert.target); return <div key={alert.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 text-sm dark:border-white/10"><span><strong>{alert.base}/{alert.quote}</strong> · {alert.direction === 'below' ? '≤' : '≥'} {fmt(alert.target, locale, 4)} · actuel {fmt(current, locale, 4)}</span><span className="flex items-center gap-2"><span className={hit ? 'font-semibold text-emerald-600' : 'text-slate-400'}>{hit ? 'Seuil atteint' : 'En veille'}</span><button onClick={() => save(alerts.filter((item) => item.id !== alert.id))}><Trash2 className="h-4 w-4"/></button></span></div>; })}{!alerts.length && <p className="py-7 text-center text-sm text-slate-400">Aucune alerte locale.</p>}</div></Shell>;
}

function Scan(props) {
  const { base, quote, marketRate, locale } = props;
  const [amount, setAmount] = useState(''); const [status, setStatus] = useState('idle'); const fileRef = useRef();
  const handle = async (event) => { const file = event.target.files?.[0]; if (!file) return; setStatus('manual'); if (typeof window !== 'undefined' && 'TextDetector' in window) { try { setStatus('scanning'); const bitmap = await createImageBitmap(file); const detector = new window.TextDetector(); const blocks = await detector.detect(bitmap); const text = blocks.map((block) => block.rawValue).join(' '); const matches = [...text.matchAll(/\d[\d\s.,]*/g)].map((match) => match[0].trim()).filter(Boolean); if (matches[0]) setAmount(matches[0]); setStatus(matches.length ? 'done' : 'manual'); } catch { setStatus('manual'); } } };
  const value = positive(amount);
  return <Shell title="Scan & Convert" subtitle="Si l’OCR n’est pas disponible, saisissez simplement le montant manuellement."><button onClick={() => fileRef.current?.click()} className="flex min-h-40 w-full flex-col items-center justify-center rounded-[26px] border border-dashed border-slate-300"><Camera className="h-8 w-8"/><span className="mt-2 text-sm font-semibold">Prendre ou choisir une photo</span><span className="text-xs text-slate-500">{status === 'scanning' ? 'Analyse en cours…' : status === 'done' ? 'Montant détecté — vérifiez-le' : 'Saisie manuelle toujours disponible'}</span></button><input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handle} className="hidden"/><div className="mt-4"><Pair {...props}/></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><Input label={`Montant (${base})`} value={amount} onChange={(e) => setAmount(e.target.value)}/><Stat label="Équivalent" value={`${fmt(value && marketRate ? value * marketRate : null, locale)} ${quote}`} accent/></div></Shell>;
}

function Field(props) {
  const { base, quote, marketRate, locale } = props;
  const [entries, setEntries] = useState(() => read('kiwango_field_rates', [])); const [rate, setRate] = useState(''); const [place, setPlace] = useState(''); const [note, setNote] = useState(''); const [error, setError] = useState('');
  const save = (next) => { setEntries(next); write('kiwango_field_rates', next); };
  const add = () => { const value = positive(rate); if (value === null || !place.trim()) { setError('Indiquez un lieu et un taux strictement positif.'); return; } setError(''); save([{ id: Date.now(), base, quote, rate: value, place: place.trim(), note: note.trim() }, ...entries]); setRate(''); setPlace(''); setNote(''); };
  return <Shell title="Taux terrain" subtitle="Enregistrez uniquement des taux réels strictement positifs."><Pair {...props}/><div className="mt-4 grid gap-3 sm:grid-cols-2"><Input label="Lieu" value={place} onChange={(e) => setPlace(e.target.value)}/><Input label={`Taux observé (1 ${base})`} value={rate} onChange={(e) => setRate(e.target.value)}/></div><div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]"><Input label="Note" value={note} onChange={(e) => setNote(e.target.value)}/><button onClick={add} className="self-end rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">Enregistrer</button></div>{error && <ErrorNote>{error}</ErrorNote>}<div className="mt-5 space-y-2">{entries.slice(0,12).map((entry) => { const delta = entry.base === base && entry.quote === quote && marketRate ? ((entry.rate - marketRate) / marketRate) * 100 : null; return <div key={entry.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 text-sm dark:border-white/10"><span className="min-w-0"><strong className="block truncate">{entry.place}</strong><span className="text-xs text-slate-500">1 {entry.base} = {fmt(entry.rate, locale, 4)} {entry.quote}{delta !== null ? ` · ${delta >= 0 ? '+' : ''}${fmt(delta, locale)}% vs référence` : ''}</span></span><button onClick={() => save(entries.filter((item) => item.id !== entry.id))}><Trash2 className="h-4 w-4"/></button></div>; })}{!entries.length && <p className="py-7 text-center text-sm text-slate-400">Aucun taux terrain enregistré.</p>}</div></Shell>;
}
