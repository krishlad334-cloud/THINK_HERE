import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer({ toast, onClose }) {
  if (!toast) return null;

  const { title, message, type = 'success' } = toast;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
      case 'warning':
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-[#16a34a] flex-shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-white/95 text-slate-900 shadow-emerald-500/10';
      case 'warning':
      case 'error':
        return 'border-rose-200 bg-white/95 text-slate-900 shadow-rose-500/10';
      default:
        return 'border-[#004845]/20 bg-white/95 text-slate-900 shadow-[#004845]/10';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-[9999] max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-200 select-none pointer-events-auto">
      <div className={`p-4 rounded-2xl border shadow-xl backdrop-blur-md flex items-start gap-3 ${getBorderColor()}`}>
        {getIcon()}
        <div className="flex-1 min-w-0">
          {title && <h5 className="text-xs font-bold text-slate-900 leading-tight mb-0.5">{title}</h5>}
          <p className="text-xs text-slate-600 leading-snug">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
