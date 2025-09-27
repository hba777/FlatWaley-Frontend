'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email?: string;
  token?: string;
  listing_id?: string;
  profile_id?: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: (credential: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
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

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Verify token with backend
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      // TODO: Add API call to verify token with backend
      // For now, we'll just set a mock user
      setUser({
        id: '1',
        username: 'user',
        token: token,
      });
    } catch (error) {
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      const userData = {
        id: data.id,
        username: data.username,
        email: email,
        token: data.token,
        listing_id: data.listing_id,
        profile_id: data.profile_id,
      };

      setUser(userData);
      localStorage.setItem('auth_token', data.token);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/users/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      
      // After successful registration, automatically log in
      const loginResponse = await fetch('http://localhost:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!loginResponse.ok) {
        throw new Error('Registration successful but login failed');
      }

      const loginData = await loginResponse.json();
      const userData = {
        id: loginData.id,
        username: loginData.username,
        email: email,
        token: loginData.token,
        listing_id: loginData.listing_id,
        profile_id: loginData.profile_id,
      };

      setUser(userData);
      localStorage.setItem('auth_token', loginData.token);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (credential: string) => {
    setLoading(true);
    try {
      // For now, we'll create a mock user for Google sign-in
      // In a real implementation, you would verify the credential with Google
      // and then create/login the user in your backend
      
      // Decode the JWT credential to get user info (this is a simplified approach)
      const payload = JSON.parse(atob(credential.split('.')[1]));
      const email = payload.email;
      const name = payload.name;
      
      // Create a username from the email
      const username = email.split('@')[0];
      
      // For now, we'll create a mock user
      // In production, you should verify the credential with Google and handle user creation/login
      const userData: User = {
        id: 'google_' + Date.now(),
        username: username,
        email: email,
        token: 'google_token_' + Date.now(),
        listing_id: undefined,
        profile_id: undefined,
      };

      setUser(userData);
      localStorage.setItem('auth_token', userData.token || '');
      
      // TODO: Implement proper Google credential verification and backend integration
      console.log('Google Sign-In successful:', { email, name, username });
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
    localStorage.setItem('auth_token', 'guest_token');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  const value: UserContextType = {
    user,
    login,
    register,
    signInWithGoogle,
    loginAsGuest,
    logout,
    loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
