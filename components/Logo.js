import React from 'react';

export default function Logo({ size = 'md', showText = true, variant = 'auto', className = '' }) {
  const iconSizes = { sm: 'w-7 h-7', md: 'w-8 h-8', lg: 'w-10 h-10' };
  const textSizes = { sm: 'text-base', md: 'text-lg', lg: 'text-xl' };
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-950 dark:text-white';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${iconSizes[size]} flex items-center justify-center rounded-full bg-emerald-700 text-white flex-shrink-0`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="w-[58%] h-[58%]">
          <path d="M7 8.5h9.5m0 0-3-3m3 3-3 3M17 15.5H7.5m0 0 3 3m-3-3 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {showText && <span className={`${textSizes[size]} font-bold tracking-[-0.03em] ${textColor}`}>AfriChange</span>}
    </div>
  );
}
