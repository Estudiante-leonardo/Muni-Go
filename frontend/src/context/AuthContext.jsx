import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../lib/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.ADMIN_ME);
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post(API_ENDPOINTS.ADMIN_LOGOUT);
    } catch {
      // Si falla la llamada al servidor, igual limpiamos estado local
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
