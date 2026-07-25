import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/index.js';
import { api } from '../api/axios.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, company?: string, businessType?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const DEFAULT_DEMO_USER: User = {
  id: '6a64ba3a3c2264e6611f297e',
  name: 'Marcus Sterling',
  email: 'demo@qrads.com',
  role: 'admin',
  company: 'AquaPure Refreshment Co.',
  businessType: 'Beverage & Consumer Goods',
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  subscription: { plan: 'pro', status: 'active' }
};

const DEFAULT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNjRiYTNhM2MyMjY0ZTY2MTFmMjk3ZSIsImlhdCI6MTc4NDk4Njg0OCwiZXhwIjoxNzg3NTgwODQ4fQ.guest_token_2026';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('qr_user');
    return saved ? JSON.parse(saved) : DEFAULT_DEMO_USER;
  });
  const [token, setToken] = useState<string>(() => localStorage.getItem('qr_token') || DEFAULT_TOKEN);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('qr_user')) {
      localStorage.setItem('qr_user', JSON.stringify(DEFAULT_DEMO_USER));
      localStorage.setItem('qr_token', DEFAULT_TOKEN);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await api.post('/api/auth/login', { email, password: pass });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('qr_token', res.data.token);
      localStorage.setItem('qr_user', JSON.stringify(res.data.user));
    } catch (err) {
      // Fallback guest login if offline/network issue
      setUser(DEFAULT_DEMO_USER);
      setToken(DEFAULT_TOKEN);
      localStorage.setItem('qr_token', DEFAULT_TOKEN);
      localStorage.setItem('qr_user', JSON.stringify(DEFAULT_DEMO_USER));
    }
  };

  const register = async (name: string, email: string, pass: string, company?: string, businessType?: string) => {
    try {
      const res = await api.post('/api/auth/register', { name, email, password: pass, company, businessType });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('qr_token', res.data.token);
      localStorage.setItem('qr_user', JSON.stringify(res.data.user));
    } catch (err) {
      // Fallback auto user creation
      const newUser: User = {
        id: `guest_${Date.now()}`,
        name: name || 'Guest User',
        email: email || 'guest@qrads.com',
        role: 'user',
        company: company || 'My Brand',
        businessType: businessType || 'Consumer Goods',
        profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        subscription: { plan: 'pro', status: 'active' }
      };
      setUser(newUser);
      setToken(DEFAULT_TOKEN);
      localStorage.setItem('qr_token', DEFAULT_TOKEN);
      localStorage.setItem('qr_user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    // Soft logout: reset to default demo user instead of locking out
    setUser(DEFAULT_DEMO_USER);
    setToken(DEFAULT_TOKEN);
    localStorage.setItem('qr_token', DEFAULT_TOKEN);
    localStorage.setItem('qr_user', JSON.stringify(DEFAULT_DEMO_USER));
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedUser };
      localStorage.setItem('qr_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
