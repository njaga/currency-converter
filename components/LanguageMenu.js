import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Languages } from 'lucide-react';

const LANGUAGES = [
  { code: 'fr', short: 'FR', label: 'Français' },
  { code: 'en', short: 'EN', label: 'English' },
];

export default function LanguageMenu({ value = 'fr', onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const active = LANGUAGES.find((item) => item.code === value) || LANGUAGES[0];

  useEffect(() => {
    const close = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    const escape = (event) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); };
  }, []);

  return (
    <div ref={rootRef} className="relative z-[120] flex-none">
      <button type="button" onClick={() => setOpen((current) => !current)} aria-haspopup="menu" aria-expanded={open} className={`flex h-10 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition-all ${open ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white dark:text-slate-300 dark:hover:border-white/10 dark:hover:bg-white/5'}`}>
        <Languages className="h-4 w-4"/><span>{active.short}</span><ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}/>
      </button>
      {open && <div role="menu" className="absolute right-0 top-[calc(100%+10px)] z-[150] w-48 overflow-visible rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-[0_22px_60px_rgba(15,23,42,.18)] dark:border-white/10 dark:bg-slate-900">
        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">Langue</p>
        {LANGUAGES.map((language) => { const selected = language.code === active.code; return <button key={language.code} type="button" role="menuitem" onClick={() => { onChange(language.code); setOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${selected ? 'bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5'}`}><span><span className="mr-2 text-xs font-bold">{language.short}</span>{language.label}</span>{selected && <Check className="h-4 w-4"/>}</button>; })}
      </div>}
    </div>
  );
}
