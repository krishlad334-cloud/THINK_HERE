import React from 'react';

/**
 * LogoIcon
 * Option 2: Dual Glacial Cyan (High Luminosity)
 * - Brain (Left): Deep Ocean Cyan (#0e7490)
 * - Lightbulb (Right): Bright Glacial Cyan (#22d3ee)
 * - Center Filament Highlight: Cyan Glow (#67e8f9)
 * - Socket Base: Ocean Cyan (#0e7490)
 */
export function LogoIcon({ className = 'w-full h-full' }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className}>
      {/* Left Side: Deep Ocean Cyan Brain */}
      <path
        d="M48 20 C42 18, 35 22, 33 28 C28 29, 25 34, 27 40 C23 44, 24 51, 28 55 C25 60, 29 67, 35 68 C39 69, 43 67, 48 65"
        stroke="#0e7490"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Internal Brain Folds */}
      <path d="M42 32 C38 34, 38 42, 44 42" stroke="#0e7490" strokeWidth="5" strokeLinecap="round" />
      <path d="M36 48 C38 52, 44 54, 45 50" stroke="#0e7490" strokeWidth="5" strokeLinecap="round" />
      <path d="M48 20 L48 65" stroke="#0e7490" strokeWidth="6" strokeLinecap="round" />

      {/* Right Side: Bright Glacial Cyan Bulb */}
      <path
        d="M52 20 C68 20, 78 32, 78 46 C78 56, 70 62, 65 67 L52 67"
        stroke="#22d3ee"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center Filament Highlight */}
      <circle cx="56" cy="38" r="4" stroke="#67e8f9" strokeWidth="4" />
      <path d="M56 42 L53 62" stroke="#22d3ee" strokeWidth="4.5" strokeLinecap="round" />

      {/* Bulb Base Socket */}
      <path d="M38 74 L62 74" stroke="#0e7490" strokeWidth="5" strokeLinecap="round" />
      <path d="M41 81 L59 81" stroke="#0e7490" strokeWidth="5" strokeLinecap="round" />
      <path d="M45 87 C47 91, 53 91, 55 87" stroke="#22d3ee" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ size = 'md', showTagline = false, showText = true, className = '' }) {
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const iconClass = iconSizes[size] || iconSizes.md;
  const textClass = textSizes[size] || textSizes.md;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Option 2: Dual Glacial Cyan Brain-Bulb Vector Icon */}
      <div className={`relative flex-shrink-0 rounded-xl overflow-hidden bg-white p-1 border border-slate-200/60 shadow-xs flex items-center justify-center ${iconClass} group`}>
        <LogoIcon className="w-full h-full object-contain transform transition-transform group-hover:scale-105" />
      </div>

      {/* Brand Wordmark with Option 2 High-Luminosity Glacial Cyan */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-black tracking-tight ${textClass}`}>
              <span className="text-[#020617]">Over</span>
              <span className="text-[#22d3ee]">Think</span>
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5">
              Every Thought Deserves a Solution
            </span>
          )}
        </div>
      )}
    </div>
  );
}
