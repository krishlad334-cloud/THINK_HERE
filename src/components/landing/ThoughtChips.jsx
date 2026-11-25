import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const THOUGHTS = [
  'Should I pivot my SaaS pricing model?',
  'How do I negotiate my VP Engineering offer?',
  'Is my business idea worth pursuing?',
];

/**
 * Cycling glass pills with glowing #5EEAD4 teal indicator dot.
 */
export default function ThoughtChips({ reducedMotion = false }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % THOUGHTS.length);
    }, 2600);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className="flex flex-wrap gap-2.5 pt-1" aria-label="Example thoughts shared on OverThink">
      {THOUGHTS.map((text, idx) => {
        const isActive = idx === activeIdx;
        return (
          <motion.button
            key={text}
            type="button"
            onClick={() => setActiveIdx(idx)}
            animate={
              reducedMotion
                ? {}
                : {
                    scale: isActive ? 1.02 : 0.98,
                    borderColor: isActive
                      ? 'rgba(94, 234, 212, 0.7)'
                      : 'rgba(76, 69, 133, 0.45)',
                  }
            }
            transition={{ duration: 0.35 }}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium backdrop-blur-md transition-colors ${
              isActive
                ? 'bg-[#15122B]/85 text-[#F5F3FF] shadow-[0_0_20px_rgba(94,234,212,0.22)]'
                : 'bg-[#15122B]/50 text-[#A9A4C8] hover:text-[#F5F3FF]'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full transition-all ${
                isActive
                  ? 'bg-[#5EEAD4] shadow-[0_0_10px_#5EEAD4] scale-110'
                  : 'bg-[#5EEAD4]/40'
              }`}
            />
            <span>“{text}”</span>
          </motion.button>
        );
      })}
    </div>
  );
}
