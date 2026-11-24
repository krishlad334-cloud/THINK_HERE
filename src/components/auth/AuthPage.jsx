import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { getUsers } from '../../utils/thinkStorage';
import Logo from '../common/Logo';
import UserAvatar from '../common/UserAvatar';
import {
  User,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  Users,
  KeyRound,
  RotateCcw,
  Check,
  ChevronDown,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function AuthPage({ initialMode = 'login', onBackToLanding, onSuccess }) {
  const {
    login,
    register,
    quickRegister,
    verifyRegistrationOTP,
    generateOTP,
    resendOTP,
    showToast
  } = useApp();

  // Primary mode: 'login' | 'register'
  const [mode, setMode] = useState(initialMode);

  // =========================================================================
  // LOGIN FORM STATE
  // =========================================================================
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginRememberMe, setLoginRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [loginIsNotFound, setLoginIsNotFound] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showOtherAccounts, setShowOtherAccounts] = useState(false);

  // =========================================================================
  // REGISTRATION FORM STATE (4 Steps)
  // =========================================================================
  const [regStep, setRegStep] = useState(1);
  const [regRole, setRegRole] = useState('client'); // 'client' | 'consultant'
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regShowConfirmPassword, setRegShowConfirmPassword] = useState(false);

  // OTP State for Step 4
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(120);
  const [otpExpired, setOtpExpired] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [regError, setRegError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Refs for 6-digit OTP inputs
  const otpInputRefs = useRef([]);

  // Timer countdown effect for OTP verification
  useEffect(() => {
    let interval = null;
    if (mode === 'register' && regStep === 4 && otpTimer > 0 && !otpExpired) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setOtpExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, regStep, otpTimer, otpExpired]);

  // Format seconds into MM:SS
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // =========================================================================
  // LOGIN SUBMIT HANDLER
  // Strictly Email/Mobile + Password -> Automatic Role Identification -> ZERO OTP
  // =========================================================================
  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setLoginError('');
    setLoginIsNotFound(false);

    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your registered email address or mobile number.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your password.');
      return;
    }

    setIsLoggingIn(true);
    setTimeout(() => {
      const res = login(loginIdentifier.trim(), loginPassword);
      setIsLoggingIn(false);
      if (!res.success) {
        setLoginError(res.error || 'Authentication failed. Please verify your details.');
        setLoginIsNotFound(!!res.notFound);
      } else if (onSuccess) {
        onSuccess();
      }
    }, 300);
  };

  // Quick Demo Instant Login Handler
  const handleQuickLogin = (identifier, password = 'password123') => {
    setLoginIdentifier(identifier);
    setLoginPassword(password);
    setLoginError('');
    setLoginIsNotFound(false);
    setIsLoggingIn(true);
    setTimeout(() => {
      const res = login(identifier, password);
      setIsLoggingIn(false);
      if (!res.success) {
        setLoginError(res.error || 'Authentication failed. Please verify your details.');
      } else if (onSuccess) {
        onSuccess();
      }
    }, 250);
  };

  // =========================================================================
  // REGISTRATION STEP HANDLERS
  // =========================================================================

  // Step 1 -> Step 2
  const handleStep1Next = () => {
    setRegError('');
    if (!regRole) {
      setRegError('Please select an account type to continue.');
      return;
    }
    setRegStep(2);
  };

  // Step 2 -> Step 3: Validate Personal Info & Uniqueness
  const handleStep2Next = () => {
    setRegError('');
    const cleanName = regName.trim();
    const cleanEmail = regEmail.trim();
    const cleanMobile = regMobile.trim();

    if (!cleanName) {
      setRegError('Please enter your full name.');
      return;
    }
    if (!cleanEmail) {
      setRegError('Please enter a valid email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setRegError('Please enter a valid email address format.');
      return;
    }
    if (!cleanMobile) {
      setRegError('Please enter your mobile phone number.');
      return;
    }
    const digitsOnly = cleanMobile.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setRegError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Check duplicate in think_users
    const existingUsers = getUsers();
    const emailExists = existingUsers.some(
      (u) => u.email && u.email.toLowerCase() === cleanEmail.toLowerCase()
    );
    if (emailExists) {
      setRegError('An account with this email address already exists. Please sign in or use a different email.');
      return;
    }
    const mobileExists = existingUsers.some(
      (u) => u.mobile && u.mobile.replace(/\D/g, '') === digitsOnly
    );
    if (mobileExists) {
      setRegError('An account with this mobile number already exists.');
      return;
    }

    setRegStep(3);
  };

  // Step 3 -> Step 4: Validate Passwords & Trigger Simulated OTP
  const handleStep3Next = () => {
    setRegError('');
    if (!regPassword) {
      setRegError('Please create a password for your account.');
      return;
    }
    if (regPassword.length < 8) {
      setRegError('Password must be at least 8 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter your password.');
      return;
    }

    // Generate simulated 6-digit OTP for this user
    const otpData = generateOTP(regEmail);
    if (otpData) {
      setSimulatedOtp(otpData.otp);
      setOtpTimer(otpData.expiresInSeconds || 120);
      setOtpExpired(false);
      setOtpValues(['', '', '', '', '', '']);
    }

    setRegStep(4);
  };

  // Handle individual digit typing in 6-box OTP input
  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newValues = [...otpValues];
    newValues[index] = value ? value.slice(-1) : '';
    setOtpValues(newValues);
    if (regError) setRegError('');

    // Auto-focus next box
    if (value && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace navigation across OTP boxes
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0 && otpInputRefs.current[index - 1]) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  // Auto-fill simulated OTP for easy testing
  const handleAutoFillSimulatedOtp = () => {
    if (!simulatedOtp || simulatedOtp.length !== 6) return;
    const digits = simulatedOtp.split('');
    setOtpValues(digits);
    if (otpInputRefs.current[5]) {
      otpInputRefs.current[5].focus();
    }
    if (regError) setRegError('');
  };

  // Handle Resend OTP
  const handleResendOtp = () => {
    setRegError('');
    const res = resendOTP(regEmail);
    if (!res.success) {
      setRegError(res.error || 'Could not resend OTP.');
      return;
    }
    setSimulatedOtp(res.otp);
    setOtpTimer(120);
    setOtpExpired(false);
    setResendCount(res.resendCount);
    setOtpValues(['', '', '', '', '', '']);
    showToast('Code Resent', `New simulated OTP: ${res.otp}`, 'info');
  };

  // Final Registration Submission after OTP check
  const handleFinalRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    const enteredOtp = otpValues.join('');
    if (enteredOtp.length < 6) {
      setRegError('Please enter all 6 digits of your verification code.');
      return;
    }

    if (otpExpired) {
      setRegError('Your verification code has expired. Please click "Resend Code".');
      return;
    }

    // Verify OTP against thinkAuth
    const verifyRes = verifyRegistrationOTP(regEmail, enteredOtp);
    if (!verifyRes.success) {
      setRegError(verifyRes.error || 'Invalid verification code.');
      return;
    }

    // Complete registration
    setIsRegistering(true);
    setTimeout(() => {
      const regRes = register({
        role: regRole,
        name: regName.trim(),
        email: regEmail.trim(),
        mobile: regMobile.trim(),
        password: regPassword
      });

      setIsRegistering(false);
      if (!regRes.success) {
        setRegError(regRes.error || 'Registration failed.');
      } else if (onSuccess) {
        onSuccess();
      }
    }, 500);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex bg-[#fafbfc] text-slate-800 font-sans antialiased selection:bg-[#020617]/10 selection:text-[#020617] overflow-x-hidden">
      {/* ============================================================= */}
      {/* LEFT COLUMN: BRAND SHOWCASE & SOCIAL PROOF (Desktop Only)    */}
      {/* ============================================================= */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] relative flex-col justify-between p-10 xl:p-14 bg-gradient-to-br from-[#020617] via-[#020617] to-[#031b2e] text-white overflow-hidden select-none flex-shrink-0">
        {/* Decorative Ambient Orbs & Subtle Grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0891b2]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-[#020617]/40 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>

        {/* Top: Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white p-1 border border-white/20 shadow-lg flex items-center justify-center">
              <img src="/logo.svg" alt="OverThink" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white flex items-center">
                Over<span className="text-[#22d3ee]">Think</span>
              </span>
              <p className="text-[11px] text-cyan-200/80 font-medium">
                Every Thought Deserves a Solution
              </p>
            </div>
          </div>
        </div>

        {/* Center: Value Proposition & Feature Pillars */}
        <div className="relative z-10 my-auto py-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-cyan-300 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#06b6d4]" />
            <span>24-Hour Verified Consultation Platform</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-[1.25]">
            Turn complex problems into validated roadmaps.
          </h2>

          <p className="text-sm xl:text-base text-cyan-100/75 leading-relaxed max-w-lg">
            Connect 1-on-1 in dedicated consultation rooms with vetted industry leaders, or receive structured AI fallback blueprints within 24 hours.
          </p>

          {/* Feature Highlights */}
          <div className="space-y-3 pt-2 max-w-md">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/10 shadow-xs">
              <div className="p-2 rounded-xl bg-[#0891b2]/20 text-[#06b6d4] flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">24-Hour Fallback Guarantee</h4>
                <p className="text-[11px] text-cyan-100/70 mt-0.5">Never stay blocked. Intelligent AI synthesizer activates if human specialists are pending.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/10 shadow-xs">
              <div className="p-2 rounded-xl bg-cyan-400/20 text-cyan-300 flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Shielded 1-on-1 Consultation Rooms</h4>
                <p className="text-[11px] text-cyan-100/70 mt-0.5">Encrypted private chat, diagnostic file attachments, and integrated live video calls.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Vetted Expert Social Proof */}
        <div className="relative z-10 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <UserAvatar
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
              name="Dr. Elena Vance"
              role="consultant"
              size="md"
              showOnline={true}
              className="ring-2 ring-white/20"
            />
            <div className="min-w-0">
              <p className="text-xs italic text-cyan-100/90 leading-snug">
                "Direct connection between clients and vetted domain specialists with zero middleman friction."
              </p>
              <span className="text-[11px] font-bold text-white block mt-1">
                Dr. Elena Vance • Principal Solutions Architect (ex-AWS)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* RIGHT COLUMN: AUTHENTICATION FORM CANVAS                      */}
      {/* ============================================================= */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 xl:p-16 overflow-y-auto overflow-x-hidden max-w-full">
        {/* Top Navbar / Header: Clean back link + mobile brand logo */}
        <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-6 flex-shrink-0">
          {/* Back to Home / Landing Page button */}
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

          {/* Mobile-only logo */}
          <div className="lg:hidden ml-auto">
            <Logo size="xs" showTagline={false} />
          </div>
        </div>

        {/* Center Container: Main Form */}
        <div className="w-full max-w-lg mx-auto my-auto py-2">
          {/* Mode Switcher Tabs: Responsive segmented control */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80 mb-6 select-none">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError('');
              }}
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
              onClick={() => {
                setMode('register');
                setRegStep(1);
                setRegError('');
              }}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer text-center ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>
          {/* ============================================================= */}
          {/* VIEW: LOGIN                                                  */}
          {/* ============================================================= */}
          {mode === 'login' && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Choose an instant 1-click demo profile or sign in with your credentials.
                </p>
              </div>

              {/* 1-Click Fast Demo Login Profiles */}
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
                  {/* Alex Morgan - Client */}
                  <button
                    type="button"
                    disabled={isLoggingIn}
                    onClick={() => handleQuickLogin('alex.morgan@overthink.platform', 'password123')}
                    className="p-3 rounded-xl bg-white hover:bg-[#ecfeff]/40 border border-slate-200/80 hover:border-[#0891b2]/50 hover:shadow-sm transition-all text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-1">
                      <UserAvatar
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                        name="Alex Morgan"
                        role="client"
                        size="sm"
                        showOnline={true}
                        className="ring-1 ring-slate-200"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-[#020617] truncate block">
                          Alex Morgan
                        </span>
                        <span className="text-[10px] text-slate-400 truncate block">
                          Startup Founder
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200/70 flex-shrink-0">
                      Client
                    </span>
                  </button>

                  {/* Dr. Elena Vance - Consultant */}
                  <button
                    type="button"
                    disabled={isLoggingIn}
                    onClick={() => handleQuickLogin('elena.vance@overthink.platform', 'password123')}
                    className="p-3 rounded-xl bg-white hover:bg-[#ecfeff]/40 border border-slate-200/80 hover:border-[#020617]/50 hover:shadow-sm transition-all text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-1">
                      <UserAvatar
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
                        name="Dr. Elena Vance"
                        role="consultant"
                        size="sm"
                        showOnline={true}
                        className="ring-1 ring-slate-200"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-[#020617] truncate block">
                          Dr. Elena Vance
                        </span>
                        <span className="text-[10px] text-slate-400 truncate block">
                          Cloud Architect
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#ecfeff] text-[#020617] border border-[#020617]/20 flex-shrink-0">
                      Expert
                    </span>
                  </button>
                </div>

                {/* More test accounts dropdown */}
                {(() => {
                  const users = getUsers();
                  const additionalUsers = users.filter(u =>
                    !u.email?.includes('alex.morgan') && !u.email?.includes('elena.vance')
                  );
                  if (additionalUsers.length === 0) return null;

                  return (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                      <button
                        type="button"
                        onClick={() => setShowOtherAccounts(!showOtherAccounts)}
                        className="w-full py-1 px-2 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>More test accounts ({additionalUsers.length})</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showOtherAccounts ? 'rotate-180' : ''}`} />
                      </button>

                      {showOtherAccounts && (
                        <div className="mt-2 p-2 rounded-xl bg-white border border-slate-200/80 space-y-1.5 max-h-40 overflow-y-auto animate-fadeIn">
                          {additionalUsers.map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              disabled={isLoggingIn}
                              onClick={() => handleQuickLogin(u.email || u.mobile, u.password || 'password123')}
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
                              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                                u.role === 'consultant' ? 'bg-[#ecfeff] text-[#020617]' : 'bg-cyan-50 text-cyan-800'
                              }`}>
                                {u.role === 'consultant' ? 'Expert' : 'Client'}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Divider */}
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

              {/* Inline Error Message */}
              {loginError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200/80 text-red-700 text-xs font-medium space-y-2 animate-fadeIn">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{loginError}</span>
                  </div>

                  {loginIsNotFound && (
                    <div className="mt-2 pt-2 border-t border-red-200/60">
                      <p className="text-[11px] text-slate-700 font-semibold mb-1.5">
                        Account not found in LocalStorage. Quick create and sign in now:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            quickRegister(loginIdentifier.trim(), loginPassword, 'client');
                            if (onSuccess) onSuccess();
                          }}
                          className="py-1.5 px-2 bg-[#0891b2] hover:bg-[#0e7490] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>+ Create Client</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            quickRegister(loginIdentifier.trim(), loginPassword, 'consultant');
                            if (onSuccess) onSuccess();
                          }}
                          className="py-1.5 px-2 bg-[#020617] hover:bg-[#082f49] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>+ Create Consultant</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email / Mobile Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address or Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      autoComplete="username"
                      value={loginIdentifier}
                      onChange={(e) => {
                        setLoginIdentifier(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                      placeholder="e.g. name@company.com or 9876543210"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all shadow-2xs"
                      autoFocus
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      {loginIdentifier.includes('@') ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs text-[#020617] hover:text-[#082f49] font-medium hover:underline transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={loginShowPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all shadow-2xs"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setLoginShowPassword(!loginShowPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {loginShowPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={loginRememberMe}
                      onChange={(e) => setLoginRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#020617] rounded border-slate-300 focus:ring-[#020617] focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 font-medium">
                      Remember this browser session
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
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

              {/* Bottom Switch Link */}
              <div className="text-center text-xs text-slate-500 pt-2">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setRegStep(1);
                    setRegError('');
                  }}
                  className="text-[#020617] font-bold hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* VIEW: REGISTRATION (4 Distinct Steps)                        */}
          {/* ============================================================= */}
          {mode === 'register' && (
            <div className="space-y-6">
              {/* Header with Step Text & Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Create Account
                  </h1>
                  <span className="text-xs font-bold text-[#020617] bg-[#ecfeff] px-2.5 py-0.5 rounded-full">
                    Step {regStep} of 4
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {regStep === 1 && 'Select how you want to use the OverThink platform.'}
                  {regStep === 2 && 'Enter your personal details to get started.'}
                  {regStep === 3 && 'Create a secure password for your account.'}
                  {regStep === 4 && 'Enter the simulated OTP to verify your account.'}
                </p>

                {/* Clean 4-segment progress bar */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className={`h-1.5 rounded-full transition-all duration-300 ${regStep >= 1 ? 'bg-[#020617]' : 'bg-slate-200'}`} />
                  <div className={`h-1.5 rounded-full transition-all duration-300 ${regStep >= 2 ? 'bg-[#020617]' : 'bg-slate-200'}`} />
                  <div className={`h-1.5 rounded-full transition-all duration-300 ${regStep >= 3 ? 'bg-[#020617]' : 'bg-slate-200'}`} />
                  <div className={`h-1.5 rounded-full transition-all duration-300 ${regStep >= 4 ? 'bg-[#020617]' : 'bg-slate-200'}`} />
                </div>
              </div>

              {/* Inline Error Message */}
              {regError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200/80 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{regError}</span>
                </div>
              )}

              {/* STEP 1 – Select Account Type */}
              {regStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {/* Client Option Card */}
                    <button
                      type="button"
                      onClick={() => setRegRole('client')}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 relative cursor-pointer ${
                        regRole === 'client'
                          ? 'border-[#020617] bg-[#020617]/5 ring-2 ring-[#020617]/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          regRole === 'client'
                            ? 'bg-[#020617] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pr-6">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            Client Account
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Submit problems, business challenges, or technical questions and get guaranteed solutions from top consultants.
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 absolute top-4 right-4 ${
                          regRole === 'client'
                            ? 'border-[#020617] bg-[#020617] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {regRole === 'client' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>

                    {/* Consultant Option Card */}
                    <button
                      type="button"
                      onClick={() => setRegRole('consultant')}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 relative cursor-pointer ${
                        regRole === 'consultant'
                          ? 'border-[#020617] bg-[#020617]/5 ring-2 ring-[#020617]/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          regRole === 'consultant'
                            ? 'bg-[#020617] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pr-6">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            Consultant Account
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Browse client submissions, claim consultation ownership, advise founders, and earn on successful delivery.
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 absolute top-4 right-4 ${
                          regRole === 'consultant'
                            ? 'border-[#020617] bg-[#020617] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {regRole === 'consultant' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleStep1Next}
                    className="w-full mt-3 py-3 px-4 bg-[#020617] hover:bg-[#082f49] text-white rounded-xl text-sm font-bold shadow-md shadow-[#020617]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
                  >
                    <span>Continue to Personal Details</span>
                    <ArrowRight className="w-4 h-4 text-[#0891b2]" />
                  </button>
                </div>
              )}

              {/* STEP 2 – Personal Information */}
              {regStep === 2 && (
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => {
                          setRegName(e.target.value);
                          if (regError) setRegError('');
                        }}
                        placeholder="e.g. John Doe"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all shadow-2xs"
                        autoFocus
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => {
                          setRegEmail(e.target.value);
                          if (regError) setRegError('');
                        }}
                        placeholder="name@company.com"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all shadow-2xs"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={regMobile}
                        onChange={(e) => {
                          setRegMobile(e.target.value);
                          if (regError) setRegError('');
                        }}
                        placeholder="10-digit mobile number"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all shadow-2xs"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Step 2 Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleStep2Next}
                      className="flex-1 py-3 px-4 bg-[#020617] hover:bg-[#082f49] text-white rounded-xl text-sm font-bold shadow-md shadow-[#020617]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Password</span>
                      <ArrowRight className="w-4 h-4 text-[#0891b2]" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 – Account Credentials */}
              {regStep === 3 && (
                <div className="space-y-4">
                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Create Password (Min 8 Characters) *
                    </label>
                    <div className="relative">
                      <input
                        type={regShowPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => {
                          setRegPassword(e.target.value);
                          if (regError) setRegError('');
                        }}
                        placeholder="At least 8 characters"
                        className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all shadow-2xs"
                        autoFocus
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setRegShowPassword(!regShowPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        tabIndex={-1}
                      >
                        {regShowPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={regShowConfirmPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => {
                          setRegConfirmPassword(e.target.value);
                          if (regError) setRegError('');
                        }}
                        placeholder="Re-enter your password"
                        className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all shadow-2xs"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setRegShowConfirmPassword(!regShowConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        tabIndex={-1}
                      >
                        {regShowConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Match Indicator */}
                  {regPassword && regConfirmPassword && (
                    <div className="flex items-center gap-1.5 text-xs">
                      {regPassword === regConfirmPassword ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                          <span className="text-cyan-700 font-medium">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                          <span className="text-red-600 font-medium">Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Step 3 Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(2)}
                      className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleStep3Next}
                      className="flex-1 py-3 px-4 bg-[#020617] hover:bg-[#082f49] text-white rounded-xl text-sm font-bold shadow-md shadow-[#020617]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Verification</span>
                      <ArrowRight className="w-4 h-4 text-[#0891b2]" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4 – OTP Verification (Registration ONLY) */}
              {regStep === 4 && (
                <div className="space-y-4">
                  {/* Explanation */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A 6-digit verification code was simulated for{' '}
                    <span className="font-semibold text-slate-900">{regEmail}</span>.
                  </p>

                  {/* Development Testing OTP Banner with 1-click Auto-Fill */}
                  <div className="p-3 bg-amber-50/90 border border-amber-200/80 rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <KeyRound className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <div className="text-xs truncate">
                        <span className="text-amber-800 font-medium">Simulated Code: </span>
                        <span className="font-mono font-bold text-amber-950 tracking-wider">
                          {simulatedOtp}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoFillSimulatedOtp}
                      className="text-xs font-bold text-amber-900 hover:text-amber-950 underline px-2 py-1 rounded hover:bg-amber-100/60 transition-colors flex-shrink-0 cursor-pointer"
                    >
                      Auto-fill Code
                    </button>
                  </div>

                  {/* 6-box OTP input */}
                  <div className="flex items-center justify-between gap-2 py-2">
                    {otpValues.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`w-12 h-14 text-center text-xl font-bold rounded-xl border transition-all ${
                          digit
                            ? 'border-[#020617] bg-[#020617]/5 text-[#020617]'
                            : 'border-slate-200 bg-white text-slate-900 focus:border-[#020617] focus:ring-2 focus:ring-[#020617]/20'
                        }`}
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>

                  {/* Countdown Timer & Resend */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>
                      {otpExpired ? (
                        <span className="text-red-600 font-medium">Code expired</span>
                      ) : (
                        <span>
                          Code expires in{' '}
                          <span className="font-mono font-semibold text-slate-700">
                            {formatTimer(otpTimer)}
                          </span>
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCount >= 3 || (!otpExpired && otpTimer > 60)}
                      className="text-[#020617] font-semibold hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                    >
                      Resend Code {resendCount > 0 && `(${3 - resendCount} left)`}
                    </button>
                  </div>

                  {/* Step 4 Actions */}
                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setRegStep(3)}
                      className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleFinalRegisterSubmit}
                      disabled={isRegistering || otpValues.join('').length < 6}
                      className="flex-1 py-3 px-4 bg-[#020617] hover:bg-[#082f49] text-white rounded-xl text-sm font-bold shadow-md shadow-[#020617]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      {isRegistering ? (
                        <>
                          <RotateCcw className="w-4 h-4 animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Complete</span>
                          <CheckCircle2 className="w-4 h-4 text-[#0891b2]" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Switch Link */}
              <div className="text-center text-xs text-slate-500 pt-2">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setLoginError('');
                  }}
                  className="text-[#020617] font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Guarantee & Developer Credit */}
        <div className="w-full max-w-lg mx-auto text-center pt-6 flex-shrink-0 space-y-1.5">
          <p className="text-[11px] text-slate-400 font-medium">
            Protected by OverThink Simulated Local Authentication • Zero Server Required
          </p>
          <div className="text-xs text-slate-400 font-medium select-none">
            Developed by <span className="font-semibold text-slate-600">Krish Lad</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
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
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 bg-[#020617] hover:bg-[#082f49] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Understood, Return to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
