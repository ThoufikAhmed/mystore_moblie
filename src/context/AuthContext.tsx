import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { router } from 'expo-router';
import { UserProfile, Address } from '../types';
import { userProfile as initialUserProfile } from '../data/mockData';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile;
  login: () => void;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>(initialUserProfile);

  // Simulate token verification on launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    router.replace('/(tabs)');
  };

  const logout = () => {
    setIsAuthenticated(false);
    router.replace('/(auth)/login');
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addAddress = (newAddr: Omit<Address, 'id'>) => {
    const id = `a_${Date.now()}`;
    setUser((prev) => {
      const addresses = newAddr.isDefault
        ? prev.addresses.map((a) => ({ ...a, isDefault: false }))
        : [...prev.addresses];
      return {
        ...prev,
        addresses: [...addresses, { ...newAddr, id }],
      };
    });
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setUser((prev) => {
      let updatedList = prev.addresses.map((addr) =>
        addr.id === id ? { ...addr, ...updates } : addr
      );
      if (updates.isDefault) {
        updatedList = updatedList.map((addr) =>
          addr.id === id ? { ...addr, isDefault: true } : { ...addr, isDefault: false }
        );
      }
      return { ...prev, addresses: updatedList };
    });
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => {
      const remaining = prev.addresses.filter((addr) => addr.id !== id);
      if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
        remaining[0].isDefault = true;
      }
      return { ...prev, addresses: remaining };
    });
  };

  const setDefaultAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        updateUser,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
