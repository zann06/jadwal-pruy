import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface UserContextType {
  userName: string | null;
  setUserName: (name: string) => void;
  hasSeenIntro: boolean;
  setHasSeenIntro: (seen: boolean) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'jadwal-pruy-user';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserNameState] = useState<string | null>(null);
  const [hasSeenIntro, setHasSeenIntroState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserNameState(data.userName || null);
        setHasSeenIntroState(data.hasSeenIntro || false);
      } catch {
        setHasSeenIntroState(false);
      }
    }
    setIsLoading(false);
  }, []);

  const setUserName = useCallback((name: string) => {
    setUserNameState(name);
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, userName: name }));
  }, []);

  const setHasSeenIntro = useCallback((seen: boolean) => {
    setHasSeenIntroState(seen);
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, hasSeenIntro: seen }));
  }, []);

  return (
    <UserContext.Provider value={{ userName, setUserName, hasSeenIntro, setHasSeenIntro, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

