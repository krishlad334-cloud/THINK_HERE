import {
  STORAGE_KEYS,
  getUsers,
  getUserById,
  setActiveUser,
  getAuthSession,
  setAuthSession,
  clearAuthSession
} from './thinkStorage';

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
  const session = getAuthSession();
  if (!session || !session.isAuthenticated || !session.userId) {
    return false;
  }
  const user = getUserById(session.userId);
  return !!user;
}

export function getCurrentUser() {
  const session = getAuthSession();
  if (!session || !session.userId) return null;
  return getUserById(session.userId);
}

export function getUserRole() {
  const user = getCurrentUser();
  if (user) return user.role;
  const session = getAuthSession();
  return session?.role || null;
}

export function redirectByRole(role) {
  if (role === 'consultant') {
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
    resendCount: prev.resendCount
  };

  return {
    otp,
    expiresAt,
    expiresInSeconds: OTP_EXPIRY_SECONDS
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
      error: 'OTP resend limit reached. Please wait or continue with your existing code.'
    };
  }

  const otpData = generateOTP(emailOrMobile);
  OTP_STORE[key].resendCount = (current?.resendCount || 0) + 1;

  return {
    success: true,
    otp: otpData.otp,
    expiresAt: otpData.expiresAt,
    resendCount: OTP_STORE[key].resendCount,
    remainingResends: MAX_RESEND_LIMIT - OTP_STORE[key].resendCount
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

export function registerUser(userData) {
  const users = getUsers();
  const normalizedEmail = (userData.email || '').trim().toLowerCase();
  const cleanMobile = (userData.mobile || '').trim().replace(/\D/g, '');

  if (!userData.name || !userData.name.trim()) {
    return { success: false, error: 'Full name is required.' };
  }
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return { success: false, error: 'A valid email address is required.' };
  }
  if (!cleanMobile || cleanMobile.length < 10) {
    return { success: false, error: 'A valid 10-digit mobile number is required.' };
  }
  if (!userData.password || userData.password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters in length.' };
  }
  if (!userData.role || (userData.role !== 'client' && userData.role !== 'consultant')) {
    return { success: false, error: 'Please select an account type (Client or Consultant).' };
  }

  const existingEmail = users.find(u => u.email && u.email.toLowerCase() === normalizedEmail);
  if (existingEmail) {
    return { success: false, error: 'This email address is already registered. Please sign in instead.' };
  }

  const existingMobile = users.find(u => u.mobile && u.mobile.replace(/\D/g, '') === cleanMobile);
  if (existingMobile) {
    return { success: false, error: 'This mobile number is already registered. Please sign in instead.' };
  }

  const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const isConsultant = userData.role === 'consultant';
  const newUser = {
    id,
    name: userData.name.trim(),
    email: normalizedEmail,
    mobile: cleanMobile,
    password: userData.password,
    role: userData.role,
    isVerified: !isConsultant,
    assessmentPassed: isConsultant ? false : undefined,
    title: userData.title || (isConsultant ? 'Consultant Candidate' : 'Client Member'),
    hourlyRate: userData.hourlyRate ? Number(userData.hourlyRate) : (isConsultant ? 120 : undefined),
    responseTime: isConsultant ? '< 2 hours' : undefined,
    location: userData.location || 'Remote',
    bio: userData.bio || '',
    skills: userData.skills || [],
    services: isConsultant ? (userData.services || []) : undefined,
    experience: isConsultant ? (userData.experience || []) : undefined,
    education: isConsultant ? (userData.education || []) : undefined,
    certifications: isConsultant ? (userData.certifications || []) : undefined,
    portfolio: isConsultant ? (userData.portfolio || []) : undefined,
    avatar: userData.avatar || userData.profileImage || null,
    profileImage: userData.profileImage || userData.avatar || null,
    label: isConsultant ? 'Consultant' : 'Client',
    createdAt: new Date().toISOString()
  };

  const updatedUsers = [...users, newUser];
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    window.dispatchEvent(new CustomEvent('think_storage_updated', { detail: { key: STORAGE_KEYS.USERS, data: updatedUsers } }));
  } catch (err) {
    console.error('Error saving user in storage:', err);
  }

  setActiveUser(newUser.id);
  const session = {
    userId: newUser.id,
    role: newUser.role,
    isAuthenticated: true,
    createdAt: new Date().toISOString()
  };
  setAuthSession(session);

  return {
    success: true,
    user: newUser,
    role: newUser.role,
    redirectTo: redirectByRole(newUser.role)
  };
}

export function loginUser(identifier, password) {
  if (!identifier || !identifier.trim()) {
    return { success: false, error: 'Please enter your registered email address or mobile number.' };
  }
  if (!password) {
    return { success: false, error: 'Please enter your password.' };
  }

  const users = getUsers();
  const rawId = identifier.trim();
  const isEmail = rawId.includes('@');
  const normalizedEmail = isEmail ? rawId.toLowerCase() : null;
  const cleanMobile = !isEmail ? rawId.replace(/\D/g, '') : null;

  const user = users.find(u => {
    if (normalizedEmail && u.email) {
      const uEmail = u.email.toLowerCase();
      if (uEmail === normalizedEmail) return true;
      if (normalizedEmail.replace('@overthink.platform', '') === uEmail.replace('@think.platform', '')) return true;
      if (normalizedEmail.replace('@think.platform', '') === uEmail.replace('@overthink.platform', '')) return true;
    }
    if (rawId && u.email && u.email.toLowerCase().startsWith(rawId.toLowerCase() + '@')) {
      return true;
    }
    if (rawId && (u.id === rawId || u.name?.toLowerCase() === rawId.toLowerCase())) {
      return true;
    }
    if (cleanMobile && u.mobile && u.mobile.replace(/\D/g, '') === cleanMobile) {
      return true;
    }
    return false;
  });

  if (!user) {
    return {
      success: false,
      notFound: true,
      error: 'No account found with this email address or mobile number.'
    };
  }

  if (user.password && user.password !== password) {
    return {
      success: false,
      error: 'Incorrect password. Please verify and try again.'
    };
  }

  if (user.role !== 'consultant' && user.isVerified === false) {
    return {
      success: false,
      error: 'Your account is not verified yet. Please complete verification.'
    };
  }

  setActiveUser(user.id);
  const session = {
    userId: user.id,
    role: user.role,
    isAuthenticated: true,
    createdAt: new Date().toISOString()
  };
  setAuthSession(session);

  return {
    success: true,
    user,
    role: user.role,
    redirectTo: redirectByRole(user.role)
  };
}

export function quickRegisterUser(identifier, password, role = 'client') {
  const cleanId = (identifier || '').trim();
  const isEmail = cleanId.includes('@');
  const email = isEmail ? cleanId.toLowerCase() : `${cleanId.toLowerCase()}@overthink.platform`;
  const mobile = !isEmail ? cleanId.replace(/\D/g, '') : `987${Math.floor(1000000 + Math.random() * 9000000)}`;
  const prefix = isEmail ? cleanId.split('@')[0] : 'User';
  const name = prefix.charAt(0).toUpperCase() + prefix.slice(1).replace(/[^a-zA-Z0-9]/g, ' ');

  return registerUser({
    name,
    email,
    mobile: mobile.length >= 10 ? mobile : `98765432${Math.floor(10 + Math.random() * 89)}`,
    password: password || 'password123',
    role: role || 'client'
  });
}

export function logoutUser() {
  clearAuthSession();
  return { success: true };
}
