import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  AlertCircle,
  Search,
  Sparkles,
  Users,
  MessageSquare,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  UserCheck,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { setHumanStepIndex } from '../three/useHumanStore';

gsap.registerPlugin(ScrollTrigger);

const RealHumanStage = lazy(() => import('../three/RealHumanStage'));

const TYPED_THOUGHT =
  '“I want to pivot our pricing model, but every blog says something different. What should I actually do?”';

const STORY_STEPS = [
  {
    num: '01',
    emotion: 'Stress & Overload',
    accent: '#F472B6',
    icon: AlertCircle,
    title: 'Overthinking & Mental Noise',
    desc: 'You sit alone late at night with a big decision—replaying doubts, worrying about the wrong move, and feeling stuck.',
    chips: ['“What if it fails?”', '“Am I missing something?”', '“Too much at stake”'],
  },
  {
    num: '02',
    emotion: 'Frustration',
    accent: '#A855F7',
    icon: Search,
    title: 'Searching Everywhere Without Answers',
    desc: 'You jump across Google, forums, YouTube videos, and generic AI chats—scrolling for hours, yet nothing fits your real context.',
    chips: ['Google threads', 'Contradicting videos', 'Zero practical roadmap'],
  },
  {
    num: '03',
    emotion: 'Hope',
    accent: '#5EEAD4',
    icon: Sparkles,
    title: 'Discovering OverThink & Sharing Your Thought',
    desc: 'You open OverThink, drop your messy situation into one private brief in 60 seconds, and immediately lift the mental weight.',
    isTyping: true,
  },
  {
    num: '04',
    emotion: 'Guidance',
    accent: '#5EEAD4',
    icon: Users,
    title: 'Real Consultant or AI Tailored Guidance',
    desc: 'Choose a vetted human domain specialist, instant AI deep synthesis, or both—getting ground-level advice built for your exact situation.',
    isChoice: true,
  },
  {
    num: '05',
    emotion: 'Refinement',
    accent: '#A855F7',
    icon: MessageSquare,
    title: '1-on-1 Follow-Up & Plan Refinement',
    desc: 'Ask follow-up questions, challenge assumptions, and tailor every detail inside your private 1-on-1 room until the plan fits your exact constraints.',
    dialogue: [
      { who: 'You', text: '“What if our budget caps at $5k/mo?”' },
      { who: 'Specialist', text: '“Switch to the 2-tier launch first—cuts burn by 60% while keeping trial conversion high.”' },
    ],
  },
  {
    num: '06',
    emotion: 'Success & Relief',
    accent: '#FACC15',
    icon: Lightbulb,
    title: 'Clear 24h Solution & Confident Action',
    desc: 'Within 24 hours you have a step-by-step action plan saved in your workspace—execute with confidence, solve the problem, and move forward relieved.',
    checklist: [
      'Root bottleneck diagnosed clearly',
      'Prioritized 14-day action roadmap',
      'Saved in your workspace for anytime review',
    ],
  },
];

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
  const Icon = current.icon;
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
                  <span
                    className="font-display font-bold"
                    style={{ color: s.accent }}
                  >
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
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current.num}
                initial={reducedMotion ? false : { opacity: 0, y: 14, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  borderColor: `${current.accent}66`,
                  boxShadow: `0 0 48px ${current.accent}1a`,
                }}
                className="relative overflow-hidden rounded-3xl border bg-[#15122B]/75 p-6 sm:p-8 backdrop-blur-xl space-y-5"
              >
                <div className="absolute left-0 right-0 top-0 h-0.5 bg-[#4C4585]/35">
                  <div
                    ref={progressBarRef}
                    style={{
                      width: `${((activeStep + 1) / STORY_STEPS.length) * 100}%`,
                      backgroundColor: current.accent,
                    }}
                    className="h-full transition-[background-color,width] duration-300 ease-out"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: current.accent }}
                  >
                    <Icon className="h-4 w-4" />
                    Step {current.num} · {current.emotion}
                  </span>
                  <span className="font-display text-xs font-bold text-[#A9A4C8]">
                    {current.num} / {String(STORY_STEPS.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F3FF] leading-tight">
                    {current.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-[#A9A4C8]">
                    {current.desc}
                  </p>
                </div>

                {current.chips && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {current.chips.map((c) => (
                      <span
                        key={c}
                        className="rounded-xl border border-[#4C4585]/60 bg-[#0A0816]/75 px-3 py-1.5 text-xs text-[#F5F3FF]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {current.isTyping && (
                  <div className="rounded-2xl border border-[#5EEAD4]/40 bg-[#0A0816]/85 p-4 text-xs sm:text-sm text-[#F5F3FF]">
                    <span>{typedText}</span>
                    <span className="ml-0.5 inline-block h-3.5 w-0.5 bg-[#5EEAD4] animate-pulse align-middle" />
                  </div>
                )}

                {current.isChoice && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setRouteChoice('human')}
                      className={`flex items-center gap-2 rounded-2xl border px-3.5 py-3 text-xs font-semibold transition ${
                        routeChoice === 'human'
                          ? 'border-[#5EEAD4] bg-[#5EEAD4]/15 text-[#5EEAD4]'
                          : 'border-[#4C4585]/60 bg-[#0A0816]/70 text-[#A9A4C8]'
                      }`}
                    >
                      <UserCheck className="h-4 w-4" />
                      <span>Human Expert</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRouteChoice('ai')}
                      className={`flex items-center gap-2 rounded-2xl border px-3.5 py-3 text-xs font-semibold transition ${
                        routeChoice === 'ai'
                          ? 'border-[#A855F7] bg-[#A855F7]/20 text-[#A855F7]'
                          : 'border-[#4C4585]/60 bg-[#0A0816]/70 text-[#A9A4C8]'
                      }`}
                    >
                      <Cpu className="h-4 w-4" />
                      <span>AI Solution</span>
                    </button>
                  </div>
                )}

                {current.dialogue && (
                  <div className="space-y-2.5 pt-1">
                    {current.dialogue.map((msg) => (
                      <div
                        key={msg.who}
                        className={`rounded-2xl border px-3.5 py-2.5 text-xs sm:text-sm ${
                          msg.who === 'You'
                            ? 'border-[#4C4585]/60 bg-[#0A0816]/80 text-[#F5F3FF]'
                            : 'border-[#A855F7]/45 bg-[#A855F7]/12 text-[#F5F3FF]'
                        }`}
                      >
                        <span className="mr-2 font-semibold text-[#5EEAD4]">
                          {msg.who}:
                        </span>
                        <span>{msg.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {current.checklist && (
                  <ul className="space-y-2 pt-1">
                    {current.checklist.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-xs sm:text-sm text-[#F5F3FF]"
                      >
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#FACC15]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-center justify-between border-t border-[#4C4585]/40 pt-4">
                  <button
                    type="button"
                    onClick={() => goToStep(activeStep - 1)}
                    disabled={activeStep === 0}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#4C4585]/60 bg-[#0A0816]/70 px-3.5 py-2 text-xs font-semibold text-[#F5F3FF] transition hover:border-[#5EEAD4]/60 disabled:opacity-40"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {STORY_STEPS.map((s, idx) => (
                      <button
                        key={s.num}
                        type="button"
                        onClick={() => goToStep(idx)}
                        aria-label={`Go to step ${s.num}`}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === activeStep ? 'w-6 bg-[#5EEAD4]' : 'w-2 bg-[#4C4585]'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => goToStep((activeStep + 1) % STORY_STEPS.length)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#5EEAD4] px-3.5 py-2 text-xs font-bold text-[#0A0816] transition hover:scale-[1.03]"
                  >
                    <span>{activeStep === STORY_STEPS.length - 1 ? 'Replay' : 'Next Step'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
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
