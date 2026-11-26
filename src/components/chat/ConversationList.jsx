import React from 'react';
import { MessageSquare, Search } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';
import VerifiedBadge from '../common/VerifiedBadge';
import { timeAgo } from '../../utils/formatters';

export default function ConversationList({
  conversations,
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
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#ecfeff] flex items-center justify-center text-[#020617]">
            <MessageSquare className="w-3.5 h-3.5 text-[#0891b2]" />
          </div>
          <h3 className="text-xs font-black text-slate-900 tracking-tight uppercase">
            {isClientRole ? 'My Consultations' : 'Client Conversations'}
          </h3>
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

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No conversations match "{searchQuery}".
          </div>
        ) : (
          conversations.map((conv) => {
            const isSelected = conv.id === activeConvId;
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
                className={`p-3 rounded-2xl cursor-pointer transition-colors flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#ecfeff] border border-[#0891b2]/25'
                    : 'border border-transparent hover:bg-slate-100/80'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <UserAvatar
                    src={contactAvatar}
                    name={contactName}
                    size="md"
                    showOnline={true}
                    className="ring-2 ring-white shadow-xs"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate flex items-center gap-1 min-w-0">
                      <span className="truncate">{contactName}</span>
                      {isClientRole && <VerifiedBadge size="xs" />}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">
                      {lastMsg ? timeAgo(lastMsg.createdAt) : timeAgo(conv.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-xs text-slate-500 truncate flex-1">
                      {lastMsg ? lastMsg.text : 'Conversation started.'}
                    </p>

                    {unreadCount > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#0891b2] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
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
