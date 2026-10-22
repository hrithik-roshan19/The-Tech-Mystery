import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../services/auth.service';

export const AuthContext = createContext(null);

export const LegacyAuthProvider = ({ children }) => {
  const [user, setUser] = useState(storage.getUser());
  const [token, setToken] = useState(storage.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = storage.getToken();
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.data.user);
          storage.setUser(res.data.user);
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      } else {
        setUser(null);
        storage.clearAll();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    const clearSession = () => { setUser(null); setToken(null); };
    window.addEventListener('htg:unauthorized', clearSession);
    return () => window.removeEventListener('htg:unauthorized', clearSession);
  }, []);

  const login = (userData, accessToken) => {
    storage.setToken(accessToken);
    storage.setUser(userData);
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    // Capture the credential before clearing local state.
    const tokenToRevoke = storage.getToken();
    if (tokenToRevoke) authService.logout(tokenToRevoke).catch(() => {});
    storage.clearAll();
    setUser(null);
    setToken(null);
  };

  const updateTeamMembership = (teamId, role) => {
    if (user) {
      const updated = { ...user, teamId, role: role || user.role };
      setUser(updated);
      storage.setUser(updated);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN',
    hasTeam: !!user?.teamId,
    loading,
    login,
    logout,
    updateTeamMembership
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export { AuthProvider } from './ClerkAuthProvider';
