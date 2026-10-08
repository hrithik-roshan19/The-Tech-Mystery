import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
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
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData, accessToken) => {
    storage.setToken(accessToken);
    storage.setUser(userData);
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
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
