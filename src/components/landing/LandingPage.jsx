import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion, useIsMobile } from '../../hooks/useReducedMotion';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

import Loader from './Loader';
import Cursor from './Cursor';
import Navbar from './Navbar';

import Hero from '../../sections/Hero';
import HowItWorks from '../../sections/HowItWorks';
import HumanVsAI from '../../sections/HumanVsAI';
import UseCases from '../../sections/UseCases';
import TwentyFourHour from '../../sections/TwentyFourHour';
import Testimonials from '../../sections/Testimonials';
import FinalCTA from '../../sections/FinalCTA';
import Footer from '../../sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage({
  onSignIn,
  onStartThink,
  isAuthenticated = false,
  currentUser = null,
  onGoToApp,
  onLogout,
  skipLoader = false,
}) {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile(768);
  const isCompact = useIsMobile(1024);
  const [, setReady] = useState(skipLoader);

  const { scrollTo } = useSmoothScroll({ disabled: reducedMotion });

  useEffect(() => {
    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 350);
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('orientationchange', onResize);
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());
    return () => {
      clearTimeout(refreshId);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-[#0A0816] font-sans text-[#F5F3FF] antialiased selection:bg-[#A855F7]/30 selection:text-[#F5F3FF]">
      {!skipLoader && (
        <Loader reducedMotion={reducedMotion} onComplete={() => setReady(true)} />
      )}

      <Cursor disabled={isMobile || reducedMotion} />

      <Navbar
        onNavigate={(target) => scrollTo(target)}
        onSignIn={onSignIn}
        onStartThink={onStartThink}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onGoToApp={onGoToApp}
        onLogout={onLogout}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="landing-dot-grid absolute inset-0 opacity-70" />
        <div className="absolute -top-44 left-1/4 h-[580px] w-[580px] rounded-full bg-[#A855F7]/12 blur-[140px]" />
        <div className="absolute top-1/3 -right-32 h-[520px] w-[520px] rounded-full bg-[#5EEAD4]/10 blur-[140px]" />
        <div className="landing-grain absolute inset-0" />
      </div>

      <main className="relative z-10">
        <Hero
          onStartThink={onStartThink}
          onExplore={(target) => scrollTo(target)}
          isAuthenticated={isAuthenticated}
          onGoToApp={onGoToApp}
          isMobile={isMobile}
          reducedMotion={reducedMotion}
        />
        <HowItWorks
          isMobile={isCompact}
          reducedMotion={reducedMotion}
          onScrollTo={scrollTo}
        />
        <HumanVsAI reducedMotion={reducedMotion} />
        <UseCases isMobile={isCompact} reducedMotion={reducedMotion} />
        <TwentyFourHour reducedMotion={reducedMotion} />
        <Testimonials />
        <FinalCTA
          onStartThink={onStartThink}
          onSignIn={onSignIn}
          isAuthenticated={isAuthenticated}
          onGoToApp={onGoToApp}
          reducedMotion={reducedMotion}
        />
      </main>

      <Footer onNavigate={(target) => scrollTo(target)} />
    </div>
  );
}
