import React from 'react';
import CharacterVisual from './CharacterVisual';
import {
  HelpCircle,
  Brain,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Rocket,
  Cloud,
  Briefcase,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

/**
 * Scene1Overthinking
 * Expansive Wide Hero Layout (matching the TimePe reference layout):
 * - Left column: Narrative headline, dilemma cards, and call-to-actions
 * - Right column: Cinematic real human video animation with 3D depth
 * - Bottom: Full-width industry specialization pill strip
 */
export default function Scene1Overthinking({
  progress = 0.5,
  onStartThink
}) {
  // Thought bubble progression milestones
  const showBubble1 = progress >= 0.15;
  const showBubble2 = progress >= 0.35;
  const showBubble3 = progress >= 0.55;
  const showBubble4 = progress >= 0.75;

  const categories = [
    { icon: Rocket, label: 'SaaS Growth & Scale', color: 'text-emerald-600' },
    { icon: Cloud, label: 'Cloud Architecture Audit', color: 'text-teal-600' },
    { icon: Briefcase, label: 'B2B Funnel Conversion', color: 'text-blue-600' },
    { icon: TrendingUp, label: 'Unit Economics & Capital', color: 'text-amber-600' },
    { icon: ShieldCheck, label: 'High-Availability Systems', color: 'text-emerald-700' }
  ];

  return (
    <div className="relative w-full min-h-[640px] lg:min-h-[720px] flex flex-col justify-center py-10 lg:py-16">
      {/* =================================================================== */}
      {/* MAIN 2-COLUMN EXPANSIVE HERO GRID                                   */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
        {/* LEFT COLUMN: HERO NARRATIVE & ACTION CTAS */}
        <div className="lg:col-span-7 space-y-5 lg:space-y-6 text-left">
          {/* Top Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50/90 border border-amber-200/70 text-[11px] font-semibold text-amber-800 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>24-Hour Verified Consultation Platform</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Every Big Decision Starts With A <span className="text-[#004845]">Question</span>.
          </h1>

          {/* Subheading */}
          <div className="space-y-2">
            <h2 className="text-base sm:text-xl font-bold text-slate-800">
              Turn Overthinking Into Validated Action.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl font-normal leading-relaxed">
              Sometimes, the hardest part isn't having a problem. It's knowing where to find the right solution.
            </p>
          </div>

          {/* Thought Dilemma Grid Cards (highlight with scroll progress) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {/* Dilemma 1 */}
            <div
              className={`p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 transition-all duration-300 ${
                showBubble1
                  ? 'border-teal-300 ring-2 ring-teal-500/10 shadow-xs'
                  : 'opacity-70'
              }`}
            >
              <div className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-200/80 text-[#004845] flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">"How do I solve this?"</span>
            </div>

            {/* Dilemma 2 */}
            <div
              className={`p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 transition-all duration-300 ${
                showBubble2
                  ? 'border-amber-300 ring-2 ring-amber-500/10 shadow-xs'
                  : 'opacity-70'
              }`}
            >
              <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">"What should I do next?"</span>
            </div>

            {/* Dilemma 3 */}
            <div
              className={`p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 transition-all duration-300 ${
                showBubble3
                  ? 'border-rose-300 ring-2 ring-rose-500/10 shadow-xs'
                  : 'opacity-70'
              }`}
            >
              <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">"Right decision?"</span>
            </div>

            {/* Dilemma 4 */}
            <div
              className={`p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 transition-all duration-300 ${
                showBubble4
                  ? 'border-emerald-300 ring-2 ring-emerald-500/10 shadow-xs'
                  : 'opacity-70'
              }`}
            >
              <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">"Where to find guidance?"</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onStartThink}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#004845] to-[#16a34a] hover:from-[#003836] hover:to-[#15803d] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-900/15 hover:shadow-lg hover:shadow-emerald-900/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Start Your Think</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: REAL HUMAN ANIMATION WITH 3D DEPTH */}
        <div className="lg:col-span-5 flex justify-center items-center relative">
          <div
            className="relative w-full max-w-[380px] sm:max-w-[420px] transition-transform duration-500 ease-out"
            style={{
              transform: `scale(${1 + progress * 0.04})`
            }}
          >
            <CharacterVisual
              state="overthinking"
              progress={progress}
              scrub={true}
              aspect="portrait"
              className="w-full"
            />

            {/* Desktop Thought Accents (Floating gracefully outside image perimeter) */}
            <div
              className={`hidden xl:flex absolute top-4 -left-20 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl text-slate-800 text-xs font-semibold items-center gap-2 transition-all duration-500 ${
                showBubble1 ? 'opacity-100 -translate-x-2' : 'opacity-0 translate-x-2 pointer-events-none'
              }`}
            >
              <div className="w-5 h-5 rounded-lg bg-teal-50 text-[#004845] flex items-center justify-center">
                <HelpCircle className="w-3 h-3" />
              </div>
              <span>"How do I solve this?"</span>
            </div>

            <div
              className={`hidden xl:flex absolute bottom-8 -right-16 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl text-slate-800 text-xs font-semibold items-center gap-2 transition-all duration-500 ${
                showBubble2 ? 'opacity-100 translate-x-2' : 'opacity-0 -translate-x-2 pointer-events-none'
              }`}
            >
              <div className="w-5 h-5 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-3 h-3" />
              </div>
              <span>"What should I do next?"</span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* BOTTOM FULL-WIDTH DOMAIN & SPECIALIZATION PILL STRIP                */}
      {/* Matches the TimePe bottom category strip                            */}
      {/* =================================================================== */}
      <div className="w-full mt-10 lg:mt-14 pt-6 border-t border-slate-200/70">
        <div className="flex items-center justify-between gap-2.5 overflow-x-auto pb-2 scrollbar-none text-slate-700 text-xs font-semibold">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.label}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow whitespace-nowrap flex-shrink-0"
              >
                <Icon className={`w-4 h-4 ${cat.color}`} />
                <span>{cat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
