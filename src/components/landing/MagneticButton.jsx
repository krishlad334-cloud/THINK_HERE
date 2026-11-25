import React, { useEffect, useRef, useState } from 'react';

/**
 * Brand CTA button with magnetic cursor pull, glow pulse, and click ripple.
 */
export default function MagneticButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  reducedMotion = false,
  ...props
}) {
  const btnRef = useRef(null);
  const timersRef = useRef([]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((id) => clearTimeout(id));
    };
  }, []);

  const handleMouseMove = (e) => {
    if (reducedMotion || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: dx * 0.2, y: dy * 0.2 });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  const handleClick = (e) => {
    if (!reducedMotion && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const id = Date.now() + Math.random();
      setRipples((prev) => [
        ...prev,
        { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
      ]);
      const tid = setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 700);
      timersRef.current.push(tid);
    }
    onClick?.(e);
  };

  const variantClasses =
    variant === 'primary'
      ? 'bg-gradient-to-r from-[#A855F7] to-[#5EEAD4] text-[#0A0816] font-bold animate-pulse-glow'
      : 'border border-[#4C4585]/70 bg-[#15122B]/65 text-[#F5F3FF] hover:border-[#5EEAD4]/60 hover:bg-[#15122B]/90 backdrop-blur-md';

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-3.5 sm:px-7 sm:py-4 text-sm sm:text-base transition-transform duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4] ${variantClasses} ${className}`}
      {...props}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{ left: r.x, top: r.y }}
          className="pointer-events-none absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5F3FF]/40 animate-ripple-out"
        />
      ))}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
