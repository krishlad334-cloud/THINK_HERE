import React, { useState } from 'react';

// Generates a consistent, visually pleasing background color from any string
function getAvatarBgColor(name = '', role = '') {
  if (role === 'consultant') {
    return 'bg-[#004845] text-white border border-[#16a34a]/30';
  }
  if (!name) return 'bg-[#004845] text-white';

  const colors = [
    'bg-[#004845] text-white',
    'bg-[#0f766e] text-white',
    'bg-[#0369a1] text-white',
    'bg-[#4338ca] text-white',
    'bg-[#7e22ce] text-white',
    'bg-[#b45309] text-white',
    'bg-[#15803d] text-white',
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
  const [imgError, setImgError] = useState(false);

  // Extract first letter of name
  const trimmedName = (name || '').trim();
  const initial = trimmedName.length > 0
    ? trimmedName.charAt(0).toUpperCase()
    : (role === 'consultant' ? 'C' : 'U');

  // Size map
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
          onError={() => setImgError(true)}
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
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16a34a] ring-2 ring-white" />
      )}
    </div>
  );
}
