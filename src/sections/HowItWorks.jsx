import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STORY_STEPS, TYPED_THOUGHT } from '../data/landingStorySteps';
import { setHumanStepIndex } from '../three/useHumanStore';
import StoryStepCard from './StoryStepCard';

gsap.registerPlugin(ScrollTrigger);

const RealHumanStage = lazy(() => import('../three/RealHumanStage'));

export default function HowItWorks({ isMobile = false, reducedMotion = false }) {
  const sectionRef = useRef(null);
  const stRef = useRef(null);
  const progressBarRef = useRef(null);
  const activeStepRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const [typedCount, setTypedCount] = useState(18);
  const [routeChoice, setRouteChoice] = useState('human');

  const goToStep = (idx) => {
    const clamped = Math.max(0, Math.min(STORY_STEPS.length - 1, idx));
    activeStepRef.current = clamped;
    setActiveStep(clamped);
    setHumanStepIndex(clamped);

    const st = stRef.current;
    if (st && st.isActive) {
      const targetProgress = (clamped + 0.12) / STORY_STEPS.length;
      const targetY = st.start + (st.end - st.start) * targetProgress;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setHumanStepIndex(0);
  }, []);

  useEffect(() => {
    if (reducedMotion || activeStep !== 2) return undefined;
    const id = setInterval(() => {
      setTypedCount((c) => (c >= TYPED_THOUGHT.length ? 16 : c + 2));
    }, 55);
    return () => clearInterval(id);
  }, [activeStep, reducedMotion]);

  useEffect(() => {
    if (!sectionRef.current || isMobile || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=340%',
        pin: true,
        scrub: 0.75,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${Math.min(100, Math.max(4, self.progress * 100))}%`;
          }
          const idx = Math.min(
            STORY_STEPS.length - 1,
            Math.floor(self.progress * STORY_STEPS.length)
          );
          if (idx !== activeStepRef.current) {
            activeStepRef.current = idx;
            setActiveStep(idx);
            setHumanStepIndex(idx);
          }
        },
      });
    }, sectionRef);

    return () => {
      stRef.current = null;
      ctx.revert();
    };
  }, [isMobile, reducedMotion]);

  const current = STORY_STEPS[activeStep];
  const typedText =
    reducedMotion || activeStep !== 2
      ? TYPED_THOUGHT
      : TYPED_THOUGHT.slice(0, typedCount);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative flex lg:min-h-screen items-center py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="mb-6 lg:mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#F5F3FF] sm:text-5xl">
              From Overthinking to{' '}
              <span className="bg-gradient-to-r from-[#A855F7] to-[#5EEAD4] bg-clip-text text-transparent">
                Clear Solution
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {STORY_STEPS.map((s, idx) => {
              const isCurrent = idx === activeStep;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => goToStep(idx)}
                  style={{
                    borderColor: isCurrent ? s.accent : undefined,
                    boxShadow: isCurrent ? `0 0 22px ${s.accent}35` : undefined,
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-[#15122B] text-[#F5F3FF]'
                      : 'border-[#4C4585]/50 bg-[#15122B]/50 text-[#A9A4C8] hover:text-[#F5F3FF]'
                  }`}
                >
                  <span className="font-display font-bold" style={{ color: s.accent }}>
                    {s.num}
                  </span>
                  <span className="hidden sm:inline">{s.emotion.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <StoryStepCard
              activeStep={activeStep}
              current={current}
              typedText={typedText}
              routeChoice={routeChoice}
              onSelectRoute={setRouteChoice}
              onGoToStep={goToStep}
              progressBarRef={progressBarRef}
              reducedMotion={reducedMotion}
            />
          </div>

          <div className="relative lg:col-span-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div
                className="h-72 w-72 sm:h-96 sm:w-96 rounded-full opacity-30 blur-3xl transition-colors duration-700"
                style={{ backgroundColor: current.accent }}
              />
            </div>

            <Suspense
              fallback={
                <div className="flex h-[310px] sm:h-[400px] lg:h-[460px] xl:h-[520px] items-center justify-center">
                  <img
                    src="/images/man-stressed.png"
                    alt="OverThink human guide"
                    className="h-64 sm:h-72 w-auto object-contain"
                  />
                </div>
              }
            >
              <RealHumanStage isMobile={isMobile} reducedMotion={reducedMotion} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
