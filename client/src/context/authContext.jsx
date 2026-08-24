import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';

import { authService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();

    if (storedUser) {
      setUser(storedUser);
    }

    setLoading(false);
  }, []);

  // -----------------------------
  // LOGIN
  // -----------------------------
  const login = async (credentials) => {
    const data = await authService.login(credentials);

    // Backend returns:
    // {
    //   success: true,
    //   user: {...},
    //   token: "..."
    // }

    setUser(data.user);

    return data;
  };

  // -----------------------------
  // REGISTER
  // -----------------------------
  const register = async (userData) => {
    const data = await authService.register(userData);

    // Backend returns:
    // {
    //   success: true,
    //   user: {...},
    //   token: "..."
    // }

    setUser(data.user);

    return data;
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // -----------------------------
  // UPDATE USER
  // -----------------------------
  const updateUser = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem(
      'user',
      JSON.stringify(updatedUser)
    );
  };

  const value = {
    user,
    loading,

    login,
    register,
    logout,
    updateUser,

    isAuthenticated: !!user,

    isAdmin: user?.role === 'Admin',

    isOrganizer:
      user?.role === 'Organizer' ||
      user?.role === 'Admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};