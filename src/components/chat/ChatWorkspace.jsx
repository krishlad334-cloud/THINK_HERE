import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import UserAvatar from '../common/UserAvatar';
import { timeAgo } from '../../utils/formatters';
import {
  MessageSquare,
  PhoneCall,
  Video,
  Send,
  Paperclip,
  FileText,
  ChevronDown,
  Mic,
  CheckCheck,
  Info,
  MoreVertical,
  Search,
  Copy,
  Check,
  Lock,
  ArrowLeft,
  CheckCircle,
  Smile
} from 'lucide-react';

function isOnlyEmojis(text) {
  if (!text || typeof text !== 'string') return false;
  const clean = text.trim();
  if (!clean) return false;
  try {
    const emojiRegex = /^(\p{Extended_Pictographic}|\p{Emoji_Presentation}|\s)+$/u;
    return emojiRegex.test(clean) && Array.from(clean).length <= 4;
  } catch {
    return false;
  }
}

export default function ChatWorkspace() {
  const {
    conversations,
    thinks,
    thoughts,
    sendChatMessage,
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
    setActiveTab
  } = useApp();

  const allThinks = thinks || thoughts || [];

  // Filter conversations strictly for the active demo user (security/isolation requirement)
  const myConversations = conversations.filter(c => {
    if (activeUser.role === 'client') {
      return c.clientId === activeUser.id;
    } else {
      return c.consultantId === activeUser.id;
    }
  });

  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showContextDrawer, setShowContextDrawer] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Active conversation selection
  const currentConversation = myConversations.find(c => c.id === activeConversationId)
    || (activeChatThoughtId ? myConversations.find(c => c.thinkId === activeChatThoughtId) : null)
    || (selectedThoughtId ? myConversations.find(c => c.thinkId === selectedThoughtId) : null)
    || (myConversations.length > 0 ? myConversations[0] : null);

  const activeConvId = currentConversation?.id || null;

  // Connected Think details
  const activeThought = allThinks.find(t => t.id === currentConversation?.thinkId) || null;

  // Mobile master-detail view: 'list' on phone shows conversation list, 'chat' shows active chat
  const [mobileView, setMobileView] = useState(currentConversation ? 'chat' : 'list');

  const [activeMsgMenuId, setActiveMsgMenuId] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [copiedThinkId, setCopiedThinkId] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const moreMenuRef = useRef(null);

  const EMOJI_LIST = ['👍', '👋', '😊', '💡', '🚀', '✅', '🙏', '🔥', '👏', '🎉', '❤️', '🤔', '🎯', '🤝', '💼', '📈', '⭐', '💯', '✨', '🙌', '👌', '⚡', '📝', '💬'];

  const handleInsertEmoji = (emoji) => {
    setInputMessage(prev => prev + emoji);
  };

  // Close emoji picker on outside click
  useEffect(() => {
    const handleEmojiClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleEmojiClickOutside);
      return () => document.removeEventListener('mousedown', handleEmojiClickOutside);
    }
  }, [showEmojiPicker]);

  // Mark messages as read when opening conversation
  useEffect(() => {
    if (activeConvId) {
      markConversationRead(activeConvId);
    }
  }, [activeConvId, markConversationRead]);

  // Scroll to bottom on messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages?.length]);

  // Close message popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
      setActiveMsgMenuId(null);
      setShowCallMenu(false);
      setShowStatusMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && attachments.length === 0) return;
    if (!currentConversation) return;

    sendChatMessage(currentConversation.id, inputMessage.trim(), attachments);
    setInputMessage('');
    setAttachments([]);
  };

  const handleCopyText = (msgId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => {
      setCopiedMsgId(null);
      setActiveMsgMenuId(null);
    }, 1200);
  };

  const handleStartCall = (callType) => {
    if (!currentConversation) return;
    const isClient = activeUser.role === 'client';
    const participantName = isClient ? currentConversation.consultantName : currentConversation.clientName;
    const participantAvatar = isClient ? currentConversation.consultantAvatar : currentConversation.clientAvatar;

    startCall({
      thoughtId: currentConversation.thinkId,
      participantName,
      participantAvatar,
      callType
    });
    setShowCallMenu(false);
  };

  const handleStatusChange = (newStatus) => {
    if (activeThought) {
      updateThinkStatus(activeThought.id, newStatus);
    }
    setShowStatusMenu(false);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      setAttachments(prev => [
        ...prev,
        {
          id: 'att_' + Date.now(),
          name: f.name,
          size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`
        }
      ]);
    });
  };

  // Search filter
  const filteredConversations = searchQuery
    ? myConversations.filter(c => {
        const q = searchQuery.toLowerCase();
        const partnerName = activeUser.role === 'client' ? c.consultantName : c.clientName;
        const think = allThinks.find(t => t.id === c.thinkId);
        return (
          partnerName?.toLowerCase().includes(q) ||
          c.thinkId?.toLowerCase().includes(q) ||
          think?.title?.toLowerCase().includes(q) ||
          think?.category?.toLowerCase().includes(q)
        );
      })
    : myConversations;

  // Empty state when no conversations exist for the active user
  if (myConversations.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white p-6 sm:p-12">
        <div className="text-center max-w-md space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#ecfeff] text-[#020617] flex items-center justify-center mx-auto shadow-xs">
            <MessageSquare className="w-8 h-8 text-[#0891b2]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {activeUser.role === 'consultant'
                ? 'No Active Consultations Yet'
                : 'No Consultation Conversations'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              {activeUser.role === 'consultant'
                ? `You are signed in as ${activeUser.label}. Head to Available OverThinks to accept client submissions and start consultation rooms.`
                : 'Submit an OverThink to start. Once a verified consultant accepts your OverThink, your private 1-on-1 consultation chat will appear here.'}
            </p>
          </div>

          <div className="pt-2">
            {activeUser.role === 'consultant' ? (
              <button
                onClick={() => setActiveTab('browse_thoughts')}
                className="px-5 py-2.5 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Browse Available OverThinks
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('chat')}
                className="px-5 py-2.5 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Go to Client Workspace
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isClientRole = activeUser.role === 'client';
  const partnerName = isClientRole ? currentConversation.consultantName : currentConversation.clientName;
  const partnerAvatar = isClientRole ? currentConversation.consultantAvatar : currentConversation.clientAvatar;
  const partnerRoleLabel = isClientRole ? 'Verified Consultant' : 'Client';
  const currentStatus = activeThought?.status || currentConversation.status || 'accepted';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
      case 'pending_human':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Pending</span>;
      case 'accepted':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">Accepted</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">In Progress</span>;
      case 'resolved':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">Completed</span>;
      case 'closed':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">Closed</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-white overflow-hidden select-none">
      {/* ======================================================== */}
      {/* Left Panel: Clean Consultation Rooms List                */}
      {/* ======================================================== */}
      <div className={`w-full md:w-72 lg:w-80 border-r border-slate-200/90 flex flex-col bg-[#fcfdfe] flex-shrink-0 h-full ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        {/* Rooms Header */}
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

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all font-medium"
            />
          </div>
        </div>

        {/* Room Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80 p-2 space-y-1">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConvId;
            const think = allThinks.find(t => t.id === conv.thinkId);
            const contactName = isClientRole ? conv.consultantName : conv.clientName;
            const contactAvatar = isClientRole ? conv.consultantAvatar : conv.clientAvatar;
            const lastMsg = conv.messages && conv.messages.length > 0
              ? conv.messages[conv.messages.length - 1]
              : null;

            // Unread count: messages sent by partner where isRead === false
            const unreadCount = (conv.messages || []).filter(m => m.senderId !== activeUser.id && !m.isRead).length;

            return (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveConversationId(conv.id);
                  if (conv.thinkId) setActiveChatThoughtId(conv.thinkId);
                  setSelectedThoughtId(null);
                  setMobileView('chat');
                }}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 relative ${
                  isSelected
                    ? 'bg-[#ecfeff]/80 border-l-[3.5px] border-[#020617] shadow-xs'
                    : 'hover:bg-slate-100/70 border-l-[3.5px] border-transparent'
                }`}
              >
                {/* Avatar with Online Ring */}
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

                  {/* Think ID & Category */}
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      #{conv.thinkId}
                    </span>
                    {think && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-[#020617] truncate max-w-[100px]">
                        {think.category}
                      </span>
                    )}
                    {getStatusBadge(think?.status || conv.status)}
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
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* Center / Right: Main Chat Canvas                         */}
      {/* ======================================================== */}
      <div className={`flex-1 flex flex-col h-full bg-[#f8fafc] min-w-0 overflow-hidden ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        {/* Top Chat Header - WhatsApp Inspired Clean Layout */}
        <div className="px-2.5 sm:px-4 py-2 sm:py-2.5 border-b border-slate-200/90 flex items-center justify-between bg-white z-20 flex-shrink-0 shadow-2xs gap-1 sm:gap-3 h-14 sm:h-16">
          {/* Partner Info (WhatsApp Style) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Mobile Back Button */}
            <button
              type="button"
              onClick={() => setMobileView('list')}
              className="p-1.5 -ml-1 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden cursor-pointer transition-colors flex-shrink-0"
              title="Back to conversations"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>

            {/* Profile Avatar */}
            <div
              className="relative flex-shrink-0 cursor-pointer"
              onClick={() => setShowContextDrawer(prev => !prev)}
            >
              <UserAvatar
                src={partnerAvatar}
                name={partnerName}
                role={partnerRoleLabel?.toLowerCase().includes('consultant') ? 'consultant' : 'client'}
                size="md"
                showOnline={true}
              />
            </div>

            {/* Name & Online Status Column (Clean WhatsApp Stack - ZERO wrapping!) */}
            <div
              className="min-w-0 flex-1 cursor-pointer"
              onClick={() => setShowContextDrawer(prev => !prev)}
            >
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate leading-tight">
                  {partnerName}
                </h3>
                <span className="hidden sm:inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-[#ecfeff] text-[#020617] border border-[#020617]/20 flex-shrink-0">
                  {partnerRoleLabel}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-600 font-semibold leading-none">Online</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="hidden sm:inline text-slate-500 truncate font-normal">
                  {activeThought?.title || 'Consultation Room'}
                </span>
              </p>
            </div>
          </div>

          {/* Right Action Header: Video Call, Audio Call & Options Menu */}
          <div className="flex items-center gap-0.5 sm:gap-1.5 flex-shrink-0">
            {/* Live Video Call Button (WhatsApp Style) */}
            <button
              type="button"
              onClick={() => handleStartCall('video')}
              className="p-2 sm:px-3 sm:py-2 rounded-full sm:rounded-xl text-slate-700 hover:text-[#020617] hover:bg-slate-100 active:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Start Live Video Call"
              aria-label="Start Live Video Call"
            >
              <Video className="w-5 h-5 text-slate-700 hover:text-[#020617]" />
              <span className="hidden lg:inline text-xs font-semibold text-slate-700">Video</span>
            </button>

            {/* Audio Voice Call Button (WhatsApp Style) */}
            <button
              type="button"
              onClick={() => handleStartCall('audio')}
              className="p-2 sm:px-3 sm:py-2 rounded-full sm:rounded-xl text-slate-700 hover:text-[#020617] hover:bg-slate-100 active:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Start Voice Call"
              aria-label="Start Voice Call"
            >
              <PhoneCall className="w-4.5 h-4.5 text-slate-700 hover:text-[#020617]" />
              <span className="hidden lg:inline text-xs font-semibold text-slate-700">Call</span>
            </button>

            {/* Status Dropdown Pill Button (No "Status:" prefix, clean status badge) */}
            <div className="relative hidden md:block">
              {(() => {
                const config = {
                  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500 animate-pulse' },
                  pending_human: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500 animate-pulse' },
                  in_progress: { label: 'In Progress', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', dot: 'bg-blue-500 animate-pulse' },
                  accepted: { label: 'Accepted', bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200', dot: 'bg-cyan-500' },
                  resolved: { label: 'Completed', bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200', dot: 'bg-sky-500' },
                  closed: { label: 'Closed', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', dot: 'bg-slate-400' }
                }[currentStatus] || { label: currentStatus, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400' };

                return (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStatusMenu(prev => !prev);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer hover:opacity-90 ${config.bg} ${config.text} ${config.border}`}
                    title="Change Status (Pending, Accepted, In Progress, Completed, Closed)"
                  >
                    <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                    <span>{config.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>
                );
              })()}

              {showStatusMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1.5 z-50 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Change Status
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('pending')}
                    className="w-full px-3 py-2 text-xs font-semibold text-left hover:bg-amber-50 text-amber-800 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Pending</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('accepted')}
                    className="w-full px-3 py-2 text-xs font-semibold text-left hover:bg-cyan-50 text-cyan-800 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span>Accepted</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('in_progress')}
                    className="w-full px-3 py-2 text-xs font-semibold text-left hover:bg-blue-50 text-blue-800 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span>In Progress</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('resolved')}
                    className="w-full px-3 py-2 text-xs font-semibold text-left hover:bg-sky-50 text-sky-800 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <span>Completed</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('closed')}
                    className="w-full px-3 py-2 text-xs font-semibold text-left hover:bg-slate-100 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span>Closed</span>
                  </button>
                </div>
              )}
            </div>

            {/* WhatsApp-Style 3-Dots More Options Menu */}
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoreMenu(prev => !prev);
                }}
                className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
                title="More Options"
                aria-label="More Options"
              >
                <MoreVertical className="w-5 h-5 text-slate-700" />
              </button>

              {showMoreMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1.5 z-50 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 animate-in fade-in zoom-in-95 duration-100"
                >
                  {/* Status Section */}
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Consultation Status
                    </span>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-600 font-medium">Current:</span>
                      {getStatusBadge(currentStatus)}
                    </div>
                    <div className="grid grid-cols-2 gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => { handleStatusChange('pending'); setShowMoreMenu(false); }}
                        className="py-1 px-2 rounded-lg text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 text-center transition-colors"
                      >
                        Pending
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleStatusChange('accepted'); setShowMoreMenu(false); }}
                        className="py-1 px-2 rounded-lg text-[11px] font-semibold bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-center transition-colors"
                      >
                        Accepted
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleStatusChange('in_progress'); setShowMoreMenu(false); }}
                        className="py-1 px-2 rounded-lg text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 text-center transition-colors"
                      >
                        In Progress
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleStatusChange('resolved'); setShowMoreMenu(false); }}
                        className="py-1 px-2 rounded-lg text-[11px] font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 text-center transition-colors"
                      >
                        Completed
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleStatusChange('closed'); setShowMoreMenu(false); }}
                        className="col-span-2 py-1 px-2 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 text-center transition-colors"
                      >
                        Closed
                      </button>
                    </div>
                  </div>

                  {/* Think Context Action */}
                  <div className="p-1.5 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowContextDrawer(!showContextDrawer);
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Info className="w-4 h-4 text-[#020617]" />
                      <span>{showContextDrawer ? 'Hide OverThink Details' : 'View OverThink Details'}</span>
                    </button>
                  </div>

                  {/* Think ID Copy Action */}
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`#${currentConversation.thinkId}`);
                        setCopiedThinkId(true);
                        setTimeout(() => {
                          setCopiedThinkId(false);
                          setShowMoreMenu(false);
                        }, 1200);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="truncate font-mono text-[11px]">#{currentConversation.thinkId}</span>
                      <span className="text-[10px] text-[#020617] font-bold flex items-center gap-1">
                        {copiedThinkId ? <Check className="w-3 h-3 text-[#0891b2]" /> : <Copy className="w-3 h-3" />}
                        {copiedThinkId ? 'Copied' : 'Copy'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Original Think Details Context Drawer */}
        {(showContextDrawer || !activeThought?.description) && activeThought && (
          <div className="bg-white border-b border-slate-200 p-4 sm:p-5 animate-in slide-in-from-top-2 duration-150 space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#020617]">
                    Original OverThink #{activeThought.id}
                  </span>
                  <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-[#ecfeff] text-[#020617]">
                    {activeThought.category}
                  </span>
                  {getStatusBadge(currentStatus)}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{activeThought.title}</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed whitespace-pre-wrap max-w-4xl">
                  {activeThought.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowContextDrawer(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 p-1 cursor-pointer flex-shrink-0"
              >
                ✕ Close
              </button>
            </div>

            {/* Attachments preview */}
            {activeThought.attachments && activeThought.attachments.length > 0 && (
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-500">Attachments:</span>
                {activeThought.attachments.map((att, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#020617]" />
                    <span>{att.name}</span>
                    <span className="text-[10px] text-slate-400">({att.size || '1.2 MB'})</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* Messages Stream                                          */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-5 bg-[#f8fafc]/90">
          <div className="max-w-3xl sm:max-w-4xl mx-auto space-y-4">
            {/* Consultation Connected Banner at Top */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-2.5 sm:p-4 shadow-xs text-center space-y-1 max-w-xl mx-auto mb-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ecfeff] text-[#020617] text-[10px] sm:text-[11px] font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-[#0891b2]" />
                <span>1-on-1 Consultation Connected</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 sm:line-clamp-2">
                "{activeThought?.title || 'Problem Consultation'}"
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate sm:whitespace-normal">
                OverThink #{currentConversation.thinkId} • Verified discussion between {currentConversation.clientName} and {currentConversation.consultantName}
              </p>
            </div>

            {(!currentConversation.messages || currentConversation.messages.length === 0) ? (
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
              currentConversation.messages.map((msg) => {
                const isMine = msg.senderId === activeUser.id;
                const isMenuOpen = activeMsgMenuId === msg.id;

                if (!isMine) {
                  // Partner / Consultant Message (Incoming)
                  return (
                    <div
                      key={msg.id}
                      className="flex items-start gap-2.5 sm:gap-3 max-w-md sm:max-w-lg lg:max-w-xl mr-auto group relative"
                    >
                      <UserAvatar
                        src={msg.senderAvatar || partnerAvatar}
                        name={msg.senderName}
                        role={msg.senderRole}
                        size="sm"
                        className="ring-2 ring-white shadow-xs mt-0.5"
                      />

                      <div className="flex flex-col items-start max-w-[calc(100%-2.5rem)] min-w-0">
                        <div className="flex items-center gap-1.5 px-1 mb-1">
                          <span className="text-xs font-bold text-slate-900">{msg.senderName}</span>
                          {msg.senderRole === 'consultant' && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                              Consultant
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">{timeAgo(msg.createdAt)}</span>
                        </div>

                        <div className="relative group/bubble w-fit max-w-full">
                          <div
                            className={`w-fit max-w-full rounded-2xl rounded-tl-xs bg-white border border-slate-200/90 shadow-xs leading-relaxed text-slate-800 ${
                              isOnlyEmojis(msg.text)
                                ? 'px-3.5 py-2 text-2xl sm:text-3xl'
                                : 'px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-[13.5px]'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                            {/* Attachments preview inside bubble */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                                {msg.attachments.map((att, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-[#0891b2]" />
                                    <span className="font-semibold truncate max-w-[140px]">{att.name}</span>
                                    <span className="text-[10px] text-slate-400">({att.size || '1 MB'})</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Hover Trigger */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMsgMenuId(isMenuOpen ? null : msg.id);
                            }}
                            className="absolute top-2 -right-7 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 opacity-0 group-hover/bubble:opacity-100 transition-opacity cursor-pointer"
                            title="Message options"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {isMenuOpen && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute left-0 top-full mt-1 z-30 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1"
                            >
                              <button
                                type="button"
                                onClick={() => handleCopyText(msg.id, msg.text)}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                              >
                                {copiedMsgId === msg.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-[#0891b2]" />
                                    <span className="text-[#0891b2]">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Copy Text</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // Current User Message (Outgoing)
                  return (
                    <div
                      key={msg.id}
                      className="flex items-start gap-2.5 sm:gap-3 max-w-md sm:max-w-lg lg:max-w-xl ml-auto flex-row-reverse group relative"
                    >
                      <UserAvatar
                        src={msg.senderAvatar || activeUser.profileImage || activeUser.avatar}
                        name={msg.senderName || activeUser.name}
                        role={activeUser.role}
                        size="sm"
                        className="ring-2 ring-white shadow-xs mt-0.5"
                      />

                      <div className="flex flex-col items-end max-w-[calc(100%-2.5rem)] min-w-0">
                        <div className="flex items-center justify-end gap-2 px-1 mb-1">
                          <span className="text-[10px] text-slate-400">{timeAgo(msg.createdAt)}</span>
                          <span className="text-xs font-bold text-slate-900">{msg.senderName}</span>
                        </div>

                        <div className="relative group/bubble w-fit max-w-full flex flex-col items-end">
                          <div
                            className={`w-fit max-w-full rounded-2xl rounded-tr-xs bg-[#020617] text-white shadow-xs leading-relaxed text-left ${
                              isOnlyEmojis(msg.text)
                                ? 'px-3.5 py-2 text-2xl sm:text-3xl'
                                : 'px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-[13.5px]'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                            {/* Attachments preview inside bubble */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2.5 pt-2 border-t border-white/20 flex flex-wrap gap-1.5">
                                {msg.attachments.map((att, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-[#0891b2]" />
                                    <span className="font-semibold truncate max-w-[140px]">{att.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] text-cyan-200/80">
                              <span>{timeAgo(msg.createdAt)}</span>
                              <CheckCheck className={`w-3.5 h-3.5 ${msg.isRead ? 'text-[#0891b2]' : 'text-cyan-300'}`} />
                            </div>
                          </div>

                          {/* Hover Trigger */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMsgMenuId(isMenuOpen ? null : msg.id);
                            }}
                            className="absolute top-2 -left-7 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 opacity-0 group-hover/bubble:opacity-100 transition-opacity cursor-pointer"
                            title="Message options"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {isMenuOpen && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-full mt-1 z-30 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1"
                            >
                              <button
                                type="button"
                                onClick={() => handleCopyText(msg.id, msg.text)}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                              >
                                {copiedMsgId === msg.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-[#0891b2]" />
                                    <span className="text-[#0891b2]">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Copy Text</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ======================================================== */}
        {/* Bottom Message Composer (Mobile Optimized)               */}
        {/* ======================================================== */}
        <div className="p-2 sm:p-4 bg-white border-t border-slate-200/90 flex-shrink-0 z-10 shadow-xs pb-[max(0.35rem,env(safe-area-inset-bottom))]">
          <div className="max-w-3xl sm:max-w-4xl mx-auto w-full space-y-1.5 sm:space-y-2">
            {/* Attachments preview if selected */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-1">
                {attachments.map((att) => (
                  <div key={att.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-xs text-slate-700 border border-slate-200">
                    <FileText className="w-3 h-3 text-[#0891b2]" />
                    <span className="font-medium truncate max-w-[120px]">{att.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
                      className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSend} className="bg-slate-50 border border-slate-200/90 rounded-2xl p-1 sm:p-1.5 flex items-center gap-1 sm:gap-2 focus-within:border-[#020617] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#020617]/15 transition-all shadow-xs">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-500 hover:text-[#020617] hover:bg-slate-200/60 rounded-xl cursor-pointer transition-colors"
                title="Attach Files"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setInputMessage(prev => (prev ? prev + ' ' : '') + 'Can we schedule a quick call to review?')}
                className="p-2 text-slate-500 hover:text-[#020617] hover:bg-slate-200/60 rounded-xl cursor-pointer transition-colors"
                title="Quick Prompt Template"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Emoji Picker Button */}
              <div className="relative" ref={emojiPickerRef}>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(prev => !prev)}
                  className={`p-2 rounded-xl cursor-pointer transition-colors ${
                    showEmojiPicker
                      ? 'text-[#020617] bg-slate-200/80'
                      : 'text-slate-500 hover:text-[#020617] hover:bg-slate-200/60'
                  }`}
                  title="Insert Emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>

                {showEmojiPicker && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-full left-0 mb-2 p-2.5 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 w-64 animate-in fade-in zoom-in-95 duration-100"
                  >
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Choose Emoji
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(false)}
                        className="text-slate-400 hover:text-slate-700 text-xs p-0.5 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="grid grid-cols-6 gap-1 text-lg">
                      {EMOJI_LIST.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleInsertEmoji(emoji)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-base hover:scale-115 active:scale-95 transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message ${partnerName}...`}
                className="flex-1 px-3 py-2 bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() && attachments.length === 0}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  inputMessage.trim() || attachments.length > 0
                    ? 'bg-[#020617] hover:bg-[#091528] text-white shadow-xs transform active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4 text-[#0891b2]" />
              </button>
            </form>

            <div className="hidden sm:flex items-center justify-between px-2 text-[10px] text-slate-400">
              <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-100 font-mono text-slate-600">Enter</kbd> to send</span>
              <span className="flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-[#0891b2]" />
                <span>Protected by OverThink Verified Consultation</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
