import React from 'react';

export default function Logo({ size = 'md', showText = true, variant = 'auto', className = '' }) {
  const iconSizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  const textSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-950 dark:text-white';

  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${className}`}>
      <div className={`${iconSizes[size]} relative flex flex-shrink-0 items-center justify-center rounded-[30%] bg-slate-950 shadow-[0_10px_28px_rgba(15,23,42,0.18)] dark:bg-white`} aria-hidden="true">
        <svg viewBox="0 0 32 32" className="h-[64%] w-[64%]" fill="none">
          <path d="M8.5 7.5v17" stroke="#10B981" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M10 16h4.2l7.3-8.5" stroke="currentColor" className="text-white dark:text-slate-950" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m14.2 16 7.8 8.5" stroke="currentColor" className="text-white dark:text-slate-950" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="23.7" cy="7.2" r="2.2" fill="#10B981" />
        </svg>
      </div>
      {showText && (
        <span className={`${textSizes[size]} truncate font-semibold tracking-[-0.045em] ${textColor}`}>
          Kiwango
        </span>
      )}
    </div>
  );
}
