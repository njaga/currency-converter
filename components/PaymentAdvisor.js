import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Banknote,
  Check,
  ChevronDown,
  CreditCard,
  Landmark,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  WalletCards,
  WifiOff,
} from 'lucide-react';

import { calculateCrossRate } from '../lib/rates';
import { calculatePaymentOptions, DEFAULT_PAYMENT_FEES } from '../lib/payment-advisor';

const STORAGE_KEY = 'kiwango_payment_advisor_v1';

const DEFAULT_FORM = {
  cardMarkup: String(DEFAULT_PAYMENT_FEES.card.markupPct),
  cardFixed: String(DEFAULT_PAYMENT_FEES.card.fixedFeeHome),
  atmMarkup: String(DEFAULT_PAYMENT_FEES.atm.markupPct),
  atmFixed: String(DEFAULT_PAYMENT_FEES.atm.fixedFeeHome),
  atmLocal: String(DEFAULT_PAYMENT_FEES.atm.localFee),
  exchangeSpread: String(DEFAULT_PAYMENT_FEES.exchange.spreadPct),
  exchangeRate: '',
  exchangeFixed: String(DEFAULT_PAYMENT_FEES.exchange.fixedFeeHome),
  dccMarkup: String(DEFAULT_PAYMENT_FEES.dcc.markupPct),
  dccFixed: String(DEFAULT_PAYMENT_FEES.dcc.fixedFeeHome),
};

const COPY = {
  fr: {
    eyebrow: 'Kiwango Pay Advisor',
    title: 'Quelle est la meilleure façon de payer ?',
    intro: 'Comparez le coût réel de la carte, du DAB, du change et de la conversion du terminal avant de choisir.',
    amount: 'Montant à payer sur place',
    home: 'Votre devise',
    local: 'Devise locale',
    reference: 'Référence du marché',
    noRate: 'Le taux de cette paire n’est pas encore disponible. Connectez-vous pour le synchroniser.',
    assumptions: 'Ajuster vos frais',
    assumptionsHelp: 'Renseignez les tarifs de votre banque ou de votre carte pour une recommandation plus précise.',
    saved: 'Enregistrés uniquement sur cet appareil',
    percentage: 'Marge (%)',
    fixedHome: 'Frais fixes',
    localFee: 'Frais du DAB',
    spread: 'Écart estimé (%)',
    offeredRate: 'Taux proposé (facultatif)',
    card: 'Payer par carte',
    cardHelp: 'Conversion par votre banque ou votre carte.',
    atm: 'Retirer au DAB',
    atmHelp: 'Retrait puis paiement en espèces.',
    exchange: 'Bureau de change',
    exchangeHelp: 'Espèces changées avant le paiement.',
    dcc: 'Conversion du terminal (DCC)',
    dccHelp: 'Le terminal convertit directement dans votre devise.',
    resultEyebrow: 'Recommandation',
    bestPrefix: 'Pour cette dépense, choisissez',
    total: 'Coût total estimé',
    saves: 'Économie possible face à l’option la plus chère',
    ranking: 'Comparaison complète',
    market: 'au taux du marché',
    extra: 'de plus que le marché',
    best: 'Meilleur choix',
    estimated: 'estimation',
    dccWarningTitle: 'Refusez la conversion dynamique quand c’est possible.',
    dccWarning: 'Au terminal ou au DAB, choisissez la devise locale. Votre banque fera la conversion, généralement à un coût plus lisible que la DCC.',
    disclaimer: 'Estimation indicative : vérifiez toujours les frais réels de votre banque, de votre carte et du DAB avant l’opération.',
    offline: 'Taux hors connexion',
    synced: 'Taux synchronisé',
  },
  en: {
    eyebrow: 'Kiwango Pay Advisor',
    title: 'What is the best way to pay?',
    intro: 'Compare the real cost of card, ATM, cash exchange and terminal conversion before choosing.',
    amount: 'Amount to pay locally',
    home: 'Your currency',
    local: 'Local currency',
    reference: 'Market reference',
    noRate: 'This pair is not available yet. Connect to synchronise its rate.',
    assumptions: 'Adjust your fees',
    assumptionsHelp: 'Enter your bank or card pricing for a more accurate recommendation.',
    saved: 'Saved only on this device',
    percentage: 'Markup (%)',
    fixedHome: 'Fixed fee',
    localFee: 'ATM fee',
    spread: 'Estimated spread (%)',
    offeredRate: 'Offered rate (optional)',
    card: 'Pay by card',
    cardHelp: 'Your bank or card handles the conversion.',
    atm: 'Withdraw at an ATM',
    atmHelp: 'Withdraw cash, then pay with it.',
    exchange: 'Exchange office',
    exchangeHelp: 'Exchange cash before paying.',
    dcc: 'Terminal conversion (DCC)',
    dccHelp: 'The terminal converts directly into your currency.',
    resultEyebrow: 'Recommendation',
    bestPrefix: 'For this purchase, choose',
    total: 'Estimated total cost',
    saves: 'Potential saving versus the most expensive option',
    ranking: 'Full comparison',
    market: 'at the market rate',
    extra: 'above the market rate',
    best: 'Best option',
    estimated: 'estimate',
    dccWarningTitle: 'Decline dynamic conversion whenever possible.',
    dccWarning: 'At a terminal or ATM, choose the local currency. Your bank will convert it, usually at a clearer cost than DCC.',
    disclaimer: 'Indicative estimate: always check the actual fees charged by your bank, card and ATM before the transaction.',
    offline: 'Offline rate',
    synced: 'Synced rate',
  },
};

