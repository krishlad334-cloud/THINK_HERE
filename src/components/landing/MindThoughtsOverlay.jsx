import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Cpu, Search, Sparkles, UserCheck } from 'lucide-react';

export function MindConnections({ activeStep, accent, routeChoice, isInView, reducedMotion }) {
  const pathsByStep = {
    0: [
      { d: 'M 365 215 C 295 190, 235 165, 165 132', color: '#F472B6' },
      { d: 'M 380 185 C 380 148, 380 120, 380 88', color: '#A855F7' },
      { d: 'M 395 215 C 465 190, 525 165, 595 132', color: '#F472B6' },
    ],
    1: [
      { d: 'M 365 215 C 295 188, 235 162, 165 128', color: '#A855F7' },
      { d: 'M 380 185 C 378 148, 382 120, 380 88', color: '#F472B6' },
      { d: 'M 395 215 C 465 188, 525 162, 595 128', color: '#A855F7' },
    ],
    2: [
      { d: 'M 340 218 C 295 170, 310 122, 355 96', color: '#5EEAD4' },
      { d: 'M 420 218 C 465 170, 450 122, 405 96', color: '#A855F7' },
    ],
    3: [
      {
        d: 'M 365 215 C 295 186, 235 158, 168 124',
        color: '#5EEAD4',
        strong: routeChoice === 'human',
      },
      {
        d: 'M 395 215 C 465 186, 525 158, 592 124',
        color: '#A855F7',
        strong: routeChoice === 'ai',
      },
    ],
    4: [
      { d: 'M 365 215 C 295 186, 235 158, 168 126', color: '#5EEAD4' },
      { d: 'M 395 215 C 465 182, 525 154, 592 120', color: '#A855F7' },
      { d: 'M 225 104 Q 380 56 535 100', color: '#5EEAD4', wide: true },
    ],
    5: [
      { d: 'M 362 212 C 292 188, 232 166, 165 134', color: '#FACC15', strong: true },
      { d: 'M 380 182 C 380 146, 380 118, 380 86', color: '#5EEAD4', strong: true },
      { d: 'M 398 212 C 468 188, 528 166, 595 134', color: '#FACC15', strong: true },
    ],
  };

  const paths = pathsByStep[activeStep] || pathsByStep[0];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 760 500"
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
    >
      {paths.map((item, idx) => (
        <g key={idx}>
          <motion.path
            d={item.d}
            fill="none"
            stroke={item.color || accent}
            strokeWidth={item.strong ? 5 : 3.5}
            strokeLinecap="round"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={
              isInView
                ? { opacity: item.strong === true ? 0.22 : item.strong === false ? 0.12 : 0.16 }
                : { opacity: 0 }
            }
            transition={{ duration: 0.6, delay: 0.2 + idx * 0.08 }}
          />
          <motion.path
            d={item.d}
            fill="none"
            stroke={item.color || accent}
            strokeWidth={item.strong === true ? 2 : 1.45}
            strokeLinecap="round"
            strokeDasharray={item.wide ? '5 8' : '3 7'}
            initial={reducedMotion ? false : { opacity: 0, strokeDashoffset: 0 }}
            animate={
              !isInView
                ? { opacity: 0 }
                : reducedMotion
                ? { opacity: item.strong === true ? 0.8 : item.strong === false ? 0.45 : 0.58 }
                : {
                    opacity: item.strong === true ? 0.85 : item.strong === false ? 0.48 : 0.64,
                    strokeDashoffset: [0, -20],
                  }
            }
            transition={
              reducedMotion
                ? { duration: 0.4 }
                : {
                    opacity: { duration: 0.5, delay: 0.2 + idx * 0.08 },
                    strokeDashoffset: {
                      duration: 2.2,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                  }
            }
          />
        </g>
      ))}
    </svg>
  );
}

