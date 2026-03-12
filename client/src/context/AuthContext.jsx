import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token/get admin profile if needed
      setLoading(false);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
      const response = await axios.post(`${apiUrl}/api/admin/login`, { username, password });
      const { token, admin } = response.data;
      localStorage.setItem('admin_token', token);
      setToken(token);
      setAdmin(admin);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro ao fazer login' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
