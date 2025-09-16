// Authentication Service for ISKA RMS
import { supabase } from '@/integrations/supabase/client';
import * as jose from 'jose';

// Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'salesperson' 
  | 'reservationist' 
  | 'accountant' 
  | 'operations_manager' 
  | 'cleaner' 
  | 'student';

export interface Session {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface Permission {
  can_access: boolean;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

// Constants
const SESSION_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const STORAGE_KEYS = {
  SESSION: 'iska_rms_session',
  LAST_ACTIVITY: 'iska_rms_last_activity'
};

class AuthService {
  private currentSession: Session | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeSession();
    this.startSessionMonitoring();
  }

  // Initialize session from localStorage
  private initializeSession() {
    try {
      const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (sessionData) {
        const session: Session = JSON.parse(sessionData);
        if (session.expiresAt && new Date(session.expiresAt) > new Date()) {
          this.currentSession = session;
          this.updateLastActivity();
        } else {
          this.logout();
        }
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      this.logout();
    }
  }

  // Start session monitoring
  private startSessionMonitoring() {
    // Check session every minute
    this.sessionCheckInterval = setInterval(() => {
      this.checkSession();
    }, 60000);
  }

  // Check session validity
  private checkSession() {
    if (!this.currentSession) return;

    const now = new Date();
    const lastActivity = this.getLastActivity();
    const sessionExpiry = new Date(this.currentSession.expiresAt);

    // Check if session has expired or user has been inactive
    if (now > sessionExpiry || (lastActivity && now.getTime() - lastActivity > SESSION_DURATION)) {
      this.logout();
      window.location.href = '/login';
    }
  }

  // Update last activity
  private updateLastActivity() {
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
  }

  // Get last activity timestamp
  private getLastActivity(): number | null {
    const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
    return lastActivity ? parseInt(lastActivity) : null;
  }

  // Login method
  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      // Validate password complexity
      if (password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters long' };
      }

      // Get user from database
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single();

      if (userError || !user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // In production, you should hash passwords and compare hashes
      // For now, we'll use a simple check (replace with proper password hashing)
      if (user.password_hash !== password) {
        await this.logAuditEvent(user.id, 'login_failed', 'auth', null, { email });
        return { success: false, error: 'Invalid email or password' };
      }

      // Create session
      const session = await this.createSession(user);
      if (!session) {
        return { success: false, error: 'Failed to create session' };
      }

      // Log successful login
      await this.logAuditEvent(user.id, 'login_success', 'auth', null, { email });

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  }

  // Create session
  private async createSession(user: User): Promise<Session | null> {
    try {
      const expiresAt = new Date(Date.now() + SESSION_DURATION);
      
      // Create JWT using jose library
      const secret = new TextEncoder().encode(JWT_SECRET);
      const token = await new jose.SignJWT({ 
        userId: user.id, 
        email: user.email, 
        role: user.role
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(expiresAt)
        .sign(secret);

      // Store session in database
      const { error: sessionError } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          session_token: token,
          expires_at: expiresAt.toISOString(),
          ip_address: '127.0.0.1', // In production, get real IP
          user_agent: navigator.userAgent
        });

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        return null;
      }

      const session: Session = {
        user,
        token,
        expiresAt
      };

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      this.currentSession = session;
      this.updateLastActivity();

      return session;
    } catch (error) {
      console.error('Session creation error:', error);
      return null;
    }
  }

  // Logout method
  async logout(): Promise<void> {
    try {
      if (this.currentSession) {
        // Log audit event
        await this.logAuditEvent(this.currentSession.user.id, 'logout', 'auth');

        // Remove session from database
        await supabase
          .from('user_sessions')
          .delete()
          .eq('session_token', this.currentSession.token);

        // Clear current session
        this.currentSession = null;
      }

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Get current session
  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentSession?.user || null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentSession !== null && new Date(this.currentSession.expiresAt) > new Date();
  }

  // Check if user has role
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  // Check module access
  async hasModuleAccess(moduleName: string): Promise<boolean> {
    try {
      const user = this.getCurrentUser();
      if (!user) return false;

      const { data: permission, error } = await supabase
        .from('role_permissions')
        .select('can_access')
        .eq('role_name', user.role)
        .eq('module_name', moduleName)
        .single();

      if (error || !permission) return false;
      return permission.can_access;
    } catch (error) {
      console.error('Module access check error:', error);
      return false;
    }
  }

  // Check page access
  async hasPageAccess(moduleName: string, pagePath?: string): Promise<boolean> {
    try {
      const user = this.getCurrentUser();
      if (!user) return false;

      const { data: permission, error } = await supabase
        .from('role_permissions')
        .select('can_access')
        .eq('role_name', user.role)
        .eq('module_name', moduleName)
        .eq('page_path', pagePath || '*')
        .single();

      if (error || !permission) return false;
      return permission.can_access;
    } catch (error) {
      console.error('Page access check error:', error);
      return false;
    }
  }

  // Get user permissions for a module
  async getModulePermissions(moduleName: string): Promise<Permission | null> {
    try {
      const user = this.getCurrentUser();
      if (!user) return null;

      const { data: permission, error } = await supabase
        .from('role_permissions')
        .select('can_access, can_create, can_read, can_update, can_delete')
        .eq('role_name', user.role)
        .eq('module_name', moduleName)
        .single();

      if (error || !permission) return null;
      return permission;
    } catch (error) {
      console.error('Get permissions error:', error);
      return null;
    }
  }

  // Get accessible modules for current user
  async getAccessibleModules(): Promise<string[]> {
    try {
      const user = this.getCurrentUser();
      if (!user) return [];

      const { data: permissions, error } = await supabase
        .from('role_permissions')
        .select('module_name')
        .eq('role_name', user.role)
        .eq('can_access', true);

      if (error || !permissions) return [];
      return [...new Set(permissions.map(p => p.module_name))];
    } catch (error) {
      console.error('Get accessible modules error:', error);
      return [];
    }
  }

  // Log audit event
  private async logAuditEvent(
    userId: string,
    action: string,
    resourceType?: string,
    resourceId?: string | null,
    details?: any
  ): Promise<void> {
    try {
      await supabase
        .from('audit_logs')
        .insert({
          user_id: userId,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details,
          ip_address: '127.0.0.1', // In production, get real IP
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }

  // Validate JWT token
  async validateToken(token: string): Promise<boolean> {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jose.jwtVerify(token, secret);
      return payload.exp ? payload.exp * 1000 > Date.now() : false;
    } catch (error) {
      return false;
    }
  }

  // Refresh session
  async refreshSession(): Promise<boolean> {
    try {
      const user = this.getCurrentUser();
      if (!user) return false;

      const newSession = await this.createSession(user);
      return newSession !== null;
    } catch (error) {
      console.error('Session refresh error:', error);
      return false;
    }
  }

  // Cleanup on unmount
  cleanup() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
