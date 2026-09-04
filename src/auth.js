/**
 * FlowCash Google Authentication Manager
 */

const AUTH_STORAGE_KEY = 'flowcash_user_session';

export const DEFAULT_USER = {
  id: 'usr_google_1029384',
  name: 'Tirth Gorasiya',
  email: 'tirth.gorasiya@gmail.com',
  role: 'UI/UX Designer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isGoogleUser: true,
  joinedAt: '2025-01-15',
};

const listeners = new Set();

export const subscribeToAuth = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const notifyAuthListeners = (user) => {
  listeners.forEach(cb => {
    try { cb(user); } catch (e) { console.error(e); }
  });
};

export const getCurrentUser = () => {
  if (typeof window === 'undefined') return DEFAULT_USER;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
};

export const loginWithGoogle = (userData = DEFAULT_USER) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    notifyAuthListeners(userData);
    return userData;
  } catch (err) {
    console.error('Failed to save user session:', err);
    throw err;
  }
};

export const logoutGoogle = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    notifyAuthListeners(null);
  } catch (err) {
    console.error('Failed to remove user session:', err);
  }
};
