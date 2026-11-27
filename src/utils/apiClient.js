export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const JWT_TOKEN_KEY = 'overthink_jwt_token';

export function getAuthToken() {
  try {
    return localStorage.getItem(JWT_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(JWT_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(JWT_TOKEN_KEY);
    }
  } catch (err) {
    console.error('[apiClient] Failed to store auth token:', err);
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(JWT_TOKEN_KEY);
  } catch (err) {
    console.error('[apiClient] Failed to clear auth token:', err);
  }
}

export async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    skipAuth = false,
  } = options;

  const requestHeaders = { ...headers };
  const token = !skipAuth ? getAuthToken() : '';

  if (token && !requestHeaders.Authorization) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let requestBody = body;
  if (body !== undefined && !(body instanceof FormData)) {
    if (!requestHeaders['Content-Type']) {
      requestHeaders['Content-Type'] = 'application/json';
    }
    requestBody = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
      method,
      headers: requestHeaders,
      body: requestBody,
    });
  } catch {
    throw new Error('Unable to reach OverThink server. Please ensure the backend is running.');
  }

  let payload = null;
  const rawText = await response.text();
  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = { success: response.ok, message: rawText, data: null };
    }
  }

  if (!response.ok || payload?.success === false) {
    const errorMessage =
      payload?.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMessage);
    err.status = response.status;
    err.data = payload?.data || null;
    err.errors = payload?.data?.errors || null;

    if (
      response.status === 401 &&
      !skipAuth &&
      token &&
      !normalizedEndpoint.startsWith('/auth/login') &&
      !normalizedEndpoint.startsWith('/auth/register')
    ) {
      window.dispatchEvent(new CustomEvent('overthink_unauthorized'));
    }

    throw err;
  }

  return payload || { success: true, message: '', data: null };
}
