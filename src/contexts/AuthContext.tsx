// Authentication Context for ISKA RMS
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, Session, Permission } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasModuleAccess: (moduleName: string) => Promise<boolean>;
  hasPageAccess: (moduleName: string, pagePath?: string) => Promise<boolean>;
  getModulePermissions: (moduleName: string) => Promise<Permission | null>;
  getAccessibleModules: () => Promise<string[]>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentSession = authService.getCurrentSession();
        const currentUser = authService.getCurrentUser();

        if (currentSession && currentUser && authService.isAuthenticated()) {
          setSession(currentSession);
          setUser(currentUser);
        } else {
          // Clear any invalid session
          authService.logout();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      authService.cleanup();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      
      if (result.success && result.user) {
        const currentSession = authService.getCurrentSession();
        setUser(result.user);
        setSession(currentSession);
        
        // Redirect based on user role
        if (result.user.role === 'student') {
          window.location.href = '/student-portal';
        } else {
          window.location.href = '/';
        }
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setSession(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Role checking functions
  const hasRole = (role: string) => {
    return authService.hasRole(role as any);
  };

  const hasAnyRole = (roles: string[]) => {
    return authService.hasAnyRole(roles as any);
  };

  // Access checking functions
  const hasModuleAccess = async (moduleName: string) => {
    return await authService.hasModuleAccess(moduleName);
  };

  const hasPageAccess = async (moduleName: string, pagePath?: string) => {
    return await authService.hasPageAccess(moduleName, pagePath);
  };

  const getModulePermissions = async (moduleName: string) => {
    return await authService.getModulePermissions(moduleName);
  };

  const getAccessibleModules = async () => {
    return await authService.getAccessibleModules();
  };

  const refreshSession = async () => {
    return await authService.refreshSession();
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: authService.isAuthenticated(),
    isLoading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    hasModuleAccess,
    hasPageAccess,
    getModulePermissions,
    getAccessibleModules,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for role-based access control
export function useRoleAccess() {
  const { hasRole, hasAnyRole, hasModuleAccess, hasPageAccess, getModulePermissions } = useAuth();
  return {
    hasRole,
    hasAnyRole,
    hasModuleAccess,
    hasPageAccess,
    getModulePermissions
  };
}

// Hook for module access
export function useModuleAccess() {
  const { hasModuleAccess, getAccessibleModules } = useAuth();
  const [accessibleModules, setAccessibleModules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAccessibleModules = async () => {
      try {
        const modules = await getAccessibleModules();
        setAccessibleModules(modules);
      } catch (error) {
        console.error('Error loading accessible modules:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccessibleModules();
  }, [getAccessibleModules]);

  return {
    accessibleModules,
    isLoading,
    hasModuleAccess,
    refreshModules: () => getAccessibleModules().then(setAccessibleModules)
  };
}
