import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TOPIC_SUGGESTIONS } from '../../data/mockSeedData';
import { calculateTimeRemaining, timeAgo, formatDate } from '../../utils/formatters';
import {
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  Mic,
  MicOff,
  Send,
  Clock,
  CheckCircle,
  FileText,
  Bookmark,
  Printer,
  PhoneCall,
  Video,
  ArrowRight,
  ShieldCheck,
  User,
  Bot,
  Trash2,
  Bell,
  BellOff,
  RotateCcw,
  MoreVertical,
  Copy,
  Check,
  CheckCheck,
  MessageSquare
} from 'lucide-react';

export default function ClientChatView() {
  const {
    currentUser,
    thoughts,
    messages,
    sendMessage,
    deleteMessage,
    clearChat,
    toggleMuteChat,
    mutedThoughtIds,
    submitThought,
    activeChatThoughtId,
    setActiveChatThoughtId,
    openChatWithThought,
    setSelectedThoughtId,
    setActiveTab,
    toggleSaveThought,
    startCall
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [activeMsgMenuId, setActiveMsgMenuId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCallMenu, setShowCallMenu] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const callMenuTimerRef = useRef(null);
  const fileInputRef = useRef(null);
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

  // Active thought
  const activeThought = thoughts.find(t => t.id === activeChatThoughtId);
  const isMuted = activeThought ? (mutedThoughtIds || []).includes(activeThought.id) : false;
  const thoughtMessages = activeThought ? messages.filter(m => m.thoughtId === activeThought.id) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thoughtMessages, activeThought]);

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
      }, 2000);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      setAttachments(prev => [
        ...prev,
        {
          id: 'att-' + Date.now(),
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
      const created = submitThought({
        title: inputVal.trim(),
        description: 'Initiated via THINK Conversational AI Workspace',
        attachments
      });
      setInputVal('');
      setAttachments([]);
      // Open immediately in the live consultation room
      openChatWithThought(created.id);
    } else {
      sendMessage(activeThought.id, inputVal.trim(), attachments);
      setInputVal('');
      setAttachments([]);
    }
  };

  const handleSelectStarter = (prompt) => {
    setInputVal(prompt);
  };

  const timeInfo = activeThought ? calculateTimeRemaining(activeThought.createdAt, activeThought.deadlineHours || 24) : null;
  const latestSolution = activeThought?.solutions?.[0];

  return (
    <div className="flex flex-col h-full w-full bg-white flex-1 overflow-hidden">
      {/* Top Header of Chat View - Seamless Edge to Edge */}
      {activeThought ? (
        <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white flex-shrink-0 z-10 w-full">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#e6f2f1] text-[#004845]">
              {activeThought.category}
            </span>

            {activeThought.assignedConsultantName && (
              <span className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                <img
                  src={activeThought.assignedConsultantAvatar}
                  alt={activeThought.assignedConsultantName}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span>Consultant: {activeThought.assignedConsultantName}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeThought.assignedConsultantName && (
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

                {/* Call Dropdown with seamless hover bridge */}
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
                            participantName: activeThought.assignedConsultantName,
                            participantAvatar: activeThought.assignedConsultantAvatar,
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
                            participantName: activeThought.assignedConsultantName,
                            participantAvatar: activeThought.assignedConsultantAvatar,
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
              className={`p-2 rounded-xl border transition-colors ${
                activeThought.isSaved ? 'bg-amber-50 text-amber-600 border-amber-200' : 'text-slate-400 hover:text-slate-700 border-slate-200'
              }`}
              title={activeThought.isSaved ? 'Saved' : 'Save Roadmap'}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>

            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              title="Print Roadmap"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Main Conversation Canvas - 100% Full Width, Clean Center Container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {!activeThought ? (
          /* Empty State - Authentic ChatGPT Style with Zero Right Margin Gap */
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-3xl mx-auto space-y-6 pt-6">
            <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 p-2 shadow-sm flex items-center justify-center">
              <img src="/logo.jpg" alt="THINK" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                What's on your mind today, {currentUser.name.split(' ')[0]}?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                Start a new thought, question, or business idea. Receive immediate AI diagnostics followed by verified human consultation within 24 hours.
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
                    Direct real-time messaging, file sharing & live video calling with {activeThought.assignedConsultantName || 'your verified consultant'}.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedThoughtId(activeThought.id);
                  setActiveTab('messages');
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex-shrink-0"
              >
                <span>Enter Chat Room</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#16a34a]" />
              </button>
            </div>

            {/* Original Problem Card as the First Message */}
            <div className="flex gap-4 items-start">
              <img
                src={activeThought.clientAvatar}
                alt={activeThought.clientName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 flex-shrink-0"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{activeThought.clientName}</span>
                  <span className="text-[10px] text-slate-400">{timeAgo(activeThought.createdAt)}</span>
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

                  {/* Attachments */}
                  {activeThought.attachments && activeThought.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200">
                      {activeThought.attachments.map((att, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs">
                          <FileText className="w-3.5 h-3.5 text-[#16a34a]" />
                          <span className="font-semibold text-slate-800">{att.name}</span>
                          <span className="text-[10px] text-slate-400">({att.size})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI / Consultant Solution Card */}
            {latestSolution && (
              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-[#004845] p-1.5 text-white flex-shrink-0 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#16a34a]" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{latestSolution.author.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a] font-bold border border-[#16a34a]/20">
                      {latestSolution.isAIGenerated ? 'THINK AI Roadmap' : 'Verified Consultant Solution'}
                    </span>
                    <span className="text-[10px] text-slate-400">{timeAgo(latestSolution.createdAt)}</span>
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 text-xs sm:text-sm">
                    {/* Executive Assessment */}
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#004845] mb-1">
                        Executive Assessment & Diagnostic
                      </h4>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        {latestSolution.executiveSummary}
                      </p>
                    </div>

                    {/* Step-by-Step Strategic Roadmap */}
                    {latestSolution.actionPlan && latestSolution.actionPlan.length > 0 && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-100">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#004845]">
                          Strategic Action Plan
                        </h4>
                        <div className="space-y-2">
                          {latestSolution.actionPlan.map((step, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#004845] text-white text-[11px] font-bold flex items-center justify-center">
                                {step.step || idx + 1}
                              </span>
                              <div>
                                <h5 className="font-bold text-slate-900 text-xs">{step.title}</h5>
                                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{step.details}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended Tooling */}
                    {latestSolution.recommendedTools && latestSolution.recommendedTools.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-600">Recommended Tools:</span>
                        {latestSolution.recommendedTools.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-[#e6f2f1] text-[#004845] font-semibold text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Next Steps Prompt */}
                    <div className="p-3 bg-[#f0fdf4] border border-[#16a34a]/20 rounded-xl text-xs text-[#004845] flex items-center justify-between">
                      <span>{latestSolution.nextStepsPrompt || latestSolution.disclaimer}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            {thoughtMessages.slice(1).map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              const isAI = msg.senderRole === 'ai';
              const isMenuOpen = activeMsgMenuId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-2xl relative ${isMine ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-slate-200 self-end mb-1"
                  />
                  <div className={`space-y-1 relative group ${isMine ? 'items-end text-right' : 'items-start text-left'}`}>
                    <div className={`flex items-baseline gap-2 mb-1 ${isMine ? 'justify-end' : ''}`}>
                      <span className="text-xs font-bold text-slate-800">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400">{timeAgo(msg.timestamp)}</span>
                    </div>

                    <div className="relative inline-block text-left">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMsgMenuId(isMenuOpen ? null : msg.id);
                        }}
                        className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed cursor-pointer select-none transition-all shadow-xs hover:shadow-md ${
                          isMine
                            ? 'bg-gradient-to-br from-[#004845] to-[#003835] text-white rounded-tr-xs'
                            : isAI
                            ? 'bg-emerald-50 text-emerald-950 border border-emerald-200/90 rounded-tl-xs'
                            : 'bg-white text-slate-900 border border-slate-200/90 rounded-tl-xs'
                        }`}
                        title="Click to delete, mute, or clear chat"
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                        <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                          isMine ? 'text-emerald-100/80' : 'text-slate-400'
                        }`}>
                          <span>{timeAgo(msg.timestamp)}</span>
                          {isMine && <CheckCheck className="w-3.5 h-3.5 text-[#16a34a]" />}
                        </div>
                      </div>

                      {/* Hover / Touch 3-dots trigger button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMsgMenuId(isMenuOpen ? null : msg.id);
                        }}
                        className={`absolute top-2 ${
                          isMine ? '-left-7' : '-right-7'
                        } p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer`}
                        title="Message options"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {/* Interactive Actions Dropdown on Message Click */}
                      {isMenuOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className={`absolute z-30 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 animate-in fade-in zoom-in-95 duration-100 ${
                            isMine ? 'right-0' : 'left-0'
                          }`}
                        >
                          {/* Copy Message Option */}
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
                            className="w-full px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                          >
                            <Trash2 className="w-4 h-4 text-rose-500" />
                            <div className="flex flex-col text-left">
                              <span>Delete Message</span>
                              <span className="text-[10px] text-rose-400 font-normal">Remove this message</span>
                            </div>
                          </button>

                          {/* Mute Chat Option */}
                          <button
                            type="button"
                            onClick={() => {
                              if (activeThought) toggleMuteChat(activeThought.id);
                              setActiveMsgMenuId(null);
                            }}
                            className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                          >
                            {isMuted ? (
                              <>
                                <Bell className="w-4 h-4 text-[#16a34a]" />
                                <div className="flex flex-col text-left">
                                  <span>Unmute Chat</span>
                                  <span className="text-[10px] text-slate-400 font-normal">Enable notifications</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <BellOff className="w-4 h-4 text-amber-600" />
                                <div className="flex flex-col text-left">
                                  <span>Mute Chat</span>
                                  <span className="text-[10px] text-slate-400 font-normal">Silence notifications</span>
                                </div>
                              </>
                            )}
                          </button>

                          <div className="my-1 border-t border-slate-100" />

                          {/* Clear Chat Option */}
                          <button
                            type="button"
                            onClick={() => {
                              setShowClearConfirm(true);
                              setActiveMsgMenuId(null);
                            }}
                            className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                          >
                            <RotateCcw className="w-4 h-4 text-amber-500" />
                            <div className="flex flex-col text-left">
                              <span>Clear Chat</span>
                              <span className="text-[10px] text-slate-400 font-normal">Clear all messages in room</span>
                            </div>
                          </button>
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
      <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0 w-full">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto w-full">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachments.map((att, idx) => (
                <span key={idx} className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium text-slate-700">
                  <FileText className="w-3.5 h-3.5 text-[#16a34a]" />
                  {att.name}
                  <button type="button" onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-slate-700 font-bold">×</button>
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
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              title="Attach media or files"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleVoice}
              className={`p-2 rounded-xl transition-colors ${
                isRecording ? 'text-rose-600 bg-rose-50 animate-pulse' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
              }`}
              title="Voice Input (Speech-to-Text)"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                activeThought
                  ? "Ask follow-ups, request code, or discuss with consultant..."
                  : "Message THINK (e.g. I need help launching my SaaS MVP)..."
              }
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputVal.trim() && attachments.length === 0}
              className={`p-2.5 rounded-xl transition-all ${
                inputVal.trim() || attachments.length > 0
                  ? 'bg-[#16a34a] hover:bg-[#15803d] text-white shadow-md shadow-[#16a34a]/25'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-400 mt-2">
            THINK guarantees meaningful human or AI solutions within 24 hours. Keep communications inside THINK for safety.
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
