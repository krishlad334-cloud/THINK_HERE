import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/useApp';
import ConversationList from './ConversationList';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ChatComposer from './ChatComposer';

export default function ChatWorkspace() {
  const {
    conversations,
    thinks,
    thoughts,
    sendChatMessage,
    deleteMessage,
    updateThinkStatus,
    activeUser,
    activeConversationId,
    setActiveConversationId,
    activeChatThoughtId,
    setActiveChatThoughtId,
    selectedThoughtId,
    setSelectedThoughtId,
    startCall,
    markConversationRead,
    setActiveTab,
  } = useApp();

  const allThinks = thinks || thoughts || [];

  const myConversations = conversations.filter((c) => {
    if (!activeUser) return false;
    return activeUser.role === 'client'
      ? c.clientId === activeUser.id
      : c.consultantId === activeUser.id;
  });

  const currentConversation =
    myConversations.find((c) => c.id === activeConversationId) ||
    (activeChatThoughtId ? myConversations.find((c) => c.thinkId === activeChatThoughtId) : null) ||
    (selectedThoughtId ? myConversations.find((c) => c.thinkId === selectedThoughtId) : null) ||
    (myConversations.length > 0 ? myConversations[0] : null);

  const activeConvId = currentConversation?.id || null;
  const activeThought = allThinks.find((t) => t.id === currentConversation?.thinkId) || null;

  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showContextDrawer, setShowContextDrawer] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [mobileView, setMobileView] = useState(currentConversation ? 'chat' : 'list');
  const [activeMsgMenuId, setActiveMsgMenuId] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [attachments, setAttachments] = useState([]);

  const messagesEndRef = useRef(null);
  const moreMenuRef = useRef(null);
  const statusMenuRef = useRef(null);

  useEffect(() => {
    if (activeConvId) {
      markConversationRead(activeConvId);
    }
  }, [activeConvId, markConversationRead]);

  const messageCount = currentConversation?.messages?.length || 0;
  useEffect(() => {
    if (messageCount >= 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messageCount]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target)) {
        setShowStatusMenu(false);
      }
      setActiveMsgMenuId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (myConversations.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white p-6 sm:p-12">
        <div className="text-center max-w-md space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#ecfeff] text-[#020617] flex items-center justify-center mx-auto shadow-xs">
            <MessageSquare className="w-8 h-8 text-[#0891b2]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {activeUser?.role === 'consultant'
                ? 'No Active Consultations Yet'
                : 'No Consultation Conversations'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              {activeUser?.role === 'consultant'
                ? `You are signed in as ${activeUser?.label || activeUser?.name || 'Consultant'}. Head to Available OverThinks to accept client submissions and start consultation rooms.`
                : 'Submit an OverThink to start. Once a verified consultant accepts your OverThink, your private 1-on-1 consultation chat will appear here.'}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() =>
                setActiveTab(activeUser?.role === 'consultant' ? 'browse_thoughts' : 'chat')
              }
              className="px-5 py-2.5 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              {activeUser?.role === 'consultant'
                ? 'Browse Available OverThinks'
                : 'Go to Client Workspace'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isClientRole = activeUser.role === 'client';
  const partnerName = isClientRole
    ? currentConversation.consultantName
    : currentConversation.clientName;
  const partnerAvatar = isClientRole
    ? currentConversation.consultantAvatar
    : currentConversation.clientAvatar;
  const partnerRoleLabel = isClientRole ? 'Verified Consultant' : 'Client';
  const currentStatus = activeThought?.status || currentConversation.status || 'accepted';

  const filteredConversations = searchQuery
    ? myConversations.filter((c) => {
        const q = searchQuery.toLowerCase();
        const name = isClientRole ? c.consultantName : c.clientName;
        const think = allThinks.find((t) => t.id === c.thinkId);
        return (
          name?.toLowerCase().includes(q) ||
          c.thinkId?.toLowerCase().includes(q) ||
          think?.title?.toLowerCase().includes(q) ||
          think?.category?.toLowerCase().includes(q)
        );
      })
    : myConversations;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && attachments.length === 0) return;
    if (!currentConversation) return;

    sendChatMessage(currentConversation.id, inputMessage.trim(), attachments);
    setInputMessage('');
    setAttachments([]);
  };

  const handleCopyText = (msgId, text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedMsgId(msgId);
    setTimeout(() => {
      setCopiedMsgId(null);
      setActiveMsgMenuId(null);
    }, 1200);
  };

  const handleStartCall = (callType) => {
    if (!currentConversation) return;
    startCall({
      thoughtId: currentConversation.thinkId,
      participantName: partnerName,
      participantAvatar: partnerAvatar,
      callType,
    });
  };

  const handleStatusChange = (newStatus) => {
    if (activeThought) {
      updateThinkStatus(activeThought.id, newStatus);
    }
    setShowStatusMenu(false);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((f) => {
      setAttachments((prev) => [
        ...prev,
        {
          id: 'att_' + Date.now() + Math.random().toString(36).slice(2, 5),
          name: f.name,
          size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        },
      ]);
    });
  };

  const baseMessages = currentConversation.messages || [];
  const hasProblemBubble = baseMessages.some((m) => m.isProblemPost);
  const threadMessages =
    activeThought && !hasProblemBubble
      ? [
          {
            id: `msg_problem_${activeThought.id}`,
            conversationId: currentConversation.id,
            senderId: activeThought.clientId,
            senderName: activeThought.clientName || currentConversation.clientName,
            senderAvatar: activeThought.clientAvatar || currentConversation.clientAvatar,
            senderRole: 'client',
            isProblemPost: true,
            problemTitle: activeThought.title,
            problemDescription: activeThought.description || '',
            problemCategory: activeThought.category || 'General Consultation',
            text: activeThought.description
              ? `${activeThought.title}\n\n${activeThought.description}`
              : activeThought.title,
            attachments: activeThought.attachments || [],
            createdAt: activeThought.createdAt,
            isRead: true,
          },
          ...baseMessages,
        ]
      : baseMessages;

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-white overflow-hidden select-none">
      <ConversationList
        conversations={filteredConversations}
        activeConvId={activeConvId}
        activeUserId={activeUser.id}
        isClientRole={isClientRole}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectConversation={(conv) => {
          setActiveConversationId(conv.id);
          if (conv.thinkId) setActiveChatThoughtId(conv.thinkId);
          setSelectedThoughtId(null);
          setMobileView('chat');
        }}
        mobileView={mobileView}
      />

      <div
        className={`flex-1 flex flex-col h-full bg-[#f8fafc] min-w-0 overflow-hidden ${
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        }`}
      >
        <ChatHeader
          partnerName={partnerName}
          partnerAvatar={partnerAvatar}
          partnerRoleLabel={partnerRoleLabel}
          activeThought={activeThought}
          currentStatus={currentStatus}
          thinkId={currentConversation.thinkId}
          showContextDrawer={showContextDrawer}
          onToggleContextDrawer={() => setShowContextDrawer((prev) => !prev)}
          onCloseContextDrawer={() => setShowContextDrawer(false)}
          showStatusMenu={showStatusMenu}
          onToggleStatusMenu={() => {
            setShowMoreMenu(false);
            setActiveMsgMenuId(null);
            setShowStatusMenu((prev) => !prev);
          }}
          showMoreMenu={showMoreMenu}
          onToggleMoreMenu={() => {
            setShowStatusMenu(false);
            setActiveMsgMenuId(null);
            setShowMoreMenu((prev) => !prev);
          }}
          onCloseMenus={() => {
            setShowMoreMenu(false);
            setShowStatusMenu(false);
          }}
          statusMenuRef={statusMenuRef}
          moreMenuRef={moreMenuRef}
          onBackToList={() => setMobileView('list')}
          onStartCall={handleStartCall}
          onStatusChange={handleStatusChange}
        />

        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-5 bg-[#f8fafc]/90">
          <div className="max-w-3xl sm:max-w-4xl mx-auto space-y-4">
            <div className="flex justify-center pt-0.5 pb-1">
              <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-3.5 py-1.5 sm:py-1 rounded-2xl sm:rounded-full bg-white border border-slate-200/80 shadow-2xs text-[11px] font-medium text-slate-500 max-w-full text-center">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                  <CheckCircle className="w-3.5 h-3.5 text-[#0891b2] flex-shrink-0" />
                  <span>1-on-1 Consultation Connected</span>
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 truncate max-w-full">
                  {currentConversation.clientName} &amp; {currentConversation.consultantName}
                </span>
              </div>
            </div>

            {threadMessages.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-2.5 shadow-xs">
                  <MessageSquare className="w-6 h-6 text-[#020617]" />
                </div>
                <p className="font-bold text-slate-700 text-sm">Consultation Room Active</p>
                <p className="mt-1 text-slate-500 max-w-sm mx-auto">
                  Send a message below to begin real-time consultation with {partnerName}.
                </p>
              </div>
            ) : (
              threadMessages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isMine={msg.senderId === activeUser.id}
                  activeUser={activeUser}
                  partnerAvatar={partnerAvatar}
                  isMenuOpen={activeMsgMenuId === msg.id}
                  copiedMsgId={copiedMsgId}
                  onToggleMenu={() =>
                    setActiveMsgMenuId(activeMsgMenuId === msg.id ? null : msg.id)
                  }
                  onCopyText={handleCopyText}
                  onDeleteMessage={(msgId) => {
                    deleteMessage(msgId);
                    setActiveMsgMenuId(null);
                  }}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <ChatComposer
          inputMessage={inputMessage}
          onInputChange={setInputMessage}
          attachments={attachments}
          onAddAttachments={handleFileUpload}
          onRemoveAttachment={(attId) =>
            setAttachments((prev) => prev.filter((a) => a.id !== attId))
          }
          onInsertEmoji={(emoji) => setInputMessage((prev) => prev + emoji)}
          onInsertQuickPrompt={() =>
            setInputMessage(
              (prev) => (prev ? prev + ' ' : '') + 'Can we schedule a quick call to review?'
            )
          }
          onSubmit={handleSend}
          partnerName={partnerName}
        />
      </div>
    </div>
  );
}
