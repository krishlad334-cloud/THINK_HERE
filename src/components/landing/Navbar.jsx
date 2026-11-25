import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, User, X } from 'lucide-react';
import Logo from '../common/Logo';

const NAV_LINKS = [
  { label: 'How it works', target: '#how-it-works' },
  { label: 'Human vs AI', target: '#human-vs-ai' },
  { label: 'Use cases', target: '#use-cases' },
  { label: '24h Promise', target: '#promise-24h' },
];

/**
 * Sticky glassmorphic Navbar:
 * - Uses the original OverThink vector Logo component
 * - Hides on scroll down, shows on scroll up with backdrop blur
 * - Preserves Sign In, Share your thought, and Workspace routes
 */
export default function Navbar({
  onNavigate,
  onSignIn,
  onStartThink,
  isAuthenticated = false,
  currentUser = null,
  onGoToApp,
}) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTarget, setActiveTarget] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

      if (y > 120 && y > lastY.current + 6) {
        setHidden(true);
      } else if (y < lastY.current - 6 || y <= 80) {
        setHidden(false);
      }
      lastY.current = y;

      // Track active section in viewport using viewport coordinates (works inside GSAP pin-spacers)
      const thresholdY = window.innerHeight * 0.42;
      let current = '';
      for (const item of NAV_LINKS) {
        const el = document.querySelector(item.target);
        if (el && el.getBoundingClientRect().top <= thresholdY) {
          current = item.target;
        }
      }
      setActiveTarget(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLink = (target) => {
    setMobileOpen(false);
    setActiveTarget(target);
    onNavigate?.(target);
  };

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden && !mobileOpen ? '-110%' : '0%' }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-[#4C4585]/40 bg-[#0A0816]/85 backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.45)]'
          : 'border-[#4C4585]/20 bg-[#0A0816]/45 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-3.5 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => handleLink('#hero')}
          className="rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4]"
          aria-label="OverThink Home"
        >
          <div className="hidden sm:block">
            <Logo size="md" showTagline={true} dark={true} />
          </div>
          <div className="sm:hidden">
            <Logo size="sm" showTagline={true} dark={true} />
          </div>
        </button>

        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-7"
        >
          {NAV_LINKS.map((item) => {
            const isActive = activeTarget === item.target;
            return (
              <button
                key={item.target}
                type="button"
                onClick={() => handleLink(item.target)}
                className={`relative py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4] rounded-md ${
                  isActive ? 'text-[#F5F3FF]' : 'text-[#A9A4C8] hover:text-[#F5F3FF]'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#5EEAD4]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3.5">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={onGoToApp}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#4C4585]/60 bg-[#15122B]/80 px-3 py-2 sm:px-3.5 text-xs sm:text-sm font-semibold text-[#F5F3FF] transition hover:border-[#5EEAD4]/60"
            >
              <User className="h-3.5 w-3.5 text-[#5EEAD4]" />
              <span>{currentUser?.name?.split(' ')[0] || 'Workspace'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#4C4585]/60 bg-[#15122B]/70 px-3 py-2 sm:border-transparent sm:bg-transparent sm:px-3.5 text-xs sm:text-sm font-semibold text-[#F5F3FF] sm:text-[#A9A4C8] transition hover:border-[#5EEAD4]/60 hover:bg-[#15122B]/70 hover:text-[#F5F3FF]"
            >
              <User className="h-3.5 w-3.5 text-[#5EEAD4] sm:text-current" />
              <span className="whitespace-nowrap">Sign In</span>
            </button>
          )}

          <button
            type="button"
            onClick={isAuthenticated ? onGoToApp : onStartThink}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#5EEAD4] px-4 py-2.5 text-xs sm:text-sm font-bold text-[#0A0816] shadow-[0_0_24px_rgba(168,85,247,0.35)] transition hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4]"
          >
            <span>{isAuthenticated ? 'Open Workspace' : 'Share your thought'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex rounded-xl border border-[#4C4585]/50 bg-[#15122B]/60 p-2 text-[#F5F3FF] lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[#4C4585]/40 bg-[#0A0816]/95 px-4 py-4 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col gap-1.5">
              {NAV_LINKS.map((item) => (
                <button
                  key={item.target}
                  type="button"
                  onClick={() => handleLink(item.target)}
                  className="w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-[#F5F3FF] hover:bg-[#15122B]"
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  if (isAuthenticated) {
                    onGoToApp?.();
                  } else {
                    onStartThink?.();
                  }
                }}
                className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#5EEAD4] py-2.5 text-xs font-bold text-[#0A0816]"
              >
                <span>{isAuthenticated ? 'Open Workspace' : 'Share your thought'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
