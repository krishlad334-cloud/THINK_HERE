import React, { useRef, useState } from 'react';

export default function TiltCard({
  children,
  className = '',
  glowColor = 'rgba(94, 234, 212, 0.25)',
  reducedMotion = false,
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const handleMouseMove = (e) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    setTilt({
      rx: -(py - 0.5) * 14,
      ry: (px - 0.5) * 14,
      gx: px * 100,
      gy: py * 100,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${tilt.active ? -4 : 0}px)`,
      }}
      className={`gradient-border-brand relative overflow-hidden rounded-3xl border border-[#4C4585]/50 bg-[#15122B]/60 backdrop-blur-xl transition-transform duration-200 ease-out ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: tilt.active ? 1 : 0,
          background: `radial-gradient(460px circle at ${tilt.gx}% ${tilt.gy}%, ${glowColor}, transparent 55%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
