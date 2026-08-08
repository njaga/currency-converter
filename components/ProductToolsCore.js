import React, { useMemo, useRef, useState } from 'react';
import { Bell, Calculator, Camera, CircleDollarSign, Landmark, MapPin, PiggyBank, ReceiptText, ScanLine, WalletCards } from 'lucide-react';
import { calculateCrossRate } from '../lib/rates';

const TOOL_ITEMS = [
  ['rate-check', 'Vérifier un taux', CircleDollarSign],
  ['fees', 'Frais réels', ReceiptText],
  ['budget', 'Budget', PiggyBank],
  ['wallet', 'Cash Wallet', WalletCards],
  ['calculator', 'Calculatrice', Calculator],
  ['atm', 'Retrait ATM', Landmark],
  ['alerts', 'Alertes', Bell],
  ['scan', 'Scan & Convert', ScanLine],
  ['field', 'Taux terrain', MapPin],
];

const read = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const write = (key, value) => { if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value)); };
const number = (v) => Number(String(v ?? '').replace(/\s/g, '').replace(',', '.'));
const fmt = (n, locale = 'fr-FR', digits = 2) => Number.isFinite(n) ? new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(n) : '—';

function safeCalculate(expression) {
  const tokens = String(expression).replace(/\s+/g, '').match(/\d+(?:\.\d+)?|[()+\-*/]/g);
  if (!tokens || tokens.join('') !== String(expression).replace(/\s+/g, '')) return null;
  let i = 0;
  const parseExpression = () => {
    let value = parseTerm();
    while (tokens[i] === '+' || tokens[i] === '-') { const op = tokens[i++]; const rhs = parseTerm(); value = op === '+' ? value + rhs : value - rhs; }
    return value;
  };
  const parseTerm = () => {
    let value = parseFactor();
    while (tokens[i] === '*' || tokens[i] === '/') { const op = tokens[i++]; const rhs = parseFactor(); value = op === '*' ? value * rhs : value / rhs; }
    return value;
  };
  const parseFactor = () => {
    if (tokens[i] === '-') { i += 1; return -parseFactor(); }
    if (tokens[i] === '(') { i += 1; const value = parseExpression(); if (tokens[i] !== ')') throw new Error('parenthesis'); i += 1; return value; }
    const value = Number(tokens[i++]); if (!Number.isFinite(value)) throw new Error('number'); return value;
  };
  try { const result = parseExpression(); return i === tokens.length && Number.isFinite(result) ? result : null; } catch { return null; }
}

function Shell({ title, subtitle, children }) {
  return <section className="min-w-0 rounded-[28px] border border-slate-200/80 bg-white/85 p-5 shadow-[0_18px_55px_rgba(15,23,42,.05)] sm:p-7 dark:border-white/10 dark:bg-white/[.035]"><div className="mb-6"><h2 className="text-2xl font-semibold tracking-[-.035em]">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{subtitle}</p></div>{children}</section>;
}
const Input = (props) => <input {...props} className={`w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-slate-950 ${props.className || ''}`} />;
const Select = ({ children, ...props }) => <select {...props} className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-slate-950">{children}</select>;

