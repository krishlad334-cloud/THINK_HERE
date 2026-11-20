import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  Video,
  FileText,
  Mic,
  MicOff,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function NewThoughtModal() {
  const {
    isNewThoughtModalOpen,
    setIsNewThoughtModalOpen,
    submitThought,
    setActiveChatThoughtId,
    setActiveTab
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('Standard');
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  if (!isNewThoughtModalOpen) return null;

  const toggleSpeechRecognition = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setDescription(prev => (prev ? prev + ' ' : '') + transcript);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setDescription(prev => (prev ? prev + ' ' : '') + "I am launching an innovative platform and need advice on go-to-market strategy.");
        setIsRecording(false);
      }, 2500);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const isImg = file.type.startsWith('image/');
      const isVid = file.type.startsWith('video/');

      const newAtt = {
        id: 'att-' + Date.now() + Math.random().toString(36).substring(2, 6),
        name: file.name,
        type: isImg ? 'image' : (isVid ? 'video' : 'document'),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: isImg ? URL.createObjectURL(file) : null
      };

      setAttachments(prev => [...prev, newAtt]);
    });
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const createdThought = submitThought({
      title: title.trim(),
      description: description.trim(),
      attachments,
      urgency
    });

    setIsNewThoughtModalOpen(false);
    setTitle('');
    setDescription('');
    setAttachments([]);
    setActiveChatThoughtId(createdThought.id);
    setActiveTab('chat');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#e6f2f1] text-[#004845] rounded-xl">
              <Sparkles className="w-5 h-5 text-[#16a34a]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Share a Thought, Problem or Business Idea
              </h3>
              <p className="text-xs text-slate-500">
                Guaranteed response by human consultants or AI within 24 hours
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewThoughtModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              What is on your mind? (Your Core Thought or Question) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. I am a Python developer but not getting interview calls. How to fix my portfolio?"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845] transition-all font-medium placeholder:text-slate-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Detailed Context & Requirements
              </label>

              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                  isRecording
                    ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                    : 'bg-[#e6f2f1] text-[#004845] border-[#004845]/20 hover:bg-[#d5eae8]'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#16a34a]" />}
                <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more background: what you have tried, specific blockers, target outcome, budget or industry details..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845] transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Priority Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845]"
              >
                <option value="Standard">Standard (24h Window)</option>
                <option value="High (Urgent)">High (Urgent Expedited)</option>
              </select>
            </div>

            <div className="p-2.5 bg-[#f0fdf4] rounded-xl border border-[#16a34a]/20 flex items-center gap-2.5 text-[#004845]">
              <Clock className="w-4 h-4 text-[#16a34a] flex-shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold">24-Hour Fallback active:</span> If no human responds in 24h, AI delivers an actionable roadmap.
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Attachments (Images, Docs, Product Media)
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#004845] hover:text-[#16a34a] font-bold flex items-center gap-1"
              >
                <Paperclip className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Add Files</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {attachments.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#004845] hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-center gap-3 text-slate-400 mb-1">
                  <ImageIcon className="w-5 h-5 text-[#16a34a]" />
                  <Video className="w-5 h-5 text-[#16a34a]" />
                  <FileText className="w-5 h-5 text-[#16a34a]" />
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Click to attach resume, architecture diagram, product photos, or sample videos
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="w-4 h-4 text-[#16a34a] flex-shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-slate-800 truncate block">{att.name}</span>
                        <span className="text-[10px] text-slate-400">{att.size}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Submit Button - Strictly in Brand Teal/Green */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#004845] hover:bg-[#003331] text-white font-bold text-sm shadow-md shadow-[#004845]/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <span>Submit Thought & Start 24h Window</span>
              <ArrowRight className="w-4 h-4 text-[#16a34a]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
