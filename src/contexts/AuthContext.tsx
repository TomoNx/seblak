import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check session storage on initial load
    return sessionStorage.getItem('seblak_auth') === 'true';
  });

  const login = async (pin: string) => {
    try {
      const success = await api.verifyAdminPin(pin);
      if (success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('seblak_auth', 'true');
        return true;
      }
      return false;
    } catch (err) {
      console.error("Auth error:", err);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('seblak_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
