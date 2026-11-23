import React from 'react';
import CharacterVisual from './CharacterVisual';
import {
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';

/**
 * Scene5ApplySucceed
 * TRANSFORMATION: CONFUSION TO CONFIDENCE & TRIUMPH
 * 
 * Heading: "Turn The Right Advice Into Real Progress."
 * Description: "Take action, make better decisions, and move forward with confidence."
 * 
 * 5-Step Action Plan:
 * 1. Understand the problem.
 * 2. Follow expert guidance.
 * 3. Apply the recommended strategy.
 * 4. Measure progress.
 * 5. Achieve the desired result.
 * 
 * Final CTA:
 * "Start Your Think"
 * "Your next breakthrough could start with one conversation."
 * 
 * Brand Statement:
 * "Don't Just Search for Answers. Find the Right People to Move Forward."
 */
export default function Scene5ApplySucceed({
  progress = 0.5,
  onStartThink,
  onSignIn,
  isAuthenticated = false,
  onGoToApp
}) {
  // Compute milestone checkoffs based on scroll progress:
  // Step 1: >= 0.15
  // Step 2: >= 0.30
  // Step 3: >= 0.45
  // Step 4: >= 0.60
  // Step 5: >= 0.75
  const isStep1Done = progress >= 0.15;
  const isStep2Done = progress >= 0.3;
  const isStep3Done = progress >= 0.45;
  const isStep4Done = progress >= 0.6;
  const isStep5Done = progress >= 0.75;

  // Numerical percentage calculation
  const completedCount = [isStep1Done, isStep2Done, isStep3Done, isStep4Done, isStep5Done].filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((completedCount / 5) * 100));

  const isFullSuccess = progress >= 0.8;

  const stepsData = [
    { num: 1, title: 'Understand the problem', desc: 'Identify root bottlenecks with structured client intake', isDone: isStep1Done },
    { num: 2, title: 'Follow expert guidance', desc: 'Align on validated milestones with Dr. Elena Vance', isDone: isStep2Done },
    { num: 3, title: 'Apply the recommended strategy', desc: 'Implement customer funnel adjustments & clear team roles', isDone: isStep3Done },
    { num: 4, title: 'Measure progress', desc: 'Track key performance indicators and retention metrics', isDone: isStep4Done },
    { num: 5, title: 'Achieve the desired result', desc: 'Scale sustainably with 100% directional clarity', isDone: isStep5Done }
  ];

  return (
    <div className="relative w-full min-h-[920px] flex flex-col items-center justify-center py-16 px-4 sm:px-6">
      {/* Narrative Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#004845] shadow-xs">
          <Award className="w-4 h-4 text-[#16a34a]" />
          <span>Scene 05 • Apply & Succeed</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Turn The Right Advice Into <span className="text-[#16a34a]">Real Progress</span>.
        </h2>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Take action, make better decisions, and move forward with confidence.
        </p>
      </div>

      {/* Main Dual Grid: Action Plan Checklist on Left, Victorious Character on Right */}
      <div className="relative w-full max-w-6xl xl:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
        {/* Left Column: 5 Action Plan Milestones + Dynamic Progress Bar */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header with Progress Bar */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Personalized Action Plan</span>
                    <Sparkles className="w-4 h-4 text-[#16a34a]" />
                  </h3>
                  <p className="text-xs text-slate-500">
                    Execution roadmap provided by your verified consultant
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#16a34a] font-mono">
                    {progressPercent}%
                  </span>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">
                    Execution
                  </div>
                </div>
              </div>

              {/* Dynamic Animated Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200/60 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#004845] via-[#16a34a] to-[#22c55e] transition-all duration-500 ease-out shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* The 5 Action Steps */}
            <div className="space-y-3">
              {stepsData.map((step) => (
                <div
                  key={step.num}
                  className={`p-3.5 rounded-2xl border transition-all duration-500 flex items-start gap-3.5 ${
                    step.isDone
                      ? 'bg-emerald-50/70 border-emerald-200/90 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200/60 opacity-60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-300 ${
                      step.isDone
                        ? 'bg-[#16a34a] text-white shadow-xs scale-105'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {step.isDone ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs sm:text-sm font-bold tracking-tight ${
                          step.isDone ? 'text-slate-900' : 'text-slate-600'
                        }`}
                      >
                        {step.num}. {step.title}
                      </h4>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          step.isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {step.isDone ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Confident Victorious Character & Impact Cards */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div
            className="relative transition-all duration-500"
            style={{
              transform: `scale(${isFullSuccess ? 1.05 : 1})`
            }}
          >
            <CharacterVisual
              state="succeeding"
              progress={progress}
              scrub={true}
              lookDirection="center"
              size="lg"
              className="w-full max-w-[420px]"
            />

            {/* Victory Impact Stat Pills */}
            {isFullSuccess && (
              <>
                <div className="absolute top-4 -left-4 px-3.5 py-2 rounded-2xl bg-white/95 border border-emerald-200 shadow-xl flex items-center gap-2 animate-bounce">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black text-slate-900">+140% Growth</div>
                    <div className="text-[9px] text-slate-500">Milestone Met</div>
                  </div>
                </div>

                <div className="absolute top-12 -right-4 px-3.5 py-2 rounded-2xl bg-white/95 border border-teal-200 shadow-xl flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black text-slate-900">100% Clarity</div>
                    <div className="text-[9px] text-slate-500">Overthinking Ended</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* FINAL HERO CALL TO ACTION (Connects directly to Registration)       */}
      {/* =================================================================== */}
      <div className="w-full max-w-5xl xl:max-w-6xl mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#002826] via-[#004845] to-[#023b39] p-6 sm:p-10 lg:p-14 text-white shadow-2xl text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#16a34a]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5 sm:space-y-6 max-w-2xl mx-auto">
          {/* Logo Showcase */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white p-1 flex items-center justify-center">
                <img src="/logo.jpg" alt="OverThink" className="w-full h-full object-contain" />
              </div>
              <span className="font-black text-base sm:text-lg text-white">
                Over<span className="text-[#22c55e]">Think</span>
              </span>
            </div>
          </div>

          <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Don't Just Search for Answers.<br />
            <span className="text-[#22c55e]">Find the Right People to Move Forward.</span>
          </h3>

          <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
            Your next breakthrough could start with one conversation. Share your challenge with verified experts who help you execute with confidence.
          </p>

          {/* Core Action Button: Start Your Think / Open Workspace */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={isAuthenticated ? onGoToApp : onStartThink}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-slate-950 font-black text-sm sm:text-base hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-102 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg cursor-pointer"
            >
              <span>{isAuthenticated ? 'Open Your Workspace' : 'Start Your Think'}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
            </button>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={onGoToApp}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer"
              >
                Go to Dashboard
              </button>
            ) : onSignIn && (
              <button
                type="button"
                onClick={onSignIn}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer"
              >
                Sign In to Existing Account
              </button>
            )}
          </div>

          {/* Brand Manifesto Quote */}
          <div className="pt-5 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-emerald-200/80 gap-2 sm:gap-3">
            <span>"AI Can Give You Answers. THINK Connects You With The Right Human Expertise."</span>
            <span className="font-semibold text-white/90">Zero Risk • 24hr Matching Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
