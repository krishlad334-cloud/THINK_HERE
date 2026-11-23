import React, { useState, useRef, useEffect } from 'react';

/**
 * CharacterVisual
 * Real Human Cinematic Video Animation with 3D Depth & Tilt
 * 
 * Features:
 * - Real human continuous video motion (typing, thinking, reacting, breathing)
 * - Photorealistic poster fallback with graceful error recovery
 * - Soft feathered perimeter blending into the background canvas
 * - Interactive 3D cursor tilt & parallax
 * - Multi-layer ambient lighting
 */
export default function CharacterVisual({
  state = 'overthinking', // 'overthinking' | 'searching' | 'discovering' | 'connecting' | 'succeeding'
  className = '',
  aspect = 'portrait',
  enableTilt = true
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const videoMap = {
    overthinking: '/scene1_overthinking.mp4',
    searching: '/scene2_searching.mp4',
    discovering: '/scene3_discover.mp4',
    connecting: '/scene3_discover.mp4',
    succeeding: '/scene5_succeed.mp4'
  };

  const imageMap = {
    overthinking: '/scene1_overthinking.jpg',
    searching: '/scene2_searching.jpg',
    discovering: '/scene3_discover.jpg',
    connecting: '/scene3_discover.jpg',
    succeeding: '/scene5_succeed.jpg'
  };

  const currentVideo = videoMap[state] || '/scene1_overthinking.mp4';
  const currentImage = imageMap[state] || '/scene1_overthinking.jpg';

  const glowColors = {
    overthinking: 'from-amber-500/20 via-orange-400/10 to-transparent',
    searching: 'from-blue-600/25 via-indigo-500/15 to-transparent',
    discovering: 'from-emerald-500/25 via-teal-500/20 to-transparent',
    connecting: 'from-teal-500/25 via-emerald-500/20 to-transparent',
    succeeding: 'from-emerald-500/35 via-green-400/25 to-transparent'
  };

  // Ensure autoplay works reliably across mobile & desktop browsers
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy or low power mode - video remains ready
        });
      }
    }
  }, [currentVideo]);

  const handleMouseMove = (e) => {
    if (!enableTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: -y * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group flex items-center justify-center select-none w-full max-w-[420px] mx-auto transition-transform duration-300 ease-out ${className}`}
      style={{
        perspective: '1200px',
        transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`
      }}
    >
      {/* 1. Ambient Floor & Backlight Aura (Blends seamlessly into page canvas) */}
      <div
        className={`absolute -inset-6 sm:-inset-10 rounded-full bg-gradient-to-tr ${glowColors[state]} blur-3xl transition-all duration-700 pointer-events-none opacity-80 group-hover:opacity-100`}
      />

      {/* 2. Cutout-Style Seamless Human Character Canvas */}
      <div
        className="relative w-full rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.22)] bg-slate-900 transition-all duration-500"
        style={{
          // Soft radial edge feathering so it feels integrated into the webpage space
          maskImage: 'radial-gradient(ellipse 98% 92% at 50% 50%, black 82%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 98% 92% at 50% 50%, black 82%, transparent 100%)'
        }}
      >
        {/* Real Human Animated Video (with photorealistic image fallback) */}
        {!videoError ? (
          <video
            ref={videoRef}
            src={currentVideo}
            poster={currentImage}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={() => setVideoError(true)}
            className="w-full h-auto object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              maxHeight: aspect === 'portrait' ? '450px' : '350px',
              minHeight: '260px'
            }}
          />
        ) : (
          <img
            src={currentImage}
            alt={`Alex Morgan - ${state}`}
            className="w-full h-auto object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              maxHeight: aspect === 'portrait' ? '450px' : '350px',
              minHeight: '260px'
            }}
          />
        )}

        {/* Cinematic Vignette Shadows */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/10 pointer-events-none" />

        {/* Ambient Top Light Reflection */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-white/20 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
