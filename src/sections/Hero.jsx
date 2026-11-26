import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown } from 'lucide-react';
import MagneticButton from '../components/landing/MagneticButton';
import FloatingWindow from '../components/landing/FloatingWindow';
import ThoughtChips from '../components/landing/ThoughtChips';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE_WORDS = [
  { text: 'Every', grad: false },
  { text: 'Thought', grad: true },
  { text: 'Deserves', grad: false },
  { text: 'a', grad: false },
  { text: 'Solution.', grad: true },
];

const CHAOTIC_WINDOWS = [
  { id: 'w1', variant: 'article', title: 'startup-advice.blog', x: '2%', y: '6%', mx: '1%', my: '4%', w: 'w-32 sm:w-44 lg:w-48', rot: -6, depth: 1.2, z: 'z-10' },
  { id: 'w2', variant: 'analytics', title: 'metrics-overload.io', x: '46%', y: '4%', mx: '54%', my: '4%', w: 'w-32 sm:w-44 lg:w-48', rot: 5, depth: 1.0, z: 'z-0' },
  { id: 'w3', variant: 'video', title: '10x-founder-talk.mp4', x: '24%', y: '30%', mx: '26%', my: '27%', w: 'w-36 sm:w-48 lg:w-52', rot: -2, depth: 1.5, z: 'z-20' },
  { id: 'w4', variant: 'grid', title: 'competitor-research', x: '54%', y: '48%', mx: '52%', my: '52%', w: 'w-32 sm:w-44 lg:w-48', rot: 6, depth: 1.3, z: 'z-10' },
  { id: 'w5', variant: 'article', title: 'reddit-thread-492', x: '0%', y: '44%', mx: '0%', my: '39%', w: 'w-32 sm:w-40 lg:w-44', rot: 7, depth: 1.35, z: 'z-10' },
  { id: 'w6', variant: 'analytics', title: 'pricing-calculator', x: '12%', y: '64%', mx: '6%', my: '66%', w: 'w-32 sm:w-44 lg:w-48', rot: -5, depth: 1.15, z: 'z-20' },
  { id: 'w7', variant: 'sticky', title: '', x: '56%', y: '74%', mx: '52%', my: '78%', w: '!w-28 sm:!w-36', rot: -7, depth: 1.65, z: 'z-20' },
  { id: 'w8', variant: 'papers', title: '', x: '30%', y: '4%', mx: '31%', my: '0%', w: '!w-28 sm:!w-36', rot: 7, depth: 1.45, z: 'z-10' },
  { id: 'w9', variant: 'camera', title: '', x: '62%', y: '28%', mx: '58%', my: '29%', w: 'scale-90 sm:scale-100', rot: -4, depth: 1.75, z: 'z-30' },
];

export default function Hero({
  onStartThink,
  onExplore,
  isAuthenticated = false,
  onGoToApp,
  isMobile = false,
  reducedMotion = false,
}) {
  const sectionRef = useRef(null);
  const windowsRef = useRef([]);
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return undefined;

    const onMove = (e) => {
      if (isMobile) return;
      targetMouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    let rafId = null;
    let lastTs = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      const alpha = 1 - Math.exp(-6.5 * dt);

      const sm = smoothMouseRef.current;
      const tg = targetMouseRef.current;
      sm.x += (tg.x - sm.x) * alpha;
      sm.y += (tg.y - sm.y) * alpha;

      const t = now / 1000;
      windowsRef.current.forEach((el, idx) => {
        if (!el) return;
        const depth = Number(el.dataset.depth) || 1;
        const rot = Number(el.dataset.rot) || 0;
        const driftX = Math.sin(t * 0.9 + idx * 0.85) * (isMobile ? 4.5 : 3.5);
        const driftY = Math.cos(t * 0.75 + idx * 1.1) * (isMobile ? 5.5 : 4.0);
        const dx = (isMobile ? 0 : sm.x * depth * 14) + driftX;
        const dy = (isMobile ? 0 : sm.y * depth * 12) + driftY;
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${rot}deg)`;
      });
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobile, reducedMotion]);

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const items = windowsRef.current.filter(Boolean);
      gsap.to(items, {
        scale: 0.86,
        opacity: 0,
        y: -40,
        stagger: 0.025,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center top',
          end: 'bottom top',
          scrub: 0.75,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const visibleWindows = CHAOTIC_WINDOWS;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[88vh] lg:min-h-screen flex-col justify-center pt-24 pb-12 sm:pt-28 sm:pb-16 overflow-hidden"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
        <div className="relative z-20 space-y-6 lg:col-span-6">
          <h1 className="font-display text-4xl font-bold leading-[1.06] tracking-tight text-[#F5F3FF] sm:text-6xl xl:text-[4rem]">
            {HEADLINE_WORDS.map((w, idx) => (
              <span key={w.text} className="mr-3 inline-block overflow-hidden align-bottom pb-1">
                <motion.span
                  initial={reducedMotion ? false : { y: '115%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    duration: 0.68,
                    delay: 0.16 + idx * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`inline-block ${
                    w.grad
                      ? 'bg-gradient-to-r from-[#A855F7] to-[#5EEAD4] bg-clip-text text-transparent'
                      : 'text-[#F5F3FF]'
                  }`}
                >
                  {w.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="max-w-xl text-base leading-relaxed text-[#A9A4C8] sm:text-lg"
          >
            Share any thought, question, problem, business idea, or career
            challenge—and get clear, meaningful solutions from vetted human
            consultants or AI within <span className="font-semibold text-[#F5F3FF]">24 hours</span>.
          </motion.p>

          <ThoughtChips reducedMotion={reducedMotion} />

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.58 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <MagneticButton
              reducedMotion={reducedMotion}
              onClick={isAuthenticated ? onGoToApp : onStartThink}
            >
              <span>{isAuthenticated ? 'Open Workspace' : 'Share your thought'}</span>
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>

            <MagneticButton
              variant="secondary"
              reducedMotion={reducedMotion}
              onClick={() => onExplore?.('#how-it-works')}
            >
              <span>See how it works</span>
            </MagneticButton>
          </motion.div>
        </div>

        <div className="relative flex min-h-[380px] sm:min-h-[440px] lg:col-span-6 lg:min-h-[500px] items-center justify-center overflow-visible">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-[#A855F7]/25 blur-2xl animate-float-slow" />
            <div className="absolute right-10 bottom-14 h-36 w-36 rounded-full bg-[#5EEAD4]/22 blur-2xl animate-float-slow" />
            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-[#A855F7]/28 via-[#5EEAD4]/14 to-transparent blur-2xl" />
          </div>

          {visibleWindows.map((win, idx) => (
            <div
              key={win.id}
              ref={(el) => {
                windowsRef.current[idx] = el;
              }}
              data-depth={win.depth}
              data-rot={win.rot}
              style={{
                left: isMobile ? win.mx : win.x,
                top: isMobile ? win.my : win.y,
                transform: `rotate(${win.rot}deg)`,
                willChange: 'transform',
              }}
              className={`pointer-events-none absolute ${win.z || 'z-10'}`}
            >
              <FloatingWindow
                variant={win.variant}
                title={win.title}
                className={win.w}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onExplore?.('#how-it-works')}
        className="mt-6 lg:mt-0 lg:absolute lg:bottom-5 lg:left-1/2 z-20 lg:-translate-x-1/2 flex flex-col items-center gap-1 self-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#A9A4C8] transition hover:text-[#5EEAD4]"
      >
        <span>Scroll to clear the noise</span>
        <ChevronDown className="h-4 w-4 animate-bounce text-[#5EEAD4]" />
      </button>
    </section>
  );
}
