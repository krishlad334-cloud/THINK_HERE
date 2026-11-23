import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import LandingNavbar from './LandingNavbar';
import Scene1Overthinking from './Scene1Overthinking';
import Scene2SearchingEverywhere from './Scene2SearchingEverywhere';
import Scene3DiscoverThink from './Scene3DiscoverThink';
import Scene4HumanConnection from './Scene4HumanConnection';
import Scene5ApplySucceed from './Scene5ApplySucceed';
import LandingFAQ from './LandingFAQ';
import Logo from '../common/Logo';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CURRENT_YEAR = new Date().getFullYear();

/**
 * LandingPage
 * Orchestrates the 5 connected scroll-based storytelling scenes:
 * 1. OVERTHINKING – Main character confused, thoughts multiply
 * 2. SEARCHING EVERYWHERE – Floating 3D multi-screen information overload (Primary visual reference)
 * 3. DISCOVERING THINK – Clutter fades, discovering OverThink, input typing
 * 4. HUMAN CONNECTION – Dr. Elena Vance accepts OverThink, 1-on-1 dialogue & action plan
 * 5. APPLY, GROW & SUCCEED – Milestones checked off, 0% -> 100% progress, triumph, final CTA
 */
export default function LandingPage({
  onSignIn,
  onStartThink,
  isAuthenticated = false,
  currentUser = null,
  onGoToApp
}) {
  const [sceneProgress, setSceneProgress] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  });

  const scene1Ref = useRef(null);
  const scene2Ref = useRef(null);
  const scene3Ref = useRef(null);
  const scene4Ref = useRef(null);
  const scene5Ref = useRef(null);

  // Set up GSAP ScrollTrigger for all 5 scenes with calibrated triggers
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const refs = [scene1Ref, scene2Ref, scene3Ref, scene4Ref, scene5Ref];

    // Calibrated start/end points per scene for natural storytelling scrub
    const sceneConfigs = [
      { start: 'top 90px', end: 'bottom 25%' }, // Scene 1: Starts at top of page (0.0) -> scrolls to exit (1.0)
      { start: 'top 75%', end: 'bottom 25%' },  // Scene 2: Searching Everywhere 3D clutter
      { start: 'top 75%', end: 'bottom 25%' },  // Scene 3: Discovering THINK & live typing
      { start: 'top 75%', end: 'bottom 25%' },  // Scene 4: 1-on-1 Human Connection
      { start: 'top 75%', end: 'bottom 75%' }   // Scene 5: Action Plan & 100% Progress
    ];

    const triggers = refs.map((ref, idx) => {
      const sceneNum = idx + 1;
      if (!ref.current) return null;
      const config = sceneConfigs[idx] || { start: 'top 75%', end: 'bottom 25%' };

      return ScrollTrigger.create({
        trigger: ref.current,
        start: config.start,
        end: config.end,
        scrub: prefersReducedMotion ? false : 0.35,
        onUpdate: (self) => {
          setSceneProgress((prev) => ({
            ...prev,
            [sceneNum]: self.progress
          }));
        }
      });
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t && t.kill());
    };
  }, []);

  // Smooth scroll to a target scene
  const scrollToScene = (sceneNum) => {
    const refs = [scene1Ref, scene2Ref, scene3Ref, scene4Ref, scene5Ref];
    const targetRef = refs[sceneNum - 1];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f8fafc] text-slate-900 font-sans antialiased overflow-x-hidden selection:bg-[#004845]/10 selection:text-[#004845]">
      {/* Fixed Sticky Header */}
      <LandingNavbar
        onNavigateScene={scrollToScene}
        onSignIn={onSignIn}
        onStartThink={onStartThink}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onGoToApp={onGoToApp}
      />

      {/* Hero Atmosphere / Background Lighting Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-emerald-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-teal-100/35 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/6 w-[700px] h-[700px] bg-emerald-50/60 rounded-full blur-3xl" />
      </div>

      {/* =================================================================== */}
      {/* 5 CONNECTED SCENES                                                  */}
      {/* =================================================================== */}
      <main className="relative z-10 pt-20 sm:pt-24 pb-16">
        {/* SCENE 01: OVERTHINKING */}
        <section
          ref={scene1Ref}
          id="scene-1"
          className="min-h-[85vh] w-full max-w-[1440px] mx-auto flex items-center justify-center border-b border-slate-200/40 relative px-4 sm:px-8 lg:px-12 xl:px-16"
        >
          <Scene1Overthinking
            progress={sceneProgress[1]}
            onStartThink={onStartThink}
          />
          {/* Scroll Down Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 text-xs font-semibold animate-pulse">
            <span>Scroll to explore the journey</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </section>

        {/* SCENE 02: SEARCHING EVERYWHERE (PRIMARY ANIMATION REFERENCE) */}
        <section
          ref={scene2Ref}
          id="scene-2"
          className="min-h-[95vh] w-full max-w-[1440px] mx-auto flex items-center justify-center border-b border-slate-200/40 relative px-4 sm:px-8 lg:px-12 xl:px-16"
        >
          <Scene2SearchingEverywhere progress={sceneProgress[2]} />
        </section>

        {/* SCENE 03: DISCOVER THINK (THE TURNING POINT) */}
        <section
          ref={scene3Ref}
          id="scene-3"
          className="min-h-[85vh] w-full max-w-[1440px] mx-auto flex items-center justify-center border-b border-slate-200/40 relative px-4 sm:px-8 lg:px-12 xl:px-16"
        >
          <Scene3DiscoverThink progress={sceneProgress[3]} />
        </section>

        {/* SCENE 04: HUMAN CONNECTION & PERSONALIZED SOLUTION (USP) */}
        <section
          ref={scene4Ref}
          id="scene-4"
          className="min-h-[95vh] w-full max-w-[1440px] mx-auto flex items-center justify-center border-b border-slate-200/40 relative px-4 sm:px-8 lg:px-12 xl:px-16"
        >
          <Scene4HumanConnection progress={sceneProgress[4]} />
        </section>

        {/* SCENE 05: APPLY, GROW & SUCCEED (TRANSFORMATION & HERO CTA) */}
        <section
          ref={scene5Ref}
          id="scene-5"
          className="min-h-[95vh] w-full max-w-[1440px] mx-auto flex items-center justify-center relative px-4 sm:px-8 lg:px-12 xl:px-16"
        >
          <Scene5ApplySucceed
            progress={sceneProgress[5]}
            onStartThink={onStartThink}
            onSignIn={onSignIn}
            isAuthenticated={isAuthenticated}
            onGoToApp={onGoToApp}
          />
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <LandingFAQ />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-10 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" showTagline={true} />

          {/* Developed by Krish Lad - Clean Modern Credit */}
          <div className="text-xs text-slate-500 font-medium select-none text-center">
            Developed by <span className="font-bold text-[#004845]">Krish Lad</span>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-right space-y-1">
            <div>&copy; {CURRENT_YEAR} OverThink Platform. All rights reserved.</div>
            <div className="text-slate-400">
              AI Can Give You Answers. THINK Connects You With The Right Human Expertise.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