export default function ProductTools({ allRates = {}, fromCurrency = 'EUR', toCurrency = 'XOF', currencies = [], lang = 'fr' }) {
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  const [tool, setTool] = useState('rate-check');
  const [base, setBase] = useState(fromCurrency);
  const [quote, setQuote] = useState(toCurrency);
  const marketRate = useMemo(() => calculateCrossRate(base, quote, allRates, 'EUR'), [base, quote, allRates]);
  const options = currencies.map((c) => <option key={c.code} value={c.code}>{c.code} · {c.name}</option>);

  return <div className="min-w-0"><div className="mb-6"><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-400">Kiwango tools</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">Gérez l’argent du voyage, pas seulement la conversion.</h1></div><div className="grid min-w-0 gap-6 lg:grid-cols-[230px_minmax(0,1fr)]"><aside className="min-w-0"><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:sticky lg:top-24 lg:grid-cols-1">{TOOL_ITEMS.map(([id,label,Icon]) => <button key={id} onClick={() => setTool(id)} className={`flex min-w-0 items-center gap-2.5 rounded-2xl px-3 py-3 text-left text-xs font-medium transition ${tool === id ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-white/[.035] dark:text-slate-300 dark:hover:bg-white/[.07]'}`}><Icon className="h-4 w-4 flex-none"/><span className="truncate">{label}</span></button>)}</div></aside><div className="min-w-0">
    {tool === 'rate-check' && <RateCheck marketRate={marketRate} base={base} quote={quote} setBase={setBase} setQuote={setQuote} options={options} locale={locale}/>} 
    {tool === 'fees' && <FeeCalculator marketRate={marketRate} base={base} quote={quote} setBase={setBase} setQuote={setQuote} options={options} locale={locale}/>} 
    {tool === 'budget' && <Budget locale={locale}/>} 
    {tool === 'wallet' && <CashWallet locale={locale}/>} 
    {tool === 'calculator' && <SmartCalculator marketRate={marketRate} base={base} quote={quote} setBase={setBase} setQuote={setQuote} options={options} locale={locale}/>} 
    {tool === 'atm' && <AtmCalculator marketRate={marketRate} base={base} quote={quote} setBase={setBase} setQuote={setQuote} options={options} locale={locale}/>} 
    {tool === 'alerts' && <RateAlerts allRates={allRates} marketRate={marketRate} base={base} quote={quote} setBase={setBase} setQuote={setQuote} options={options} locale={locale}/>} 
    {tool === 'scan' && <ScanConvert marketRate={marketRate} quote={quote} setQuote={setQuote} options={options} locale={locale}/>} 
    {tool === 'field' && <FieldRates marketRate={marketRate} base={base} quote={quote} setBase={setBase} setQuote={setQuote} options={options} locale={locale}/>} 
  </div></div></div>;
}

function PairFields({ base, quote, setBase, setQuote, options }) { return <div className="grid gap-3 sm:grid-cols-2"><Select value={base} onChange={(e)=>setBase(e.target.value)}>{options}</Select><Select value={quote} onChange={(e)=>setQuote(e.target.value)}>{options}</Select></div>; }

