import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import UserAvatar from '../common/UserAvatar';
import { TOPIC_SUGGESTIONS } from '../../data/mockSeedData';
import { timeAgo } from '../../utils/formatters';
import {
  Paperclip,
  Mic,
  Send,
  FileText,
  Bookmark,
  Printer,
  PhoneCall,
  Video,
  ArrowRight,
  Trash2,
  Bell,
  BellOff,
  RotateCcw,
  MoreVertical,
  Copy,
  Check,
  CheckCheck,
  MessageSquare,
  ChevronDown,
  CheckCircle,
  Clock,
  Lock,
  ExternalLink,
  Smile
} from 'lucide-react';

export default function ClientChatView() {
  const {
    currentUser,
    thoughts,
    thinks,
    conversations,
    messages,
    sendMessage,
    deleteMessage,
    clearChat,
    toggleMuteChat,
    mutedThoughtIds,
    submitThink,
    activeChatThoughtId,
    setActiveChatThoughtId,
    openChatWithThought,
    setSelectedThoughtId,
    setActiveConversationId,
    setActiveTab,
    toggleSaveThought,
    startCall,
    showToast
  } = useApp();

  const allThinks = thinks || thoughts || [];

  const [inputVal, setInputVal] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [activeMsgMenuId, setActiveMsgMenuId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCallMenu, setShowCallMenu] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const callMenuTimerRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const EMOJI_LIST = ['👍', '👋', '😊', '💡', '🚀', '✅', '🙏', '🔥', '👏', '🎉', '❤️', '🤔', '🎯', '🤝', '💼', '📈', '⭐', '💯', '✨', '🙌', '👌', '⚡', '📝', '💬'];

  const handleInsertEmoji = (emoji) => {
    setInputVal(prev => prev + emoji);
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

  // Active thought determination
  const activeThought = allThinks.find(t => t.id === activeChatThoughtId) || null;
  const isMuted = activeThought ? (mutedThoughtIds || []).includes(activeThought.id) : false;

  // Find linked shared conversation messages
  const currentConversation = conversations.find(c => c.thinkId === activeThought?.id || c.id === activeThought?.id);
  const thoughtMessages = currentConversation
    ? (currentConversation.messages || [])
    : messages.filter(m => m.thoughtId === activeThought?.id || m.conversationId === activeThought?.id);

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

  const handleCopyText = (msgId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => {
      setCopiedMsgId(null);
      setActiveMsgMenuId(null);
    }, 1200);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thoughtMessages.length, activeThought?.id]);

  // Voice speech-to-text
  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setInputVal(prev => (prev ? prev + ' ' : '') + text);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
      setIsRecording(true);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setInputVal(prev => (prev ? prev + ' ' : '') + "How can I improve my product's go-to-market strategy?");
        setIsRecording(false);
      }, 1600);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      setAttachments(prev => [
        ...prev,
        {
          id: 'att-' + Date.now() + Math.random().toString(36).substring(2, 5),
          name: f.name,
          type: f.type.startsWith('image/') ? 'image' : 'document',
          size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`
        }
      ]);
    });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim() && attachments.length === 0) return;

    if (!activeThought) {
      // Create new Think with pending status
      const created = submitThink({
        title: inputVal.trim(),
        description: inputVal.trim(),
        category: 'General Consultation',
        attachments
      });
      setInputVal('');
      setAttachments([]);

      if (created) {
        openChatWithThought(created.id);
      }
    } else {
      // Send chat message in existing conversation
      sendMessage(activeThought.id, inputVal.trim(), attachments);
      setInputVal('');
      setAttachments([]);
    }
  };

  const handleSelectStarter = (prompt) => {
    setInputVal(prompt);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
      case 'pending_human':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Pending (Available)</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Accepted</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>In Progress</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Resolved</span>
          </span>
        );
      case 'closed':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Closed</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const assignedConsName = activeThought?.assignedConsultantName;
  const assignedConsAvatar = activeThought?.assignedConsultantAvatar;

  return (
    <div className="flex flex-col h-full w-full bg-white flex-1 overflow-hidden">
      {/* Top Header of Chat View - Seamless Edge to Edge */}
      {activeThought ? (
        <div className="px-3 sm:px-6 py-2 sm:py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 sm:gap-3 bg-white flex-shrink-0 z-10 w-full">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
            <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              #{activeThought.id}
            </span>

            <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#e6f2f1] text-[#004845] flex-shrink-0">
              {activeThought.category}
            </span>

            {getStatusBadge(activeThought.status)}

            {assignedConsName && (
              <span className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 truncate">
                <img
                  src={assignedConsAvatar}
                  alt={assignedConsName}
                  className="w-4 h-4 rounded-full object-cover flex-shrink-0"
                />
                <span className="truncate">
                  <span className="hidden sm:inline text-slate-400">Consultant: </span>
                  <span className="font-bold text-slate-800">{assignedConsName}</span>
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Open in dedicated 1-on-1 Consultation room button */}
            <button
              type="button"
              onClick={() => {
                setActiveChatThoughtId(activeThought.id);
                setSelectedThoughtId(null);
                if (currentConversation) {
                  setActiveConversationId(currentConversation.id);
                }
                setActiveTab('messages');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
              title="Open full consultation chat room"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#004845]" />
              <span>Open Chat Room</span>
            </button>

            {assignedConsName && (
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold shadow-xs transition-all cursor-pointer group select-none"
                  title="Call Consultant"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span>Call</span>
                  <ChevronDown className={`w-3 h-3 text-white/70 transition-transform duration-150 ${showCallMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Call Dropdown */}
                {showCallMenu && (
                  <div
                    onMouseEnter={handleCallMouseEnter}
                    onMouseLeave={handleCallMouseLeave}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full pt-1 z-50 w-48 animate-in fade-in zoom-in-95 duration-100"
                  >
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/95 p-1.5 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          startCall({
                            thoughtId: activeThought.id,
                            participantName: assignedConsName,
                            participantAvatar: assignedConsAvatar,
                            callType: 'video'
                          });
                          setShowCallMenu(false);
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-xl text-slate-800 hover:bg-[#e6f2f1] hover:text-[#004845] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                      >
                        <div className="p-1.5 rounded-lg bg-[#e6f2f1] text-[#004845]">
                          <Video className="w-3.5 h-3.5 text-[#16a34a]" />
                        </div>
                        <div>
                          <span className="block font-bold">Live Video Call</span>
                          <span className="text-[10px] text-slate-400 font-normal">HD Screen & Camera</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          startCall({
                            thoughtId: activeThought.id,
                            participantName: assignedConsName,
                            participantAvatar: assignedConsAvatar,
                            callType: 'audio'
                          });
                          setShowCallMenu(false);
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-xl text-slate-800 hover:bg-[#e6f2f1] hover:text-[#004845] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                      >
                        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                          <PhoneCall className="w-3.5 h-3.5 text-[#004845]" />
                        </div>
                        <div>
                          <span className="block font-bold">Audio Call</span>
                          <span className="text-[10px] text-slate-400 font-normal">Encrypted Voice</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => toggleSaveThought(activeThought.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                activeThought.isSaved ? 'bg-amber-50 text-amber-600 border-amber-200' : 'text-slate-400 hover:text-slate-700 border-slate-200'
              }`}
              title={activeThought.isSaved ? 'Saved' : 'Save Think'}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Main Conversation Canvas - 100% Full Width, Clean Center Container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {!activeThought ? (
          /* Empty State - Authentic Minimalist ChatGPT Style Landing */
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-3xl mx-auto space-y-6 pt-6">
            <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 p-2 shadow-xs flex items-center justify-center">
              <img src="/logo.jpg" alt="THINK" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                What's on your mind today, {currentUser.name.split(' ')[0]}?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                Start a new thought, question, or business challenge. Receive verified human consultation within 24 hours.
              </p>
            </div>

            {/* Starter Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left pt-2">
              {TOPIC_SUGGESTIONS.slice(0, 4).map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectStarter(s.prompt)}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-[#004845] hover:bg-white hover:shadow-xs cursor-pointer transition-all group"
                >
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#004845] mb-1">
                    {s.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    "{s.prompt}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Active Chat Stream */
          <div className="space-y-6 max-w-3xl sm:max-w-4xl mx-auto w-full">
            {/* 1-Click Gateway into Dedicated Consultation Room */}
            <div className="bg-[#e6f2f1]/90 border border-[#004845]/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#004845] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <MessageSquare className="w-5 h-5 text-[#16a34a]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    1-on-1 Consultation Room Ready
                  </h4>
                  <p className="text-xs text-slate-600">
                    Direct messaging, file sharing & live video calling with {assignedConsName || 'your verified consultant'}.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveChatThoughtId(activeThought.id);
                  setSelectedThoughtId(null);
                  if (currentConversation) {
                    setActiveConversationId(currentConversation.id);
                  }
                  setActiveTab('messages');
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex-shrink-0"
              >
                <span>Enter Consultation Chat</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#16a34a]" />
              </button>
            </div>

            {/* Original Problem Card as the First Message */}
            <div className="flex gap-4 items-start">
              <UserAvatar
                src={activeThought.clientAvatar || currentUser.profileImage || currentUser.avatar}
                name={activeThought.clientName || currentUser.name}
                role="client"
                size="md"
                className="ring-2 ring-slate-200 flex-shrink-0"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{activeThought.clientName || currentUser.name}</span>
                  <span className="text-[10px] text-slate-400">{timeAgo(activeThought.createdAt)}</span>
                  <span className="text-[10px] font-mono text-slate-400">#{activeThought.id}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-100/80 text-slate-900 text-sm leading-relaxed rounded-tl-none font-medium">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                    {activeThought.title}
                  </h3>
                  {activeThought.description && (
                    <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap">
                      {activeThought.description}
                    </p>
                  )}

                  {activeThought.attachments && activeThought.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 mt-2 border-t border-slate-200/60">
                      {activeThought.attachments.map((att, i) => (
                        <span key={i} className="text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 text-slate-700">
                          <FileText className="w-3.5 h-3.5 text-[#16a34a]" />
                          {att.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages Stream */}
            {thoughtMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              const isConsultantMsg = msg.senderRole === 'consultant' || (!isMine && assignedConsName);
              const isMenuOpen = activeMsgMenuId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 items-start group relative ${
                    isMine ? 'flex-row-reverse' : ''
                  }`}
                >
                  <UserAvatar
                    src={msg.senderAvatar || (isMine ? (currentUser.profileImage || currentUser.avatar) : (assignedConsAvatar || null))}
                    name={msg.senderName}
                    role={isMine ? 'client' : 'consultant'}
                    size="sm"
                    className="ring-2 ring-slate-100 flex-shrink-0"
                  />

                  <div className={`space-y-1 max-w-[85%] sm:max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center gap-2 text-[10px] text-slate-400 ${isMine ? 'justify-end' : ''}`}>
                      <span className="font-bold text-slate-700">{msg.senderName}</span>
                      <span>{timeAgo(msg.createdAt)}</span>
                      {isMine && (
                        <CheckCheck className={`w-3.5 h-3.5 ${msg.isRead ? 'text-[#16a34a]' : 'text-slate-400'}`} />
                      )}
                    </div>

                    <div className="relative group/bubble">
                      <div
                        className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMine
                            ? 'bg-[#004845] text-white rounded-tr-none'
                            : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-none shadow-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2 mt-2 border-t border-slate-200/30">
                            {msg.attachments.map((att, aIdx) => (
                              <div
                                key={aIdx}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                                  isMine ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                <FileText className="w-3.5 h-3.5 text-[#16a34a]" />
                                <span className="truncate max-w-[140px]">{att.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Hover action menu */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMsgMenuId(isMenuOpen ? null : msg.id);
                        }}
                        className={`absolute top-2 ${
                          isMine ? '-left-6 sm:-left-7' : '-right-6 sm:-right-7'
                        } p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer`}
                        title="Message options"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {isMenuOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className={`absolute z-30 mt-1.5 w-48 max-w-[80vw] bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 animate-in fade-in zoom-in-95 duration-100 ${
                            isMine ? 'right-0' : 'left-0'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            {copiedMsgId === msg.id ? <Check className="w-3.5 h-3.5 text-[#16a34a]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                            <span>{copiedMsgId === msg.id ? 'Copied!' : 'Copy Text'}</span>
                          </button>

                          {isMine && (
                            <button
                              type="button"
                              onClick={() => {
                                deleteMessage(msg.id);
                                setActiveMsgMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom Fixed ChatGPT Input Bar - 100% Width Container */}
      <div className="p-2.5 sm:p-4 bg-white border-t border-slate-100 flex-shrink-0 w-full">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto w-full">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachments.map((att, idx) => (
                <span key={idx} className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium text-slate-700">
                  <FileText className="w-3.5 h-3.5 text-[#16a34a]" />
                  {att.name}
                  <button type="button" onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer">×</button>
                </span>
              ))}
            </div>
          )}

          <div className="relative flex items-center bg-slate-50 rounded-2xl border border-slate-200/90 focus-within:border-[#004845] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#004845]/10 p-1.5 transition-all w-full">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              title="Attach media or files"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleVoice}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isRecording ? 'text-rose-600 bg-rose-50 animate-pulse' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
              }`}
              title="Voice Input (Speech-to-Text)"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Emoji Picker Button */}
            <div className="relative" ref={emojiPickerRef}>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(prev => !prev)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  showEmojiPicker
                    ? 'text-[#004845] bg-slate-200/80'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
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
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                activeThought
                  ? "Message your assigned consultant or ask questions..."
                  : "Please enter your thought, question, or business idea to start the consultation..."
              }
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputVal.trim() && attachments.length === 0}
              className={`p-2.5 rounded-xl transition-all ${
                inputVal.trim() || attachments.length > 0
                  ? 'bg-[#16a34a] hover:bg-[#15803d] text-white shadow-md shadow-[#16a34a]/25 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-400 mt-2">
            THINK guarantees meaningful human solutions within 24 hours. Keep communications inside THINK for safety.
          </p>
        </form>
      </div>

      {/* Clear Chat Confirmation Modal */}
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
