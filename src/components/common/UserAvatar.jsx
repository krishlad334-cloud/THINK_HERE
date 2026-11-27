import React, { useState } from 'react';

function getAvatarBgColor(name = '', role = '') {
  if (role === 'consultant') {
    return 'bg-[#020617] text-white border border-[#0891b2]/30';
  }
  if (!name) return 'bg-[#020617] text-white';

  const colors = [
    'bg-[#020617] text-white',
    'bg-[#0f766e] text-white',
    'bg-[#0369a1] text-white',
    'bg-[#4338ca] text-white',
    'bg-[#7e22ce] text-white',
    'bg-[#b45309] text-white',
    'bg-[#0e7490] text-white',
    'bg-[#be123c] text-white'
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export default function UserAvatar({
  src,
  name = 'User',
  size = 'md',
  role = '',
  showOnline = false,
  className = '',
  rounded = 'full',
  onClick
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  const imgError = failedSrc === src;

  const trimmedName = (name || '').trim();
  const initial = trimmedName.length > 0
    ? trimmedName.charAt(0).toUpperCase()
    : (role === 'consultant' ? 'C' : 'U');

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs font-bold',
    md: 'w-10 h-10 text-sm font-bold',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-16 h-16 text-xl font-extrabold',
    '2xl': 'w-24 h-24 text-3xl font-black',
    '3xl': 'w-28 h-28 sm:w-36 sm:h-36 text-4xl sm:text-5xl font-black'
  };

  const selectedSizeClass = sizeClasses[size] || size;
  const roundedClass = rounded === 'full' ? 'rounded-full' : (rounded === '3xl' ? 'rounded-3xl' : 'rounded-2xl');
  const bgClass = getAvatarBgColor(trimmedName, role);

  const onlineSizeClasses = {
    xs: { dot: 'w-1.5 h-1.5', container: 'w-1.5 h-1.5', ring: 'ring-[1.5px]' },
    sm: { dot: 'w-2 h-2', container: 'w-2 h-2', ring: 'ring-2' },
    md: { dot: 'w-2.5 h-2.5', container: 'w-2.5 h-2.5', ring: 'ring-2' },
    lg: { dot: 'w-3 h-3', container: 'w-3 h-3', ring: 'ring-2' },
    xl: { dot: 'w-3.5 h-3.5', container: 'w-3.5 h-3.5', ring: 'ring-2' },
    '2xl': { dot: 'w-4 h-4', container: 'w-4 h-4', ring: 'ring-2.5' },
    '3xl': { dot: 'w-5 h-5', container: 'w-5 h-5', ring: 'ring-3' }
  };
  const onlineStyle = onlineSizeClasses[size] || onlineSizeClasses.md;

  const hasValidPhoto = src && typeof src === 'string' && src.trim().length > 0 && !imgError;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${roundedClass} ${className}`}
    >
      {hasValidPhoto ? (
        <img
          src={src}
          alt={trimmedName || 'Profile'}
          onError={() => setFailedSrc(src)}
          className={`${selectedSizeClass} ${roundedClass} object-cover`}
        />
      ) : (
        <div
          className={`${selectedSizeClass} ${roundedClass} ${bgClass} flex items-center justify-center tracking-tight shadow-xs transition-transform`}
          title={trimmedName || 'Profile'}
        >
          <span>{initial}</span>
        </div>
      )}

      {showOnline && (
        <span
          className={`absolute bottom-0 right-0 flex items-center justify-center ${onlineStyle.container}`}
          title="Active Now"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 pointer-events-none" />
          <span className={`relative inline-flex rounded-full bg-emerald-500 ${onlineStyle.dot} ${onlineStyle.ring} ring-white shadow-xs`} />
        </span>
      )}
    </div>
  );
}