function ThoughtTrail({ accent, align = 'left', className = '' }) {
  const alignClass =
    align === 'right' ? 'items-end' : align === 'left' ? 'items-start' : 'items-center';
  const dots = [
    { size: 'h-2 w-2 sm:h-2.5 sm:w-2.5', offset: align === 'left' ? 'translate-x-2' : align === 'right' ? '-translate-x-2' : '' },
    { size: 'h-1.5 w-1.5 opacity-75', offset: align === 'left' ? 'translate-x-5' : align === 'right' ? '-translate-x-5' : '' },
    { size: 'h-1 w-1 opacity-50', offset: align === 'left' ? 'translate-x-7' : align === 'right' ? '-translate-x-7' : '' },
  ];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none flex flex-col gap-1 ${alignClass} ${className}`}
    >
      {dots.map((dot, idx) => (
        <span
          key={idx}
          className={`rounded-full ${dot.size} ${dot.offset}`}
          style={{
            backgroundColor: accent,
            boxShadow: `0 0 10px ${accent}`,
          }}
        />
      ))}
    </div>
  );
}

function ThoughtBubble({
  children,
  accent,
  delay = 0,
  floatAmp = 5,
  floatDur = 3.0,
  isInView = true,
  reducedMotion = false,
  className = '',
}) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, scale: 0.86, y: 12 }}
      animate={
        !isInView
          ? { opacity: 0, scale: 0.86, y: 12 }
          : reducedMotion
          ? { opacity: 1, scale: 1, y: 0 }
          : {
              opacity: 1,
              scale: 1,
              y: [0, -floatAmp],
            }
      }
      transition={
        reducedMotion
          ? { duration: 0.2 }
          : {
              opacity: { duration: 0.42, delay },
              scale: { duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] },
              y: {
                duration: floatDur,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: delay + 0.25,
              },
            }
      }
      style={{
        borderColor: `${accent}58`,
        boxShadow: `0 12px 30px rgba(5, 4, 14, 0.72), 0 0 22px ${accent}22`,
      }}
      className={`will-change-transform rounded-2xl sm:rounded-3xl border bg-[#120F26]/86 backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function MindThoughtsOverlay({
  step,
  activeStep,
  typedText,
  routeChoice,
  onSelectRoute,
  isInView = true,
  reducedMotion = false,
}) {
  const accent = step.accent;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 select-none">
      {activeStep === 0 && step.mindThoughts && (
        <>
          <div className="absolute left-[1%] sm:left-[3%] top-[14%] sm:top-[16%] max-w-[134px] sm:max-w-[205px]">
            <ThoughtBubble accent={accent} delay={0.28} floatAmp={5} floatDur={2.6} isInView={isInView} reducedMotion={reducedMotion} className="px-2.5 py-2 sm:px-4 sm:py-2.5">
              <div className="flex items-center gap-1.5 text-[10.5px] sm:text-xs font-medium text-[#F5F3FF]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F472B6] animate-pulse flex-shrink-0" />
                <span>{step.mindThoughts[0].text}</span>
              </div>
            </ThoughtBubble>
            <ThoughtTrail accent={accent} align="left" className="mt-1 ml-5 sm:ml-7" />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 top-[0%] sm:top-[1%] max-w-[165px] sm:max-w-[235px]">
            <ThoughtBubble accent="#A855F7" delay={0.38} floatAmp={4} floatDur={3.0} isInView={isInView} reducedMotion={reducedMotion} className="px-2.5 py-1.5 sm:px-4 sm:py-2">
              <div className="text-center text-[10.5px] sm:text-xs font-medium text-[#F5F3FF]">
                {step.mindThoughts[1].text}
              </div>
            </ThoughtBubble>
            <ThoughtTrail accent="#A855F7" align="center" className="mt-1" />
          </div>

          <div className="absolute right-[1%] sm:right-[3%] top-[15%] sm:top-[17%] max-w-[134px] sm:max-w-[200px]">
            <ThoughtBubble accent={accent} delay={0.48} floatAmp={5} floatDur={2.8} isInView={isInView} reducedMotion={reducedMotion} className="px-2.5 py-2 sm:px-4 sm:py-2.5">
              <div className="flex items-center gap-1.5 text-[10.5px] sm:text-xs font-medium text-[#F5F3FF]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F472B6] animate-pulse flex-shrink-0" />
                <span>{step.mindThoughts[2].text}</span>
              </div>
            </ThoughtBubble>
            <ThoughtTrail accent={accent} align="right" className="mt-1 mr-5 sm:mr-7" />
          </div>
        </>
      )}

      {activeStep === 1 && step.mindThoughts && (
        <>
          <div className="absolute left-[1%] sm:left-[3%] top-[13%] sm:top-[15%] max-w-[140px] sm:max-w-[215px]">
            <ThoughtBubble accent={accent} delay={0.28} floatAmp={5} floatDur={2.9} isInView={isInView} reducedMotion={reducedMotion} className="px-2.5 py-2 sm:px-4 sm:py-2.5">
              <div className="flex items-center gap-1.5 text-[10.5px] sm:text-xs text-[#F5F3FF]">
                <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 text-[#A855F7]" />
                <span>{step.mindThoughts[0].text}</span>
              </div>
            </ThoughtBubble>
            <ThoughtTrail accent={accent} align="left" className="mt-1 ml-6 sm:ml-8" />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 top-[0%] sm:top-[1%] max-w-[175px] sm:max-w-[245px]">
            <ThoughtBubble accent="#F472B6" delay={0.38} floatAmp={4} floatDur={3.2} isInView={isInView} reducedMotion={reducedMotion} className="px-2.5 py-1.5 sm:px-4 sm:py-2">
              <div className="text-center text-[10.5px] sm:text-xs text-[#F5F3FF]">
                {step.mindThoughts[1].text}
              </div>
            </ThoughtBubble>
            <ThoughtTrail accent="#F472B6" align="center" className="mt-1" />
          </div>

          <div className="absolute right-[1%] sm:right-[3%] top-[14%] sm:top-[16%] max-w-[140px] sm:max-w-[215px]">
            <ThoughtBubble accent={accent} delay={0.48} floatAmp={5} floatDur={3.0} isInView={isInView} reducedMotion={reducedMotion} className="px-2.5 py-2 sm:px-4 sm:py-2.5">
              <div className="text-[10.5px] sm:text-xs text-[#F5F3FF]">
                {step.mindThoughts[2].text}
              </div>
            </ThoughtBubble>
            <ThoughtTrail accent={accent} align="right" className="mt-1 mr-6 sm:mr-8" />
          </div>
        </>
      )}

      {activeStep === 2 && (
        <div className="absolute left-1/2 -translate-x-1/2 top-[0%] sm:top-[2%] w-[90%] max-w-[380px]">
          <ThoughtBubble
            accent="#5EEAD4"
            delay={0.28}
            floatAmp={4}
            floatDur={3.4}
            isInView={isInView}
            reducedMotion={reducedMotion}
            className="px-3.5 py-2.5 sm:px-5 sm:py-3.5"
          >
            <div className="mb-1 flex items-center justify-between text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#5EEAD4]">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                Structured Mind Brief
              </span>
              <span className="text-[#A9A4C8]">60s</span>
            </div>
            <p className="text-[11px] sm:text-sm leading-relaxed text-[#F5F3FF]">
              <span>{typedText}</span>
              <span className="ml-0.5 inline-block h-3.5 w-0.5 bg-[#5EEAD4] animate-pulse align-middle" />
            </p>
          </ThoughtBubble>
          <ThoughtTrail accent="#5EEAD4" align="center" className="mt-1" />
        </div>
      )}

      {activeStep === 3 && step.choiceOptions && (
        <>
          <div className="pointer-events-auto absolute left-[1%] sm:left-[3%] top-[10%] sm:top-[13%] max-w-[148px] sm:max-w-[225px]">
            <button
              type="button"
              onClick={() => onSelectRoute?.('human')}
              className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4] rounded-3xl cursor-pointer"
            >
              <ThoughtBubble
                accent={routeChoice === 'human' ? '#5EEAD4' : '#4C4585'}
                delay={0.28}
                floatAmp={4}
                floatDur={3.2}
                isInView={isInView}
                reducedMotion={reducedMotion}
                className={`px-3 py-2 sm:px-4 sm:py-3 transition-all ${
                  routeChoice === 'human' ? 'ring-1 ring-[#5EEAD4]/60' : 'opacity-65 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10.5px] sm:text-xs font-bold text-[#5EEAD4]">
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>{step.choiceOptions.human.title}</span>
                </div>
                <p className="mt-0.5 text-[10px] sm:text-xs leading-snug text-[#F5F3FF]">
                  {step.choiceOptions.human.thought}
                </p>
              </ThoughtBubble>
            </button>
            <ThoughtTrail
              accent={routeChoice === 'human' ? '#5EEAD4' : '#4C4585'}
              align="left"
              className="mt-1 ml-6 sm:ml-8"
            />
          </div>

          <div className="pointer-events-auto absolute right-[1%] sm:right-[3%] top-[10%] sm:top-[13%] max-w-[148px] sm:max-w-[225px]">
            <button
              type="button"
              onClick={() => onSelectRoute?.('ai')}
              className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A855F7] rounded-3xl cursor-pointer"
            >
              <ThoughtBubble
                accent={routeChoice === 'ai' ? '#A855F7' : '#4C4585'}
                delay={0.4}
                floatAmp={4}
                floatDur={3.5}
                isInView={isInView}
                reducedMotion={reducedMotion}
                className={`px-3 py-2 sm:px-4 sm:py-3 transition-all ${
                  routeChoice === 'ai' ? 'ring-1 ring-[#A855F7]/60' : 'opacity-65 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10.5px] sm:text-xs font-bold text-[#A855F7]">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>{step.choiceOptions.ai.title}</span>
                </div>
                <p className="mt-0.5 text-[10px] sm:text-xs leading-snug text-[#F5F3FF]">
                  {step.choiceOptions.ai.thought}
                </p>
              </ThoughtBubble>
            </button>
            <ThoughtTrail
              accent={routeChoice === 'ai' ? '#A855F7' : '#4C4585'}
              align="right"
              className="mt-1 mr-6 sm:mr-8"
            />
          </div>
        </>
      )}

      {activeStep === 4 && step.dialogue && (
        <>
          <div className="absolute left-[1%] sm:left-[3%] top-[11%] sm:top-[14%] max-w-[152px] sm:max-w-[230px]">
            <ThoughtBubble accent="#5EEAD4" delay={0.28} floatAmp={4} floatDur={3.3} isInView={isInView} reducedMotion={reducedMotion} className="px-3 py-2 sm:px-4 sm:py-2.5">
              <span className="block text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
                {step.dialogue[0].who}
              </span>
              <p className="mt-0.5 text-[10.5px] sm:text-xs leading-snug text-[#F5F3FF]">
                {step.dialogue[0].text}
              </p>
            </ThoughtBubble>
            <ThoughtTrail accent="#5EEAD4" align="left" className="mt-1 ml-6 sm:ml-8" />
          </div>

          <div className="absolute right-[1%] sm:right-[3%] top-[7%] sm:top-[10%] max-w-[156px] sm:max-w-[240px]">
            <ThoughtBubble accent="#A855F7" delay={0.42} floatAmp={4} floatDur={3.6} isInView={isInView} reducedMotion={reducedMotion} className="px-3 py-2 sm:px-4 sm:py-2.5">
              <span className="block text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#A855F7]">
                {step.dialogue[1].who}
              </span>
              <p className="mt-0.5 text-[10.5px] sm:text-xs leading-snug text-[#F5F3FF]">
                {step.dialogue[1].text}
              </p>
            </ThoughtBubble>
            <ThoughtTrail accent="#A855F7" align="right" className="mt-1 mr-6 sm:mr-8" />
          </div>
        </>
      )}

      {activeStep === 5 && step.checklist && (
        <>
          <div className="absolute left-[1%] sm:left-[3%] top-[14%] sm:top-[16%] max-w-[140px] sm:max-w-[215px]">
            <ThoughtBubble accent="#FACC15" delay={0.28} floatAmp={4} floatDur={3.4} isInView={isInView} reducedMotion={reducedMotion} className="px-2.5 py-2 sm:px-4 sm:py-2.5">
              <div className="flex items-center gap-1.5 text-[10.5px] sm:text-xs font-medium text-[#F5F3FF]">
                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-[#FACC15]" />
                <span>{step.checklist[0]}</span>
              </div>
            </ThoughtBubble>
            <ThoughtTrail accent="#FACC15" align="left" className="mt-1 ml-6 sm:ml-8" />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 top-[0%] sm:top-[1%] max-w-[168px] sm:max-w-[240px]">
            <ThoughtBubble accent="#5EEAD4" delay={0.38} floatAmp={4} floatDur={3.8} isInView={isInView} reducedMotion={reducedMotion} className="px-2.5 py-1.5 sm:px-4 sm:py-2">
              <div className="flex items-center justify-center gap-1.5 text-[10.5px] sm:text-xs font-semibold text-[#F5F3FF]">
                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-[#5EEAD4]" />
                <span>{step.checklist[1]}</span>
              </div>
            </ThoughtBubble>
            <ThoughtTrail accent="#5EEAD4" align="center" className="mt-1" />
          </div>

          <div className="absolute right-[1%] sm:right-[3%] top-[14%] sm:top-[16%] max-w-[140px] sm:max-w-[215px]">
            <ThoughtBubble accent="#FACC15" delay={0.48} floatAmp={4} floatDur={3.5} isInView={isInView} reducedMotion={reducedMotion} className="px-2.5 py-2 sm:px-4 sm:py-2.5">
              <div className="flex items-center gap-1.5 text-[10.5px] sm:text-xs font-medium text-[#F5F3FF]">
                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-[#FACC15]" />
                <span>{step.checklist[2]}</span>
              </div>
            </ThoughtBubble>
            <ThoughtTrail accent="#FACC15" align="right" className="mt-1 mr-6 sm:mr-8" />
          </div>
        </>
      )}
    </div>
  );
}
