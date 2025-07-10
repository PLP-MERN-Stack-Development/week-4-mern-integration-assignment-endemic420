import { useState, useEffect, useCallback } from 'react';
import {jwtDecode} from 'jwt-decode';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeAuth = useCallback(() => {
    console.log('Initializing auth');
    const token = localStorage.getItem('token');
    if (token && !isInitialized) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token on init:', decoded);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded.user);
          console.log('User set:', decoded.user);
        } else {
          console.log('Token expired, removing');
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (err) {
        console.error('Token decode error:', err);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setIsInitialized(true);
    console.log('Auth initialized, isInitialized:', true);
  }, [isInitialized]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (token, userData) => {
    localStorage.setItem('token', token);
    try {
      const decoded = jwtDecode(token);
      console.log('Decoded token on login:', decoded);
      setUser(decoded.user);
      console.log('User set after login:', decoded.user);
      return Promise.resolve();
    } catch (err) {
      console.error('Token decode error on login:', err);
      setUser(userData); // Fallback to userData
      return Promise.resolve();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsInitialized(false);
    console.log('User logged out');
  };

  return { user, login, logout, isInitialized };
};