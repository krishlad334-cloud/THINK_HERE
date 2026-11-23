import React from 'react';
import {
  Search,
  Bot,
  Sparkles,
  Layers,
  HelpCircle,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

/**
 * FloatingWindows
 * The Primary Visual Reference (Scene 02: Searching Everywhere)
 * Multi-layer 3D floating browser windows, AI chat interfaces, search engine SERP cards,
 * and information overload cards responding to scroll progress (0.0 to 1.0).
 * 
 * Supports 3-layer depth sandwich via `layer`:
 * - 'back': renders behind the human character (Search SERP, Forum Debate)
 * - 'front': renders in front of the human character (AI Chat, Strategy Gen, Central Thought Bubble)
 * - 'all': renders all layers together
 */
export default function FloatingWindows({ progress = 0.5, layer = 'all' }) {
  const showMissingAnswer = progress > 0.68;
  const isTransitioningOut = progress > 0.9;

  // Compute smooth dynamic transforms based on scroll progress
  // Window 1: Top-Left Search Engine SERP
  const w1X = (1 - Math.min(progress * 1.6, 1)) * -140; // slides in from left
  const w1Opacity = Math.min(progress * 2.5, 1) * (isTransitioningOut ? (1 - (progress - 0.9) * 10) : 1);
  const w1RotateY = -10 + progress * 6;
  const w1RotateX = 8 - progress * 4;

  // Window 2: Top-Right AI Chat Assistant (Neuromind AI)
  const w2X = (1 - Math.min((progress - 0.1) * 1.8, 1)) * 160; // slides in from right
  const w2Opacity = progress > 0.1 ? Math.min((progress - 0.1) * 3, 1) * (isTransitioningOut ? (1 - (progress - 0.9) * 10) : 1) : 0;
  const w2RotateY = 12 - progress * 5;
  const w2RotateX = 6 - progress * 3;

  // Window 3: Bottom-Left Forum & Conflicting Advice
  const w3Y = (1 - Math.min((progress - 0.25) * 1.8, 1)) * 120; // rises from bottom
  const w3Opacity = progress > 0.25 ? Math.min((progress - 0.25) * 3, 1) * (isTransitioningOut ? (1 - (progress - 0.9) * 10) : 1) : 0;

  // Window 4: Bottom-Right Secondary AI Framework Card
  const w4X = (1 - Math.min((progress - 0.35) * 1.8, 1)) * 140;
  const w4Opacity = progress > 0.35 ? Math.min((progress - 0.35) * 3, 1) * (isTransitioningOut ? (1 - (progress - 0.9) * 10) : 1) : 0;

  // Window 5: Floating Urgent Snippet / Article ("10 generic ways...")
  const w5Opacity = progress > 0.45 ? Math.min((progress - 0.45) * 3, 1) * (isTransitioningOut ? (1 - (progress - 0.9) * 10) : 1) : 0;

  const renderBack = layer === 'all' || layer === 'back';
  const renderFront = layer === 'all' || layer === 'front';

  return (
    <div
      className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible"
      style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
    >
      {/* =================================================================== */}
      {/* BACKGROUND LAYER: WINDOW 1 & WINDOW 3 (Behind the human)           */}
      {/* =================================================================== */}
      {renderBack && (
        <>
          {/* WINDOW 1: SEARCH ENGINE SERP (Top-Left Layer) */}
          <div
            className="absolute top-2 sm:top-6 left-1 sm:left-4 md:left-8 w-[86vw] max-w-sm sm:w-80 md:w-96 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_16px_40px_rgba(0,0,0,0.07)] ring-1 ring-black/5 overflow-hidden transition-transform duration-300 pointer-events-auto"
            style={{
              opacity: w1Opacity,
              transform: `translateX(${w1X}px) translateY(${progress * -15}px) rotateY(${w1RotateY}deg) rotateX(${w1RotateX}deg) translateZ(${progress * 20}px)`,
              zIndex: 5
            }}
          >
            {/* Browser Chrome Header */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100/90 border-b border-slate-200">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              {/* Mini Search Bar */}
              <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] text-slate-600 font-mono shadow-inner">
                <Search className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">search: how to scale business without team burnout</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-3.5 space-y-2.5 text-left">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>About 4,820,000 results (0.42 seconds)</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold text-[9px]">Generic Advice</span>
              </div>

              {/* Result 1 */}
              <div className="p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                <div className="text-[10px] text-blue-600 flex items-center gap-1">
                  <span>growthhackers-daily.org/scaling</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 leading-tight mt-0.5">
                  10 General Strategies for Scaling Any Business
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  "1. Outsource all non-core tasks. 2. Raise prices by 20%. 3. Run automated email blasts. 4. Cut internal meetings..."
                </p>
              </div>

              {/* Result 2 */}
              <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="text-[10px] text-emerald-600 flex items-center gap-1">
                  <span>business-frameworks.io/playbook</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 leading-tight mt-0.5">
                  Why 85% of General Business Advice Fails Your Context
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  "Standard advice assumes unlimited cash reserve or different market dynamics..."
                </p>
              </div>
            </div>
          </div>

          {/* WINDOW 3: CONFLICTING FORUM ADVICE (Bottom-Left Layer) */}
          <div
            className="absolute bottom-6 sm:bottom-12 left-1 sm:left-6 md:left-14 w-[84vw] max-w-xs sm:w-72 md:w-80 rounded-2xl bg-white/90 backdrop-blur-md border border-amber-200/80 shadow-lg overflow-hidden transition-transform duration-300 pointer-events-auto"
            style={{
              opacity: w3Opacity,
              transform: `translateY(${w3Y}px) rotateY(-8deg) rotateX(-4deg) translateZ(${progress * 15}px)`,
              zIndex: 4
            }}
          >
            <div className="px-3 py-2 bg-amber-50/90 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Community Forum Debate</span>
              </div>
              <span className="text-[9px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                42 Answers
              </span>
            </div>
            <div className="p-3 space-y-2 text-left">
              <p className="text-[11px] font-semibold text-slate-800">
                "Should we pivot marketing or rebuild the onboarding flow?"
              </p>
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-100 text-[10px] text-rose-800 leading-tight">
                <strong>User928:</strong> "Never pivot marketing! It's always a product problem. Fire your sales lead."
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-800 leading-tight">
                <strong>DevGuru:</strong> "Opposite! Product is fine, you just need TikTok influencer ads ASAP."
              </div>
              <div className="text-[9px] text-slate-400 text-center font-medium">
                Conflicting opinions • Zero accountability
              </div>
            </div>
          </div>
        </>
      )}

      {/* =================================================================== */}
      {/* FOREGROUND LAYER: WINDOW 2, WINDOW 4, THOUGHT BUBBLE (In front)    */}
      {/* =================================================================== */}
      {renderFront && (
        <>
          {/* WINDOW 2: AI CHAT ASSISTANT (Top-Right Layer) */}
          <div
            className="absolute top-0 sm:top-4 right-1 sm:right-4 md:right-8 w-[86vw] max-w-sm sm:w-80 md:w-96 rounded-2xl bg-white/95 backdrop-blur-md border border-indigo-100/90 shadow-[0_20px_50px_rgba(79,70,229,0.1)] ring-1 ring-indigo-500/10 overflow-hidden transition-transform duration-300 pointer-events-auto"
            style={{
              opacity: w2Opacity,
              transform: `translateX(${w2X}px) translateY(${progress * -20}px) rotateY(${w2RotateY}deg) rotateX(${w2RotateX}deg) translateZ(${progress * 60}px)`,
              zIndex: 25
            }}
          >
            {/* AI Browser Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                    <span>Neuromind AI Chat</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-[9px] text-indigo-400 font-medium">Model v4.5 • Synthesizing generic answers</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100/80 text-indigo-700 font-semibold">
                Prompt #4
              </span>
            </div>

            {/* AI Chat Dialogue */}
            <div className="p-3.5 space-y-2.5 text-left">
              {/* User Prompt */}
              <div className="flex justify-end">
                <div className="max-w-[85%] p-2 rounded-xl bg-indigo-600 text-white text-[11px] leading-relaxed shadow-xs">
                  "How do I fix my retention drop without lowering prices?"
                </div>
              </div>

              {/* AI Response Card */}
              <div className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                </div>
                <div className="flex-1 p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-slate-700 space-y-1.5">
                  <div className="font-semibold text-indigo-900 flex items-center gap-1">
                    <span>Here are 10 ways to solve your problem:</span>
                  </div>
                  <ul className="list-disc pl-3.5 space-y-1 text-slate-600 text-[10.5px]">
                    <li>Try these general retention strategies.</li>
                    <li>Follow these recommended generic steps.</li>
                    <li>Conduct customer exit interviews.</li>
                    <li>Offer loyalty discounts and coupons.</li>
                  </ul>
                  <div className="pt-1 border-t border-indigo-100/60 flex items-center justify-between text-[9px] text-slate-400 italic">
                    <span>* Generated from public web scraped data</span>
                    <span className="text-amber-600 font-medium">No context of your product</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WINDOW 4: SECONDARY AI & AUTOMATION BOT (Bottom-Right Layer) */}
          <div
            className="absolute bottom-4 sm:bottom-10 right-1 sm:right-6 md:right-14 w-[84vw] max-w-xs sm:w-72 md:w-80 rounded-2xl bg-white/90 backdrop-blur-md border border-purple-100 shadow-xl overflow-hidden transition-transform duration-300 pointer-events-auto"
            style={{
              opacity: w4Opacity,
              transform: `translateX(${w4X}px) rotateY(10deg) rotateX(4deg) translateZ(${progress * 50}px)`,
              zIndex: 22
            }}
          >
            <div className="px-3 py-2 bg-purple-50/80 border-b border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>Automated Strategy Gen</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-mono">
                Prompt #7
              </span>
            </div>
            <div className="p-3 text-left space-y-1.5">
              <div className="text-[10px] text-slate-500 font-medium">Recommended next steps:</div>
              <div className="space-y-1 text-[10.5px] text-slate-700">
                <div className="p-1.5 rounded bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span>A/B test 50 different landing copy variants</span>
                </div>
                <div className="p-1.5 rounded bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span>Restructure whole pricing tier matrix</span>
                </div>
              </div>
              <div className="text-[9px] text-purple-600 font-medium text-right">
                Too broad? Try another prompt &rarr;
              </div>
            </div>
          </div>

          {/* FLOATING CHIPS / NOTIFICATION WARNINGS */}
          {progress > 0.4 && (
            <div
              className="absolute -top-6 sm:-top-8 left-1/3 px-3 py-1.5 rounded-full bg-amber-500 text-white font-bold text-[10px] shadow-lg flex items-center gap-1.5 animate-bounce pointer-events-none"
              style={{ opacity: w5Opacity, zIndex: 30 }}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Information Overload: 12 Tabs Open</span>
            </div>
          )}

          {/* THE CLIMAX THOUGHT BUBBLE */}
          {showMissingAnswer && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-auto max-w-md p-4 sm:p-5 rounded-2xl bg-slate-900/95 text-white border-2 border-amber-400/90 shadow-2xl backdrop-blur-xl transition-all duration-500 pointer-events-auto"
              style={{
                zIndex: 50,
                transform: `translate(-50%, -50%) scale(${Math.min(1, (progress - 0.68) * 6)}) translateZ(100px)`,
                opacity: Math.min(1, (progress - 0.68) * 8) * (isTransitioningOut ? (1 - (progress - 0.9) * 10) : 1)
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0 text-amber-400">
                  <HelpCircle className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1 text-left">
                  <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                    <span>The Core Dilemma</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </div>
                  <p className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                    "But which solution is right for <span className="text-amber-300 underline decoration-amber-400 decoration-2 underline-offset-4">MY situation</span>?"
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    More information does not mean finding the right direction. Your challenge deserves personal understanding, not generic articles.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
