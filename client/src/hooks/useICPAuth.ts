import { useState, useEffect, useCallback } from 'react';
import { login, logout, isAuthenticated, getPrincipal } from '@/lib/auth';

export function useICPAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [principal, setPrincipal] = useState<string | undefined>(undefined);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const authed = await isAuthenticated();
      setIsLoggedIn(authed);
      
      if (authed) {
        const principal = await getPrincipal();
        setPrincipal(principal);
      } else {
        setPrincipal(undefined);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsLoggedIn(false);
      setPrincipal(undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = useCallback(async () => {
    const success = await login();
    if (success) {
      await checkAuth();
    }
    return success;
  }, [checkAuth]);

  const handleLogout = useCallback(async () => {
    await logout();
    await checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isLoggedIn,
    principal,
    login: handleLogin,
    logout: handleLogout,
    loading,
    checkAuth
  };
}
