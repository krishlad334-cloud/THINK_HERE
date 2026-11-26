import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function ClearChatModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <RotateCcw className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Clear All Messages?</h3>
          <p className="text-xs text-slate-500 mt-1">
            This will permanently clear all messages in this consultation room for both parties.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Yes, Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
}
