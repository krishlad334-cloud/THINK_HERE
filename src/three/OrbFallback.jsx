import React from 'react';

/**
 * Lightweight CSS radial glow fallback shown while the 3D Canvas lazy-loads
 * or if WebGL is unavailable.
 */
export default function OrbFallback() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <div className="relative h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-gradient-radial from-cyan-400/25 via-violet-500/20 to-transparent blur-2xl animate-pulse-glow" />
    </div>
  );
}
