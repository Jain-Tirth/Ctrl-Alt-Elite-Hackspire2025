"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user types
export type UserType = 'admin' | 'customer' | 'staff';

// Define session data structure
export interface SessionData {
  isLoggedIn: boolean;
  userType: UserType | null;
  userId: string | null;
  userName: string | null;
  email: string | null;
}

// Define context interface
interface SessionContextType {
  session: SessionData;
  login: (userData: Omit<SessionData, 'isLoggedIn'>) => void;
  logout: () => void;
}

// Create initial session state
const initialSession: SessionData = {
  isLoggedIn: false,
  userType: null,
  userId: null,
  userName: null,
  email: null
};

// Create context
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Session provider component
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData>(() => {
    // Check if we're in the browser and try to load session from localStorage
    if (typeof window !== 'undefined') {
      const savedSession = localStorage.getItem('userSession');
      if (savedSession) {
        try {
          return JSON.parse(savedSession);
        } catch (e) {
          console.error('Failed to parse session data:', e);
        }
      }
    }
    return initialSession;
  });

  // Save session to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userSession', JSON.stringify(session));
    }
  }, [session]);

  // Login function
  const login = (userData: Omit<SessionData, 'isLoggedIn'>) => {
    setSession({
      ...userData,
      isLoggedIn: true
    });
  };

  // Logout function
  const logout = () => {
    setSession(initialSession);
  };

  return (
    <SessionContext.Provider value={{ session, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

// Custom hook to use the session context
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
