import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, Cpu, Sparkles, UserCheck } from 'lucide-react';
import TiltCard from '../components/landing/TiltCard';

const HUMAN_POINTS = [
  'Deep empathy & context-aware judgment',
  'Real operators (<4% acceptance rate)',
  'Reads between the lines of politics & timing',
  'Private 1-on-1 dialogue & custom roadmap',
];

const AI_POINTS = [
  'Zero-latency clarity in seconds, 24/7',
  'Organizes messy brain dumps instantly',
  'Rapid scenario modeling & blind-spot checks',
  'Seamless handoff to a human specialist anytime',
];

/**
 * Human vs AI Section:
 * Small man-choosing.png centered between two 3D-tilt glass cards.
 * Hovering either card shifts the man slightly toward it.
 */
export default function HumanVsAI({ reducedMotion = false }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const dividerScale = useTransform(scrollYProgress, [0.15, 0.55], [0.2, 1]);
  const orbY = useTransform(scrollYProgress, [0.1, 0.8], [-24, 24]);

  return (
    <section
      id="human-vs-ai"
      ref={containerRef}
      className="relative py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 sm:mb-12 max-w-3xl text-center space-y-3"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#F5F3FF] sm:text-5xl">
            Human Empathy Meets{' '}
            <span className="bg-gradient-to-r from-[#A855F7] to-[#5EEAD4] bg-clip-text text-transparent">
              24/7 AI Speed
            </span>
          </h2>
          <p className="text-sm text-[#A9A4C8] sm:text-base">
            Use AI for instant structure, human consultants for nuanced
            decisions, or combine both in one workspace.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Left: Human Consultants */}
          <div className="lg:col-span-5">
            <TiltCard
              reducedMotion={reducedMotion}
              glowColor="rgba(94, 234, 212, 0.25)"
              className="h-full p-7 sm:p-9"
            >
              <div className="flex h-full flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#5EEAD4]/40 bg-[#5EEAD4]/15 text-[#5EEAD4]">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#5EEAD4]">
                      Empathy &amp; Experience
                    </span>
                    <h3 className="mt-1 font-display text-2xl font-bold text-[#F5F3FF]">
                      Human Consultants
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#A9A4C8]">
                    Seasoned founders, principal engineers, and career mentors
                    who bring lived judgment to high-stakes crossroads.
                  </p>
                </div>

                <ul className="space-y-3 border-t border-[#4C4585]/40 pt-5 text-sm text-[#F5F3FF]">
                  {HUMAN_POINTS.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#5EEAD4]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          </div>

          {/* Scroll-driven animated divider */}
          <div className="relative flex items-center justify-center lg:col-span-2 min-h-[80px]">
            <div className="relative flex h-16 w-full items-center justify-center lg:h-full lg:w-12">
              <motion.div
                style={reducedMotion ? {} : { scaleY: dividerScale }}
                className="hidden h-full w-0.5 origin-center rounded-full bg-gradient-to-b from-[#A855F7]/30 via-[#5EEAD4]/70 to-[#A855F7]/30 lg:block"
              />
              <motion.div
                style={reducedMotion ? {} : { scaleX: dividerScale }}
                className="h-0.5 w-full origin-center rounded-full bg-gradient-to-r from-[#A855F7] to-[#5EEAD4] lg:hidden"
              />
              <motion.div
                style={reducedMotion ? {} : { y: orbY }}
                className="absolute flex h-11 w-11 items-center justify-center rounded-full border border-[#5EEAD4]/60 bg-[#0A0816]/90 text-xs font-bold text-[#5EEAD4] shadow-[0_0_24px_rgba(94,234,212,0.35)]"
              >
                +
              </motion.div>
            </div>
          </div>

          {/* Right: AI Solutions */}
          <div className="lg:col-span-5">
            <TiltCard
              reducedMotion={reducedMotion}
              glowColor="rgba(168, 85, 247, 0.28)"
              className="h-full p-7 sm:p-9"
            >
              <div className="flex h-full flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#A855F7]/40 bg-[#A855F7]/15 text-[#A855F7]">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#A855F7]">
                      Speed &amp; 24/7 Availability
                    </span>
                    <h3 className="mt-1 font-display text-2xl font-bold text-[#F5F3FF]">
                      AI Solutions
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#A9A4C8]">
                    Always-on structured reasoning that untangles scattered
                    notes into clear options whenever inspiration strikes.
                  </p>
                </div>

                <ul className="space-y-3 border-t border-[#4C4585]/40 pt-5 text-sm text-[#F5F3FF]">
                  {AI_POINTS.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#A855F7]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}
