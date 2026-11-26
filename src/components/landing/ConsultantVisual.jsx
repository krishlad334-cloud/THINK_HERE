import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function ConsultantVisual({
  hasAccepted = false,
  progress = 0,
  scrub = true,
  className = '',
  enableTilt = true
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const lastSeekTimeRef = useRef(0);

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
      <div
        className={`absolute -inset-6 rounded-full bg-gradient-to-tr ${
          hasAccepted ? 'from-cyan-500/35 via-sky-500/25' : 'from-cyan-600/25 via-blue-500/15'
        } to-transparent blur-3xl transition-all duration-700 pointer-events-none opacity-80 group-hover:opacity-100`}
      />

      <div
        className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.22)] bg-slate-900 transition-all duration-500 w-full"
        style={{
          maskImage: 'radial-gradient(ellipse 98% 92% at 50% 50%, black 82%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 98% 92% at 50% 50%, black 82%, transparent 100%)'
        }}
      >
        {!videoError ? (
          <video
            ref={videoRef}
            src="/scene4_consultant.mp4"
            poster="/scene4_consultant.jpg"
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={handleLoadedMetadata}
            onSeeking={handleSeeking}
            onSeeked={handleSeeked}
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
            alt="Consultant - Elena Vance"
            className="w-full h-auto object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              maxHeight: '380px',
              minHeight: '260px'
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/10 pointer-events-none" />
      </div>
    </div>
  );
}
