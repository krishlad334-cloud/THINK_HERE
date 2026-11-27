import React from 'react';
import { motion } from 'framer-motion';
import HumanMindStage from '../components/landing/HumanMindStage';

export default function StoryStepCard({
  step,
  index,
  isLast = false,
  routeChoice,
  onSelectRoute,
  reducedMotion = false,
  nextAccent,
}) {
  return (
    <article className="relative flex flex-col items-center">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-6 sm:mb-8 max-w-2xl text-center space-y-3"
      >
        <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#F5F3FF] leading-tight">
          <span className="mr-2.5" style={{ color: step.accent }}>
            {step.num}.
          </span>
          {step.title}
        </h3>

        <p className="text-sm sm:text-base leading-relaxed text-[#A9A4C8]">
          {step.desc}
        </p>
      </motion.div>

      <HumanMindStage
        step={step}
        index={index}
        routeChoice={routeChoice}
        onSelectRoute={onSelectRoute}
        reducedMotion={reducedMotion}
      />

      {!isLast && (
        <div
          aria-hidden="true"
          className="mt-4 sm:mt-6 flex flex-col items-center gap-1.5"
        >
          <div
            className="h-12 sm:h-16 w-[2px] rounded-full opacity-55"
            style={{
              background: `linear-gradient(to bottom, ${step.accent}, ${nextAccent || step.accent})`,
            }}
          />
          <span
            className="h-2 w-2 rounded-full opacity-75"
            style={{
              backgroundColor: nextAccent || step.accent,
              boxShadow: `0 0 10px ${nextAccent || step.accent}`,
            }}
          />
        </div>
      )}
    </article>
  );
}
