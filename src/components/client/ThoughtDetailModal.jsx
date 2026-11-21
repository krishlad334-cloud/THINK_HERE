import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { timeAgo, formatDate } from '../../utils/formatters';
import {
  X,
  Clock,
  CheckCircle,
  FileText,
  Bookmark,
  MessageSquare,
  PhoneCall,
  Printer,
  Lock,
  UserCheck
} from 'lucide-react';

export default function ThoughtDetailModal() {
  const {
    selectedThoughtId,
    setSelectedThoughtId,
    thoughts,
    thinks,
    toggleSaveThought,
    setActiveTab,
    startCall,
    acceptThink,
    openChatWithThought,
    activeUser
  } = useApp();

  const allThinks = thinks || thoughts || [];
  const thought = allThinks.find(t => t.id === selectedThoughtId);

  if (!thought) return null;

  const isPending = thought.status === 'pending' || thought.status === 'pending_human';
  const isAccepted = thought.status === 'accepted';
  const isInProgress = thought.status === 'in_progress';
  const isResolved = thought.status === 'resolved';
  const isClosed = thought.status === 'closed';

  const handleOpenChat = () => {
    openChatWithThought(thought.id);
    setSelectedThoughtId(null);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2.5 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92dvh]">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
              #{thought.id}
            </span>
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-[#e6f2f1] text-[#004845]">
              {thought.category}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400">
              Submitted {timeAgo(thought.createdAt)}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200">
              Status: <span className="capitalize font-extrabold text-[#004845]">{thought.status}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {activeUser.role === 'consultant' && isPending && (
              <button
                onClick={() => {
                  acceptThink(thought.id);
                  setSelectedThoughtId(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
              >
                Accept Think
              </button>
            )}

            {thought.assignedConsultantName && (
              <button
                onClick={handleOpenChat}
                className="px-3.5 py-1.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
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

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1">
          {/* Status & Connection Banner */}
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
                  This Think is saved locally and listed in the Consultant Panel under <strong>Available Thinks</strong>.
                  A consultant can claim it to start the shared consultation chat.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#e6f2f1] border border-[#004845]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={thought.assignedConsultantAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'}
                  alt={thought.assignedConsultantName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    Consultant: {thought.assignedConsultantName}
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-[#16a34a] text-white">
                      Accepted
                    </span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Direct 1-on-1 consultation chat is active between client and consultant.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenChat}
                className="px-4 py-2 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Open Chat Room</span>
              </button>
            </div>
          )}

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

            {/* Attachments Display */}
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
                      <div className="w-8 h-8 rounded-lg bg-[#e6f2f1] text-[#004845] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-[#16a34a]" />
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

          {/* Consultation Activity / Chat Access */}
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
                  <div className="w-9 h-9 rounded-xl bg-[#004845] text-white flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-[#16a34a]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Shared 1-on-1 Consultation Channel
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Messages sent in this room are saved to LocalStorage and synchronized in real time.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenChat}
                  className="px-4 py-2 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#16a34a]" />
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
                  Once a consultant accepts this Think from their Available Thinks feed, you can chat directly here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