function RateCheck({ marketRate, base, quote, setBase, setQuote, options, locale }) {
  const [offered, setOffered] = useState(''); const [amount, setAmount] = useState('100');
  const offer = number(offered), amt = number(amount); const diff = Number.isFinite(offer) && marketRate ? ((offer-marketRate)/marketRate)*100 : null; const loss = Number.isFinite(amt) && marketRate && Number.isFinite(offer) ? amt*(marketRate-offer) : null;
  const verdict = diff == null ? null : diff >= -1 ? ['Bon taux','text-emerald-700 bg-emerald-50'] : diff >= -3 ? ['Acceptable','text-amber-700 bg-amber-50'] : ['Défavorable','text-rose-700 bg-rose-50'];
  return <Shell title="Rate Check" subtitle="Comparez le taux proposé par un bureau de change, un hôtel ou un commerçant au taux de référence disponible dans Kiwango."><PairFields {...{base,quote,setBase,setQuote,options}}/><div className="mt-4 grid gap-3 sm:grid-cols-2"><Input value={amount} onChange={(e)=>setAmount(e.target.value)} inputMode="decimal" placeholder={`Montant en ${base}`}/><Input value={offered} onChange={(e)=>setOffered(e.target.value)} inputMode="decimal" placeholder={`Taux proposé : 1 ${base} = ? ${quote}`}/></div><div className="mt-5 rounded-2xl bg-slate-50 p-5 dark:bg-white/[.035]"><p className="text-xs text-slate-500">Taux de référence</p><p className="mt-1 text-xl font-semibold">1 {base} = {fmt(marketRate,locale,4)} {quote}</p>{verdict && <div className="mt-5 flex flex-wrap items-center gap-3"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${verdict[1]}`}>{verdict[0]}</span><span className="text-sm">Écart : <strong>{fmt(diff,locale,2)} %</strong></span>{loss > 0 && <span className="text-sm">Perte estimée : <strong>{fmt(loss,locale,2)} {quote}</strong></span>}</div>}</div></Shell>;
}

function FeeCalculator({ marketRate, base, quote, setBase, setQuote, options, locale }) {
 const [amount,setAmount]=useState('100'); const [pct,setPct]=useState('2'); const [fixed,setFixed]=useState('0'); const a=number(amount), p=number(pct)||0, f=number(fixed)||0; const net=Math.max(0,a-a*p/100-f); const result=marketRate&&Number.isFinite(net)?net*marketRate:null;
 return <Shell title="Montant réellement reçu" subtitle="Ajoutez les commissions fixes et pourcentages pour voir le montant net réellement converti."><PairFields {...{base,quote,setBase,setQuote,options}}/><div className="mt-4 grid gap-3 sm:grid-cols-3"><Input value={amount} onChange={e=>setAmount(e.target.value)} placeholder={`Montant ${base}`}/><Input value={pct} onChange={e=>setPct(e.target.value)} placeholder="Frais %"/><Input value={fixed} onChange={e=>setFixed(e.target.value)} placeholder={`Frais fixes ${base}`}/></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[.035]"><p className="text-xs text-slate-500">Montant net converti</p><p className="mt-1 text-xl font-semibold">{fmt(net,locale)} {base}</p></div><div className="rounded-2xl bg-emerald-50 p-4 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-200"><p className="text-xs opacity-70">Vous recevez environ</p><p className="mt-1 text-xl font-semibold">{fmt(result,locale)} {quote}</p></div></div></Shell>;
}

function Budget({ locale }) {
 const [budget,setBudget]=useState(()=>read('kiwango_budget',{name:'Mon voyage',currency:'XOF',total:150000,expenses:[]})); const [label,setLabel]=useState(''); const [amount,setAmount]=useState(''); const spent=budget.expenses.reduce((s,e)=>s+e.amount,0); const save=(next)=>{setBudget(next);write('kiwango_budget',next)};
 return <Shell title="Budget Voyage" subtitle="Suivez vos dépenses sans compte et gardez-les sur cet appareil, même hors connexion."><div className="grid gap-3 sm:grid-cols-3"><Input value={budget.name} onChange={e=>save({...budget,name:e.target.value})}/><Input value={budget.total} onChange={e=>save({...budget,total:number(e.target.value)||0})} inputMode="decimal"/><Input value={budget.currency} onChange={e=>save({...budget,currency:e.target.value.toUpperCase()})}/></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><Stat label="Budget" value={`${fmt(budget.total,locale)} ${budget.currency}`}/><Stat label="Dépensé" value={`${fmt(spent,locale)} ${budget.currency}`}/><Stat label="Restant" value={`${fmt(budget.total-spent,locale)} ${budget.currency}`}/></div><div className="mt-5 grid gap-2 sm:grid-cols-[1fr_1fr_auto]"><Input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Taxi, restaurant…"/><Input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Montant"/><button onClick={()=>{const a=number(amount);if(!label||!Number.isFinite(a))return;save({...budget,expenses:[{id:Date.now(),label,amount:a},...budget.expenses]});setLabel('');setAmount('')}} className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">Ajouter</button></div><div className="mt-4 divide-y divide-slate-100 dark:divide-white/10">{budget.expenses.slice(0,8).map(e=><div key={e.id} className="flex justify-between gap-3 py-3 text-sm"><span>{e.label}</span><strong>{fmt(e.amount,locale)} {budget.currency}</strong></div>)}</div></Shell>;
}

function CashWallet({ locale }) {
 const [wallet,setWallet]=useState(()=>read('kiwango_wallet',{currency:'GMD',balance:0,entries:[]})); const [amount,setAmount]=useState(''); const [note,setNote]=useState(''); const save=n=>{setWallet(n);write('kiwango_wallet',n)}; const add=(sign)=>{const a=number(amount);if(!Number.isFinite(a))return;save({...wallet,balance:wallet.balance+sign*a,entries:[{id:Date.now(),amount:sign*a,note:note|| (sign>0?'Ajout cash':'Dépense')},...wallet.entries]});setAmount('');setNote('')};
 return <Shell title="Cash Wallet" subtitle="Un portefeuille virtuel pour savoir combien d’espèces il vous reste réellement pendant le voyage."><div className="flex flex-col gap-3 rounded-[24px] bg-slate-950 p-6 text-white sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs text-slate-400">Solde cash estimé</p><p className="mt-2 text-4xl font-semibold tracking-[-.05em]">{fmt(wallet.balance,locale)} <span className="text-lg text-slate-400">{wallet.currency}</span></p></div><Input value={wallet.currency} onChange={e=>save({...wallet,currency:e.target.value.toUpperCase()})} className="max-w-28 !border-white/10 !bg-white/10 !text-white"/></div><div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]"><Input value={note} onChange={e=>setNote(e.target.value)} placeholder="Libellé"/><Input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Montant"/><button onClick={()=>add(1)} className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">+ Cash</button><button onClick={()=>add(-1)} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold dark:bg-white/10">Dépense</button></div><div className="mt-4 divide-y divide-slate-100 dark:divide-white/10">{wallet.entries.slice(0,8).map(e=><div key={e.id} className="flex justify-between py-3 text-sm"><span>{e.note}</span><strong className={e.amount<0?'text-rose-600':'text-emerald-600'}>{e.amount>0?'+':''}{fmt(e.amount,locale)} {wallet.currency}</strong></div>)}</div></Shell>;
}

function SmartCalculator({ marketRate, base, quote, setBase, setQuote, options, locale }) {
 const [expr,setExpr]=useState('450 * 3 + 120'); const result=safeCalculate(expr);
 return <Shell title="Calculatrice multi-devise" subtitle="Calculez une addition de taxi, restaurant ou shopping puis convertissez immédiatement le total."><PairFields {...{base,quote,setBase,setQuote,options}}/><Input value={expr} onChange={e=>setExpr(e.target.value)} className="mt-4 font-mono text-lg"/><div className="mt-5 grid gap-3 sm:grid-cols-2"><Stat label={`Total en ${base}`} value={`${fmt(result,locale)} ${base}`}/><Stat label={`Équivalent en ${quote}`} value={`${fmt(Number.isFinite(result)&&marketRate?result*marketRate:null,locale)} ${quote}`}/></div></Shell>;
}

function AtmCalculator({ marketRate, base, quote, setBase, setQuote, options, locale }) {
 const [need,setNeed]=useState('100000'); const [atmFee,setAtmFee]=useState('0'); const [bankPct,setBankPct]=useState('2'); const target=number(need); const localNeeded=marketRate&&target?target*marketRate:null; const total=localNeeded?localNeeded+(number(atmFee)||0)+localNeeded*(number(bankPct)||0)/100:null;
 return <Shell title="Calculateur de retrait ATM" subtitle="Estimez combien retirer dans la devise locale en incluant les frais du distributeur et de votre banque."><PairFields {...{base,quote,setBase,setQuote,options}}/><div className="mt-4 grid gap-3 sm:grid-cols-3"><Input value={need} onChange={e=>setNeed(e.target.value)} placeholder={`Besoin en ${base}`}/><Input value={atmFee} onChange={e=>setAtmFee(e.target.value)} placeholder={`Frais ATM ${quote}`}/><Input value={bankPct} onChange={e=>setBankPct(e.target.value)} placeholder="Frais banque %"/></div><div className="mt-5 rounded-2xl bg-emerald-50 p-5 dark:bg-emerald-950/20"><p className="text-xs text-emerald-700">Retrait estimé à prévoir</p><p className="mt-1 text-2xl font-semibold">{fmt(total,locale)} {quote}</p></div></Shell>;
}

function RateAlerts({ allRates, marketRate, base, quote, setBase, setQuote, options, locale }) {
 const [alerts,setAlerts]=useState(()=>read('kiwango_alerts',[])); const [target,setTarget]=useState(''); const add=()=>{const t=number(target);if(!Number.isFinite(t))return;const next=[{id:Date.now(),base,quote,target:t},...alerts];setAlerts(next);write('kiwango_alerts',next);setTarget('')};
 return <Shell title="Alertes de taux" subtitle="Kiwango vérifie ces seuils quand l’application est ouverte. Les notifications en arrière-plan nécessiteront ensuite un service push."><PairFields {...{base,quote,setBase,setQuote,options}}/><div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]"><Input value={target} onChange={e=>setTarget(e.target.value)} placeholder={`Alerter quand 1 ${base} ≥ … ${quote}`}/><button onClick={add} className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">Créer</button></div><div className="mt-5 space-y-2">{alerts.map(a=>{const current=calculateCrossRate(a.base,a.quote,allRates,'EUR');const hit=Number.isFinite(current)&&current>=a.target;return <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 p-4 text-sm dark:border-white/10"><span>1 {a.base} ≥ {fmt(a.target,locale,4)} {a.quote}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${hit?'bg-emerald-50 text-emerald-700':'bg-slate-100 text-slate-500 dark:bg-white/10'}`}>{hit?'Seuil atteint':`Actuel : ${fmt(current,locale,4)}`}</span></div>})}</div><p className="mt-4 text-xs text-slate-400">Paire active : 1 {base} = {fmt(marketRate,locale,4)} {quote}</p></Shell>;
}

