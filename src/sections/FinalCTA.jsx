import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import MagneticButton from '../components/landing/MagneticButton';

export default function FinalCTA({
  onStartThink,
  onSignIn,
  isAuthenticated = false,
  onGoToApp,
  reducedMotion = false,
}) {
  return (
    <section
      id="final-cta"
      className="relative flex items-center justify-center py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[340px] w-[340px] sm:h-[520px] sm:w-[520px] rounded-full bg-gradient-radial from-[#FACC15]/25 via-[#A855F7]/18 to-transparent blur-3xl animate-pulse-glow" />
      </div>

      <div className="relative z-20 mx-auto max-w-4xl px-4 text-center sm:px-8 space-y-7">
        <motion.h2
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="font-display text-4xl font-bold tracking-tight text-[#F5F3FF] sm:text-6xl"
        >
          Every Thought Deserves a{' '}
          <span className="bg-gradient-to-r from-[#A855F7] to-[#5EEAD4] bg-clip-text text-transparent">
            Solution.
          </span>
        </motion.h2>

        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.16 }}
          className="mx-auto max-w-xl text-base text-[#A9A4C8] sm:text-lg"
        >
          Clear the open tabs in your mind. Share your thought now and move
          forward with human expertise or AI clarity within 24 hours.
        </motion.p>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.24 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <MagneticButton
            reducedMotion={reducedMotion}
            onClick={isAuthenticated ? onGoToApp : onStartThink}
          >
            <span>{isAuthenticated ? 'Open Workspace' : 'Share your thought'}</span>
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>

          {!isAuthenticated && (
            <MagneticButton
              variant="secondary"
              reducedMotion={reducedMotion}
              onClick={onSignIn}
            >
              <span>Sign In</span>
            </MagneticButton>
          )}
        </motion.div>
      </div>
    </section>
  );
}
