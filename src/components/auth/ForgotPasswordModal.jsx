import React from 'react';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
        <h3 className="text-base font-bold text-slate-900 mb-2">
          Password Recovery (Demo)
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          In this frontend-only platform, demo accounts use password{' '}
          <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold">
            password123
          </code>
          . If you registered a new account, you can log in directly using the password you set during registration.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-[#020617] hover:bg-[#082f49] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Understood, Return to Login
        </button>
      </div>
    </div>
  );
}