function ScanConvert({ marketRate, quote, setQuote, options, locale }) {
 const [image,setImage]=useState(null); const [amount,setAmount]=useState(''); const [status,setStatus]=useState('idle'); const fileRef=useRef();
 const handle=async(e)=>{const file=e.target.files?.[0];if(!file)return;setImage(URL.createObjectURL(file));setStatus('manual');if(typeof window!=='undefined'&&'TextDetector' in window){try{setStatus('scanning');const bmp=await createImageBitmap(file);const detector=new window.TextDetector();const blocks=await detector.detect(bmp);const text=blocks.map(b=>b.rawValue).join(' ');const found=text.match(/\d[\d\s.,]*/);if(found)setAmount(found[0]);setStatus('done')}catch{setStatus('manual')}}};
 return <Shell title="Scan & Convert" subtitle="Photographiez une étiquette ou un reçu. Kiwango utilise l’OCR natif si votre navigateur le permet, avec saisie assistée sinon."><div className="grid gap-5 md:grid-cols-2"><button onClick={()=>fileRef.current?.click()} className="flex min-h-52 flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5 text-center dark:border-white/15 dark:bg-white/[.025]"><Camera className="h-7 w-7 text-emerald-600"/><span className="mt-3 text-sm font-semibold">Prendre ou choisir une photo</span><span className="mt-1 text-xs text-slate-500">{status==='scanning'?'Analyse en cours…':'Photo de prix, facture ou reçu'}</span></button><div>{image?<img src={image} alt="Aperçu du prix scanné" className="h-52 w-full rounded-[24px] object-cover"/>:<div className="flex h-52 items-center justify-center rounded-[24px] bg-slate-100 text-xs text-slate-400 dark:bg-white/5">Aperçu</div>}</div></div><input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handle} className="hidden"/><div className="mt-4 grid gap-3 sm:grid-cols-2"><Input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Montant détecté ou saisi"/><Select value={quote} onChange={e=>setQuote(e.target.value)}>{options}</Select></div><div className="mt-4 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/20"><p className="text-xs text-emerald-700">Équivalent avec le taux courant</p><p className="mt-1 text-xl font-semibold">{fmt(number(amount)&&marketRate?number(amount)*marketRate:null,locale)} {quote}</p></div></Shell>;
}

