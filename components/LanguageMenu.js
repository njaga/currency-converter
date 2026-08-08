import React from 'react';

const LANGUAGES = [
  { code: 'fr', short: 'FR' },
  { code: 'en', short: 'EN' },
];

export default function LanguageMenu({ value = 'fr', onChange }) {
  return (
    <div className="inline-flex h-10 flex-none items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm sm:h-11 dark:border-white/10 dark:bg-slate-900">
      {LANGUAGES.map((language) => {
        const selected = language.code === value;
        return (
          <button
            key={language.code}
            type="button"
            onClick={() => onChange(language.code)}
            className={`min-h-8 rounded-full px-2.5 py-1.5 text-[11px] font-bold transition sm:px-3 sm:text-xs ${selected ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
            aria-pressed={selected}
            aria-label={language.code === 'fr' ? 'Français' : 'English'}
          >
            {language.short}
          </button>
        );
      })}
    </div>
  );
}
