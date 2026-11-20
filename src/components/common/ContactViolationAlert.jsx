import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, X } from 'lucide-react';

export default function ContactViolationAlert() {
  const { privacyAlert, setPrivacyAlert } = useApp();

  if (!privacyAlert) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 bg-white border border-amber-300 rounded-2xl p-4 shadow-xl shadow-amber-500/10 animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-100 text-amber-700 flex-shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-amber-900 flex items-center justify-between">
            Contact Privacy Shield Warning
            <button
              onClick={() => setPrivacyAlert(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </h4>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            {privacyAlert.message}
          </p>
          {privacyAlert.violations && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {privacyAlert.violations.map((v, i) => (
                <span key={i} className="text-[10px] font-semibold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
                  Detected: {v}
                </span>
              ))}
            </div>
          )}
          <p className="text-[11px] text-slate-500 mt-2 italic">
            Private details were automatically masked to protect your profile security.
          </p>
        </div>
      </div>
    </div>
  );
}
