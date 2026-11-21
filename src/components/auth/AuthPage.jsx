import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Logo from '../common/Logo';
import {
  User,
  Briefcase,
  CheckCircle,
  ArrowRight,
  Lock,
  Mail,
  Zap
} from 'lucide-react';

export default function AuthPage() {
  const {
    authMode,
    setAuthMode,
    loginUser,
    role: currentRole
  } = useApp();

  const [selectedRole, setSelectedRole] = useState(currentRole || 'client'); // 'client' | 'consultant'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Handle standard form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSigningIn(true);
    setSuccessToast(`Welcome! Signing into your ${selectedRole === 'client' ? 'Client' : 'Consultant'} account...`);

    const customUser = {
      name: name || (selectedRole === 'client' ? 'Alex Morgan' : 'Dr. Elena Vance'),
      email: email || (selectedRole === 'client' ? 'alex.morgan@think.platform' : 'elena.vance@think.platform'),
      title: headline || (selectedRole === 'client' ? 'Startup Founder & Tech Innovator' : 'Principal Product & Cloud Solutions Architect')
    };

    setTimeout(() => {
      loginUser(selectedRole, customUser);
      setIsSigningIn(false);
    }, 600);
  };

  // 1-Click Fast Demo Login as Client (Alex Morgan)
  const handleDemoClient = () => {
    setSelectedRole('client');
    setEmail('alex.morgan@think.platform');
    setPassword('••••••••••••');
    setIsSigningIn(true);
    setSuccessToast('Authenticating as Demo Client (Alex Morgan)...');

    setTimeout(() => {
      loginUser('client');
      setIsSigningIn(false);
    }, 500);
  };

  // 1-Click Fast Demo Login as Consultant & Admin (Dr. Elena Vance)
  const handleDemoConsultant = () => {
    setSelectedRole('consultant');
    setEmail('elena.vance@think.platform');
    setPassword('••••••••••••');
    setIsSigningIn(true);
    setSuccessToast('Authenticating as Demo Consultant (Dr. Elena Vance)...');

    setTimeout(() => {
      loginUser('consultant');
      setIsSigningIn(false);
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-200/50 flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Centered Auth Card Container - Zero background chat */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 relative">
        {/* Top Logo & Title */}
        <div className="text-center mb-6">
          <Logo size="lg" showTagline={true} className="justify-center mb-3" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {authMode === 'login' ? 'Sign In to THINK' : 'Create Free THINK Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Every thought deserves a solution. Connect with human consultants or AI within 24 hours.
          </p>
        </div>

        {/* Auth Mode Toggle Tabs (Sign In vs Register) */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
              authMode === 'login'
                ? 'bg-white text-[#004845] shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
              authMode === 'register'
                ? 'bg-white text-[#004845] shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Role Choice Cards */}
        <div className="mb-5 space-y-2">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-center">
            Choose Your Platform Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Client Role Card */}
            <div
              onClick={() => setSelectedRole('client')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedRole === 'client'
                  ? 'border-[#004845] bg-[#e6f2f1] text-[#004845] ring-2 ring-[#004845]/20 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1.5 rounded-xl bg-white text-[#16a34a] shadow-xs">
                  <User className="w-4 h-4" />
                </span>
                {selectedRole === 'client' && (
                  <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold">Client Panel</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                  Ask thoughts & receive verified roadmaps
                </p>
              </div>
            </div>

            {/* Consultant / Admin Role Card */}
            <div
              onClick={() => setSelectedRole('consultant')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedRole === 'consultant'
                  ? 'border-[#004845] bg-[#e6f2f1] text-[#004845] ring-2 ring-[#004845]/20 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1.5 rounded-xl bg-white text-[#16a34a] shadow-xs">
                  <Briefcase className="w-4 h-4" />
                </span>
                {selectedRole === 'consultant' && (
                  <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold">Consultant Panel</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                  Provide consultations & accept client thinks
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 1-Click Fast Demo Logins */}
        <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            1-Click Fast Demo Login:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoClient}
              className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-[#16a34a]" />
              <span>Demo Client</span>
            </button>
            <button
              type="button"
              onClick={handleDemoConsultant}
              className="px-3 py-2 bg-[#004845] hover:bg-[#003331] text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#16a34a]" />
              <span>Demo Consultant</span>
            </button>
          </div>
        </div>

        {/* Success toast feedback */}
        {successToast && (
          <div className="p-3 mb-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-[#16a34a]" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Main Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845]"
              />
            </div>
          )}

          {authMode === 'register' && selectedRole === 'consultant' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Professional Title & Expertise</label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Senior Cloud Architect & Tech Recruiter"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.morgan@think.platform"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              {authMode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your registered email.')}
                  className="text-[11px] font-semibold text-[#004845] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full py-3 rounded-xl bg-[#004845] hover:bg-[#003331] text-white font-bold text-xs shadow-md shadow-[#004845]/25 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-98 mt-3"
          >
            <span>
              {authMode === 'login'
                ? `Sign In to ${selectedRole === 'client' ? 'Client Panel' : 'Consultant Panel'}`
                : `Create ${selectedRole === 'client' ? 'Client' : 'Consultant'} Account`}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#16a34a]" />
          </button>
        </form>

        {/* Footer mode switch */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          {authMode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="font-bold text-[#004845] hover:underline cursor-pointer"
              >
                Create Free Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="font-bold text-[#004845] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
