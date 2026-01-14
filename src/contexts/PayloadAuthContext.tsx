"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Types
interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'customer' | 'manager' | 'admin';
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API configuration
const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3001';

class PayloadAuthAPI {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async signIn(email: string, password: string) {
    try {
      const response = await fetch(`${this.baseURL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data };
      }

      return { data };
    } catch (error) {
      return { error: { message: 'Network error' } };
    }
  }

  async signUp(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }) {
    try {
      const response = await fetch(`${this.baseURL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data };
      }

      return { data };
    } catch (error) {
      return { error: { message: 'Network error' } };
    }
  }

  async signOut() {
    try {
      const response = await fetch(`${this.baseURL}/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      return response.ok;
    } catch (error) {
      console.error('Sign out error:', error);
      return false;
    }
  }

  async getCurrentUser() {
    try {
      const response = await fetch(`${this.baseURL}/api/users/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user || null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async updateProfile(updates: any) {
    try {
      const response = await fetch(`${this.baseURL}/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data };
      }

      return { data };
    } catch (error) {
      return { error: { message: 'Network error' } };
    }
  }

  async resetPassword(email: string) {
    try {
      const response = await fetch(`${this.baseURL}/api/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data };
      }

      return { data };
    } catch (error) {
      return { error: { message: 'Network error' } };
    }
  }
}

const authAPI = new PayloadAuthAPI(API_URL);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const PayloadAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await authAPI.getCurrentUser();
        setState({
          user,
          loading: false,
          isAuthenticated: !!user,
        });
      } catch (error) {
        setState({
          user: null,
          loading: false,
          isAuthenticated: false,
        });
      }
    };

    initializeAuth();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const { data, error } = await authAPI.signIn(email, password);

      if (error) {
        setState(prev => ({ ...prev, loading: false }));
        return { error };
      }

      setState({
        user: data.user,
        loading: false,
        isAuthenticated: true,
      });

      return {};
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return { error: { message: 'Sign in failed' } };
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const { data, error } = await authAPI.signUp({
        email,
        password,
        ...metadata,
      });

      if (error) {
        setState(prev => ({ ...prev, loading: false }));
        return { error };
      }

      setState({
        user: data.user,
        loading: false,
        isAuthenticated: true,
      });

      return { data };
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return { error: { message: 'Sign up failed' } };
    }
  };

  // Sign out function
  const signOut = async () => {
    await authAPI.signOut();
    setState({
      user: null,
      loading: false,
      isAuthenticated: false,
    });
  };

  // Update profile function
  const updateProfile = async (updates: any) => {
    try {
      const { data, error } = await authAPI.updateProfile(updates);

      if (error) {
        return { error };
      }

      // Update local state
      setState(prev => ({
        ...prev,
        user: data.user || prev.user,
      }));

      return { data };
    } catch (error) {
      return { error: { message: 'Update profile failed' } };
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await authAPI.resetPassword(email);
      
      if (error) {
        return { error };
      }

      return { data };
    } catch (error) {
      return { error: { message: 'Password reset failed' } };
    }
  };

  const value: AuthContextType = {
    user: state.user,
    loading: state.loading,
    isAuthenticated: state.isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const usePayloadAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('usePayloadAuth must be used within a PayloadAuthProvider');
  }
  return context;
};

// Protected route wrapper
interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: 'customer' | 'manager' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = null,
  requiredRole 
}) => {
  const { isAuthenticated, loading, user } = usePayloadAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Admin route wrapper
interface AdminRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  fallback = null 
}) => {
  return (
    <ProtectedRoute 
      requiredRole="admin" 
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
};

// Manager route wrapper
interface ManagerRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ManagerRoute: React.FC<ManagerRouteProps> = ({ 
  children, 
  fallback = null 
}) => {
  return (
    <ProtectedRoute 
      requiredRole="manager" 
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
};