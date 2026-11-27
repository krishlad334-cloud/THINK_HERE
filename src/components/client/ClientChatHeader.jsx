import React, { useEffect, useRef, useState } from 'react';
import {
  Bookmark,
  ChevronDown,
  MessageSquare,
  PhoneCall,
  Trash2,
  Video,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import VerifiedBadge from '../common/VerifiedBadge';

export default function ClientChatHeader({
  activeThought,
  hasConversation,
  hasMessages = false,
  onClearChat,
  onOpenChatRoom,
  onStartCall,
  onToggleSave,
}) {
  const [showCallMenu, setShowCallMenu] = useState(false);
  const callMenuRef = useRef(null);

  useEffect(() => {
    if (!showCallMenu) return undefined;

    const handleClickOutside = (event) => {
      if (callMenuRef.current && !callMenuRef.current.contains(event.target)) {
        setShowCallMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showCallMenu]);

  const assignedConsName = activeThought.assignedConsultantName;
  const assignedConsAvatar = activeThought.assignedConsultantAvatar;

  return (
    <div className="px-3 sm:px-6 py-2 sm:py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 sm:gap-3 bg-white flex-shrink-0 z-10 w-full">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
        <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
          #{activeThought.id}
        </span>

        <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#ecfeff] text-[#020617] flex-shrink-0">
          {activeThought.category}
        </span>

        <StatusBadge
          status={activeThought.status}
          variant="card"
          pendingLabel="Pending (Available)"
        />

        {assignedConsName && (
          <span className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 truncate">
            <img
              src={assignedConsAvatar}
              alt={assignedConsName}
              className="w-4 h-4 rounded-full object-cover flex-shrink-0"
            />
            <span className="truncate flex items-center gap-1">
              <span className="hidden sm:inline text-slate-400">Consultant: </span>
              <span className="font-bold text-slate-800 truncate">{assignedConsName}</span>
              <VerifiedBadge size="xs" />
            </span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {hasConversation && (
          <button
            type="button"
            onClick={onOpenChatRoom}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            title="Open full consultation chat room"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#020617]" />
            <span>Open Chat Room</span>
          </button>
        )}

        {assignedConsName && (
          <div className="relative" ref={callMenuRef}>
            <button
              type="button"
              onClick={() => setShowCallMenu((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold shadow-xs transition-all cursor-pointer group select-none"
              title="Call Consultant"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#0891b2]" />
              <span>Call</span>
              <ChevronDown
                className={`w-3 h-3 text-white/70 transition-transform duration-150 ${
                  showCallMenu ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showCallMenu && (
              <div className="absolute right-0 top-full pt-1 z-50 w-48 animate-in fade-in zoom-in-95 duration-100">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/95 p-1.5 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      onStartCall('video');
                      setShowCallMenu(false);
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl text-slate-800 hover:bg-[#ecfeff] hover:text-[#020617] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-[#ecfeff] text-[#020617]">
                      <Video className="w-3.5 h-3.5 text-[#0891b2]" />
                    </div>
                    <div>
                      <span className="block font-bold">Live Video Call</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        HD Screen & Camera
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onStartCall('audio');
                      setShowCallMenu(false);
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl text-slate-800 hover:bg-[#ecfeff] hover:text-[#020617] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                      <PhoneCall className="w-3.5 h-3.5 text-[#020617]" />
                    </div>
                    <div>
                      <span className="block font-bold">Audio Call</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Encrypted Voice
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onToggleSave}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            activeThought.isSaved
              ? 'bg-amber-50 text-amber-600 border-amber-200'
              : 'text-slate-400 hover:text-slate-700 border-slate-200'
          }`}
          title={activeThought.isSaved ? 'Saved' : 'Save OverThink'}
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
        </button>

        {hasMessages && onClearChat && (
          <button
            type="button"
            onClick={onClearChat}
            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Clear chat messages"
            aria-label="Clear chat messages"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
