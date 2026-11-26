import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Cpu, UserCheck } from 'lucide-react';
import { STORY_STEPS } from '../data/landingStorySteps';

export default function StoryStepCard({
  activeStep,
  current,
  typedText,
  routeChoice,
  onSelectRoute,
  onGoToStep,
  progressBarRef,
  reducedMotion,
}) {
  const StepIcon = current.icon;

  return (
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
            <StepIcon className="h-4 w-4" />
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
            {current.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-xl border border-[#4C4585]/60 bg-[#0A0816]/75 px-3 py-1.5 text-xs text-[#F5F3FF]"
              >
                {chip}
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
              onClick={() => onSelectRoute('human')}
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
              onClick={() => onSelectRoute('ai')}
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
                <span className="mr-2 font-semibold text-[#5EEAD4]">{msg.who}:</span>
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
            onClick={() => onGoToStep(activeStep - 1)}
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
                onClick={() => onGoToStep(idx)}
                aria-label={`Go to step ${s.num}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === activeStep ? 'w-6 bg-[#5EEAD4]' : 'w-2 bg-[#4C4585]'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => onGoToStep((activeStep + 1) % STORY_STEPS.length)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#5EEAD4] px-3.5 py-2 text-xs font-bold text-[#0A0816] transition hover:scale-[1.03]"
          >
            <span>{activeStep === STORY_STEPS.length - 1 ? 'Replay' : 'Next Step'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
