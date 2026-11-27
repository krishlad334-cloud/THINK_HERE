import { apiRequest, clearAuthToken, getAuthToken, setAuthToken } from './apiClient';
import { normalizeUser } from './normalizers';

const OTP_STORE = {};
const OTP_EXPIRY_SECONDS = 120;
const MAX_RESEND_LIMIT = 3;

export function normalizeIdentifier(val) {
  if (!val) return '';
  const trimmed = val.trim();
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  return trimmed.replace(/\D/g, '');
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export async function getCurrentUser() {
  if (!getAuthToken()) return null;
  try {
    const res = await apiRequest('/auth/me');
    return normalizeUser(res.data?.user);
  } catch (err) {
    if (err.status === 401) {
      clearAuthToken();
    }
    return null;
  }
}

export async function updateCurrentUserProfile(updates = {}) {
  const payload = {};

  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.mobile !== undefined) {
    const digits = String(updates.mobile).replace(/\D/g, '');
    if (digits) payload.mobile = digits;
  }
  if (updates.avatar !== undefined || updates.profileImage !== undefined) {
    payload.avatar = updates.avatar ?? updates.profileImage;
  }
  if (updates.headline !== undefined || updates.title !== undefined) {
    payload.headline = updates.headline ?? updates.title;
  }
  if (updates.bio !== undefined) payload.bio = updates.bio;
  if (updates.hourlyRate !== undefined) {
    payload.hourlyRate = String(updates.hourlyRate);
  }
  if (updates.skills !== undefined) payload.skills = updates.skills;
  if (updates.services !== undefined) {
    payload.services = (updates.services || []).map((srv) =>
      typeof srv === 'string' ? srv : srv.title || String(srv)
    );
  }
  if (updates.assessmentPassed !== undefined) {
    payload.assessmentPassed = Boolean(updates.assessmentPassed);
  }
  if (updates.assessmentScore !== undefined) {
    payload.assessmentScore = String(updates.assessmentScore);
  }
  if (updates.isVerified !== undefined) {
    payload.isVerified = Boolean(updates.isVerified);
  }

  const res = await apiRequest('/auth/me', {
    method: 'PATCH',
    body: payload,
  });

  return normalizeUser(res.data?.user);
}

export function redirectByRole(role) {
  if (role === 'consultant' || role === 'admin') {
    return 'browse_thoughts';
  }
  return 'chat';
}

export function generateOTP(emailOrMobile) {
  const key = normalizeIdentifier(emailOrMobile);
  if (!key) return null;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + OTP_EXPIRY_SECONDS * 1000;

  const prev = OTP_STORE[key] || { resendCount: 0 };
  OTP_STORE[key] = {
    otp,
    expiresAt,
    resendCount: prev.resendCount,
  };

  return {
    otp,
    expiresAt,
    expiresInSeconds: OTP_EXPIRY_SECONDS,
  };
}

export function resendOTP(emailOrMobile) {
  const key = normalizeIdentifier(emailOrMobile);
  if (!key) {
    return { success: false, error: 'Invalid email or mobile number.' };
  }

  const current = OTP_STORE[key];
  if (current && current.resendCount >= MAX_RESEND_LIMIT) {
    return {
      success: false,
      error: 'OTP resend limit reached. Please wait or continue with your existing code.',
    };
  }

  const otpData = generateOTP(emailOrMobile);
  OTP_STORE[key].resendCount = (current?.resendCount || 0) + 1;

  return {
    success: true,
    otp: otpData.otp,
    expiresAt: otpData.expiresAt,
    resendCount: OTP_STORE[key].resendCount,
    remainingResends: MAX_RESEND_LIMIT - OTP_STORE[key].resendCount,
  };
}

export function verifyRegistrationOTP(emailOrMobile, inputOtp) {
  const key = normalizeIdentifier(emailOrMobile);
  if (!key) {
    return { success: false, error: 'Missing email or mobile number.' };
  }

  const cleanInput = (inputOtp || '').toString().trim();
  if (!cleanInput || cleanInput.length !== 6) {
    return { success: false, error: 'Please enter a valid 6-digit OTP.' };
  }

  const record = OTP_STORE[key];
  if (!record) {
    return { success: false, error: 'No OTP generated for this account. Click Resend OTP.' };
  }

  if (Date.now() > record.expiresAt) {
    return { success: false, error: 'OTP has expired. Please click Resend OTP.' };
  }

  if (record.otp !== cleanInput) {
    return { success: false, error: 'Incorrect OTP. Please enter the valid 6-digit code.' };
  }

  return { success: true };
}

