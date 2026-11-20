import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateTimeRemaining, formatDate, timeAgo } from '../../utils/formatters';
import {
  FolderKanban,
  MessageSquare,
  PhoneCall,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function MyConsultations() {
  const { thoughts, consultantUser, setSelectedThoughtId, setActiveTab, startCall } = useApp();

  const myConsultations = thoughts.filter(t => t.assignedConsultantId === consultantUser.id);

  const handleStartCall = (thought) => {
    startCall({
      thoughtId: thought.id,
      participantName: thought.clientName,
      participantAvatar: thought.clientAvatar,
      callType: 'video'
    });
  };

  const handleOpenChat = (thoughtId) => {
    setSelectedThoughtId(thoughtId);
    setActiveTab('messages');
  };

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <FolderKanban className="w-7 h-7 text-[#004845]" />
          <span>My Active Consultations</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage claimed client engagements, delivery roadmaps, and real-time calling sessions
        </p>
      </div>

      {myConsultations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <FolderKanban className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No active consultations assigned</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Head to the problem discovery feed to browse incoming thoughts and claim ownership.
          </p>
          <button
            onClick={() => setActiveTab('browse_thoughts')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold cursor-pointer"
          >
            Browse Client Thoughts
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myConsultations.map((thought) => {
            const hasDeliveredSolution = thought.solutions?.some(s => s.author.id === consultantUser.id);

            return (
              <div
                key={thought.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#004845]/40 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f2f1] text-[#004845]">
                      {thought.category}
                    </span>
                    {hasDeliveredSolution ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0fdf4] text-[#16a34a] border border-[#16a34a]/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Solution Delivered
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" /> Response In Progress
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => setSelectedThoughtId(thought.id)}
                    className="text-base font-bold text-slate-900 hover:text-[#004845] cursor-pointer transition-colors leading-snug"
                  >
                    {thought.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <img
                        src={thought.clientAvatar}
                        alt={thought.clientName}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span>{thought.clientName}</span>
                    </div>
                    <span>• Started {timeAgo(thought.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end md:self-center flex-shrink-0">
                  <button
                    onClick={() => handleOpenChat(thought.id)}
                    className="px-3.5 py-2 rounded-xl bg-[#e6f2f1] hover:bg-[#d4ecea] text-[#004845] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#16a34a]" />
                    <span>Client Chat</span>
                  </button>

                  <button
                    onClick={() => handleStartCall(thought)}
                    className="px-3.5 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Video Consultation</span>
                  </button>

                  <button
                    onClick={() => setSelectedThoughtId(thought.id)}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Roadmap
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
