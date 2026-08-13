import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import api from '../config/api.js';
import { API_ENDPOINTS } from '../config/constants.js';

// ── Context ────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ───────────────────────────────────────────────
export function AuthProvider({ children }) {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user: clerkUser }               = useUser();

  const [dbUser,    setDbUser]    = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  // ── Inject Clerk token into Axios on every render ─────────
  const injectToken = useCallback(async () => {
    try {
      const token = await getToken();
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete api.defaults.headers.common['Authorization'];
      }
    } catch {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [getToken]);

  // ── Register / fetch the DB user once Clerk is ready ──────
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !clerkUser) {
      setDbUser(null);
      setIsLoading(false);
      return;
    }

    const syncUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await injectToken();

        // 1. Try to get existing user
        const meRes = await api.get(API_ENDPOINTS.AUTH_ME);
        setDbUser(meRes.data?.data || meRes.data);
      } catch (err) {
        if (err.status === 404) {
          // 2. User not in DB yet — register them
          try {
            const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress;
            const registerRes  = await api.post(API_ENDPOINTS.AUTH_REGISTER, {
              clerkId: clerkUser.id,
              email:   primaryEmail,
              name:    clerkUser.fullName || clerkUser.firstName || primaryEmail,
            });
            setDbUser(registerRes.data?.data || registerRes.data);
          } catch (regErr) {
            setError(regErr.message || 'Failed to register user');
          }
        } else {
          setError(err.message || 'Failed to load user profile');
        }
      } finally {
        setIsLoading(false);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, clerkUser, injectToken]);

  // ── Refresh token on each render (Clerk rotates tokens) ───
  useEffect(() => {
    if (isSignedIn) injectToken();
  });

  const refreshUser = async () => {
    if (!isSignedIn) return;
    await injectToken();
    try {
      const res = await api.get(API_ENDPOINTS.AUTH_ME);
      setDbUser(res.data?.data || res.data);
    } catch {
      /* ignore */
    }
  };

  const value = {
    clerkUser,
    dbUser,
    user:          dbUser,
    role:          dbUser?.role || null,
    isAuthenticated: isSignedIn && !!dbUser,
    isLoading:     !isLoaded || isLoading,
    error,
    refreshUser,
    injectToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ───────────────────────────────────────────────────
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}

export default AuthContext;
