import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/useApp';
import UserAvatar from '../common/UserAvatar';
import { timeAgo, formatDate } from '../../utils/formatters';
import {
  X,
  Clock,
  FileText,
  Bookmark,
  MessageSquare,
  Printer,
  CheckCircle2,
  Sparkles,
  Send,
} from 'lucide-react';

export default function ThoughtDetailModal() {
  const {
    selectedThoughtId,
    setSelectedThoughtId,
    thoughts,
    thinks,
    toggleSaveThought,
    activeTab,
    acceptThink,
    openChatWithThought,
    activeUser,
    fetchThoughtDetails,
    submitReply,
    triggerAIFallback,
  } = useApp();

  const [replyMessage, setReplyMessage] = useState('');
  const [checklistText, setChecklistText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isTriggeringAI, setIsTriggeringAI] = useState(false);

  const isModalVisible =
    Boolean(selectedThoughtId) && activeTab !== 'chat' && activeTab !== 'messages';

  useEffect(() => {
    if (isModalVisible && selectedThoughtId && fetchThoughtDetails) {
      fetchThoughtDetails(selectedThoughtId);
    }
  }, [isModalVisible, selectedThoughtId, fetchThoughtDetails]);

  if (!isModalVisible) {
    return null;
  }

  const allThinks = thinks || thoughts || [];
  const thought = allThinks.find((t) => t.id === selectedThoughtId);

  if (!thought) return null;

  const isPending = thought.status === 'pending' || thought.status === 'pending_human';
  const isConsultantOrAdmin =
    activeUser?.role === 'consultant' || activeUser?.role === 'admin';
  const solutions = thought.solutions || [];

  const handleOpenChat = () => {
    openChatWithThought(thought.id);
    setSelectedThoughtId(null);
  };

  const printSolution = () => {
    window.print();
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || replyMessage.trim().length < 2 || isSubmittingReply) return;

    const actionChecklist = checklistText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    setIsSubmittingReply(true);
    try {
      const res = await submitReply(thought.id, {
        message: replyMessage.trim(),
        responderType: activeUser?.role === 'admin' ? 'admin' : 'consultant',
        actionChecklist,
      });
      if (res) {
        setReplyMessage('');
        setChecklistText('');
      }
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleTriggerAI = async () => {
    if (isTriggeringAI) return;
    setIsTriggeringAI(true);
    try {
      await triggerAIFallback(thought.id);
    } finally {
      setIsTriggeringAI(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2.5 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92dvh]">
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
              #{thought.id}
            </span>
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-[#ecfeff] text-[#020617]">
              {thought.category}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400">
              Submitted {timeAgo(thought.createdAt)}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200">
              Status: <span className="capitalize font-extrabold text-[#020617]">{thought.status}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isConsultantOrAdmin && isPending && (
              <button
                onClick={async () => {
                  await acceptThink(thought.id);
                  setSelectedThoughtId(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
              >
                Accept OverThink
              </button>
            )}

            {thought.assignedConsultantName && (
              <button
                onClick={handleOpenChat}
                className="px-3.5 py-1.5 rounded-xl bg-[#0891b2] hover:bg-[#0e7490] text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
              >
                Open Consultation Chat
              </button>
            )}

            <button
              onClick={() => toggleSaveThought(thought.id)}
              className={`p-1.5 sm:p-2 rounded-xl border transition-colors cursor-pointer ${
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
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
              title="Print Solution"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedThoughtId(null)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1">
          {isPending ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 flex-shrink-0">
                <Clock className="w-5 h-5 text-amber-600 animate-spin" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                  Awaiting Consultant Acceptance
                </h4>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  This OverThink is live and listed in the Consultant Panel under <strong>Available OverThinks</strong>.
                  A consultant can claim it to start the shared consultation chat.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#ecfeff] border border-[#020617]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <UserAvatar
                  src={thought.assignedConsultantAvatar}
                  name={thought.assignedConsultantName || 'Consultant'}
                  role="consultant"
                  size="md"
                  className="ring-2 ring-white shadow-xs"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {thought.assignedConsultantName
                      ? `Consultant: ${thought.assignedConsultantName}`
                      : 'OverThink Solution Active'}
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-[#0891b2] text-white">
                      {thought.status}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {thought.assignedConsultantName
                      ? 'Direct 1-on-1 consultation chat is active between client and consultant.'
                      : 'Review the submitted solution details below.'}
                  </p>
                </div>
              </div>

              {thought.assignedConsultantName && (
                <button
                  type="button"
                  onClick={handleOpenChat}
                  className="px-4 py-2 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#0891b2]" />
                  <span>Open Chat Room</span>
                </button>
              )}
            </div>
          )}

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
            <div className="flex items-center gap-3 mb-3">
              <UserAvatar
                src={thought.clientAvatar}
                name={thought.clientName}
                role="client"
                size="md"
                className="ring-2 ring-white shadow-xs"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{thought.clientName}</h4>
                <p className="text-[10px] text-slate-500">{formatDate(thought.createdAt)}</p>
              </div>
              <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                Priority: {thought.urgency || 'Standard'}
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

            {thought.attachments && thought.attachments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200/60">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Uploaded Attachments ({thought.attachments.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {thought.attachments.map((att, idx) => (
                    <div
                      key={att.id || idx}
                      className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#ecfeff] text-[#020617] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-[#0891b2]" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-800 truncate block">{att.name}</span>
                        <span className="text-[10px] text-slate-400">{att.size || 'Attachment'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {solutions.length > 0 && (
            <div className="bg-white rounded-2xl border border-emerald-200/90 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Delivered Solutions & Roadmaps ({solutions.length})</span>
                </h3>
              </div>

              <div className="space-y-3">
                {solutions.map((sol, idx) => (
                  <div
                    key={sol.id || idx}
                    className={`p-4 rounded-xl border space-y-2.5 ${
                      sol.isAIGenerated
                        ? 'bg-violet-50/60 border-violet-200'
                        : 'bg-emerald-50/50 border-emerald-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {sol.author?.name || thought.assignedConsultantName || 'OverThink Specialist'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            sol.isAIGenerated
                              ? 'bg-violet-100 text-violet-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {sol.isAIGenerated ? 'AI Fallback' : 'Consultant Solution'}
                        </span>
                      </div>
                      {sol.createdAt && (
                        <span className="text-[10px] text-slate-400">
                          {timeAgo(sol.createdAt)}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {sol.executiveSummary || sol.message}
                    </p>

                    {sol.actionPlan && sol.actionPlan.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                          Action Checklist
                        </span>
                        {sol.actionPlan.map((step, sIdx) => (
                          <div key={sIdx} className="text-xs text-slate-700 flex items-start gap-2">
                            <span className="font-bold text-[#0891b2]">{step.step || sIdx + 1}.</span>
                            <span>
                              <strong>{step.title || step}</strong>
                              {step.details ? ` — ${step.details}` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isConsultantOrAdmin && (
            <form
              onSubmit={handleSubmitReply}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900">
                  Deliver Official Solution Reply
                </h3>
                {thought.status !== 'ai_fallback' && (
                  <button
                    type="button"
                    disabled={isTriggeringAI}
                    onClick={handleTriggerAI}
                    className="px-3 py-1.5 rounded-xl border border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isTriggeringAI ? 'Running AI Triage...' : 'Trigger AI Fallback'}</span>
                  </button>
                )}
              </div>

              <textarea
                rows={3}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Write a clear, actionable solution for the client (marks this thought as Answered and notifies the client)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617]"
              />

              <textarea
                rows={2}
                value={checklistText}
                onChange={(e) => setChecklistText(e.target.value)}
                placeholder="Optional action checklist (one step per line)..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617]"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingReply || replyMessage.trim().length < 2}
                  className="px-4 py-2 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-[#0891b2]" />
                  <span>{isSubmittingReply ? 'Delivering Reply...' : 'Submit Solution Reply'}</span>
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Consultation Conversation</span>
              <span className="text-xs font-medium text-slate-500">
                {thought.assignedConsultantName ? 'Active Session' : 'Pending Acceptance'}
              </span>
            </h3>

            {thought.assignedConsultantName ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#020617] text-white flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-[#0891b2]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Shared 1-on-1 Consultation Channel
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Messages sent in this room are saved automatically and synced in real time.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenChat}
                  className="px-4 py-2 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#0891b2]" />
                  <span>Enter Chat Room</span>
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/50">
                <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-800">
                  Waiting for a Consultant to Accept
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Once a consultant accepts this OverThink from their Available OverThinks feed, you can chat directly here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
