import React, { useState, useRef, useEffect } from 'react';

/**
 * ConsultantVisual
 * Real Human Cinematic Video Animation for Verified Consultant (Dr. Elena Vance)
 * 
 * Features:
 * - Real human video motion in professional consulting environment
 * - Soft radial feathered perimeter blending
 * - Interactive 3D cursor tilt & parallax
 * - Ambient glow matching OverThink teal/emerald brand
 * - Graceful fallback to photorealistic poster frame
 */
export default function ConsultantVisual({
  hasAccepted = false,
  className = '',
  enableTilt = true
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handled silently
        });
      }
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!enableTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: -y * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group flex items-center justify-center select-none w-full max-w-[380px] mx-auto transition-transform duration-300 ease-out ${className}`}
      style={{
        perspective: '1200px',
        transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`
      }}
    >
      {/* Ambient Floor & Backlight Glow */}
      <div
        className={`absolute -inset-6 rounded-full bg-gradient-to-tr ${
          hasAccepted ? 'from-emerald-500/30 via-teal-500/25' : 'from-teal-600/20 via-blue-500/15'
        } to-transparent blur-3xl transition-all duration-700 pointer-events-none opacity-80 group-hover:opacity-100`}
      />

      {/* Main Cutout-Style Container */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.22)] bg-slate-900 transition-all duration-500 w-full"
        style={{
          maskImage: 'radial-gradient(ellipse 98% 92% at 50% 50%, black 82%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 98% 92% at 50% 50%, black 82%, transparent 100%)'
        }}
      >
        {/* Real Human Animated Video (with photorealistic image fallback) */}
        {!videoError ? (
          <video
            ref={videoRef}
            src="/scene4_consultant.mp4"
            poster="/scene4_consultant.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={() => setVideoError(true)}
            className="w-full h-auto object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              maxHeight: '380px',
              minHeight: '260px'
            }}
          />
        ) : (
          <img
            src="/scene4_consultant.jpg"
            alt="Dr. Elena Vance - Consultant"
            className="w-full h-auto object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              maxHeight: '380px',
              minHeight: '260px'
            }}
          />
        )}

        {/* Bottom Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/10 pointer-events-none" />
      </div>
    </div>
  );
}