export async function registerUser(userData) {
  const normalizedEmail = (userData.email || '').trim().toLowerCase();
  const cleanMobile = (userData.mobile || '').trim().replace(/\D/g, '');

  if (!userData.name || !userData.name.trim()) {
    return { success: false, error: 'Full name is required.' };
  }
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return { success: false, error: 'A valid email address is required.' };
  }
  if (cleanMobile && (cleanMobile.length < 10 || cleanMobile.length > 15)) {
    return { success: false, error: 'Mobile number must be between 10 and 15 digits.' };
  }
  if (!userData.password || userData.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters in length.' };
  }
  const role = userData.role || 'client';
  if (!['user', 'client', 'consultant'].includes(role)) {
    return { success: false, error: 'Please select an account type (Client or Consultant).' };
  }

  const payload = {
    name: userData.name.trim(),
    email: normalizedEmail,
    password: userData.password,
    role,
  };

  if (cleanMobile) payload.mobile = cleanMobile;
  if (userData.headline || userData.title) {
    payload.headline = userData.headline || userData.title;
  }
  if (userData.bio) payload.bio = userData.bio;
  if (Array.isArray(userData.skills) && userData.skills.length > 0) {
    payload.skills = userData.skills;
  }
  if (Array.isArray(userData.services) && userData.services.length > 0) {
    payload.services = userData.services.map((srv) =>
      typeof srv === 'string' ? srv : srv.title || String(srv)
    );
  }
  if (userData.avatar || userData.profileImage) {
    payload.avatar = userData.avatar || userData.profileImage;
  }

  try {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: payload,
      skipAuth: true,
    });

    const token = res.data?.token;
    if (token) {
      setAuthToken(token);
    }

    let user = normalizeUser(res.data?.user);

    if (
      user &&
      (userData.assessmentPassed !== undefined ||
        userData.isVerified !== undefined ||
        userData.hourlyRate !== undefined)
    ) {
      try {
        user = await updateCurrentUserProfile({
          hourlyRate: userData.hourlyRate,
          assessmentPassed: userData.assessmentPassed,
          assessmentScore: userData.assessmentScore,
          isVerified: userData.isVerified,
        });
      } catch (patchErr) {
        console.warn('[thinkAuth] Post-register profile patch failed:', patchErr);
      }
    }

    return {
      success: true,
      token,
      user,
      role: user?.role || role,
      redirectTo: redirectByRole(user?.role || role),
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Registration failed. Please try again.',
    };
  }
}

export async function loginUser(identifier, password) {
  if (!identifier || !identifier.trim()) {
    return { success: false, error: 'Please enter your registered email address or mobile number.' };
  }
  if (!password) {
    return { success: false, error: 'Please enter your password.' };
  }

  try {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: {
        identifier: identifier.trim(),
        password,
      },
      skipAuth: true,
    });

    const token = res.data?.token;
    if (token) {
      setAuthToken(token);
    }

    const user = normalizeUser(res.data?.user);

    return {
      success: true,
      token,
      user,
      role: user?.role || 'client',
      redirectTo: redirectByRole(user?.role || 'client'),
    };
  } catch (err) {
    return {
      success: false,
      notFound: err.status === 404,
      error: err.message || 'Authentication failed. Please check your credentials.',
    };
  }
}

export async function quickRegisterUser(identifier, password, role = 'client') {
  const cleanId = (identifier || '').trim();
  const isEmail = cleanId.includes('@');
  const email = isEmail
    ? cleanId.toLowerCase()
    : `${cleanId.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}@overthink.platform`;
  const digits = cleanId.replace(/\D/g, '');
  const mobile =
    !isEmail && digits.length >= 10 && digits.length <= 15
      ? digits
      : `987${Math.floor(1000000 + Math.random() * 9000000)}`;
  const prefix = isEmail ? cleanId.split('@')[0] : 'User';
  const name =
    prefix.charAt(0).toUpperCase() +
    prefix.slice(1).replace(/[^a-zA-Z0-9]/g, ' ').trim();

  return registerUser({
    name: name.length >= 2 ? name : 'OverThink Member',
    email,
    mobile,
    password: password && password.length >= 6 ? password : 'password123',
    role: role || 'client',
  });
}

export function logoutUser() {
  clearAuthToken();
  return { success: true };
}
