import React, { createContext, useState, useEffect } from 'react';
import { apiFetch } from '../config/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    apiFetch('/api/auth-check', { method: 'GET', credentials: 'include' })
      .then(({ data }) => {
        if (!mounted) return;
        if (data && data.success) {
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
