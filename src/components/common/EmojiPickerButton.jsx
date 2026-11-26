import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Smile, X } from 'lucide-react';

const EmojiPicker = lazy(() => import('emoji-picker-react'));

export default function EmojiPickerButton({ onSelect, buttonTone = 'light' }) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const idleClass =
    buttonTone === 'dark'
      ? 'text-slate-500 hover:text-[#020617] hover:bg-slate-200/60'
      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60';

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-2 rounded-xl cursor-pointer transition-colors ${
          isOpen ? 'text-[#020617] bg-slate-200/80' : idleClass
        }`}
        title="Insert Emoji"
        aria-label="Open Emoji Picker"
        aria-expanded={isOpen}
      >
        <Smile className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-20 left-3 right-3 mx-auto max-w-[352px] z-[70] sm:mx-0 sm:inset-x-auto sm:absolute sm:bottom-full sm:left-0 sm:mb-2 sm:w-[352px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              All Emojis
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close Emoji Picker"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <Suspense
            fallback={
              <div className="h-[360px] flex items-center justify-center text-xs font-semibold text-slate-400">
                Loading full emoji keyboard...
              </div>
            }
          >
            <EmojiPicker
              width="100%"
              height={360}
              colorScheme="light"
              emojiStyle="native"
              lazyLoadEmojis={true}
              searchPlaceholder="Search emojis..."
              previewConfig={{ showPreview: false }}
              onEmojiClick={(emojiData) => onSelect(emojiData.emoji)}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
