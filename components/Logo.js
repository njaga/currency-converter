import React from 'react';

export default function Logo({ size = 'md', showText = true, variant = 'auto', className = '' }) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  // Determine text color based on variant
  const getAfriColor = () => {
    if (variant === 'light') return 'text-white';
    if (variant === 'dark') return 'text-slate-900';
    return 'text-slate-900 dark:text-white';
  };

  const getChangeColor = () => {
    if (variant === 'light') return 'text-cyan-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Modern Gradient Icon: Dynamic Currency Exchange Arrows */}
      <div className={`${iconSizes[size]} relative flex items-center justify-center flex-shrink-0`}>
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            <linearGradient id="logoGradPrimary" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563eb" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="logoGradSecondary" x1="44" y1="0" x2="0" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f59e0b" />
              <stop offset="1" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Rounded Hexagonal Outer Shell */}
          <rect x="2" y="2" width="40" height="40" rx="12" fill="url(#logoGradPrimary)" />

          {/* Intertwined Exchange Flow Lines */}
          <path
            d="M13 20C13 16.134 16.134 13 20 13H29M29 13L24.5 8.5M29 13L24.5 17.5"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M31 24C31 27.866 27.866 31 24 31H15M15 31L19.5 35.5M15 31L19.5 26.5"
            stroke="url(#logoGradSecondary)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`${textSizes[size]} font-black tracking-tight ${getAfriColor()}`}>
            Afri<span className={getChangeColor()}>Change</span>
          </span>
        </div>
      )}
    </div>
  );
}
