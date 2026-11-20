import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { timeAgo } from '../../utils/formatters';
import {
  MessageSquare,
  PhoneCall,
  Video,
  Send,
  Paperclip,
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  Mic,
  CheckCheck,
  Info,
  Trash2,
  RotateCcw,
  MoreVertical,
  Search,
  Copy,
  Check,
  Lock,
  ArrowLeft
} from 'lucide-react';

export default function ChatWorkspace() {
  const {
    thoughts,
    messages,
    sendMessage,
    deleteMessage,
    clearChat,
    currentUser,
    role,
    selectedThoughtId,
    setSelectedThoughtId,
    startCall
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showContextDrawer, setShowContextDrawer] = useState(false);
  const [showCallMenu, setShowCallMenu] = useState(false);
  const [activeThoughtId, setActiveThoughtId] = useState(
    selectedThoughtId || (thoughts.length > 0 ? thoughts[0].id : null)
  );
  // Master-detail navigation state for mobile phones ('list' shows conversations, 'chat' shows active chat)
  const [mobileView, setMobileView] = useState(selectedThoughtId ? 'chat' : 'list');
  const [prevSelectedId, setPrevSelectedId] = useState(selectedThoughtId);

  // Sync state during render when selectedThoughtId changes externally
  if (selectedThoughtId !== prevSelectedId) {
    setPrevSelectedId(selectedThoughtId);
    if (selectedThoughtId) {
      setActiveThoughtId(selectedThoughtId);
      setMobileView('chat');
    }
  }

  const [activeMsgMenuId, setActiveMsgMenuId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState(null);

  const callMenuTimerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleCallMouseEnter = () => {
    if (callMenuTimerRef.current) clearTimeout(callMenuTimerRef.current);
    setShowCallMenu(true);
  };

  const handleCallMouseLeave = () => {
    if (callMenuTimerRef.current) clearTimeout(callMenuTimerRef.current);
    callMenuTimerRef.current = setTimeout(() => {
      setShowCallMenu(false);
    }, 280);
  };

  // Close message popup when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMsgMenuId(null);
      setShowCallMenu(false);
    };
    if (activeMsgMenuId || showCallMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeMsgMenuId, showCallMenu]);

  const activeThought = thoughts.find(t => t.id === activeThoughtId) || thoughts[0];
  const currentMessages = messages.filter(m => m.thoughtId === activeThought?.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeThought) return;

    sendMessage(activeThought.id, inputMessage.trim());
    setInputMessage('');
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
    if (!activeThought) return;
    const isClient = role === 'client';
    const participantName = isClient
      ? (activeThought.assignedConsultantName || 'Marcus Sterling')
      : activeThought.clientName;
    const participantAvatar = isClient
      ? (activeThought.assignedConsultantAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200')
      : activeThought.clientAvatar;

    startCall({
      thoughtId: activeThought.id,
      participantName,
      participantAvatar,
      callType
    });
    setShowCallMenu(false);
  };

  const filteredThoughts = searchQuery
    ? thoughts.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : thoughts;

  if (!activeThought) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-3xl bg-[#e6f2f1] text-[#004845] flex items-center justify-center mx-auto mb-4 shadow-xs">
            <MessageSquare className="w-8 h-8 text-[#16a34a]" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No active consultation rooms</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Select or submit a thought to start real-time messaging with your assigned verified consultant.
          </p>
        </div>
      </div>
    );
  }

  const isClientRole = role === 'client';
  const partnerName = isClientRole
    ? (activeThought.assignedConsultantName || 'Marcus Sterling')
    : activeThought.clientName;
  const partnerAvatar = isClientRole
    ? (activeThought.assignedConsultantAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200')
    : activeThought.clientAvatar;
  const partnerRoleLabel = isClientRole ? 'Verified Consultant' : 'Client';

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-white overflow-hidden select-none">
      {/* ======================================================== */}
      {/* Left Panel: Clean Consultation Rooms List (Balanced width)*/}
      {/* ======================================================== */}
      <div className={`w-full md:w-72 lg:w-80 border-r border-slate-200/90 flex flex-col bg-[#fcfdfe] flex-shrink-0 h-full ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        {/* Rooms Header */}
        <div className="p-3.5 border-b border-slate-200/80 bg-white space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#e6f2f1] flex items-center justify-center text-[#004845]">
                <MessageSquare className="w-3.5 h-3.5 text-[#16a34a]" />
              </div>
              <h3 className="text-xs font-black text-slate-900 tracking-tight uppercase">Consultations</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a] border border-[#16a34a]/30 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              <span>Encrypted</span>
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
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845] transition-all"
            />
          </div>
        </div>

        {/* Room Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80 p-2 space-y-1">
          {filteredThoughts.map((t) => {
            const isSelected = t.id === activeThought.id;
            const thoughtMsgs = messages.filter(m => m.thoughtId === t.id);
            const lastMsg = thoughtMsgs.length > 0 ? thoughtMsgs[thoughtMsgs.length - 1] : null;
            const contactName = isClientRole ? (t.assignedConsultantName || 'Marcus Sterling') : t.clientName;
            const contactAvatar = isClientRole ? (t.assignedConsultantAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200') : t.clientAvatar;

            return (
              <div
                key={t.id}
                onClick={() => {
                  setActiveThoughtId(t.id);
                  setSelectedThoughtId(t.id);
                  setMobileView('chat');
                }}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 relative ${
                  isSelected
                    ? 'bg-[#e6f2f1]/80 border-l-[3.5px] border-[#004845] shadow-xs'
                    : 'hover:bg-slate-100/70 border-l-[3.5px] border-transparent'
                }`}
              >
                {/* Avatar with Online Ring */}
                <div className="relative flex-shrink-0 mt-0.5">
                  <img
                    src={contactAvatar}
                    alt={contactName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16a34a] ring-2 ring-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {contactName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">
                      {timeAgo(t.createdAt)}
                    </span>
                  </div>

                  {/* Domain Tag */}
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-[#004845] inline-block truncate max-w-[110px] mb-1">
                    {t.category}
                  </span>

                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {t.title}
                  </p>

                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {lastMsg ? lastMsg.text : 'Click to open conversation...'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* Center / Right: Main Chat Canvas (Clean & Uncluttered)   */}
      {/* ======================================================== */}
      <div className={`flex-1 flex flex-col h-full bg-[#f8fafc] min-w-0 overflow-hidden ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        {/* Top Chat Header - Clean & Streamlined */}
        <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-slate-200/90 flex items-center justify-between bg-white z-20 flex-shrink-0 shadow-2xs gap-2">
          {/* Partner Info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Back Button to Conversation List */}
            <button
              type="button"
              onClick={() => setMobileView('list')}
              className="p-1.5 -ml-1 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 md:hidden cursor-pointer transition-colors flex-shrink-0"
              title="Back to consultations"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>

            <div className="relative flex-shrink-0">
              <img
                src={partnerAvatar}
                alt={partnerName}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-slate-100 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16a34a] ring-2 ring-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">{partnerName}</h3>
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#e6f2f1] text-[#004845] font-extrabold border border-[#004845]/20 flex-shrink-0">
                  {partnerRoleLabel}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate flex items-center gap-1 sm:gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse flex-shrink-0" />
                <span className="text-emerald-700 font-medium">Online</span>
                <span>•</span>
                <span className="text-slate-600 truncate font-semibold">{activeThought.title}</span>
              </p>
            </div>
          </div>

          {/* Clean Action Header: Thought Context + Unified Call Button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Thought Context Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowContextDrawer(!showContextDrawer)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-[#004845]" />
              <span>Thought Context</span>
              {showContextDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Unified Call Hover / Dropdown Button */}
            <div
              className="relative"
              onMouseEnter={handleCallMouseEnter}
              onMouseLeave={handleCallMouseLeave}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCallMenu(prev => !prev);
                }}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold shadow-xs transition-all cursor-pointer group select-none"
                title="Start Audio or Live Video Call"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Call</span>
                <ChevronDown className={`w-3 h-3 text-white/70 transition-transform duration-150 ${showCallMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Call Options Dropdown on Hover/Click with seamless bridge */}
              {showCallMenu && (
                <div
                  onMouseEnter={handleCallMouseEnter}
                  onMouseLeave={handleCallMouseLeave}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full pt-1 z-50 w-48 sm:w-52 max-w-[calc(100vw-2rem)] animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/95 p-1.5 space-y-1">
                    <button
                      type="button"
                      onClick={() => handleStartCall('video')}
                      className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl text-slate-800 hover:bg-[#e6f2f1] hover:text-[#004845] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      <div className="p-2 rounded-xl bg-[#e6f2f1] text-[#004845] flex-shrink-0">
                        <Video className="w-4 h-4 text-[#16a34a]" />
                      </div>
                      <div>
                        <span className="block font-bold text-slate-900">Live Video Call</span>
                        <span className="text-[10px] text-slate-400 font-normal">HD Screen & Camera</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartCall('audio')}
                      className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl text-slate-800 hover:bg-[#e6f2f1] hover:text-[#004845] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-700 flex-shrink-0">
                        <PhoneCall className="w-4 h-4 text-[#004845]" />
                      </div>
                      <div>
                        <span className="block font-bold text-slate-900">Audio Call</span>
                        <span className="text-[10px] text-slate-400 font-normal">Encrypted Voice</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Thought Context Drawer */}
        {showContextDrawer && (
          <div className="bg-white border-b border-slate-200 p-4 sm:p-5 animate-in slide-in-from-top-2 duration-150 space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#004845] block">
                  Original Thought Requirements
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{activeThought.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-4xl">{activeThought.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowContextDrawer(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
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
                    <FileText className="w-3.5 h-3.5 text-[#004845]" />
                    <span>{att.name}</span>
                    <span className="text-[10px] text-slate-400">({att.size || '320 KB'})</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* Messages Stream - Clean Speech Bubbles Flow              */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 space-y-3.5">
          {currentMessages.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-xs">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-2.5 shadow-xs">
                <MessageSquare className="w-6 h-6 text-slate-300" />
              </div>
              <p className="font-bold text-slate-700 text-sm">Consultation Room Active</p>
              <p className="mt-1 text-slate-500 max-w-sm mx-auto">
                Send a message to begin consultation.
              </p>
            </div>
          ) : (
            currentMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              const isMenuOpen = activeMsgMenuId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 max-w-[80%] sm:max-w-[70%] ${
                    isMine ? 'ml-auto flex-row-reverse justify-end' : 'mr-auto justify-start'
                  }`}
                >
                  {/* Avatar */}
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-slate-200 shadow-2xs mb-1"
                  />

                  {/* Message Bubble + Meta */}
                  <div className={`space-y-1 relative group ${isMine ? 'text-right' : 'text-left'}`}>
                    {/* Header info above incoming messages */}
                    {!isMine && (
                      <div className="flex items-center gap-1.5 px-1 mb-0.5">
                        <span className="text-xs font-bold text-slate-900">{msg.senderName}</span>
                        <span className="text-[10px] text-slate-400">{timeAgo(msg.timestamp)}</span>
                      </div>
                    )}

                    {/* Speech Bubble Container */}
                    <div className="relative inline-block text-left">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMsgMenuId(isMenuOpen ? null : msg.id);
                        }}
                        className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs cursor-pointer transition-all duration-150 select-none hover:shadow-md ${
                          isMine
                            ? 'bg-gradient-to-br from-[#004845] to-[#003835] text-white rounded-tr-xs'
                            : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200/90'
                        }`}
                        title="Click for options (Copy, Delete, Clear)"
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                        {/* Attachments preview inside bubble */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className={`mt-3 pt-2.5 border-t space-y-1.5 ${isMine ? 'border-white/20' : 'border-slate-100'}`}>
                            {msg.attachments.map((att, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center justify-between gap-2 p-2 rounded-xl text-xs ${
                                  isMine ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-800 border border-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <FileText className="w-4 h-4 text-[#16a34a] flex-shrink-0" />
                                  <span className="font-semibold truncate">{att.name}</span>
                                  <span className="text-[10px] opacity-75">({att.size || '240 KB'})</span>
                                </div>
                                <Download className="w-3.5 h-3.5 opacity-80 hover:opacity-100 flex-shrink-0" />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Message Meta Info (Timestamp + Read status) */}
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                            isMine ? 'text-emerald-100/80' : 'text-slate-400'
                          }`}
                        >
                          <span>{timeAgo(msg.timestamp)}</span>
                          {isMine && <CheckCheck className="w-3.5 h-3.5 text-[#16a34a]" />}
                        </div>
                      </div>

                      {/* Hover 3-Dots Trigger Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMsgMenuId(isMenuOpen ? null : msg.id);
                        }}
                        className={`absolute top-2 ${
                          isMine ? '-left-7' : '-right-7'
                        } p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer`}
                        title="Message options"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {/* Interactive Options Dropdown Menu on Click */}
                      {isMenuOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className={`absolute z-30 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 animate-in fade-in zoom-in-95 duration-100 ${
                            isMine ? 'right-0' : 'left-0'
                          }`}
                        >
                          {/* Copy Text Option */}
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                          >
                            {copiedMsgId === msg.id ? (
                              <>
                                <Check className="w-4 h-4 text-[#16a34a]" />
                                <span className="text-[#16a34a]">Copied to Clipboard!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 text-slate-500" />
                                <span>Copy Message</span>
                              </>
                            )}
                          </button>

                          {/* Delete Message Option */}
                          <button
                            type="button"
                            onClick={() => {
                              deleteMessage(msg.id);
                              setActiveMsgMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                          >
                            <Trash2 className="w-4 h-4 text-rose-500" />
                            <span>Delete Message</span>
                          </button>

                          <div className="my-1 border-t border-slate-100" />

                          {/* Clear Chat Option */}
                          <button
                            type="button"
                            onClick={() => {
                              setShowClearConfirm(true);
                              setActiveMsgMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                          >
                            <RotateCcw className="w-4 h-4 text-amber-500" />
                            <span>Clear All Chat</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {msg.wasMasked && (
                      <span className="text-[10px] text-amber-600 block mt-0.5 font-medium">
                        [Personal contact details masked for safety]
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ======================================================== */}
        {/* Bottom Message Input Dock & Composer                     */}
        {/* ======================================================== */}
        <div className="p-2 sm:p-4 bg-white border-t border-slate-200/80 flex-shrink-0">
          <form onSubmit={handleSend} className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-1.5 flex items-center gap-2 focus-within:border-[#004845] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#004845]/15 transition-all shadow-xs">
            <button
              type="button"
              onClick={() => setInputMessage(prev => prev + ' [Document attached: architecture_v2.pdf] ')}
              className="p-2 text-slate-500 hover:text-[#004845] hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
              title="Attach File or Document"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setInputMessage('Recording audio consultation note: [Voice speech-to-text converted]')}
              className="p-2 text-slate-500 hover:text-[#004845] hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
              title="Voice Speech-to-Text Input"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Type consultation message to ${partnerName}...`}
              className="flex-1 px-3 py-2 bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                inputMessage.trim()
                  ? 'bg-[#004845] hover:bg-[#003331] text-white shadow-xs transform active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4 text-[#16a34a]" />
            </button>
          </form>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Clear Chat Confirmation Modal                            */}
      {/* ======================================================== */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Clear All Messages?</h3>
              <p className="text-xs text-slate-500 mt-1">This will permanently clear all messages in this consultation room for both parties.</p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeThought) clearChat(activeThought.id);
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Yes, Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
