import React from 'react';

export function TravelRouteIllustration() {
  return <div className="relative min-h-[420px] overflow-hidden rounded-[34px] bg-[#f4f8f5] dark:bg-[#0b1712]">
    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/70 to-transparent dark:from-white/[.025]"/>
    <svg viewBox="0 0 620 470" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <path d="M74 382C160 306 244 357 315 283c65-68 67-151 171-185" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 12" opacity=".34"/>
      <circle cx="75" cy="382" r="7" fill="#0f172a"/><circle cx="486" cy="98" r="7" fill="#10b981"/>
      <circle cx="470" cy="139" r="104" fill="#10b981" opacity=".055"/><circle cx="470" cy="139" r="73" fill="none" stroke="#10b981" strokeWidth="2" opacity=".14"/>
      <path d="m286 291 31 4-15 13 10 14-9 4-17-15-24 8 24-28Z" fill="#0f172a" opacity=".88"/>
    </svg>
    <div className="absolute left-[7%] top-[12%] w-[46%] max-w-[250px] rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,.08)] dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Destination</p><p className="mt-2 text-xl font-semibold tracking-[-.03em]">Gambie</p><p className="mt-1 text-xs text-slate-400">Banjul · GMD</p></div><span className="text-2xl">🇬🇲</span></div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs dark:border-white/10"><span className="text-slate-400">Travel Pack</span><span className="font-semibold text-emerald-700">Prêt hors ligne</span></div>
    </div>
    <div className="absolute bottom-[9%] right-[7%] w-[48%] max-w-[260px] rounded-[24px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_22px_60px_rgba(15,23,42,.1)] backdrop-blur dark:border-white/10 dark:bg-slate-900/95">
      <div className="flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Repères rapides</p><span className="h-2 w-2 rounded-full bg-emerald-500"/></div>
      <div className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><span className="text-slate-500">100 GMD</span><strong>≈ 850 XOF</strong></div><div className="flex justify-between"><span className="text-slate-500">500 GMD</span><strong>≈ 4 250 XOF</strong></div><div className="flex justify-between"><span className="text-slate-500">1 000 GMD</span><strong>≈ 8 500 XOF</strong></div></div>
    </div>
  </div>;
}

export function RateCheckIllustration() {
  return <div className="relative min-h-[390px] overflow-hidden rounded-[34px] bg-[#07130f] text-white">
    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl"/>
    <div className="absolute left-7 top-7 text-[10px] font-semibold uppercase tracking-[.18em] text-emerald-300">Kiwango · Rate Check</div>
    <div className="absolute inset-x-[7%] bottom-[8%] top-[18%] rounded-[28px] border border-white/10 bg-white/[.065] p-5 shadow-2xl backdrop-blur sm:p-6">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs text-slate-400">Vous changez</p><p className="mt-1 text-2xl font-semibold">100 EUR</p></div><span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-semibold text-emerald-300">Bon taux</span></div>
      <div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white/10 bg-white/[.045] p-4"><p className="text-[11px] text-slate-400">Vous devriez recevoir</p><p className="mt-2 text-xl font-semibold">7 820 GMD</p></div><div className="rounded-2xl border border-white/10 bg-white/[.045] p-4"><p className="text-[11px] text-slate-400">On vous propose</p><p className="mt-2 text-xl font-semibold">7 700 GMD</p></div></div>
      <div className="mt-3 rounded-2xl bg-emerald-400/10 p-4"><div className="flex items-center justify-between text-sm"><span className="text-slate-300">Perte estimée</span><span className="font-semibold text-emerald-300">120 GMD · 1,5 %</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[82%] rounded-full bg-emerald-400"/></div></div>
    </div>
  </div>;
}

export function OfflinePhoneIllustration() {
  return <div className="relative flex min-h-[410px] items-center justify-center overflow-hidden rounded-[34px] bg-[#f4f7f5] dark:bg-white/[.025]">
    <div className="absolute left-[8%] top-[12%] rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900"><p className="text-[10px] uppercase tracking-[.14em] text-slate-400">Réseau</p><p className="mt-1 text-sm font-semibold">Aucune connexion</p></div>
    <div className="absolute bottom-[13%] right-[5%] z-20 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,.09)] dark:border-emerald-900 dark:bg-slate-900"><p className="text-[10px] uppercase tracking-[.14em] text-slate-400">Travel Pack</p><p className="mt-1 text-sm font-semibold text-emerald-700">Toujours disponible ✓</p></div>
    <div className="relative w-[220px] rotate-[-2deg] rounded-[38px] border-[7px] border-slate-950 bg-white p-3 shadow-[0_34px_80px_rgba(15,23,42,.2)] dark:bg-slate-900">
      <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-slate-200 dark:bg-white/10"/>
      <div className="rounded-[24px] bg-emerald-50 p-4 dark:bg-emerald-950/20"><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-700">Sierra Leone</p><div className="mt-2 flex items-end justify-between"><div><p className="text-xl font-semibold text-slate-950 dark:text-white">SLE</p><p className="text-xs text-slate-500">Synchronisé 06:21</p></div><span>🇸🇱</span></div></div>
      <div className="mt-3 space-y-2"><div className="rounded-2xl border border-slate-200 p-3 dark:border-white/10"><p className="text-[10px] text-slate-400">100 SLE</p><p className="mt-1 text-base font-semibold">≈ 2 730 XOF</p></div><div className="rounded-2xl border border-slate-200 p-3 dark:border-white/10"><p className="text-[10px] text-slate-400">500 SLE</p><p className="mt-1 text-base font-semibold">≈ 13 650 XOF</p></div></div>
    </div>
  </div>;
}
