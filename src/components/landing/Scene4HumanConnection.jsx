import React from 'react';
import CharacterVisual from './CharacterVisual';
import ConsultantVisual from './ConsultantVisual';
import {
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Clock,
  FileCheck
} from 'lucide-react';

export default function Scene4HumanConnection({ progress = 0.5 }) {
  const isAccepted = progress >= 0.3;
  const showChat1 = progress >= 0.45;
  const showChat2 = progress >= 0.6;
  const showChat3 = progress >= 0.75;
  const showChat4 = progress >= 0.88;

  return (
    <div className="relative w-full min-h-[780px] flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-8 z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Not Just Answers. <span className="text-[#020617]">Real Human</span> <span className="text-[#0891b2]">Understanding</span>.
        </h2>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Connect with experienced consultants who understand your situation and help you find practical solutions.
        </p>
      </div>

      <div className="relative w-full max-w-6xl xl:max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
          <div className="relative p-5 sm:p-6 rounded-3xl bg-white/95 border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/5 flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-left">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-800">Alex Morgan</span>
                <span className="text-[10px] text-slate-400">Founder & Client</span>
              </div>
              <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
                OverThink Submitted
              </span>
            </div>

            <CharacterVisual
              state="connecting"
              progress={progress}
              scrub={true}
              lookDirection="right"
              size="md"
              className="w-full max-w-[280px] my-2"
            />

            <div
              className={`w-full p-2.5 rounded-xl border text-xs font-medium transition-all duration-500 ${
                isAccepted
                  ? 'bg-cyan-50/90 border-cyan-200 text-cyan-800 shadow-sm'
                  : 'bg-slate-50 border-slate-200/60 text-slate-500'
              }`}
            >
              {isAccepted ? (
                <div className="flex items-center justify-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  <span>Dr. Elena Vance accepted your OverThink!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Matching with certified expert...</span>
                </div>
              )}
            </div>
          </div>

          <div className="relative p-5 sm:p-6 rounded-3xl bg-white/95 border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/5 flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-left">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="text-xs font-bold text-slate-800">Dr. Elena Vance</span>
                <span className="text-[10px] text-slate-400">Cloud & Strategy Consultant</span>
              </div>
              <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
                Top Rated • 99% Satisfaction
              </span>
            </div>

            <ConsultantVisual
              hasAccepted={isAccepted}
              progress={progress}
              scrub={true}
              size="md"
              className="w-full max-w-[280px] my-2"
            />

            <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
              <span className="text-slate-600 font-medium">OverThink Status:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                  isAccepted
                    ? 'bg-cyan-100 text-cyan-800'
                    : 'bg-amber-100 text-amber-800 animate-pulse'
                }`}
              >
                {isAccepted ? '✓ In Active Consultation' : 'Available in Feed'}
              </span>
            </div>
          </div>
        </div>

        <div
          className="rounded-3xl bg-white/98 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_60px_rgba(8,145,178,0.09)] ring-1 ring-black/5 overflow-hidden transition-all duration-500"
          style={{
            transform: `translateY(${(1 - Math.min(progress * 1.3, 1)) * 20}px)`,
            opacity: Math.min(progress * 2, 1)
          }}
        >
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#020617] via-[#082f49] to-[#020617] text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight">Direct Consultation Workspace</h4>
                <p className="text-[11px] text-cyan-200/80 font-normal">
                  Private & Encrypted • 1-on-1 Guidance
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-cyan-200">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified Expert</span>
            </div>
          </div>

          <div className="p-6 space-y-4 max-h-[440px] overflow-y-auto bg-slate-50/50">
            <div
              className={`flex gap-3 max-w-[85%] transition-all duration-500 ${
                showChat1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex-shrink-0 flex items-center justify-center font-bold text-xs text-slate-700">
                AM
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-sm bg-white border border-slate-200 shadow-xs text-xs sm:text-sm text-slate-800 leading-relaxed">
                <div className="text-[10px] font-bold text-slate-400 mb-1">Alex Morgan (Client)</div>
                "I am struggling to grow my business. I have tried different strategies, but I am not getting the expected results."
              </div>
            </div>

            <div
              className={`flex gap-3 max-w-[88%] ml-auto justify-end transition-all duration-500 delay-100 ${
                showChat2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <div className="p-3.5 rounded-2xl rounded-tr-sm bg-[#020617] text-white shadow-xs text-xs sm:text-sm leading-relaxed text-left border border-cyan-900/30">
                <div className="text-[10px] font-bold text-cyan-200 mb-1 flex items-center gap-1">
                  <span>Dr. Elena Vance (Consultant)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                </div>
                "Let's first understand your target audience, current strategy, and business goals. Based on that, we can create a practical action plan."
              </div>
              <div className="w-8 h-8 rounded-full bg-cyan-100 border border-cyan-300 flex-shrink-0 flex items-center justify-center font-bold text-xs text-cyan-800">
                EV
              </div>
            </div>

            <div
              className={`flex gap-3 max-w-[85%] transition-all duration-500 delay-150 ${
                showChat3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex-shrink-0 flex items-center justify-center font-bold text-xs text-slate-700">
                AM
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-sm bg-white border border-slate-200 shadow-xs text-xs sm:text-sm text-slate-800 leading-relaxed">
                <div className="text-[10px] font-bold text-slate-400 mb-1">Alex Morgan (Client)</div>
                "That makes sense. What should I focus on first?"
              </div>
            </div>

            <div
              className={`flex gap-3 max-w-[90%] ml-auto justify-end transition-all duration-500 delay-200 ${
                showChat4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <div className="p-4 rounded-2xl rounded-tr-sm bg-[#020617] text-white shadow-md text-xs sm:text-sm leading-relaxed text-left space-y-3 border border-cyan-900/30">
                <div className="text-[10px] font-bold text-cyan-200 flex items-center gap-1">
                  <span>Dr. Elena Vance (Consultant)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                </div>
                <p>
                  "Start by identifying your ideal customers and improving your conversion process. I'll guide you through the next steps."
                </p>

                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                    <FileCheck className="w-4 h-4" />
                    <span>Attached Tailored Action Blueprint</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-white/90">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <strong>Phase 1:</strong> Ideal Customer Profile (ICP) validation
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <strong>Phase 2:</strong> 3-Step Funnel Friction Audit
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-cyan-100 border border-cyan-300 flex-shrink-0 flex items-center justify-center font-bold text-xs text-cyan-800">
                EV
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
