import React from 'react';
import CharacterVisual from './CharacterVisual';
import { HelpCircle, Brain, Sparkles, AlertCircle } from 'lucide-react';

/**
 * Scene1Overthinking
 * Heading: "Every Big Decision Starts With A Question."
 * Description: "Sometimes, the hardest part isn't having a problem. It's knowing where to find the right solution."
 * 
 * Fully responsive:
 * - On Mobile: Thought bubbles sit cleanly above the character in a balanced 2x2 grid (zero photo overlap).
 * - On Desktop: Thought bubbles float gracefully outside the photo on left & right sides.
 */
export default function Scene1Overthinking({ progress = 0.5 }) {
  // Thought bubble progression milestones
  const showBubble1 = progress >= 0.15;
  const showBubble2 = progress >= 0.35;
  const showBubble3 = progress >= 0.55;
  const showBubble4 = progress >= 0.75;

  return (
    <div className="relative w-full min-h-[580px] sm:min-h-[640px] flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
      {/* Narrative Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-6 sm:mb-10 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-[#004845] shadow-xs">
          <Brain className="w-4 h-4 text-[#16a34a]" />
          <span>Scene 01 • The Dilemma</span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Every Big Decision Starts With A <span className="text-[#004845]">Question</span>.
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Sometimes, the hardest part isn't having a problem. It's knowing where to find the right solution.
        </p>
      </div>

      {/* MOBILE THOUGHT BUBBLES CLUSTER (Zero overlap over photo) */}
      <div className="md:hidden w-full max-w-sm mx-auto flex flex-col gap-2 mb-4 px-1 z-20">
        <div className="flex items-center justify-between gap-2">
          <div
            className={`flex-1 p-2 sm:p-2.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-sm text-slate-800 text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-300 ${
              showBubble1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="w-4 h-4 rounded-md bg-teal-50 border border-teal-200 flex items-center justify-center text-[#004845] flex-shrink-0">
              <HelpCircle className="w-3 h-3" />
            </div>
            <span className="truncate">"How do I solve this?"</span>
          </div>

          <div
            className={`flex-1 p-2 sm:p-2.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-sm text-slate-800 text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-300 ${
              showBubble2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="w-4 h-4 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="truncate">"What should I do next?"</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div
            className={`flex-1 p-2 sm:p-2.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-sm text-slate-800 text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-300 ${
              showBubble3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="w-4 h-4 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 flex-shrink-0">
              <AlertCircle className="w-3 h-3" />
            </div>
            <span className="truncate">"Right decision?"</span>
          </div>

          <div
            className={`flex-1 p-2 sm:p-2.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-sm text-slate-800 text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-300 ${
              showBubble4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="w-4 h-4 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <Brain className="w-3 h-3" />
            </div>
            <span className="truncate">"Where to find guidance?"</span>
          </div>
        </div>
      </div>

      {/* Main Visual Staging Canvas */}
      <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center">
        {/* Character Container with Desktop Floating Thoughts */}
        <div
          className="relative transition-transform duration-500 ease-out w-full max-w-[420px]"
          style={{
            transform: `scale(${1 + progress * 0.04})`
          }}
        >
          <CharacterVisual
            state="overthinking"
            aspect="portrait"
            className="w-full"
          />

          {/* ============================================================= */}
          {/* DESKTOP FLOATING THOUGHT BUBBLES (Outside photo perimeter)    */}
          {/* ============================================================= */}

          {/* Bubble 1: Top-Left Desktop */}
          <div
            className={`hidden md:flex absolute top-6 -left-36 lg:-left-44 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl text-slate-800 text-xs sm:text-sm font-semibold items-center gap-2.5 transition-all duration-500 ${
              showBubble1
                ? 'opacity-100 translate-x-0 scale-100'
                : 'opacity-0 -translate-x-4 scale-95 pointer-events-none'
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-[#004845]">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            <span>"How do I solve this?"</span>
          </div>

          {/* Bubble 2: Top-Right Desktop */}
          <div
            className={`hidden md:flex absolute top-12 -right-36 lg:-right-44 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl text-slate-800 text-xs sm:text-sm font-semibold items-center gap-2.5 transition-all duration-500 delay-75 ${
              showBubble2
                ? 'opacity-100 translate-x-0 scale-100'
                : 'opacity-0 translate-x-4 scale-95 pointer-events-none'
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>"What should I do next?"</span>
          </div>

          {/* Bubble 3: Mid-Left Desktop */}
          <div
            className={`hidden md:flex absolute top-48 -left-40 lg:-left-48 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl text-slate-800 text-xs sm:text-sm font-semibold items-center gap-2.5 transition-all duration-500 delay-150 ${
              showBubble3
                ? 'opacity-100 translate-x-0 scale-100'
                : 'opacity-0 -translate-x-4 scale-95 pointer-events-none'
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <span>"Am I making the right decision?"</span>
          </div>

          {/* Bubble 4: Mid-Right Desktop */}
          <div
            className={`hidden md:flex absolute top-56 -right-40 lg:-right-48 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl text-slate-800 text-xs sm:text-sm font-semibold items-center gap-2.5 transition-all duration-500 delay-200 ${
              showBubble4
                ? 'opacity-100 translate-x-0 scale-100'
                : 'opacity-0 translate-x-4 scale-95 pointer-events-none'
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Brain className="w-3.5 h-3.5" />
            </div>
            <span>"Where can I find the right guidance?"</span>
          </div>
        </div>
      </div>
    </div>
  );
}
