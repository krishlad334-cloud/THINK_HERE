import React from 'react';
import CharacterVisual from './CharacterVisual';
import FloatingWindows from './FloatingWindows';
import { Globe, AlertTriangle, XCircle, CheckCircle2, Bot, Users } from 'lucide-react';

/**
 * Scene2SearchingEverywhere
 * PRIMARY ANIMATION REFERENCE
 * Heading: "More Answers. Still No Clear Direction."
 * Description: "You can search everywhere, but finding advice that truly fits your situation is different."
 * Highlight text: "Your problem deserves more than a generic answer."
 * 
 * Includes the "AI Alone vs. OverThink" comparison card.
 */
export default function Scene2SearchingEverywhere({ progress = 0.5 }) {
  return (
    <div className="relative w-full min-h-[720px] flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6 overflow-hidden">
      {/* Narrative Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-6 z-30">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-semibold text-blue-800 shadow-xs">
          <Globe className="w-4 h-4 text-blue-600" />
          <span>Scene 02 • Searching Everywhere</span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          More Answers. Still <span className="text-amber-600">No Clear Direction</span>.
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          You can search everywhere, but finding advice that truly fits your situation is different.
        </p>

        {/* Highlight Callout Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900 text-amber-300 text-xs sm:text-sm font-semibold shadow-md">
          <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 flex-shrink-0" />
          <span>"Your problem deserves more than a generic answer."</span>
        </div>
      </div>

      {/* Main Visual Stage: Character Immersed in 3-Layer Depth Sandwich */}
      <div className="relative w-full max-w-6xl mx-auto min-h-[480px] sm:min-h-[560px] flex items-center justify-center">
        {/* Layer 1: Background Floating Windows (Behind the human) */}
        <FloatingWindows progress={progress} layer="back" />

        {/* Layer 2: Central Cutout Character with 3D Tilt */}
        <div
          className="relative z-10 transition-transform duration-300 pointer-events-auto"
          style={{
            transform: `scale(${1 + (progress - 0.5) * 0.04})`
          }}
        >
          <CharacterVisual
            state="searching"
            progress={progress}
            scrub={true}
            aspect="portrait"
            enableTilt={true}
            className="w-full max-w-[360px] sm:max-w-[440px]"
          />
        </div>

        {/* Layer 3: Foreground Floating Windows & Thought Climax (In front of the human) */}
        <FloatingWindows progress={progress} layer="front" />
      </div>

      {/* =================================================================== */}
      {/* BEFORE VS. AFTER: AI SEARCH ALONE VS. OVERTHINK HUMAN GUIDANCE      */}
      {/* =================================================================== */}
      <div className="w-full max-w-5xl mx-auto mt-10 sm:mt-14 z-20">
        <div className="text-center mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Why Generic Information Leaves You Stuck
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            A real solution requires personal context, not standard web scrape responses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card A: Searching AI Alone */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-rose-100 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-800">Searching AI Alone</span>
              </div>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                High Ambiguity
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span><strong>15+ open tabs</strong> with conflicting advice and listicles</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span><strong>Zero context</strong> of your real constraints, budget, or team</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span><strong>Unaccountable suggestions</strong> with nobody to answer follow-up questions</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span><strong>Analysis paralysis:</strong> more answers without knowing what to execute</span>
              </li>
            </ul>
          </div>

          {/* Card B: With OverThink Human Guidance */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-50/60 to-teal-50/60 border border-emerald-200/80 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-[#004845]">With OverThink Guidance</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Verified Clarity
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                <span><strong>1 vetted human expert</strong> who reviews your exact situation</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                <span><strong>Diagnostic questions</strong> tailored to your product, audience, and goals</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                <span><strong>Custom action roadmap</strong> with prioritized steps & milestones</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                <span><strong>Direct 1-on-1 accountability:</strong> real answers from someone who did it</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
