import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Logo from '../common/Logo';
import AuthBrandSidebar from './AuthBrandSidebar';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordModal from './ForgotPasswordModal';

export default function AuthPage({ initialMode = 'login', onBackToLanding, onSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [showForgotModal, setShowForgotModal] = useState(false);

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex bg-[#fafbfc] text-slate-800 font-sans antialiased selection:bg-[#020617]/10 selection:text-[#020617] overflow-x-hidden">
      <AuthBrandSidebar />

      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 xl:p-16 overflow-y-auto overflow-x-hidden max-w-full">
        <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-6 flex-shrink-0">
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#020617] transition-colors py-1 cursor-pointer select-none"
              title="Return to the home page"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-[#020617] group-hover:-translate-x-0.5 transition-transform duration-200 flex-shrink-0" />
              <span className="whitespace-nowrap">Back to Home</span>
            </button>
          )}

          <div className="lg:hidden ml-auto">
            <Logo size="xs" showTagline={false} />
          </div>
        </div>

        <div className="w-full max-w-lg mx-auto my-auto py-2">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80 mb-6 select-none">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer text-center ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer text-center ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {mode === 'login' ? (
            <LoginForm
              onSuccess={onSuccess}
              onSwitchToRegister={() => setMode('register')}
              onOpenForgotModal={() => setShowForgotModal(true)}
            />
          ) : (
            <RegisterForm
              onSuccess={onSuccess}
              onSwitchToLogin={() => setMode('login')}
            />
          )}
        </div>

        <div className="w-full max-w-lg mx-auto text-center pt-6 flex-shrink-0 space-y-1.5">
          <p className="text-[11px] text-slate-400 font-medium">
            Protected by OverThink JWT Authentication
          </p>
          <div className="text-xs text-slate-400 font-medium select-none">
            Developed by <span className="font-semibold text-slate-600">Krish Lad</span>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>
  );
}
