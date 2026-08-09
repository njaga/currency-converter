import React from 'react';

export default function Logo({ size = 'md', showText = true, variant = 'auto', className = '' }) {
  const iconSizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  const textSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-950 dark:text-white';

  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${className}`}>
      <div className={`${iconSizes[size]} relative flex flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 shadow-[0_8px_22px_rgba(5,150,105,0.2)]`} aria-hidden="true">
        <svg viewBox="0 0 32 32" className="h-[58%] w-[58%]" fill="none">
          <circle cx="16" cy="16" r="11.25" stroke="white" strokeWidth="1.8" />
          <path d="M4.75 16h22.5M16 4.75c3.35 3.05 5 6.8 5 11.25S19.35 24.2 16 27.25M16 4.75C12.65 7.8 11 11.55 11 16s1.65 8.2 5 11.25" stroke="white" strokeWidth="1.55" strokeLinecap="round" />
          <path d="M7.2 9.4c2.3 1.2 5.3 1.85 8.8 1.85s6.5-.65 8.8-1.85M7.2 22.6c2.3-1.2 5.3-1.85 8.8-1.85s6.5.65 8.8 1.85" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
        </svg>
      </div>
      {showText && (
        <span className={`${textSizes[size]} truncate font-bold tracking-[-0.045em] ${textColor}`}>
          Afri<span className="text-emerald-600 dark:text-emerald-400">Change</span>
        </span>
      )}
    </div>
  );
}
