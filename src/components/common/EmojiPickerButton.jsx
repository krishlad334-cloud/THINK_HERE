import React, { useEffect, useRef, useState } from 'react';
import { Smile } from 'lucide-react';
import { EMOJI_LIST } from '../../data/chatConstants';

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      >
        <Smile className="w-4 h-4" />
      </button>

      {isOpen && (
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
              onClick={() => setIsOpen(false)}
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
                onClick={() => onSelect(emoji)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-base hover:scale-115 active:scale-95 transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
