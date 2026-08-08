import React from 'react';

export function TravelRouteIllustration() {
  return <div className="relative h-full min-h-[280px] w-full overflow-hidden rounded-[30px] bg-[#f2f8f4] dark:bg-emerald-950/20">
    <svg viewBox="0 0 620 420" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="routeBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ecfdf5"/><stop offset="1" stopColor="#ffffff"/></linearGradient>
      </defs>
      <rect width="620" height="420" rx="34" fill="url(#routeBg)"/>
      <circle cx="465" cy="180" r="122" fill="#10b981" opacity=".07"/>
      <circle cx="465" cy="180" r="90" fill="none" stroke="#10b981" strokeWidth="2" opacity=".16"/>
      <path d="M92 320C188 248 255 306 330 236c51-48 62-103 130-126" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeDasharray="9 11" opacity=".38"/>
      <circle cx="92" cy="320" r="8" fill="#0f172a"/><circle cx="460" cy="110" r="8" fill="#10b981"/>
      <path d="M444 96c0-17 14-31 31-31s31 14 31 31c0 24-31 57-31 57s-31-33-31-57Z" fill="#10b981"/><circle cx="475" cy="95" r="10" fill="white"/>
      <path d="m298 242 27 5-14 12 10 12-8 4-17-14-20 6 22-25Z" fill="#0f172a" opacity=".9"/>
      <g transform="translate(78 66)"><rect width="188" height="112" rx="22" fill="white" stroke="#dbe7df"/><text x="20" y="32" fontSize="12" fontFamily="Arial" fill="#64748b">DESTINATION</text><text x="20" y="62" fontSize="22" fontWeight="700" fontFamily="Arial" fill="#0f172a">Gambie</text><text x="20" y="88" fontSize="14" fontFamily="Arial" fill="#059669">GMD · prêt hors ligne</text></g>
    </svg>
  </div>;
}

export function RateCheckIllustration() {
  return <div className="relative h-full min-h-[300px] overflow-hidden rounded-[30px] bg-slate-950 text-white">
    <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl"/>
    <div className="relative mx-auto mt-8 w-[82%] max-w-[360px] rounded-[28px] border border-white/10 bg-white/[.07] p-5 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between"><div><p className="text-[11px] uppercase tracking-[.14em] text-slate-400">Rate Check</p><p className="mt-1 text-lg font-semibold">100 EUR → GMD</p></div><span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">Bon taux</span></div>
      <div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/[.06] p-4"><p className="text-xs text-slate-400">Référence</p><p className="mt-2 text-xl font-semibold">7 820 GMD</p></div><div className="rounded-2xl bg-white/[.06] p-4"><p className="text-xs text-slate-400">Proposé</p><p className="mt-2 text-xl font-semibold">7 700 GMD</p></div></div>
      <div className="mt-3 rounded-2xl bg-emerald-400/10 p-4"><div className="flex items-center justify-between text-sm"><span className="text-slate-300">Écart estimé</span><span className="font-semibold text-emerald-300">−1,5 %</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[78%] rounded-full bg-emerald-400"/></div></div>
    </div>
  </div>;
}

export function OfflinePhoneIllustration() {
  return <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-[30px] bg-[#f5f8f6] dark:bg-white/[.025]">
    <div className="absolute left-8 top-8 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm dark:bg-slate-900">Offline-ready</div>
    <div className="relative w-[220px] rounded-[36px] border-[7px] border-slate-950 bg-white p-3 shadow-[0_30px_70px_rgba(15,23,42,.18)] dark:bg-slate-900">
      <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-slate-200 dark:bg-white/10"/>
      <div className="rounded-[24px] bg-emerald-50 p-4 dark:bg-emerald-950/20"><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-700">Travel Pack</p><p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">Sierra Leone</p><p className="mt-1 text-xs text-slate-500">SLE · synchronisé</p></div>
      <div className="mt-3 space-y-2"><div className="rounded-2xl border border-slate-200 p-3 dark:border-white/10"><p className="text-[10px] text-slate-400">100 SLE</p><p className="mt-1 text-base font-semibold">≈ 2 730 XOF</p></div><div className="rounded-2xl border border-slate-200 p-3 dark:border-white/10"><p className="text-[10px] text-slate-400">500 SLE</p><p className="mt-1 text-base font-semibold">≈ 13 650 XOF</p></div></div>
    </div>
  </div>;
}
