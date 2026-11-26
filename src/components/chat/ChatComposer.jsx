import React, { useRef } from 'react';
import { FileText, Lock, Mic, Paperclip, Send } from 'lucide-react';
import EmojiPickerButton from '../common/EmojiPickerButton';

export default function ChatComposer({
  inputMessage,
  onInputChange,
  attachments,
  onAddAttachments,
  onRemoveAttachment,
  onInsertEmoji,
  onInsertQuickPrompt,
  onSubmit,
  partnerName,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="p-2 sm:p-4 bg-white border-t border-slate-200/90 flex-shrink-0 z-10 shadow-xs pb-[max(0.35rem,env(safe-area-inset-bottom))]">
      <div className="max-w-3xl sm:max-w-4xl mx-auto w-full space-y-1.5 sm:space-y-2">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-1">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-xs text-slate-700 border border-slate-200"
              >
                <FileText className="w-3 h-3 text-[#0891b2]" />
                <span className="font-medium truncate max-w-[120px]">{att.name}</span>
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(att.id)}
                  className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="bg-slate-50 border border-slate-200/90 rounded-2xl p-1 sm:p-1.5 flex items-center gap-1 sm:gap-2 focus-within:border-[#020617] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#020617]/15 transition-all shadow-xs"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onAddAttachments}
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
            onClick={onInsertQuickPrompt}
            className="p-2 text-slate-500 hover:text-[#020617] hover:bg-slate-200/60 rounded-xl cursor-pointer transition-colors"
            title="Quick Prompt Template"
          >
            <Mic className="w-4 h-4" />
          </button>

          <EmojiPickerButton onSelect={onInsertEmoji} buttonTone="dark" />

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
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
          <span>
            Press{' '}
            <kbd className="px-1 py-0.5 rounded bg-slate-100 font-mono text-slate-600">
              Enter
            </kbd>{' '}
            to send
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-2.5 h-2.5 text-[#0891b2]" />
            <span>Protected by OverThink Verified Consultation</span>
          </span>
        </div>
      </div>
    </div>
  );
}
