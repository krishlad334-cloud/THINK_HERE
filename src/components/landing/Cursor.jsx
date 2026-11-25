import React, { useEffect, useRef, useState } from 'react';

/**
 * Custom glowing brand-secondary (#5EEAD4) cursor that expands
 * over buttons and links. Automatically hidden on touch devices
 * and when prefers-reduced-motion is active.
 */
export default function Cursor({ disabled = false }) {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const visibleRef = useRef(false);
  const [isActive, setIsActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    let rafId = null;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visibleRef.current) {
        visibleRef.current = true;
        pos.x = e.clientX;
        pos.y = e.clientY;
        setVisible(true);
      }

      const interactive = e.target?.closest?.(
        'a, button, [role="button"], input, textarea, [data-cursor="interactive"]'
      );
      setIsActive(Boolean(interactive));
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[90] hidden md:block transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={ringRef}
        className={`fixed left-0 top-0 rounded-full transition-[width,height,background-color,box-shadow] duration-200 ease-out ${
          isActive
            ? 'h-12 w-12 border border-[#5EEAD4]/80 bg-[#5EEAD4]/15 shadow-[0_0_26px_rgba(94,234,212,0.45)]'
            : 'h-7 w-7 border border-[#5EEAD4]/50 bg-[#5EEAD4]/10 shadow-[0_0_16px_rgba(94,234,212,0.25)]'
        }`}
      />
      <div
        ref={dotRef}
        className={`fixed left-0 top-0 rounded-full bg-[#5EEAD4] transition-transform duration-150 ${
          isActive ? 'h-2 w-2 scale-125' : 'h-1.5 w-1.5 scale-100'
        }`}
      />
    </div>
  );
}
