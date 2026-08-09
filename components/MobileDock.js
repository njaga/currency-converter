import React from 'react';
import { ArrowRightLeft, LineChart, Plane, Wrench } from 'lucide-react';

const ITEMS = [
  { id: 'converter', icon: ArrowRightLeft, fr: 'Convertir', en: 'Convert' },
  { id: 'travel', icon: Plane, fr: 'Voyage', en: 'Travel' },
  { id: 'tools', icon: Wrench, fr: 'Outils', en: 'Tools' },
  { id: 'rates', icon: LineChart, fr: 'Devises', en: 'Rates' },
];

export default function MobileDock({ activeTab, onChange, lang = 'fr' }) {
  return (
    <nav aria-label="Navigation mobile" className="fixed inset-x-0 bottom-4 z-[90] mx-auto w-[calc(100%-24px)] max-w-md md:hidden">
      <div className="grid grid-cols-4 rounded-[24px] border border-white/60 bg-white/80 p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/80">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return <button key={item.id} type="button" onClick={() => onChange(item.id)} className="relative flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[18px] px-1 text-[10px] font-medium transition-all duration-300" aria-current={active ? 'page' : undefined}><span className={`absolute inset-0 rounded-[18px] transition-all duration-300 ${active ? 'scale-100 bg-emerald-600/12 opacity-100 shadow-[inset_0_1px_0_rgba(255,255,255,.7)] dark:bg-emerald-400/10' : 'scale-90 opacity-0'}`} /><Icon className={`relative z-10 h-[18px] w-[18px] transition-all duration-300 ${active ? '-translate-y-0.5 text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`} strokeWidth={active ? 2.2 : 1.8}/><span className={`relative z-10 ${active ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`}>{lang === 'fr' ? item.fr : item.en}</span></button>;
        })}
      </div>
    </nav>
  );
}
