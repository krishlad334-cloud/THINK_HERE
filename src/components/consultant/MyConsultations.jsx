import React from 'react';
import { useApp } from '../../context/AppContext';
import UserAvatar from '../common/UserAvatar';
import { timeAgo } from '../../utils/formatters';
import {
  FolderKanban,
  MessageSquare,
  PhoneCall,
  CheckCircle,
  Clock,
  Lock
} from 'lucide-react';

export default function MyConsultations() {
  const {
    thinks,
    thoughts,
    activeUser,
    setSelectedThoughtId,
    setActiveTab,
    startCall,
    openChatWithThought
  } = useApp();

  const allThinks = thinks || thoughts || [];

  const myConsultations = allThinks.filter(t =>
    t.consultantId === activeUser.id || t.assignedConsultantId === activeUser.id
  );

  const handleStartCall = (thought) => {
    startCall({
      thoughtId: thought.id,
      participantName: thought.clientName,
      participantAvatar: thought.clientAvatar,
      callType: 'video'
    });
  };

  const handleOpenChat = (thoughtId) => {
    openChatWithThought(thoughtId);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-cyan-600" /> Accepted
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-600" /> In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-sky-600" /> Resolved
          </span>
        );
      case 'closed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-500" /> Closed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <FolderKanban className="w-7 h-7 text-[#020617]" />
          <span>My Active Consultations</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage claimed client engagements, delivery roadmaps, and real-time calling sessions for {activeUser.name}
        </p>
      </div>

      {myConsultations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <FolderKanban className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No active consultations assigned to {activeUser.name}</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Head to the problem discovery feed to browse incoming thoughts and claim ownership.
          </p>
          <button
            onClick={() => setActiveTab('browse_thoughts')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold cursor-pointer"
          >
            Browse Available OverThinks
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myConsultations.map((thought) => {
            return (
              <div
                key={thought.id}
                className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#020617]/40 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      #{thought.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ecfeff] text-[#020617]">
                      {thought.category}
                    </span>
                    {getStatusBadge(thought.status)}
                  </div>

                  <h3
                    onClick={() => setSelectedThoughtId(thought.id)}
                    className="text-base font-bold text-slate-900 hover:text-[#020617] cursor-pointer transition-colors leading-snug"
                  >
                    {thought.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <UserAvatar
                        src={thought.clientAvatar}
                        name={thought.clientName}
                        role="client"
                        size="xs"
                      />
                      <span>{thought.clientName}</span>
                    </div>
                    <span>• Started {timeAgo(thought.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end md:self-center flex-shrink-0">
                  <button
                    onClick={() => handleOpenChat(thought.id)}
                    className="px-3.5 py-2 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#0891b2]" />
                    <span>Open Consultation Chat</span>
                  </button>

                  <button
                    onClick={() => handleStartCall(thought)}
                    className="px-3.5 py-2 rounded-xl bg-[#0891b2] hover:bg-[#0e7490] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Video Call</span>
                  </button>

                  <button
                    onClick={() => setSelectedThoughtId(thought.id)}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
