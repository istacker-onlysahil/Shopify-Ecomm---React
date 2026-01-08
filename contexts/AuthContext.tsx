import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiConfig, Customer } from '../types/index';
import { loginCustomer, createCustomer, recoverCustomerPassword, fetchCustomerData } from '../services/shopify';
import { DEFAULT_CONFIG } from '../config/constants';

interface AuthContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  recover: (email: string) => Promise<void>;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authView: 'login' | 'register' | 'recover';
  setAuthView: (view: 'login' | 'register' | 'recover') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'shopify_customer_token';

export const AuthProvider: React.FC<{ children: React.ReactNode, config?: ApiConfig }> = ({ children, config = DEFAULT_CONFIG }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register' | 'recover'>('login');

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken && config.isStorefrontToken) {
        try {
          const customerData = await fetchCustomerData(config, storedToken);
          setCustomer(customerData);
        } catch (e) {
          // Token invalid or expired
          console.error("Session expired", e);
          localStorage.removeItem(TOKEN_KEY);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [config]);

  const login = async (email: string, password: string) => {
    if (!config.isStorefrontToken) throw new Error("Login requires a Storefront API Token");
    
    const tokenData = await loginCustomer(config, { email, password });
    localStorage.setItem(TOKEN_KEY, tokenData.accessToken);
    
    // Fetch profile immediately
    const customerData = await fetchCustomerData(config, tokenData.accessToken);
    setCustomer(customerData);
    setShowAuthModal(false);
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    if (!config.isStorefrontToken) throw new Error("Registration requires a Storefront API Token");
    
    await createCustomer(config, { email, password, firstName, lastName });
    // Auto login after register
    await login(email, password);
  };

  const recover = async (email: string) => {
    if (!config.isStorefrontToken) throw new Error("Recovery requires a Storefront API Token");
    await recoverCustomerPassword(config, email);
    setAuthView('login');
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{
      customer,
      isAuthenticated: !!customer,
      isLoading,
      login,
      register,
      recover,
      logout,
      showAuthModal,
      setShowAuthModal,
      authView,
      setAuthView
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};