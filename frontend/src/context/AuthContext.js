import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sahai_token');
    if (token) {
      api.get('/auth/me')
        .then(r => setUser(r.data))
        .catch(() => localStorage.removeItem('sahai_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('sahai_token', res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (email, password, name) => {
    const res = await api.post('/auth/register', { email, password, name });
    localStorage.setItem('sahai_token', res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('sahai_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
