import React, { useId } from 'react';

const SIZE_CLASSES = {
  xs: 'w-[14px] h-[14px]',
  sm: 'w-4 h-4',
  md: 'w-4 h-4 sm:w-[18px] sm:h-[18px]',
  lg: 'w-5 h-5 sm:w-6 sm:h-6',
};

export default function VerifiedBadge({ size = 'sm', className = '', title = 'Verified' }) {
  const uid = useId();
  const leftClipId = `verified-left-${uid}`;
  const rightClipId = `verified-right-${uid}`;
  const dimensionClass = SIZE_CLASSES[size] || SIZE_CLASSES.sm;

  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      className={`${dimensionClass} inline-block align-middle flex-shrink-0 ${className}`}
    >
      <title>{title}</title>
      <defs>
        <clipPath id={leftClipId}>
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
        <clipPath id={rightClipId}>
          <rect x="12" y="0" width="12" height="24" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${leftClipId})`} fill="#54CCF8">
        <rect x="3.7" y="3.7" width="16.6" height="16.6" rx="3.1" />
        <rect x="3.7" y="3.7" width="16.6" height="16.6" rx="3.1" transform="rotate(45 12 12)" />
      </g>

      <g clipPath={`url(#${rightClipId})`} fill="#3E8DF8">
        <rect x="3.7" y="3.7" width="16.6" height="16.6" rx="3.1" />
        <rect x="3.7" y="3.7" width="16.6" height="16.6" rx="3.1" transform="rotate(45 12 12)" />
      </g>

      <path
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.4 12.3l2.4 2.4 4.8-5.1"
      />
    </svg>
  );
}
