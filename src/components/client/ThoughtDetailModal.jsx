import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateTimeRemaining, formatDate, timeAgo } from '../../utils/formatters';
import {
  X,
  Clock,
  Sparkles,
  UserCheck,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Video,
  Bookmark,
  Share2,
  MessageSquare,
  PhoneCall,
  AlertCircle,
  Printer,
  ChevronRight
} from 'lucide-react';

export default function ThoughtDetailModal() {
  const {
    selectedThoughtId,
    setSelectedThoughtId,
    thoughts,
    triggerAIFallback,
    toggleSaveThought,
    setActiveTab,
    startCall,
    role
  } = useApp();

  const [timeRemaining, setTimeRemaining] = useState(null);

  const thought = thoughts.find(t => t.id === selectedThoughtId);

  useEffect(() => {
    if (!thought) return;

    const updateTimer = () => {
      setTimeRemaining(calculateTimeRemaining(thought.createdAt, thought.deadlineHours || 24));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [thought]);

  if (!thought) return null;

  const hasHumanSolution = thought.solutions?.some(s => !s.isAIGenerated);
  const hasAISolution = thought.solutions?.some(s => s.isAIGenerated);

  const handleOpenChat = () => {
    setSelectedThoughtId(thought.id);
    setActiveTab('messages');
  };

  const handleStartCall = () => {
    const participant = thought.assignedConsultantName
      ? { name: thought.assignedConsultantName, avatar: thought.assignedConsultantAvatar }
      : { name: 'Assigned Specialist', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200' };

    startCall({
      thoughtId: thought.id,
      participantName: participant.name,
      participantAvatar: participant.avatar,
      callType: 'video'
    });
  };

  const printSolution = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
              {thought.category}
            </span>
            <span className="text-xs text-slate-400">
              Submitted {timeAgo(thought.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveThought(thought.id)}
              className={`p-2 rounded-xl border transition-colors ${
                thought.isSaved
                  ? 'bg-amber-50 text-amber-600 border-amber-200'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
              title={thought.isSaved ? 'Bookmarked' : 'Save Solution'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={printSolution}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200"
              title="Print Solution"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedThoughtId(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 24-Hour Guarantee & Countdown Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    24-Hour Response Guarantee
                    {thought.status === 'ai_fallback' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                        AI Fallback Delivered
                      </span>
                    )}
                    {hasHumanSolution && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                        Human Solution Live
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {timeRemaining?.isExpired
                      ? 'The 24h review window has concluded. Fallback AI roadmap is active.'
                      : `Time remaining for human consultant acceptance: ${timeRemaining?.formatted}`}
                  </p>
                </div>
              </div>

              {/* Instant AI Solution Trigger */}
              {!hasAISolution && (
                <button
                  onClick={() => triggerAIFallback(thought.id)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  title="Generate instant AI solution now"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generate AI Solution Now</span>
                </button>
              )}
            </div>

            {/* Progress bar */}
            {!timeRemaining?.isExpired && (
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-400 to-purple-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${timeRemaining?.percentRemaining || 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Original Question Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={thought.clientAvatar}
                alt={thought.clientName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{thought.clientName}</h4>
                <p className="text-[10px] text-slate-500">{formatDate(thought.createdAt)}</p>
              </div>
              <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                Priority: {thought.urgency}
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {thought.title}
            </h2>

            {thought.description && (
              <p className="text-sm text-slate-700 mt-2.5 leading-relaxed whitespace-pre-wrap">
                {thought.description}
              </p>
            )}

            {/* Attachments Display */}
            {thought.attachments && thought.attachments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200/60">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Uploaded Attachments ({thought.attachments.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {thought.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs"
                    >
                      {att.type === 'image' && att.url ? (
                        <img src={att.url} alt={att.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : att.type === 'video' ? (
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                          <Video className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-800 truncate block">{att.name}</span>
                        <span className="text-[10px] text-slate-400">{att.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Auto-categorization Insights */}
            {thought.aiAnalysis && (
              <div className="mt-4 pt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Insights:
                </span>
                <span className="bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded">
                  {thought.aiAnalysis.coreProblem}
                </span>
                {thought.aiAnalysis.suggestedSpecialists?.map((spec, i) => (
                  <span key={i} className="bg-slate-200 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded">
                    Match: {spec}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Solutions Feed */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>Solutions & Consultations</span>
              <span className="text-xs font-medium text-slate-500">
                {thought.solutions?.length || 0} Solution(s)
              </span>
            </h3>

            {(!thought.solutions || thought.solutions.length === 0) ? (
              <div className="border border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50/50">
                <Clock className="w-8 h-8 text-indigo-500 mx-auto mb-2 animate-spin" />
                <h4 className="text-sm font-bold text-slate-800">
                  Awaiting Human Consultant Review
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Our network of verified consultants has been notified. You will receive an alert as soon as a specialist accepts and submits your roadmap.
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => triggerAIFallback(thought.id)}
                    className="px-4 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs font-bold shadow-xs inline-flex items-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Get Immediate AI Solution (Instant Fallback)</span>
                  </button>
                </div>
              </div>
            ) : (
              thought.solutions.map((sol) => (
                <div
                  key={sol.id}
                  className={`rounded-2xl p-6 border shadow-xs transition-all ${
                    sol.isAIGenerated
                      ? 'bg-gradient-to-b from-indigo-50/40 to-white border-indigo-200'
                      : 'bg-white border-emerald-200 ring-1 ring-emerald-500/10'
                  }`}
                >
                  {/* Solution Author bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={sol.author.avatar}
                        alt={sol.author.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{sol.author.name}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              sol.isAIGenerated
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {sol.author.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{sol.author.role}</p>
                      </div>
                    </div>

                    {/* Actions for human consultant solutions */}
                    {!sol.isAIGenerated && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleOpenChat}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat Room</span>
                        </button>
                        <button
                          onClick={handleStartCall}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Video Consult</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Executive Summary */}
                  <div className="mt-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Executive Diagnostic & Assessment
                    </h5>
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      {sol.executiveSummary}
                    </p>
                  </div>

                  {/* Step by Step Action Plan */}
                  {sol.actionPlan && sol.actionPlan.length > 0 && (
                    <div className="mt-5">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Strategic Action Plan (Step-by-Step)
                      </h5>
                      <div className="space-y-2.5">
                        {sol.actionPlan.map((step, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-start gap-3"
                          >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                              {step.step || idx + 1}
                            </span>
                            <div>
                              <h6 className="text-xs font-bold text-slate-900">{step.title}</h6>
                              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{step.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Tools */}
                  {sol.recommendedTools && sol.recommendedTools.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">
                        Recommended Tooling:
                      </span>
                      {sol.recommendedTools.map((tool, i) => (
                        <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Disclaimer / Follow-up */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 border border-slate-100 flex items-center justify-between">
                    <span>{sol.nextStepsPrompt || sol.disclaimer}</span>
                    <span className="text-[10px] text-slate-400">{timeAgo(sol.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
