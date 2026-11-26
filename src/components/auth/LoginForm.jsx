import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  RotateCcw,
  User,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/useApp';
import { getUsers } from '../../utils/thinkStorage';
import UserAvatar from '../common/UserAvatar';

const QUICK_DEMO_PROFILES = [
  {
    name: 'Alex Morgan',
    subtitle: 'Startup Founder',
    email: 'alex.morgan@overthink.platform',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'client',
    badgeLabel: 'Client',
    badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200/70',
    hoverBorder: 'hover:border-[#0891b2]/50',
  },
  {
    name: 'Dr. Elena Vance',
    subtitle: 'Cloud Architect',
    email: 'elena.vance@overthink.platform',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    role: 'consultant',
    badgeLabel: 'Expert',
    badgeClass: 'bg-[#ecfeff] text-[#020617] border-[#020617]/20',
    hoverBorder: 'hover:border-[#020617]/50',
  },
];

export default function LoginForm({ onSuccess, onSwitchToRegister, onOpenForgotModal }) {
  const { login, quickRegister } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showOtherAccounts, setShowOtherAccounts] = useState(false);

  const additionalUsers = getUsers().filter(
    (u) => !u.email?.includes('alex.morgan') && !u.email?.includes('elena.vance')
  );

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsNotFound(false);

    if (!identifier.trim()) {
      setError('Please enter your registered email address or mobile number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoggingIn(true);
    setTimeout(() => {
      const res = login(identifier.trim(), password);
      setIsLoggingIn(false);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please verify your details.');
        setIsNotFound(!!res.notFound);
      } else if (onSuccess) {
        onSuccess(res.user, false);
      }
    }, 300);
  };

  const handleQuickLogin = (targetIdentifier, targetPassword = 'password123') => {
    setIdentifier(targetIdentifier);
    setPassword(targetPassword);
    setError('');
    setIsNotFound(false);
    setIsLoggingIn(true);
    setTimeout(() => {
      const res = login(targetIdentifier, targetPassword);
      setIsLoggingIn(false);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please verify your details.');
      } else if (onSuccess) {
        onSuccess(res.user, false);
      }
    }, 250);
  };

  const handleQuickCreate = (roleType) => {
    const res = quickRegister(identifier.trim(), password, roleType);
    if (res?.success) {
      if (onSuccess) onSuccess(res.user || { role: roleType }, roleType === 'consultant');
    } else {
      setError(
        res?.error ||
          (roleType === 'client'
            ? 'Unable to create client account.'
            : 'Unable to create consultant account.')
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Choose an instant 1-click demo profile or sign in with your credentials.
        </p>
      </div>

      <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Quick Demo Profiles
            </span>
          </div>
          <span className="text-[10px] text-cyan-800 bg-cyan-50 border border-cyan-200/60 font-semibold px-2 py-0.5 rounded-full">
            1-Click Instant Login
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {QUICK_DEMO_PROFILES.map((profile) => (
            <button
              key={profile.email}
              type="button"
              disabled={isLoggingIn}
              onClick={() => handleQuickLogin(profile.email, 'password123')}
              className={`p-3 rounded-xl bg-white hover:bg-[#ecfeff]/40 border border-slate-200/80 ${profile.hoverBorder} hover:shadow-sm transition-all text-left flex items-center justify-between group cursor-pointer`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-1">
                <UserAvatar
                  src={profile.avatar}
                  name={profile.name}
                  role={profile.role}
                  size="sm"
                  showOnline={true}
                  className="ring-1 ring-slate-200"
                />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#020617] truncate block">
                    {profile.name}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {profile.subtitle}
                  </span>
                </div>
              </div>
              <span
                className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border flex-shrink-0 ${profile.badgeClass}`}
              >
                {profile.badgeLabel}
              </span>
            </button>
          ))}
        </div>

        {additionalUsers.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-200/60">
            <button
              type="button"
              onClick={() => setShowOtherAccounts((prev) => !prev)}
              className="w-full py-1 px-2 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>More test accounts ({additionalUsers.length})</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showOtherAccounts ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showOtherAccounts && (
              <div className="mt-2 p-2 rounded-xl bg-white border border-slate-200/80 space-y-1.5 max-h-40 overflow-y-auto animate-fadeIn">
                {additionalUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    disabled={isLoggingIn}
                    onClick={() =>
                      handleQuickLogin(u.email || u.mobile, u.password || 'password123')
                    }
                    className="w-full p-1.5 px-2.5 rounded-lg hover:bg-slate-50 border border-slate-100 flex items-center justify-between text-left cursor-pointer group"
                  >
                    <div className="truncate min-w-0 pr-2">
                      <span className="text-xs font-bold text-slate-800 group-hover:text-[#020617] truncate block">
                        {u.name}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate block">
                        {u.email || u.mobile}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                        u.role === 'consultant'
                          ? 'bg-[#ecfeff] text-[#020617]'
                          : 'bg-cyan-50 text-cyan-800'
                      }`}
                    >
                      {u.role === 'consultant' ? 'Expert' : 'Client'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200/80" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#fafbfc] px-3 text-slate-400 font-medium">
            Or sign in with email / mobile
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200/80 text-red-700 text-xs font-medium space-y-2 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>

          {isNotFound && (
            <div className="mt-2 pt-2 border-t border-red-200/60">
              <p className="text-[11px] text-slate-700 font-semibold mb-1.5">
                Account not found in LocalStorage. Quick create and sign in now:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickCreate('client')}
                  className="py-1.5 px-2 bg-[#0891b2] hover:bg-[#0e7490] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>+ Create Client</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCreate('consultant')}
                  className="py-1.5 px-2 bg-[#020617] hover:bg-[#082f49] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>+ Create Consultant</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address or Mobile Number
          </label>
          <div className="relative">
            <input
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. name@company.com or 9876543210"
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all shadow-2xs"
              autoFocus
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {identifier.includes('@') ? (
                <Mail className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            <button
              type="button"
              onClick={onOpenForgotModal}
              className="text-xs text-[#020617] hover:text-[#082f49] font-medium hover:underline transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all shadow-2xs"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-[#020617] rounded border-slate-300 focus:ring-[#020617] focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-xs text-slate-600 font-medium">
              Remember this browser session
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full py-3 px-4 bg-[#020617] hover:bg-[#082f49] text-white rounded-xl text-sm font-bold shadow-md shadow-[#020617]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer transform active:scale-98"
        >
          {isLoggingIn ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to OverThink</span>
              <ArrowRight className="w-4 h-4 text-[#0891b2]" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-[#020617] font-bold hover:underline cursor-pointer"
        >
          Create an account
        </button>
      </div>
    </div>
  );
}
