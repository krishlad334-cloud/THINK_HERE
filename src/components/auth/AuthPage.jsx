import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { getUsers } from '../../utils/thinkStorage';
import Logo from '../common/Logo';
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
  Sparkles,
  RotateCcw,
  Check
} from 'lucide-react';

export default function AuthPage() {
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
  const [mode, setMode] = useState('login');

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
  const [regSuccess, setRegSuccess] = useState(false);

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
      }
      // On success, AppContext automatically updates activeUser, isAuthenticated,
      // and redirects to Client (/client/dashboard) or Consultant (/consultant/dashboard)
    }, 300);
  };

  // Quick Demo Fast-Fill Handlers for Reviewer Testing
  const handleQuickFillClient = () => {
    setLoginIdentifier('alex.morgan@think.platform');
    setLoginPassword('password123');
    setLoginError('');
  };

  const handleQuickFillConsultant = () => {
    setLoginIdentifier('elena.vance@think.platform');
    setLoginPassword('password123');
    setLoginError('');
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
    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanMobile = regMobile.trim().replace(/\D/g, '');

    if (!cleanName) {
      setRegError('Full Name is required.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setRegError('Please enter a valid email address.');
      return;
    }
    if (!cleanMobile || cleanMobile.length < 10) {
      setRegError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Check duplicate in think_users
    const existingUsers = getUsers();
    const isEmailTaken = existingUsers.some(
      (u) => u.email && u.email.toLowerCase() === cleanEmail
    );
    if (isEmailTaken) {
      setRegError('This email is already registered. Please sign in instead.');
      return;
    }

    const isMobileTaken = existingUsers.some(
      (u) => u.mobile && u.mobile.replace(/\D/g, '') === cleanMobile
    );
    if (isMobileTaken) {
      setRegError('This mobile number is already registered. Please sign in instead.');
      return;
    }

    setRegStep(3);
  };

  // Step 3 -> Step 4: Validate Credentials & Generate Verification OTP
  const handleStep3Next = () => {
    setRegError('');

    if (!regPassword || regPassword.length < 8) {
      setRegError('Password must be at least 8 characters in length.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please verify both fields.');
      return;
    }

    // Generate static simulated OTP for development verification
    const generated = generateOTP(regEmail);
    if (generated && generated.otp) {
      setSimulatedOtp(generated.otp);
      setOtpTimer(120);
      setOtpExpired(false);
      setOtpValues(['', '', '', '', '', '']);
    }

    setRegStep(4);
  };

  // Step 4: OTP Input Handlers
  const handleOtpChange = (index, value) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otpValues];
    newOtp[index] = char;
    setOtpValues(newOtp);

    // Auto-focus next box
    if (char && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otpValues];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtpValues(newOtp);
    if (pasted.length === 6) {
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    if (!simulatedOtp) return;
    const chars = simulatedOtp.split('');
    setOtpValues(chars);
    otpInputRefs.current[5]?.focus();
  };

  const handleResendOtp = () => {
    if (resendCount >= 3) {
      setRegError('OTP resend limit reached. Please use your simulated test code.');
      return;
    }
    setRegError('');
    const res = resendOTP(regEmail);
    if (res.success) {
      setSimulatedOtp(res.otp);
      setOtpTimer(120);
      setOtpExpired(false);
      setOtpValues(['', '', '', '', '', '']);
      setResendCount((prev) => prev + 1);
      showToast('OTP Resent', `New verification code generated.`, 'info');
    } else {
      setRegError(res.error || 'Failed to resend OTP.');
    }
  };

  // Final Registration Verification & Submission
  const handleCompleteRegistration = () => {
    setRegError('');
    const enteredOtp = otpValues.join('');

    if (enteredOtp.length !== 6) {
      setRegError('Please enter the complete 6-digit verification code.');
      return;
    }

    if (otpExpired) {
      setRegError('This OTP has expired. Please click Resend OTP to get a new code.');
      return;
    }

    // Verify OTP against thinkAuth
    const verifyRes = verifyRegistrationOTP(regEmail, enteredOtp);
    if (!verifyRes.success) {
      setRegError(verifyRes.error || 'Invalid OTP code.');
      return;
    }

    setIsRegistering(true);
    setTimeout(() => {
      const regRes = register({
        name: regName.trim(),
        email: regEmail.trim(),
        mobile: regMobile.trim(),
        password: regPassword,
        role: regRole
      });

      setIsRegistering(false);
      if (!regRes.success) {
        setRegError(regRes.error || 'Registration failed.');
      } else {
        setRegSuccess(true);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#f8fafc] flex flex-col justify-between items-center px-4 py-8 sm:py-12 text-slate-800 font-sans antialiased selection:bg-[#004845]/10 selection:text-[#004845]">
      {/* Background Subtle Gradient & Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
      </div>

      {/* Main Centered Content Card */}
      <div className="w-full max-w-md mx-auto my-auto relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Logo size="lg" showTagline={false} />
          <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
            Every Thought Deserves a Solution
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 transition-all duration-300">
          {/* ============================================================= */}
          {/* VIEW: LOGIN                                                  */}
          {/* ============================================================= */}
          {mode === 'login' && (
            <div>
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Welcome Back
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Sign in to continue your THINK journey.
                </p>
              </div>

              {/* Inline Error Message */}
              {loginError && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200/80 text-red-700 text-xs font-medium space-y-2 animate-fadeIn">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{loginError}</span>
                  </div>

                  {loginIsNotFound && (
                    <div className="mt-2 pt-2 border-t border-red-200/60">
                      <p className="text-[11px] text-slate-700 font-semibold mb-1.5">
                        Test account not found in LocalStorage. Quick create and sign in now:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            quickRegister(loginIdentifier.trim(), loginPassword, 'client');
                          }}
                          className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>+ Create Client</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            quickRegister(loginIdentifier.trim(), loginPassword, 'consultant');
                          }}
                          className="py-1.5 px-2 bg-[#004845] hover:bg-[#003836] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
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
                      value={loginIdentifier}
                      onChange={(e) => {
                        setLoginIdentifier(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                      placeholder="e.g. name@company.com or 9876543210"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845] transition-all"
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
                      className="text-xs text-[#004845] hover:text-[#003836] font-medium hover:underline transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={loginShowPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845] transition-all"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setLoginShowPassword(!loginShowPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
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
                      className="w-4 h-4 text-[#004845] rounded border-slate-300 focus:ring-[#004845] focus:ring-offset-0"
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
                  className="w-full py-2.5 px-4 bg-[#004845] hover:bg-[#003836] text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {isLoggingIn ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Demo Testing Helper for Quick 1-Click Login (4 Test Users + Any Local Users) */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#16a34a]" />
                    <span>LocalStorage Accounts ({getUsers().length} Users):</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    pass: password123
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {getUsers().slice(0, 6).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setLoginIdentifier(u.email || u.mobile);
                        setLoginPassword(u.password || 'password123');
                        setLoginError('');
                        setLoginIsNotFound(false);
                      }}
                      className="py-1.5 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors text-left flex items-center justify-between group cursor-pointer"
                      title={`Click to fill: ${u.name} (${u.email || u.mobile})`}
                    >
                      <div className="truncate min-w-0 pr-1">
                        <span className="font-bold text-slate-800 block truncate group-hover:text-[#004845]">
                          {u.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate capitalize">
                          {u.role === 'consultant' ? 'Consultant' : 'Client'}
                        </span>
                      </div>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded flex-shrink-0 ${
                        u.role === 'consultant' ? 'bg-[#e6f2f1] text-[#004845]' : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        {u.role === 'consultant' ? 'Expert' : 'Client'}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                  All user accounts, emails, and passwords are saved in LocalStorage for testing.
                </p>
              </div>

              {/* Bottom Switch Link */}
              <div className="mt-6 text-center text-xs text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setRegStep(1);
                    setRegError('');
                  }}
                  className="text-[#004845] font-semibold hover:underline"
                >
                  Register Now
                </button>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* VIEW: REGISTRATION (4 Distinct Steps)                        */}
          {/* ============================================================= */}
          {mode === 'register' && (
            <div>
              {/* Header with Minimalist Step Text & Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Create Account
                  </h1>
                  <span className="text-xs font-semibold text-slate-400">
                    Step {regStep} of 4
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {regStep === 1 && 'Select how you want to use the THINK platform.'}
                  {regStep === 2 && 'Enter your personal details to get started.'}
                  {regStep === 3 && 'Create a secure password for your account.'}
                  {regStep === 4 && 'Enter the simulated OTP to verify your account.'}
                </p>

                {/* Clean 4-segment progress bar */}
                <div className="grid grid-cols-4 gap-1.5 mt-3">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      regStep >= 1 ? 'bg-[#004845]' : 'bg-slate-100'
                    }`}
                  />
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      regStep >= 2 ? 'bg-[#004845]' : 'bg-slate-100'
                    }`}
                  />
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      regStep >= 3 ? 'bg-[#004845]' : 'bg-slate-100'
                    }`}
                  />
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      regStep >= 4 ? 'bg-[#004845]' : 'bg-slate-100'
                    }`}
                  />
                </div>
              </div>

              {/* Inline Error Message */}
              {regError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200/80 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
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
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 relative ${
                        regRole === 'client'
                          ? 'border-[#004845] bg-[#004845]/5 ring-1 ring-[#004845]'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          regRole === 'client'
                            ? 'bg-[#004845] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pr-6">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900">
                            Client
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          Find the right expertise and get solutions to your challenges.
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 absolute top-4 right-4 ${
                          regRole === 'client'
                            ? 'border-[#004845] bg-[#004845] text-white'
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
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 relative ${
                        regRole === 'consultant'
                          ? 'border-[#004845] bg-[#004845]/5 ring-1 ring-[#004845]'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          regRole === 'consultant'
                            ? 'bg-[#004845] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pr-6">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900">
                            Consultant
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          Share your expertise and help clients solve real problems.
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 absolute top-4 right-4 ${
                          regRole === 'consultant'
                            ? 'border-[#004845] bg-[#004845] text-white'
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
                    className="w-full mt-2 py-2.5 px-4 bg-[#004845] hover:bg-[#003836] text-white rounded-xl text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continue to Details</span>
                    <ArrowRight className="w-4 h-4" />
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
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845] transition-all"
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
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845] transition-all"
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
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845] transition-all"
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
                      className="py-2.5 px-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleStep2Next}
                      className="flex-1 py-2.5 px-4 bg-[#004845] hover:bg-[#003836] text-white rounded-xl text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2"
                    >
                      <span>Continue to Credentials</span>
                      <ArrowRight className="w-4 h-4" />
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
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845] transition-all"
                        autoFocus
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setRegShowPassword(!regShowPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
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
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845] transition-all"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setRegShowConfirmPassword(!regShowConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
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
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-medium">Passwords match</span>
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
                      className="py-2.5 px-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleStep3Next}
                      className="flex-1 py-2.5 px-4 bg-[#004845] hover:bg-[#003836] text-white rounded-xl text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2"
                    >
                      <span>Continue to Verification</span>
                      <ArrowRight className="w-4 h-4" />
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
                      <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <div className="text-xs truncate">
                        <span className="text-amber-800 font-medium">Simulated Test OTP: </span>
                        <span className="font-mono font-bold text-amber-950 tracking-wider">
                          {simulatedOtp || '684219'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="text-xs font-semibold text-amber-900 hover:text-amber-950 bg-amber-100/80 hover:bg-amber-200/70 px-2 py-1 rounded-md transition-colors flex-shrink-0"
                    >
                      Auto-fill
                    </button>
                  </div>

                  {/* 6-digit OTP Inputs */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2 text-center">
                      Enter 6-Digit OTP Code
                    </label>
                    <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                      {otpValues.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => (otpInputRefs.current[i] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="w-10 h-12 text-center font-mono font-bold text-lg text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845] transition-all"
                          autoFocus={i === 0}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Countdown Timer and Resend Option */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500 font-medium">
                      {otpExpired ? (
                        <span className="text-red-600 font-semibold">OTP Expired</span>
                      ) : (
                        `Expires in ${formatTimer(otpTimer)}`
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCount >= 3}
                      className="text-[#004845] hover:text-[#003836] font-semibold hover:underline disabled:text-slate-400 disabled:no-underline"
                    >
                      {resendCount >= 3 ? 'Resend limit reached' : 'Resend Code'}
                    </button>
                  </div>

                  {/* Step 4 Actions */}
                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setRegStep(3)}
                      className="py-2.5 px-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCompleteRegistration}
                      disabled={isRegistering || otpValues.join('').length !== 6}
                      className="flex-1 py-2.5 px-4 bg-[#004845] hover:bg-[#003836] text-white rounded-xl text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isRegistering ? (
                        <>
                          <RotateCcw className="w-4 h-4 animate-spin" />
                          <span>Verifying & Creating...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Complete</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Switch Link */}
              <div className="mt-6 text-center text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setLoginError('');
                  }}
                  className="text-[#004845] font-semibold hover:underline"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Guarantee */}
        <p className="text-center text-[11px] text-slate-400 mt-6 font-normal">
          Protected by THINK Simulated Local Authentication • Zero Server Required
        </p>
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
              className="w-full py-2 bg-[#004845] hover:bg-[#003836] text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Understood, Return to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
