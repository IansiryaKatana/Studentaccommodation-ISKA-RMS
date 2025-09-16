-- Role-Based Access Control Schema for ISKA RMS
-- Run this in your Supabase SQL Editor

-- 1. Create role_permissions table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    role_name varchar(50) NOT NULL,
    module_name varchar(50) NOT NULL,
    page_path varchar(100),
    can_access boolean DEFAULT false,
    can_create boolean DEFAULT false,
    can_read boolean DEFAULT false,
    can_update boolean DEFAULT false,
    can_delete boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(role_name, module_name, page_path)
);

-- 2. Create user_sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    session_token text NOT NULL UNIQUE,
    expires_at timestamp with time zone NOT NULL,
    ip_address inet,
    user_agent text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create module_access_config table
CREATE TABLE IF NOT EXISTS public.module_access_config (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    role_name varchar(50) NOT NULL,
    module_name varchar(50) NOT NULL,
    is_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(role_name, module_name)
);

-- 4. Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    action varchar(100) NOT NULL,
    resource_type varchar(50),
    resource_id uuid,
    details jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON public.role_permissions(role_name);
CREATE INDEX IF NOT EXISTS idx_role_permissions_module ON public.role_permissions(module_name);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON public.user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- 6. Create trigger functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Create triggers
DROP TRIGGER IF EXISTS update_role_permissions_updated_at ON public.role_permissions;
CREATE TRIGGER update_role_permissions_updated_at 
    BEFORE UPDATE ON public.role_permissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_sessions_updated_at ON public.user_sessions;
CREATE TRIGGER update_user_sessions_updated_at 
    BEFORE UPDATE ON public.user_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_module_access_config_updated_at ON public.module_access_config;
CREATE TRIGGER update_module_access_config_updated_at 
    BEFORE UPDATE ON public.module_access_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Insert default role permissions
INSERT INTO public.role_permissions (role_name, module_name, page_path, can_access, can_create, can_read, can_update, can_delete) VALUES
-- Super Admin: All modules + Module Access Config
('super_admin', 'leads', '*', true, true, true, true, true),
('super_admin', 'ota-bookings', '*', true, true, true, true, true),
('super_admin', 'students', '*', true, true, true, true, true),
('super_admin', 'studios', '*', true, true, true, true, true),
('super_admin', 'cleaning', '*', true, true, true, true, true),
('super_admin', 'finance', '*', true, true, true, true, true),
('super_admin', 'data', '*', true, true, true, true, true),
('super_admin', 'settings', '*', true, true, true, true, true),
('super_admin', 'web-access', '*', true, true, true, true, true),
('super_admin', 'branding', '*', true, true, true, true, true),
('super_admin', 'student-portal', '*', true, true, true, true, true),

-- Admin: All modules except Module Access Config
('admin', 'leads', '*', true, true, true, true, true),
('admin', 'ota-bookings', '*', true, true, true, true, true),
('admin', 'students', '*', true, true, true, true, true),
('admin', 'studios', '*', true, true, true, true, true),
('admin', 'cleaning', '*', true, true, true, true, true),
('admin', 'finance', '*', true, true, true, true, true),
('admin', 'data', '*', true, true, true, true, true),
('admin', 'settings', '*', true, true, true, true, false),
('admin', 'web-access', '*', true, true, true, true, true),
('admin', 'branding', '*', true, true, true, true, true),
('admin', 'student-portal', '*', true, true, true, true, true),

-- Salesperson: Leads, Students, Studios
('salesperson', 'leads', '*', true, true, true, true, false),
('salesperson', 'students', '*', true, true, true, true, false),
('salesperson', 'studios', '*', true, false, true, false, false),

-- Reservationist: OTA Bookings, Students, Studios
('reservationist', 'ota-bookings', '*', true, true, true, true, false),
('reservationist', 'students', '*', true, true, true, true, false),
('reservationist', 'studios', '*', true, false, true, false, false),

-- Accountant: Finance, Students
('accountant', 'finance', '*', true, true, true, true, false),
('accountant', 'students', '*', true, false, true, false, false),

-- Operations Manager: All except Finance, Module Access Config
('operations_manager', 'leads', '*', true, true, true, true, true),
('operations_manager', 'ota-bookings', '*', true, true, true, true, true),
('operations_manager', 'students', '*', true, true, true, true, true),
('operations_manager', 'studios', '*', true, true, true, true, true),
('operations_manager', 'cleaning', '*', true, true, true, true, true),
('operations_manager', 'data', '*', true, true, true, true, true),
('operations_manager', 'settings', '*', true, true, true, true, false),
('operations_manager', 'web-access', '*', true, true, true, true, true),
('operations_manager', 'branding', '*', true, true, true, true, true),
('operations_manager', 'student-portal', '*', true, true, true, true, true),

-- Cleaner: Cleaning, Studios
('cleaner', 'cleaning', '*', true, true, true, true, false),
('cleaner', 'studios', '*', true, false, true, false, false),

-- Student: Student Portal only
('student', 'student-portal', '*', true, false, true, false, false)
ON CONFLICT (role_name, module_name, page_path) DO NOTHING;

-- 9. Insert default module access config
INSERT INTO public.module_access_config (role_name, module_name, is_enabled) VALUES
('super_admin', 'leads', true),
('super_admin', 'ota-bookings', true),
('super_admin', 'students', true),
('super_admin', 'studios', true),
('super_admin', 'cleaning', true),
('super_admin', 'finance', true),
('super_admin', 'data', true),
('super_admin', 'settings', true),
('super_admin', 'web-access', true),
('super_admin', 'branding', true),
('super_admin', 'student-portal', true),

('admin', 'leads', true),
('admin', 'ota-bookings', true),
('admin', 'students', true),
('admin', 'studios', true),
('admin', 'cleaning', true),
('admin', 'finance', true),
('admin', 'data', true),
('admin', 'settings', true),
('admin', 'web-access', true),
('admin', 'branding', true),
('admin', 'student-portal', true),

('salesperson', 'leads', true),
('salesperson', 'students', true),
('salesperson', 'studios', true),

('reservationist', 'ota-bookings', true),
('reservationist', 'students', true),
('reservationist', 'studios', true),

('accountant', 'finance', true),
('accountant', 'students', true),

('operations_manager', 'leads', true),
('operations_manager', 'ota-bookings', true),
('operations_manager', 'students', true),
('operations_manager', 'studios', true),
('operations_manager', 'cleaning', true),
('operations_manager', 'data', true),
('operations_manager', 'settings', true),
('operations_manager', 'web-access', true),
('operations_manager', 'branding', true),
('operations_manager', 'student-portal', true),

('cleaner', 'cleaning', true),
('cleaner', 'studios', true),

('student', 'student-portal', true)
ON CONFLICT (role_name, module_name) DO NOTHING;
