"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// User interface extending Supabase User
interface AuthUser extends User {
  role?: string
  firstName?: string
  lastName?: string
}

// Auth state interface
interface AuthState {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
}

// Auth context interface
interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: any) => Promise<{ error?: any }>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  })

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        user: session?.user as AuthUser || null,
        loading: false,
        isAuthenticated: !!session?.user,
      }))
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user as AuthUser || null
        
        setState({
          user,
          loading: false,
          isAuthenticated: !!user,
        })

        // Handle sign out
        if (event === 'SIGNED_OUT') {
          // Clear any cached data
          localStorage.removeItem('elecromart-cart')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      return {}
    } catch (error) {
      return { error }
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        return { error }
      }

      return { data }
    } catch (error) {
      return { error }
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // Update profile function
  const updateProfile = async (updates: any) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      })

      if (error) {
        return { error }
      }

      return { data }
    } catch (error) {
      return { error }
    }
  }

  const value: AuthContextType = {
    user: state.user,
    loading: state.loading,
    isAuthenticated: state.isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Protected route wrapper
interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = null 
}) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback
  }

  return <>{children}</>
}

// Customer registration helper - simplified for client-side use
export const createCustomerProfile = async (user: AuthUser, customerData: any) => {
  try {
    // For now, just log and return success
    // In a full implementation, you'd call an API route that handles customer creation
    console.log('Creating customer profile:', customerData)

    // TODO: Call /api/customers endpoint when implemented
    // const response = await fetch('/api/customers', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId: user.id, ...customerData })
    // })

    return { success: true }
  } catch (error) {
    console.error('Error creating customer profile:', error)
    return { error }
  }
}
