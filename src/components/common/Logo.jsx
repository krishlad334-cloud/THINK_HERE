import React from 'react';

export default function Logo({ size = 'md', showTagline = false, showText = true, className = '' }) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Brain-Bulb Logo Icon from user upload */}
      <div className={`relative flex-shrink-0 rounded-xl overflow-hidden bg-white p-0.5 border border-slate-200/60 shadow-xs flex items-center justify-center ${iconSizes[size]}`}>
        <img
          src="/logo.jpg"
          alt="THINK"
          className="w-full h-full object-contain transform transition-transform hover:scale-105"
        />
      </div>

      {/* Brand Wordmark matching user uploaded typography */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-black tracking-tight ${textSizes[size]}`}>
              <span className="text-[#004845]">TH</span>
              <span className="text-[#16a34a]">INK</span>
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
