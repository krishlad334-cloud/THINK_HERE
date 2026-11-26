import React, { useState, useRef } from 'react';
import { useApp } from '../../context/useApp';
import {
  X,
  FileText,
  Paperclip,
  Image as ImageIcon,
  Video,
  Mic,
  MicOff,
  Clock,
  ArrowRight,
  PlusCircle
} from 'lucide-react';

export default function NewThoughtModal() {
  const {
    isNewThoughtModalOpen,
    setIsNewThoughtModalOpen,
    submitThink,
    setActiveChatThoughtId,
    setActiveTab
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Career & Jobs');
  const [urgency, setUrgency] = useState('Standard');
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [validationError, setValidationError] = useState('');

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const categories = [
    'Career & Jobs',
    'Technology & IT',
    'Business & Startups',
    'Product & Innovation',
    'Marketing & Growth',
    'General Consultation'
  ];

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
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Please enter a title for your OverThink.');
      return;
    }

    if (!description.trim()) {
      setValidationError('Please provide a description or problem context.');
      return;
    }

    const created = submitThink({
      title: title.trim(),
      description: description.trim(),
      category,
      attachments,
      urgency
    });

    if (created) {
      setIsNewThoughtModalOpen(false);
      setTitle('');
      setDescription('');
      setCategory('Career & Jobs');
      setAttachments([]);
      setActiveChatThoughtId(created.id);
      setActiveTab('my_thoughts');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2.5 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92dvh]">
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#ecfeff] text-[#020617] rounded-xl flex-shrink-0">
              <PlusCircle className="w-5 h-5 text-[#0891b2]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Submit an OverThink, Problem or Business Challenge
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Direct connection to verified consultants with real-time consultation chat
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewThoughtModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {validationError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              OverThink Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Looking for a job in the IT industry, but not getting interview calls..."
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all font-medium placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border ${
                    category === cat
                      ? 'bg-[#020617] text-white border-[#020617] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Problem Description & Details *
              </label>

              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                    : 'bg-[#ecfeff] text-[#020617] border-[#020617]/20 hover:bg-[#d5eae8]'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#0891b2]" />}
                <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more background: what you have tried, blockers, target outcome, budget or industry details..."
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all placeholder:text-slate-400"
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
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617]"
              >
                <option value="Standard">Standard (24h Window)</option>
                <option value="High (Urgent)">High (Urgent Expedited)</option>
              </select>
            </div>

            <div className="p-2.5 bg-[#ecfeff] rounded-xl border border-[#0891b2]/20 flex items-center gap-2.5 text-[#020617]">
              <Clock className="w-4 h-4 text-[#0891b2] flex-shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold">Instant Workflow:</span> Submitted immediately and visible in the Consultant Panel.
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Attachments (Optional)
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#020617] hover:text-[#0891b2] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Paperclip className="w-3.5 h-3.5 text-[#0891b2]" />
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
                className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center cursor-pointer hover:border-[#020617] hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-center gap-3 text-slate-400 mb-1">
                  <ImageIcon className="w-4 h-4 text-[#0891b2]" />
                  <Video className="w-4 h-4 text-[#0891b2]" />
                  <FileText className="w-4 h-4 text-[#0891b2]" />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Click to attach resume, architecture diagram, prototype, or specs
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
                      <FileText className="w-4 h-4 text-[#0891b2] flex-shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-slate-800 truncate block">{att.name}</span>
                        <span className="text-[10px] text-slate-400">{att.size}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#020617] hover:bg-[#091528] text-white font-bold text-sm shadow-md shadow-[#020617]/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
            >
              <span>Submit OverThink & Send to Consultants</span>
              <ArrowRight className="w-4 h-4 text-[#0891b2]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
