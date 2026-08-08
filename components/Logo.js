import React from 'react';

export default function Logo({ size = 'md', showText = true, variant = 'auto', className = '' }) {
  const iconSizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  const textSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-950 dark:text-white';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${iconSizes[size]} relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-600 to-green-700 shadow-[0_6px_18px_rgba(22,163,74,0.22)]`} aria-hidden="true">
        <svg viewBox="0 0 64 64" className="h-full w-full" role="img">
          <circle cx="32" cy="32" r="32" fill="transparent" />
          <path
            d="M26.2 12.4 35 11l6.5 3.2 5.6 6.3-1.9 5.4 3.2 4.8-4.4 3.6-1.7 6.8-5.2 4-2.8 7.3-5.6-2.1-2.2-6.1-5.1-3.6-2.6-6.2-4.2-4.4 2-5.8 4.7-2.6 1.2-5.2Z"
            fill="white"
          />
          <path d="M41.8 16.4 47 18l2.7 4.2-3 2.8-3.5-2.1-1.4-6.5Z" fill="rgba(255,255,255,.82)" />
          <path d="M18.7 31.5 23 34l1.2 5-3.5 1.4-3.4-3.8 1.4-5.1Z" fill="rgba(255,255,255,.75)" />
        </svg>
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold tracking-[-0.045em] ${textColor}`}>
          Afri<span className="text-green-600 dark:text-green-400">Change</span>
        </span>
      )}
    </div>
  );
}