function FieldRates({ marketRate, base, quote, setBase, setQuote, options, locale }) {
 const [entries,setEntries]=useState(()=>read('kiwango_field_rates',[])); const [rate,setRate]=useState(''); const [place,setPlace]=useState(''); const add=()=>{const r=number(rate);if(!Number.isFinite(r)||!place)return;const next=[{id:Date.now(),base,quote,rate:r,place,at:Date.now()},...entries];setEntries(next);write('kiwango_field_rates',next);setRate('');setPlace('')};
 return <Shell title="Taux observés sur le terrain" subtitle="Enregistrez les taux réellement proposés autour de vous. Pour l’instant ils restent privés sur cet appareil ; un partage communautaire demandera un backend modéré."><PairFields {...{base,quote,setBase,setQuote,options}}/><div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><Input value={place} onChange={e=>setPlace(e.target.value)} placeholder="Lieu / bureau de change"/><Input value={rate} onChange={e=>setRate(e.target.value)} placeholder={`1 ${base} = ? ${quote}`}/><button onClick={add} className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">Enregistrer</button></div><p className="mt-4 text-xs text-slate-500">Référence actuelle : 1 {base} = {fmt(marketRate,locale,4)} {quote}</p><div className="mt-3 space-y-2">{entries.slice(0,10).map(e=><div key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 p-4 text-sm dark:border-white/10"><span><strong>{e.place}</strong><span className="ml-2 text-slate-500">{e.base}/{e.quote}</span></span><strong>1 {e.base} = {fmt(e.rate,locale,4)} {e.quote}</strong></div>)}</div></Shell>;
}

function Stat({ label, value }) { return <div className="min-w-0 rounded-2xl bg-slate-50 p-4 dark:bg-white/[.035]"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 break-words text-lg font-semibold">{value}</p></div>; }
