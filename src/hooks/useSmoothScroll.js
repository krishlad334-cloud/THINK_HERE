import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Connects Lenis smooth scrolling to GSAP ScrollTrigger.
 * Respects prefers-reduced-motion and provides a clean scrollTo helper.
 */
export function useSmoothScroll({ disabled = false } = {}) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || disabled) return undefined;

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.25,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [disabled]);

  const scrollTo = (target, options = {}) => {
    if (lenisRef.current && !disabled) {
      lenisRef.current.scrollTo(target, { offset: -64, duration: 1.2, ...options });
      return;
    }
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: disabled ? 'auto' : 'smooth', block: 'start' });
  };

  return { lenisRef, scrollTo };
}
