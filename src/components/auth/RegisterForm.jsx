import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Phone,
  RotateCcw,
  User,
} from 'lucide-react';
import { useApp } from '../../context/useApp';

const ACCOUNT_OPTIONS = [
  {
    id: 'client',
    title: 'Client Account',
    description:
      'Submit problems, business challenges, or technical questions and get guaranteed solutions from top consultants.',
    icon: User,
  },
  {
    id: 'consultant',
    title: 'Consultant Account',
    description:
      'Browse client submissions, claim consultation ownership, advise founders, and earn on successful delivery.',
    icon: Briefcase,
  },
];

const STEP_SUBTITLES = {
  1: 'Select how you want to use the OverThink platform.',
  2: 'Enter your personal details to get started.',
  3: 'Create a secure password for your account.',
  4: 'Enter the simulated OTP to verify your account.',
};

function formatTimer(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const { register, verifyRegistrationOTP, generateOTP, resendOTP, showToast } = useApp();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(120);
  const [otpExpired, setOtpExpired] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const otpInputRefs = useRef([]);

  useEffect(() => {
    if (step !== 4 || otpTimer <= 0 || otpExpired) return undefined;

    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          setOtpExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, otpTimer, otpExpired]);

  const handleStep1Next = () => {
    setError('');
    if (!role) {
      setError('Please select an account type to continue.');
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    setError('');
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMobile = mobile.trim();

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }
    if (!cleanEmail) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address format.');
      return;
    }
    if (!cleanMobile) {
      setError('Please enter your mobile phone number.');
      return;
    }
    const digitsOnly = cleanMobile.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      setError('Please enter a valid 10 to 15 digit mobile number.');
      return;
    }

    setStep(3);
  };

  const handleStep3Next = () => {
    setError('');
    if (!password) {
      setError('Please create a password for your account.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    const otpData = generateOTP(email);
    if (otpData) {
      setSimulatedOtp(otpData.otp);
      setOtpTimer(otpData.expiresInSeconds || 120);
      setOtpExpired(false);
      setOtpValues(['', '', '', '', '', '']);
    }

    setStep(4);
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const nextValues = [...otpValues];
    nextValues[index] = value ? value.slice(-1) : '';
    setOtpValues(nextValues);
    if (error) setError('');

    if (value && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0 && otpInputRefs.current[index - 1]) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleAutoFillSimulatedOtp = () => {
    if (!simulatedOtp || simulatedOtp.length !== 6) return;
    setOtpValues(simulatedOtp.split(''));
    if (otpInputRefs.current[5]) {
      otpInputRefs.current[5].focus();
    }
    if (error) setError('');
  };

  const handleResendOtp = () => {
    setError('');
    const res = resendOTP(email);
    if (!res.success) {
      setError(res.error || 'Could not resend OTP.');
      return;
    }
    setSimulatedOtp(res.otp);
    setOtpTimer(120);
    setOtpExpired(false);
    setResendCount(res.resendCount);
    setOtpValues(['', '', '', '', '', '']);
    showToast('Code Resent', `New simulated OTP: ${res.otp}`, 'info');
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const enteredOtp = otpValues.join('');
    if (enteredOtp.length < 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }
    if (otpExpired) {
      setError('Your verification code has expired. Please click "Resend Code".');
      return;
    }

    const verifyRes = verifyRegistrationOTP(email, enteredOtp);
    if (!verifyRes.success) {
      setError(verifyRes.error || 'Invalid verification code.');
      return;
    }

    setIsRegistering(true);
    try {
      const regRes = await register({
        role,
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim().replace(/\D/g, ''),
        password,
      });

      if (!regRes?.success) {
        setError(regRes?.error || 'Registration failed.');
      } else if (onSuccess) {
        onSuccess(regRes.user || { role }, true);
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create Account
          </h1>
          <span className="text-xs font-bold text-[#020617] bg-[#ecfeff] px-2.5 py-0.5 rounded-full">
            Step {step} of 4
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">{STEP_SUBTITLES[step]}</p>

        <div className="grid grid-cols-4 gap-2 mt-4">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= index ? 'bg-[#020617]' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200/80 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-3">
            {ACCOUNT_OPTIONS.map((option) => {
              const OptionIcon = option.icon;
              const isSelected = role === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setRole(option.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 relative cursor-pointer ${
                    isSelected
                      ? 'border-[#020617] bg-[#020617]/5 ring-2 ring-[#020617]/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'bg-[#020617] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <OptionIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pr-6">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{option.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 absolute top-4 right-4 ${
                      isSelected
                        ? 'border-[#020617] bg-[#020617] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
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

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="name@company.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all shadow-2xs"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mobile Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  if (error) setError('');
                }}
                placeholder="10-digit mobile number"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all shadow-2xs"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
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

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Create Password (Min 8 Characters) *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
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
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Re-enter your password"
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all shadow-2xs"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {password && confirmPassword && (
            <div className="flex items-center gap-1.5 text-xs">
              {password === confirmPassword ? (
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

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
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

      {step === 4 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            A 6-digit verification code was simulated for{' '}
            <span className="font-semibold text-slate-900">{email}</span>.
          </p>

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

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
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

      <div className="text-center text-xs text-slate-500 pt-2">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[#020617] font-bold hover:underline cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
