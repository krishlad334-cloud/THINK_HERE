import React, { useState } from 'react';
import CharacterVisual from './CharacterVisual';
import Logo from '../common/Logo';
import { Send, Shield, Users, Rocket, Cloud, Briefcase } from 'lucide-react';

/**
 * Scene3DiscoverThink
 * THE TURNING POINT
 * Heading: "Discover THINK. Find The Right Perspective."
 * Description: "One platform to share your challenges and connect with people who understand how to solve them."
 * 
 * Features interactive problem preset chips that update the prompt and tags in real time!
 */
export default function Scene3DiscoverThink({ progress = 0.5 }) {
  const scenarios = [
    {
      id: 'growth',
      icon: Rocket,
      label: 'SaaS Growth & Scale',
      text: 'I am struggling to scale my business without compromising team stability. I need a clear roadmap from someone who has solved this.'
    },
    {
      id: 'cloud',
      icon: Cloud,
      label: 'Cloud Architecture Audit',
      text: 'Our microservices latency spikes 400% during peak user traffic. Need a verified cloud architect to audit our database bottlenecks.'
    },
    {
      id: 'sales',
      icon: Briefcase,
      label: 'B2B Funnel Conversion',
      text: 'Our enterprise free-to-paid trial conversion dropped below 2.1%. Looking for an ex-VP of Sales to optimize our onboarding flow.'
    }
  ];

  const [activeScenarioId, setActiveScenarioId] = useState('growth');
  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  // Typing simulation based on scroll progress (0.2 to 0.8)
  const fullText = activeScenario.text;
  const typeRatio = Math.max(0, Math.min(1, (progress - 0.2) / 0.5));
  const charsCount = Math.floor(typeRatio * fullText.length);
  const currentTyped = charsCount >= fullText.length ? fullText : fullText.slice(0, Math.max(charsCount, 25));
  const isReadyToSend = progress > 0.65;

  return (
    <div className="relative w-full min-h-[640px] sm:min-h-[720px] flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6">
      {/* Narrative Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-8 z-10">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Discover <span className="text-[#004845]">THINK</span>. Find The Right <span className="text-[#16a34a]">Perspective</span>.
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          One platform to share your challenges and connect with people who understand how to solve them.
        </p>
      </div>

      {/* Main Split Layout: Character on Left, OverThink Submission Interface on Right */}
      <div className="relative w-full max-w-6xl xl:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Character Discovering THINK (Hopeful, Upright, Hand on Mouse) */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            className="transition-transform duration-500 w-full max-w-[360px] sm:max-w-[420px]"
            style={{
              transform: `scale(${1 + (progress - 0.5) * 0.04})`
            }}
          >
            <CharacterVisual
              state="discovering"
              progress={progress}
              scrub={true}
              aspect="portrait"
              className="w-full"
            />
          </div>
        </div>

        {/* Right Column: The Real OverThink Submission Interface */}
        <div className="lg:col-span-7">
          <div
            className="rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl p-5 sm:p-8 space-y-5 transition-all duration-500"
            style={{
              transform: `translateY(${(1 - Math.min(progress * 1.5, 1)) * 15}px)`,
              opacity: Math.min(progress * 2, 1)
            }}
          >
            {/* Top Brand Bar */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 gap-2">
              <Logo size="sm" showTagline={false} />
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Confidential & Verified</span>
                </span>
              </div>
            </div>

            {/* Prompt Header */}
            <div className="space-y-1">
              <h3 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
                What are you thinking about?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Share your challenge. Connect with the right expertise.
              </p>
            </div>

            {/* Interactive Scenario Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Tap an example scenario to test:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {scenarios.map((sc) => {
                  const Icon = sc.icon;
                  const isActive = sc.id === activeScenarioId;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setActiveScenarioId(sc.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#004845] text-white shadow-xs scale-102'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{sc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* The Live Typing Problem Input Box */}
            <div className="relative rounded-2xl bg-slate-50 border-2 border-emerald-500/60 p-3.5 sm:p-4 shadow-inner">
              <div className="min-h-[75px] sm:min-h-[90px] font-sans text-xs sm:text-sm md:text-base text-slate-800 leading-relaxed">
                {currentTyped}
                <span className="inline-block w-1.5 sm:w-2 h-3.5 sm:h-4 ml-1 bg-[#16a34a] animate-pulse align-middle" />
              </div>

              {/* Problem Submission Status Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs">
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Ready for Consultant Review</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {currentTyped.length} / {fullText.length} chars
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 gap-3 sm:gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Users className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Available to vetted human consultants</span>
              </div>

              <button
                type="button"
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all duration-300 ${
                  isReadyToSend
                    ? 'bg-[#16a34a] hover:bg-[#15803d] shadow-emerald-600/30 ring-4 ring-emerald-500/20 scale-102'
                    : 'bg-[#004845] hover:bg-[#023b39] shadow-[#004845]/20'
                }`}
              >
                <span>Submit OverThink</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
