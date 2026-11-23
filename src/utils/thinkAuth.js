/**
 * OverThink Local Authentication & User Management Service (Frontend Only)
 * 
 * Implements a pure client-side simulated auth system using LocalStorage.
 * Handles:
 * - User Registration (4-step workflow with simulated OTP)
 * - User Login (Email or Mobile + Password, NO OTP on normal login)
 * - Role-based authorization & route destination identification
 * - Session Persistence across browser refreshes via 'think_auth_session'
 * 
 * DISCLAIMER:
 * This is a frontend-only demonstration architecture designed for rapid local testing.
 * Passwords and OTPs are simulated locally and must be backed by a secure backend API in production.
 */

import {
  STORAGE_KEYS,
  getUsers,
  getUserById,
  getActiveUser,
  setActiveUser,
  updateUser,
  getAuthSession,
  setAuthSession,
  clearAuthSession
} from './thinkStorage';

// In-memory simulated OTP store with timestamps and limits
// Key: normalized identifier (email or mobile), Value: { otp, expiresAt, resendCount }
const OTP_STORE = {};
const OTP_EXPIRY_SECONDS = 120; // 2 minutes expiry
const MAX_RESEND_LIMIT = 3;

/**
 * Normalizes email or mobile for safe lookup
 */
export function normalizeIdentifier(val) {
  if (!val) return '';
  const trimmed = val.trim();
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  // Strip non-numeric chars for mobile numbers
  return trimmed.replace(/\D/g, '');
}

/**
 * Checks whether an account is currently authenticated.
 * Restores and verifies active session from LocalStorage.
 */
export function isAuthenticated() {
  const session = getAuthSession();
  if (!session || !session.isAuthenticated || !session.userId) {
    return false;
  }
  const user = getUserById(session.userId);
  return !!user;
}

/**
 * Returns the currently authenticated user object, or null.
 */
export function getCurrentUser() {
  const session = getAuthSession();
  if (!session || !session.userId) return null;
  return getUserById(session.userId);
}

/**
 * Returns the role of the authenticated user ('client' | 'consultant'), or null.
 */
export function getUserRole() {
  const user = getCurrentUser();
  if (user) return user.role;
  const session = getAuthSession();
  return session?.role || null;
}

/**
 * Returns the appropriate dashboard route tab name based on user role.
 * Client -> 'chat' (Client Workspace)
 * Consultant -> 'browse_thoughts' (Client Thinks / Consultant Discovery Portal)
 */
export function redirectByRole(role) {
  if (role === 'consultant') {
    return 'browse_thoughts';
  }
  return 'chat';
}

/**
 * Generates a simulated 6-digit OTP for registration verification.
 */
export function generateOTP(emailOrMobile) {
  const key = normalizeIdentifier(emailOrMobile);
  if (!key) return null;

  // Generate a random 6-digit number
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

/**
 * Resends a registration OTP with count limit enforcement.
 */
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

/**
 * Verifies the 6-digit registration OTP.
 */
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
    // If no OTP was generated yet, generate one for the tester
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

/**
 * Registers a new user following 4-step validation.
 * Checks for duplicate email or mobile.
 */
export function registerUser(userData) {
  const users = getUsers();
  const normalizedEmail = (userData.email || '').trim().toLowerCase();
  const cleanMobile = (userData.mobile || '').trim().replace(/\D/g, '');

  // 1. Validation checks
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

  // 2. Duplicate checks
  const existingEmail = users.find(u => u.email && u.email.toLowerCase() === normalizedEmail);
  if (existingEmail) {
    return { success: false, error: 'This email address is already registered. Please sign in instead.' };
  }

  const existingMobile = users.find(u => u.mobile && u.mobile.replace(/\D/g, '') === cleanMobile);
  if (existingMobile) {
    return { success: false, error: 'This mobile number is already registered. Please sign in instead.' };
  }

  // 3. Create user record
  const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newUser = {
    id,
    name: userData.name.trim(),
    email: normalizedEmail,
    mobile: cleanMobile,
    password: userData.password,
    role: userData.role,
    isVerified: true,
    title: userData.title || (userData.role === 'consultant' ? 'Professional Consultant' : 'Client Member'),
    hourlyRate: userData.hourlyRate ? Number(userData.hourlyRate) : (userData.role === 'consultant' ? 120 : undefined),
    bio: userData.bio || '',
    skills: userData.skills || [],
    avatar: userData.avatar || userData.profileImage || null,
    profileImage: userData.profileImage || userData.avatar || null,
    label: userData.role === 'consultant' ? 'Consultant' : 'Client',
    createdAt: new Date().toISOString()
  };

  // Add to think_users
  const updatedUsers = [...users, newUser];
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    window.dispatchEvent(new CustomEvent('think_storage_updated', { detail: { key: STORAGE_KEYS.USERS, data: updatedUsers } }));
  } catch (err) {
    console.error('Error saving user in storage:', err);
  }

  // 4. Create active session and set active user
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

/**
 * Logs in a user using Email OR Mobile number + Password.
 * Strictly NO OTP is required during regular login as specified in Requirement 4.
 * Automatically identifies user role from the stored account (never asks user to select role on login).
 */
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

  // Search by email, mobile, or username/demo match
  const user = users.find(u => {
    if (normalizedEmail && u.email) {
      const uEmail = u.email.toLowerCase();
      if (uEmail === normalizedEmail) return true;
      // Cross-match @overthink.platform and legacy @think.platform
      if (normalizedEmail.replace('@overthink.platform', '') === uEmail.replace('@think.platform', '')) return true;
      if (normalizedEmail.replace('@think.platform', '') === uEmail.replace('@overthink.platform', '')) return true;
    }
    // Match username prefix (e.g. "alex.morgan" matches "alex.morgan@overthink.platform")
    if (rawId && u.email && u.email.toLowerCase().startsWith(rawId.toLowerCase() + '@')) {
      return true;
    }
    // Match by ID or Name for demo convenience
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
      error: 'Account not registered in local storage.'
    };
  }

  // Check password
  if (user.password && user.password !== password) {
    return {
      success: false,
      error: 'Incorrect password. Please verify and try again.'
    };
  }

  // Check verification status
  if (user.isVerified === false) {
    return {
      success: false,
      error: 'Your account is not verified yet. Please complete verification.'
    };
  }

  // Set active user and active session
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

/**
 * Allows instantaneous local registration for testing if a user enters new credentials on the login screen.
 * Saves email, password, and profile directly into LocalStorage ('think_users').
 */
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

/**
 * Logs out the active user, clears 'think_auth_session' and resets active user.
 */
export function logoutUser() {
  clearAuthSession();
  return { success: true };
}
