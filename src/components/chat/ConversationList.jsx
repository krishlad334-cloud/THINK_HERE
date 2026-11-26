import React from 'react';
import { Lock, MessageSquare, Search } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';
import StatusBadge from '../common/StatusBadge';
import { timeAgo } from '../../utils/formatters';

export default function ConversationList({
  conversations,
  allThinks,
  activeConvId,
  activeUserId,
  isClientRole,
  searchQuery,
  onSearchChange,
  onSelectConversation,
  mobileView,
}) {
  return (
    <div
      className={`w-full md:w-72 lg:w-80 border-r border-slate-200/90 flex flex-col bg-[#fcfdfe] flex-shrink-0 h-full ${
        mobileView === 'chat' ? 'hidden md:flex' : 'flex'
      }`}
    >
      <div className="p-3.5 border-b border-slate-200/80 bg-white space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#ecfeff] flex items-center justify-center text-[#020617]">
              <MessageSquare className="w-3.5 h-3.5 text-[#0891b2]" />
            </div>
            <h3 className="text-xs font-black text-slate-900 tracking-tight uppercase">
              {isClientRole ? 'My Consultations' : 'Client Conversations'}
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ecfeff] text-[#0891b2] border border-[#0891b2]/30 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            <span>LocalStorage Sync</span>
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all font-medium"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80 p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No conversations match "{searchQuery}".
          </div>
        ) : (
          conversations.map((conv) => {
            const isSelected = conv.id === activeConvId;
            const think = allThinks.find((t) => t.id === conv.thinkId);
            const contactName = isClientRole ? conv.consultantName : conv.clientName;
            const contactAvatar = isClientRole ? conv.consultantAvatar : conv.clientAvatar;
            const lastMsg =
              conv.messages && conv.messages.length > 0
                ? conv.messages[conv.messages.length - 1]
                : null;
            const unreadCount = (conv.messages || []).filter(
              (m) => m.senderId !== activeUserId && !m.isRead
            ).length;

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 relative ${
                  isSelected
                    ? 'bg-[#ecfeff]/80 border-l-[3.5px] border-[#020617] shadow-xs'
                    : 'hover:bg-slate-100/70 border-l-[3.5px] border-transparent'
                }`}
              >
                <div className="relative flex-shrink-0 mt-0.5">
                  <UserAvatar
                    src={contactAvatar}
                    name={contactName}
                    size="md"
                    showOnline={true}
                    className="ring-2 ring-white shadow-xs"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {contactName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">
                      {lastMsg ? timeAgo(lastMsg.createdAt) : timeAgo(conv.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      #{conv.thinkId}
                    </span>
                    {think && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-[#020617] truncate max-w-[100px]">
                        {think.category}
                      </span>
                    )}
                    <StatusBadge
                      status={think?.status || conv.status}
                      variant="compact"
                      pendingLabel="Pending"
                      resolvedLabel="Completed"
                    />
                  </div>

                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {think?.title || 'Consultation Request'}
                  </p>

                  <div className="flex items-center justify-between gap-1 mt-1">
                    <p className="text-[11px] text-slate-500 truncate flex-1">
                      {lastMsg ? lastMsg.text : 'Conversation started.'}
                    </p>

                    {unreadCount > 0 && (
                      <span className="min-w-[16px] h-4 px-1 rounded-full bg-[#0891b2] text-white text-[9px] font-extrabold flex items-center justify-center flex-shrink-0">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