const METHOD_META = {
  card: { icon: CreditCard, tint: 'bg-blue-50 text-blue-700 dark:bg-blue-950/35 dark:text-blue-300' },
  atm: { icon: Landmark, tint: 'bg-violet-50 text-violet-700 dark:bg-violet-950/35 dark:text-violet-300' },
  exchange: { icon: Banknote, tint: 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-300' },
  dcc: { icon: ReceiptText, tint: 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-300' },
};

function parseNumber(value) {
  if (typeof value === 'number') return value;
  const normalized = String(value ?? '').replace(/\s/g, '').replace(',', '.');
  return normalized === '' ? 0 : Number(normalized);
}

function NumberField({ label, value, onChange, suffix, placeholder = '0' }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[.11em] text-slate-400">{label}</span>
      <span className="flex min-w-0 items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/10 dark:border-white/10 dark:bg-slate-950/50">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-sm font-semibold outline-none"
        />
        {suffix && <span className="ml-2 flex-none text-xs font-medium text-slate-400">{suffix}</span>}
      </span>
    </label>
  );
}

function CurrencySelect({ label, value, currencies, onChange }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[.11em] text-slate-400">{label}</span>
      <span className="relative block">
        <select value={value} onChange={(event) => onChange(event.target.value)} className="h-[42px] w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm font-semibold outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-slate-950/50">
          {currencies.map((currency) => <option key={currency.code} value={currency.code}>{currency.code} · {currency.name}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </span>
    </label>
  );
}

function MethodSettings({ id, copy, form, setField, homeCurrency, localCurrency }) {
  const meta = METHOD_META[id];
  const Icon = meta.icon;
  const fields = {
    card: [
      ['cardMarkup', copy.percentage, '%'],
      ['cardFixed', copy.fixedHome, homeCurrency],
    ],
    atm: [
      ['atmMarkup', copy.percentage, '%'],
      ['atmFixed', copy.fixedHome, homeCurrency],
      ['atmLocal', copy.localFee, localCurrency],
    ],
    exchange: [
      ['exchangeSpread', copy.spread, '%'],
      ['exchangeRate', copy.offeredRate, `${localCurrency}/1 ${homeCurrency}`],
      ['exchangeFixed', copy.fixedHome, homeCurrency],
    ],
    dcc: [
      ['dccMarkup', copy.percentage, '%'],
      ['dccFixed', copy.fixedHome, homeCurrency],
    ],
  }[id];

  return (
    <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-slate-50/65 p-4 dark:border-white/10 dark:bg-white/[.025]">
      <div className="flex items-start gap-3">
        <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-xl ${meta.tint}`}><Icon className="h-4 w-4" /></span>
        <div className="min-w-0"><h3 className="text-sm font-semibold">{copy[id]}</h3><p className="mt-0.5 text-xs leading-5 text-slate-500">{copy[`${id}Help`]}</p></div>
      </div>
      <div className={`mt-4 grid gap-3 ${fields.length > 2 ? 'sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3' : 'grid-cols-2'}`}>
        {fields.map(([key, label, suffix]) => <NumberField key={key} label={label} value={form[key]} onChange={(value) => setField(key, value)} suffix={suffix} />)}
      </div>
    </div>
  );
}

export default function PaymentAdvisor({
  allRates = {},
  fromCurrency = 'EUR',
  toCurrency = 'XOF',
  currencies = [],
  lang = 'fr',
  isOffline = false,
  lastUpdated = null,
}) {
  const copy = COPY[lang] || COPY.fr;
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  const [amount, setAmount] = useState('10000');
  const [homeCurrency, setHomeCurrency] = useState(fromCurrency);
  const [localCurrency, setLocalCurrency] = useState(toCurrency);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    setHomeCurrency(fromCurrency);
    setLocalCurrency(toCurrency);
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved === 'object') setForm((current) => ({ ...current, ...saved }));
    } catch {}
    setSettingsLoaded(true);
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form, settingsLoaded]);

  const marketRate = useMemo(
    () => calculateCrossRate(homeCurrency, localCurrency, allRates, 'EUR'),
    [homeCurrency, localCurrency, allRates],
  );

  const result = useMemo(() => calculatePaymentOptions({
    amountLocal: parseNumber(amount),
    marketRate,
    card: { markupPct: parseNumber(form.cardMarkup), fixedFeeHome: parseNumber(form.cardFixed) },
    atm: { markupPct: parseNumber(form.atmMarkup), fixedFeeHome: parseNumber(form.atmFixed), localFee: parseNumber(form.atmLocal) },
    exchange: { spreadPct: parseNumber(form.exchangeSpread), offeredRate: parseNumber(form.exchangeRate), fixedFeeHome: parseNumber(form.exchangeFixed) },
    dcc: { markupPct: parseNumber(form.dccMarkup), fixedFeeHome: parseNumber(form.dccFixed) },
  }), [amount, marketRate, form]);

  const formatMoney = (value, currency = homeCurrency) => new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
    maximumFractionDigits: 2,
  }).format(value || 0);
  const formatNumber = (value, maximumFractionDigits = 4) => new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value || 0);
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const bestLabel = result.best ? copy[result.best.id] : '';

  return (
    <section className="min-w-0" aria-labelledby="payment-advisor-title">
      <div className="relative overflow-hidden rounded-[30px] border border-emerald-100 bg-[linear-gradient(135deg,#f0fdf7_0%,#ffffff_55%,#f8fafc_100%)] px-5 py-7 sm:px-8 sm:py-9 dark:border-emerald-900/50 dark:bg-[linear-gradient(135deg,#06251b_0%,#07110d_58%,#020617_100%)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.12em] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"><WalletCards className="h-3.5 w-3.5" />{copy.eyebrow}</span>
          <h1 id="payment-advisor-title" className="mt-5 text-3xl font-semibold leading-tight tracking-[-.045em] sm:text-4xl">{copy.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">{copy.intro}</p>
        </div>
      </div>

      <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[.88fr_1.12fr] xl:items-start">
        <div className="min-w-0 space-y-6">
          <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,.05)] sm:p-6 dark:border-white/10 dark:bg-white/[.035]">
            <NumberField label={copy.amount} value={amount} onChange={setAmount} suffix={localCurrency} placeholder="10 000" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <CurrencySelect label={copy.home} value={homeCurrency} currencies={currencies} onChange={setHomeCurrency} />
              <CurrencySelect label={copy.local} value={localCurrency} currencies={currencies} onChange={setLocalCurrency} />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs dark:border-white/10">
              <span className="text-slate-500">{copy.reference}</span>
              {marketRate ? <span className="font-semibold">1 {homeCurrency} = {formatNumber(marketRate)} {localCurrency}</span> : <span className="text-amber-700 dark:text-amber-300">{copy.noRate}</span>}
            </div>
            {marketRate && <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${isOffline ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-300'}`}>{isOffline ? <WifiOff className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}{isOffline ? copy.offline : copy.synced}{lastUpdated ? ` · ${new Date(lastUpdated).toLocaleDateString(locale)}` : ''}</div>}
          </div>

          <details open className="group rounded-[26px] border border-slate-200/80 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-white/[.035]">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <span><span className="block text-lg font-semibold tracking-[-.025em]">{copy.assumptions}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{copy.assumptionsHelp}</span></span>
              <ChevronDown className="mt-1 h-5 w-5 flex-none text-slate-400 transition group-open:rotate-180" />
            </summary>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              {['card', 'atm', 'exchange', 'dcc'].map((id) => <MethodSettings key={id} id={id} copy={copy} form={form} setField={setField} homeCurrency={homeCurrency} localCurrency={localCurrency} />)}
            </div>
            <p className="mt-4 flex items-center gap-2 text-[11px] text-slate-400"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />{copy.saved}</p>
          </details>
        </div>

        <div className="min-w-0 space-y-5 xl:sticky xl:top-24">
          {result.best ? <>
            <div className="overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_24px_65px_rgba(15,23,42,.18)] sm:p-7 dark:border dark:border-white/10">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-emerald-300"><Sparkles className="h-4 w-4" />{copy.resultEyebrow}</div>
              <p className="mt-5 text-sm text-slate-300">{copy.bestPrefix}</p>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
                <h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-[-.04em] text-white">{bestLabel}</h2>
                <div className="text-right"><p className="text-[10px] uppercase tracking-[.12em] text-slate-400">{copy.total}</p><p className="mt-1 text-2xl font-semibold text-emerald-300">{formatMoney(result.best.cost)}</p></div>
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5 text-sm"><span className="text-slate-300">{copy.saves}</span><strong className="flex-none text-emerald-300">{formatMoney(result.savingsVsWorst)}</strong></div>
            </div>

            <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-white/[.035]">
              <h2 className="text-lg font-semibold tracking-[-.025em]">{copy.ranking}</h2>
              <p className="mt-1 text-xs text-slate-500">{formatMoney(result.referenceCost)} {copy.market}</p>
              <div className="mt-5 space-y-3">
                {result.options.map((item, index) => {
                  const meta = METHOD_META[item.id];
                  const Icon = meta.icon;
                  const isBest = index === 0;
                  return <article key={item.id} className={`relative flex min-w-0 items-center gap-3 rounded-2xl border p-4 transition ${isBest ? 'border-emerald-300 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-950/20' : 'border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-white/[.02]'}`}>
                    <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl ${meta.tint}`}><Icon className="h-[18px] w-[18px]" /></span>
                    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold">{copy[item.id]}</h3>{isBest && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[.08em] text-white"><Check className="h-2.5 w-2.5" />{copy.best}</span>}</div><p className="mt-1 text-[11px] text-slate-500">+{formatMoney(item.extra)} · {formatNumber(item.extraPct, 1)}% {copy.extra}{item.isEstimatedRate ? ` · ${copy.estimated}` : ''}</p></div>
                    <div className="flex-none text-right"><span className="block text-[10px] font-semibold text-slate-400">#{index + 1}</span><strong className="mt-1 block text-sm">{formatMoney(item.cost)}</strong></div>
                  </article>;
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-100">
              <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-amber-600" /><div><h2 className="text-sm font-semibold">{copy.dccWarningTitle}</h2><p className="mt-2 text-xs leading-5 text-amber-900/75 dark:text-amber-200/75">{copy.dccWarning}</p></div></div>
            </div>
          </> : <div className="rounded-[26px] border border-dashed border-amber-300 bg-amber-50/65 p-8 text-center dark:border-amber-900/60 dark:bg-amber-950/20"><AlertTriangle className="mx-auto h-6 w-6 text-amber-600" /><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-amber-900 dark:text-amber-200">{copy.noRate}</p></div>}
          <p className="px-2 text-[11px] leading-5 text-slate-400">{copy.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
