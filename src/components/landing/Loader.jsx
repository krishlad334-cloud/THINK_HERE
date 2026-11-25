import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoIcon } from '../common/Logo';

/**
 * Page-load & route-transition intro with animated progress counter (00% -> 100%)
 * featuring the clean OverThink white-squircle icon badge only.
 */
export default function Loader({ onComplete, reducedMotion = false, duration = 800 }) {
  const [progress, setProgress] = useState(reducedMotion ? 100 : 0);
  const [visible, setVisible] = useState(!reducedMotion);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (reducedMotion) {
      onCompleteRef.current?.();
      return undefined;
    }

    const start = Date.now();

    const timer = setInterval(() => {
      const ratio = Math.max(0, Math.min(1, (Date.now() - start) / duration));
      const eased = 1 - Math.pow(1 - ratio, 3);
      setProgress(Math.round(eased * 100));

      if (ratio >= 1) {
        clearInterval(timer);
        setTimeout(() => {
          setVisible(false);
          onCompleteRef.current?.();
        }, 120);
      }
    }, 25);

    return () => {
      clearInterval(timer);
    };
  }, [reducedMotion, duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0816] px-5 text-[#F5F3FF]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(168,85,247,0.16),rgba(34,211,238,0.1)_42%,transparent_72%)]" />

          <div className="relative z-10 flex w-full max-w-[240px] sm:max-w-[280px] flex-col items-center gap-6">
            <motion.div
              initial={reducedMotion ? false : { scale: 0.9, opacity: 0 }}
              animate={
                reducedMotion
                  ? { scale: 1, opacity: 1 }
                  : { scale: [0.96, 1.03, 1], opacity: 1 }
              }
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white p-2.5 border border-slate-200/80 shadow-[0_0_44px_rgba(34,211,238,0.3)]"
            >
              <LogoIcon className="h-full w-full" />
            </motion.div>

            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-[11px] font-medium tracking-wider text-[#A9A4C8]">
                <span>LOADING</span>
                <span className="font-display text-[#5EEAD4]">
                  {String(progress).padStart(2, '0')}%
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-[#15122B]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#A855F7] to-[#5EEAD4] transition-[width] duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
