import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';
const API_URL = `${API_BASE}/auth`;

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      localStorage.setItem('token', data.token);
      setUser(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (tokenData) => {
    setIsLoading(true);
    try {
      const body = typeof tokenData === 'string' 
        ? { credential: tokenData } 
        : { access_token: tokenData.access_token };

      const response = await fetch(`${API_URL}/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Google login failed');
      }

      localStorage.setItem('token', data.token);
      setUser(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }

      localStorage.setItem('token', data.token);
      setUser(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (userData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to update profile');
    }

    const updatedUser = await response.json();
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const updateAvatar = useCallback(async (avatar) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/avatar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ avatar }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to update avatar');
    }

    const updatedUser = await response.json();
    setUser((prev) => (prev ? { ...prev, avatar: updatedUser.avatar } : null));
    return updatedUser;
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to change password');
    }

    return await response.json();
  }, []);

  const deleteAccount = useCallback(async (password) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/account`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete account');
    }

    localStorage.removeItem('token');
    setUser(null);
    return await response.json();
  }, []);

  const updateUser = useCallback((userData) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        register,
        updateProfile,
        updateAvatar,
        changePassword,
        deleteAccount,
        updateUser,
      }}
    >
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
