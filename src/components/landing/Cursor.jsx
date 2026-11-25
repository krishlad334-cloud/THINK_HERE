import React, { useEffect, useRef, useState } from 'react';

/**
 * Simple, understated glowing cursor accent:
 * Uses the native crisp OS pointer/hand cursor with a subtle soft
 * brand-secondary (#5EEAD4) ambient glow that brightens gently on hover.
 */
export default function Cursor({ disabled = false }) {
  const glowRef = useRef(null);
  const visibleRef = useRef(false);
  const [isActive, setIsActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const onMove = (e) => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      if (!visibleRef.current) {
        visibleRef.current = true;
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
      setIsActive(false);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[90] hidden md:block transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={glowRef}
        className={`fixed left-0 top-0 rounded-full bg-[#5EEAD4] blur-xl transition-[width,height,opacity] duration-200 ease-out ${
          isActive ? 'h-12 w-12 opacity-25' : 'h-7 w-7 opacity-15'
        }`}
      />
    </div>
  );
}
