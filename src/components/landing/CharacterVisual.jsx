import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function CharacterVisual({
  state = 'overthinking',
  progress = 0,
  scrub = true,
  className = '',
  aspect = 'portrait',
  enableTilt = true
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const lastSeekTimeRef = useRef(0);

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
    discovering: 'from-cyan-500/30 via-sky-500/20 to-transparent',
    connecting: 'from-sky-500/30 via-cyan-500/20 to-transparent',
    succeeding: 'from-cyan-500/35 via-cyan-400/25 to-transparent'
  };

  const applySeek = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;
    if (video.readyState < 1) return;

    const now = Date.now();
    if (isSeekingRef.current && now - lastSeekTimeRef.current > 120) {
      isSeekingRef.current = false;
    }
    if (isSeekingRef.current) return;

    const target = Math.max(0, Math.min(video.duration, targetTimeRef.current));
    if (Math.abs(video.currentTime - target) > 0.02) {
      try {
        isSeekingRef.current = true;
        lastSeekTimeRef.current = now;
        if (typeof video.fastSeek === 'function') {
          video.fastSeek(target);
        } else {
          video.currentTime = target;
        }
      } catch {
        isSeekingRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    if (!scrub) return;
    const video = videoRef.current;
    if (!video) return;

    const clampedProgress = Math.max(0, Math.min(1, typeof progress === 'number' ? progress : 0));
    if (video.duration && !isNaN(video.duration) && video.duration > 0) {
      targetTimeRef.current = clampedProgress * video.duration;
      applySeek();
    }
  }, [progress, scrub, applySeek]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    if (scrub) {
      video.pause();
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
        });
      }
    }
  }, [scrub]);

  useEffect(() => {
    if (!scrub) return;
    const interval = setInterval(() => {
      if (isSeekingRef.current && videoRef.current) {
        const now = Date.now();
        if (now - lastSeekTimeRef.current > 120) {
          isSeekingRef.current = false;
          applySeek();
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [scrub, applySeek]);

  const handleLoadedMetadata = (e) => {
    const video = e.currentTarget;
    video.defaultMuted = true;
    video.muted = true;

    if (scrub) {
      video.pause();
      const clampedProgress = Math.max(0, Math.min(1, typeof progress === 'number' ? progress : 0));
      if (video.duration && !isNaN(video.duration)) {
        targetTimeRef.current = clampedProgress * video.duration;
        applySeek();
      }
    }
  };

  const handleSeeking = () => {
    isSeekingRef.current = true;
  };

  const handleSeeked = () => {
    isSeekingRef.current = false;
    const video = videoRef.current;
    if (video && video.duration && !isNaN(video.duration)) {
      const target = Math.max(0, Math.min(video.duration, targetTimeRef.current));
      if (Math.abs(video.currentTime - target) > 0.02) {
        applySeek();
      }
    }
  };

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
      <div
        className={`absolute -inset-6 sm:-inset-10 rounded-full bg-gradient-to-tr ${glowColors[state]} blur-3xl transition-all duration-700 pointer-events-none opacity-80 group-hover:opacity-100`}
      />

      <div
        className="relative w-full rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.22)] bg-slate-900 transition-all duration-500"
        style={{
          maskImage: 'radial-gradient(ellipse 98% 92% at 50% 50%, black 82%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 98% 92% at 50% 50%, black 82%, transparent 100%)'
        }}
      >
        {!videoError ? (
          <video
            ref={videoRef}
            src={currentVideo}
            poster={currentImage}
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={handleLoadedMetadata}
            onSeeking={handleSeeking}
            onSeeked={handleSeeked}
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
            alt={`Character - ${state}`}
            className="w-full h-auto object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              maxHeight: aspect === 'portrait' ? '450px' : '350px',
              minHeight: '260px'
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/10 pointer-events-none" />

        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-white/20 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
