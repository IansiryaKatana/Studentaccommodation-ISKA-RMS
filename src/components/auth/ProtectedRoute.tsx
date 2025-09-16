// Protected Route Component for ISKA RMS
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredRoles?: string[];
  requiredModule?: string;
  requiredPage?: string;
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredRoles,
  requiredModule,
  requiredPage,
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, hasRole, hasAnyRole, hasModuleAccess, hasPageAccess } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      if (isLoading) return;

      setIsCheckingAccess(true);

      try {
        // Check authentication
        if (!isAuthenticated || !user) {
          setHasAccess(false);
          return;
        }

        // Check role requirements
        if (requiredRole && !hasRole(requiredRole)) {
          setHasAccess(false);
          return;
        }

        if (requiredRoles && !hasAnyRole(requiredRoles)) {
          setHasAccess(false);
          return;
        }

        // Check module access
        if (requiredModule) {
          const moduleAccess = await hasModuleAccess(requiredModule);
          if (!moduleAccess) {
            setHasAccess(false);
            return;
          }
        }

        // Check page access
        if (requiredModule && requiredPage) {
          const pageAccess = await hasPageAccess(requiredModule, requiredPage);
          if (!pageAccess) {
            setHasAccess(false);
            return;
          }
        }

        setHasAccess(true);
      } catch (error) {
        console.error('Access check error:', error);
        setHasAccess(false);
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkAccess();
  }, [isLoading, isAuthenticated, user, requiredRole, requiredRoles, requiredModule, requiredPage, hasRole, hasAnyRole, hasModuleAccess, hasPageAccess]);

  // Show loading while checking authentication
  if (isLoading || isCheckingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Redirect if access denied
  if (hasAccess === false) {
    // Redirect students to their portal
    if (user?.role === 'student') {
      return <Navigate to="/student-portal" replace />;
    }
    
    // Redirect others to dashboard
    return <Navigate to="/" replace />;
  }

  // Show children if access granted
  if (hasAccess === true) {
    return <>{children}</>;
  }

  // Show loading while determining access
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Checking permissions...</p>
      </div>
    </div>
  );
}

// Role-based route component
export function RoleRoute({ 
  children, 
  role, 
  fallbackPath = '/' 
}: { 
  children: React.ReactNode; 
  role: string; 
  fallbackPath?: string; 
}) {
  return (
    <ProtectedRoute requiredRole={role} fallbackPath={fallbackPath}>
      {children}
    </ProtectedRoute>
  );
}

// Module-based route component
export function ModuleRoute({ 
  children, 
  module, 
  page,
  fallbackPath = '/' 
}: { 
  children: React.ReactNode; 
  module: string; 
  page?: string;
  fallbackPath?: string; 
}) {
  return (
    <ProtectedRoute 
      requiredModule={module} 
      requiredPage={page}
      fallbackPath={fallbackPath}
    >
      {children}
    </ProtectedRoute>
  );
}

// Student-only route component
export function StudentRoute({ 
  children 
}: { 
  children: React.ReactNode; 
}) {
  return (
    <ProtectedRoute requiredRole="student" fallbackPath="/">
      {children}
    </ProtectedRoute>
  );
}

// Admin-only route component
export function AdminRoute({ 
  children 
}: { 
  children: React.ReactNode; 
}) {
  return (
    <ProtectedRoute 
      requiredRoles={['super_admin', 'admin']} 
      fallbackPath="/"
    >
      {children}
    </ProtectedRoute>
  );
}
