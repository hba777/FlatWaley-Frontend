'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userApi, type UserResponse } from '@/services/userApi';
import api from '@/utils/api';

interface User {
  id: string;
  username: string;
  email?: string;
  token?: string;
  listing_id?: string;
  profile_id?: string;
  is_verified?: boolean;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<{ message: string }>;
  signInWithGoogle: (credential: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  resendVerificationEmail: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
  verifyEmailWithToken: (token: string, email: string) => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    // Since we're using cookies, we can try to verify the current session
    verifyCurrentSession();
  }, []);

  const verifyCurrentSession = async () => {
    try {
      // Try to get user profile - if cookies are valid, this will work
      const userData = await userApi.getUserProfile('');
      setUser(userData);
    } catch (error) {
      // No valid session found
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const userData = await userApi.verifyToken(token);
      setUser(userData);
    } catch (error) {
      // Token verification failed, clear user state
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await userApi.login({ email: email, password });
      console.log(userData);
      
      // Check if user is verified
      if (!userData.is_verified) {
        // Try to refresh user data in case verification status changed
        try {
          const refreshedUserData = await userApi.getUserProfile('');
          console.log('Refreshed user data:', refreshedUserData);
          
          if (refreshedUserData.is_verified) {
            setUser(refreshedUserData);
            return; // User is now verified, proceed with login
          }
        } catch (refreshError) {
          console.log('Could not refresh user data:', refreshError);
        }
        
        // If still not verified after refresh, throw error
        throw new Error('Please verify your email before signing in. Check your inbox for the verification email.');
      }

      setUser(userData);
      // Cookies are automatically handled by axios
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await userApi.register({ username, email, password });
      
      // Don't automatically log in - user needs to verify email first
      return { message: 'Verification email sent! Please check your inbox and verify your email before signing in.' };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (credential: string) => {
    setLoading(true);
    try {
      const authResponse = await userApi.googleAuth({ id_token: credential });
      
      // Get user profile with the access token
      const userData = await userApi.getUserProfile(authResponse.access_token);
      
      setUser({
        ...userData,
        token: authResponse.access_token,
      });
      // Cookies are automatically handled by axios
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    const guestUser = {
      id: 'guest',
      username: 'Guest User',
      token: 'guest_token',
    };
    setUser(guestUser);
    // Guest mode doesn't use cookies
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear server-side session
      await userApi.logout();
    } catch (error) {
      // Ignore logout errors - still clear local state
    } finally {
      setUser(null);
      // Cookies will be cleared by the server response
    }
  };

  const resendVerificationEmail = async (email: string) => {
    setLoading(true);
    try {
      await userApi.resendVerificationEmail(email);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (!user) return;
    
    try {
      // Get fresh user data from server
      const freshUserData = await userApi.getUserProfile('');
      setUser(freshUserData);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // If refresh fails, user might need to log in again
      setUser(null);
    }
  };

  const verifyEmailWithToken = async (token: string, email: string) => {
    setLoading(true);
    try {
      const result = await userApi.verifyEmailWithToken(token, email);
      
      if (result.access_token) {
        // Get the updated user data using the new token (this will set the cookie)
        const userData = await userApi.getUserProfile(result.access_token);
        setUser({
          ...userData,
          token: result.access_token,
        });
      } else {
        // If no token returned, just refresh user data
        await refreshUserData();
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: UserContextType = {
    user,
    login,
    register,
    signInWithGoogle,
    loginAsGuest,
    logout,
    resendVerificationEmail,
    refreshUserData,
    verifyEmailWithToken,
    loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
