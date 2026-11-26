import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCheck,
  Clock,
  Copy,
  FileText,
  MessageSquare,
  Mic,
  MoreVertical,
  Paperclip,
  Send,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/useApp';
import UserAvatar from '../common/UserAvatar';
import EmojiPickerButton from '../common/EmojiPickerButton';
import ClientChatHeader from './ClientChatHeader';
import ClientTopicStarters from './ClientTopicStarters';
import ClearChatModal from './ClearChatModal';
import { timeAgo } from '../../utils/formatters';

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
    submitThink,
    activeChatThoughtId,
    setActiveChatThoughtId,
    setSelectedThoughtId,
    setActiveConversationId,
    setActiveTab,
    toggleSaveThought,
    startCall,
  } = useApp();

  const allThinks = thinks || thoughts || [];

  const [inputVal, setInputVal] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [activeMsgMenuId, setActiveMsgMenuId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const activeThought = allThinks.find((t) => t.id === activeChatThoughtId) || null;
  const currentConversation = conversations.find(
    (c) => c.thinkId === activeThought?.id || c.id === activeThought?.id
  );

  const thoughtMessages = currentConversation
    ? (currentConversation.messages || []).filter((m) => !m.isProblemPost)
    : activeThought?.pendingMessages?.length
      ? activeThought.pendingMessages
      : messages.filter(
          (m) => m.thoughtId === activeThought?.id || m.conversationId === activeThought?.id
        );

  useEffect(() => {
    if (!activeMsgMenuId) return undefined;
    const handleClickOutside = () => setActiveMsgMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMsgMenuId]);

  const thoughtMsgCount = thoughtMessages.length;
  const activeThoughtIdKey = activeThought?.id || null;
  useEffect(() => {
    if (thoughtMsgCount >= 0 || activeThoughtIdKey) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thoughtMsgCount, activeThoughtIdKey]);

  const handleCopyText = (msgId, text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedMsgId(msgId);
    setTimeout(() => {
      setCopiedMsgId(null);
      setActiveMsgMenuId(null);
    }, 1200);
  };

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
        setInputVal((prev) => (prev ? prev + ' ' : '') + text);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
      setIsRecording(true);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setInputVal(
          (prev) => (prev ? prev + ' ' : '') + "How can I improve my product's go-to-market strategy?"
        );
        setIsRecording(false);
      }, 1600);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((f) => {
      setAttachments((prev) => [
        ...prev,
        {
          id: 'att-' + Date.now() + Math.random().toString(36).substring(2, 5),
          name: f.name,
          type: f.type.startsWith('image/') ? 'image' : 'document',
          size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        },
      ]);
    });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim() && attachments.length === 0) return;

    if (!activeThought) {
      submitThink({
        title: inputVal.trim(),
        description: inputVal.trim(),
        category: null,
        attachments,
      });
    } else {
      sendMessage(activeThought.id, inputVal.trim(), attachments);
    }

    setInputVal('');
    setAttachments([]);
  };

  const openFullChatRoom = () => {
    if (!activeThought || !currentConversation) return;
    setActiveChatThoughtId(activeThought.id);
    setSelectedThoughtId(null);
    setActiveConversationId(currentConversation.id);
    setActiveTab('messages');
  };

  const assignedConsName = activeThought?.assignedConsultantName;
  const assignedConsAvatar = activeThought?.assignedConsultantAvatar;

  return (
    <div className="flex flex-col h-full w-full bg-white flex-1 overflow-hidden">
      {activeThought && (
        <ClientChatHeader
          activeThought={activeThought}
          hasConversation={Boolean(currentConversation)}
          onOpenChatRoom={openFullChatRoom}
          onStartCall={(callType) =>
            startCall({
              thoughtId: activeThought.id,
              participantName: assignedConsName,
              participantAvatar: assignedConsAvatar,
              callType,
            })
          }
          onToggleSave={() => toggleSaveThought(activeThought.id)}
        />
      )}

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {!activeThought ? (
          <ClientTopicStarters
            firstName={currentUser.name.split(' ')[0]}
            onSelectPrompt={setInputVal}
          />
        ) : (
          <div className="space-y-6 max-w-3xl sm:max-w-4xl mx-auto w-full">
            {currentConversation ? (
              <div className="bg-[#ecfeff]/90 border border-[#020617]/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#020617] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <MessageSquare className="w-5 h-5 text-[#0891b2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      1-on-1 Consultation Room Ready
                    </h4>
                    <p className="text-xs text-slate-600">
                      Direct messaging, file sharing & live video calling with{' '}
                      {assignedConsName || 'your verified consultant'}.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openFullChatRoom}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex-shrink-0"
                >
                  <span>Enter Consultation Chat</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0891b2]" />
                </button>
              </div>
            ) : (
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-950">
                      Awaiting Verified Consultant Acceptance
                    </h4>
                    <p className="text-xs text-amber-800">
                      Your OverThink is live in the Consultant Feed. You can add extra context below while waiting—or track all thoughts in All My Thoughts.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('my_thoughts')}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-950 text-xs font-bold shadow-xs transition-all cursor-pointer flex-shrink-0"
                >
                  <span>View My Thoughts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex gap-3 sm:gap-4 items-start flex-row-reverse">
              <UserAvatar
                src={activeThought.clientAvatar || currentUser.profileImage || currentUser.avatar}
                name={activeThought.clientName || currentUser.name}
                role="client"
                size="md"
                className="ring-2 ring-white shadow-xs flex-shrink-0"
              />
              <div className="flex flex-col items-end space-y-1 max-w-[85%] sm:max-w-[75%]">
                <div className="flex items-center justify-end gap-2 px-1">
                  <span className="text-[10px] text-slate-400">
                    {timeAgo(activeThought.createdAt)}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {activeThought.clientName || currentUser.name}
                  </span>
                </div>
                <div className="p-3.5 sm:p-4 rounded-2xl rounded-tr-none bg-[#e8f7fb] border border-[#0891b2]/25 text-slate-900 text-xs sm:text-sm leading-relaxed shadow-xs space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white text-[#0891b2] border border-[#0891b2]/25">
                      Submitted Problem
                    </span>
                    {activeThought.category && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/80 border border-slate-200/80 text-slate-600">
                        {activeThought.category}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm sm:text-[15px] leading-snug whitespace-pre-wrap break-words text-slate-900">
                    {activeThought.title}
                  </h3>
                  {activeThought.description &&
                    activeThought.description.trim() !== activeThought.title.trim() && (
                      <p className="text-xs sm:text-[13px] text-slate-600 whitespace-pre-wrap break-words">
                        {activeThought.description}
                      </p>
                    )}

                  {activeThought.attachments && activeThought.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 mt-1 border-t border-cyan-200/70">
                      {activeThought.attachments.map((att, i) => (
                        <span
                          key={i}
                          className="text-xs bg-white/90 border border-cyan-200/70 px-2.5 py-1 rounded-lg flex items-center gap-1 text-slate-800"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#0891b2]" />
                          {att.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {thoughtMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              const isMenuOpen = activeMsgMenuId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 items-start group relative ${
                    isMine ? 'flex-row-reverse' : ''
                  }`}
                >
                  <UserAvatar
                    src={
                      msg.senderAvatar ||
                      (isMine
                        ? currentUser.profileImage || currentUser.avatar
                        : assignedConsAvatar || null)
                    }
                    name={msg.senderName}
                    role={isMine ? 'client' : 'consultant'}
                    size="sm"
                    className="ring-2 ring-slate-100 flex-shrink-0"
                  />

                  <div
                    className={`space-y-1 max-w-[85%] sm:max-w-[75%] ${
                      isMine ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 text-[10px] text-slate-400 ${
                        isMine ? 'justify-end' : ''
                      }`}
                    >
                      <span className="font-bold text-slate-700">{msg.senderName}</span>
                      <span>{timeAgo(msg.createdAt)}</span>
                      {isMine && (
                        <CheckCheck
                          className={`w-3.5 h-3.5 ${
                            msg.isRead ? 'text-[#0891b2]' : 'text-slate-400'
                          }`}
                        />
                      )}
                    </div>

                    <div className="relative group/bubble">
                      <div
                        className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMine
                            ? 'bg-[#e8f7fb] border border-[#0891b2]/25 text-slate-900 rounded-tr-none shadow-xs'
                            : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-none shadow-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2 mt-2 border-t border-cyan-200/60">
                            {msg.attachments.map((att, aIdx) => (
                              <div
                                key={aIdx}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                                  isMine
                                    ? 'bg-white/90 border border-cyan-200/70 text-slate-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                <FileText className="w-3.5 h-3.5 text-[#0891b2]" />
                                <span className="truncate max-w-[140px]">{att.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

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
                            {copiedMsgId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-[#0891b2]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                            )}
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

      <div className="p-2.5 sm:p-4 bg-white border-t border-slate-100 flex-shrink-0 w-full">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto w-full">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachments.map((att, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium text-slate-700"
                >
                  <FileText className="w-3.5 h-3.5 text-[#0891b2]" />
                  {att.name}
                  <button
                    type="button"
                    onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="relative flex items-center bg-slate-50 rounded-2xl border border-slate-200/90 focus-within:border-[#020617] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#020617]/10 p-1.5 transition-all w-full">
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
                isRecording
                  ? 'text-rose-600 bg-rose-50 animate-pulse'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
              }`}
              title="Voice Input (Speech-to-Text)"
            >
              <Mic className="w-4 h-4" />
            </button>

            <EmojiPickerButton
              onSelect={(emoji) => setInputVal((prev) => prev + emoji)}
              buttonTone="light"
            />

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                activeThought
                  ? 'Message your assigned consultant or ask questions...'
                  : 'Please enter your thought, question, or business idea to start the consultation...'
              }
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputVal.trim() && attachments.length === 0}
              className={`p-2.5 rounded-xl transition-all ${
                inputVal.trim() || attachments.length > 0
                  ? 'bg-[#0891b2] hover:bg-[#0e7490] text-white shadow-md shadow-[#0891b2]/25 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-400 mt-2">
            OverThink guarantees meaningful human solutions within 24 hours. Keep communications inside OverThink for safety.
          </p>
        </form>
      </div>

      <ClearChatModal
        isOpen={showClearConfirm}
        onCancel={() => setShowClearConfirm(false)}
        onConfirm={() => {
          if (activeThought) clearChat(activeThought.id);
          setShowClearConfirm(false);
        }}
      />
    </div>
  );
}
