import React from 'react';

const LANGUAGES = [
  { code: 'fr', short: 'FR' },
  { code: 'en', short: 'EN' },
];

export default function LanguageMenu({ value = 'fr', onChange }) {
  return <div className="inline-flex h-11 items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-slate-900">
    {LANGUAGES.map((language) => {
      const selected = language.code === value;
      return <button key={language.code} type="button" onClick={() => onChange(language.code)} className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${selected ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}>{language.short}</button>;
    })}
  </div>;
}
