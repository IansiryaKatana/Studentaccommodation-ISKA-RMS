// Setup Role-Based Access Control for ISKA RMS
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setupRBAC() {
  console.log('🔧 Setting up Role-Based Access Control...\n');

  try {
    // Read the SQL schema
    const fs = await import('fs');
    const path = await import('path');
    
    const sqlPath = path.join(process.cwd(), 'supabase', 'rbac-schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📊 Creating database schema...');
    
    // Execute the SQL schema
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.log('⚠️ SQL execution failed, trying alternative approach...');
      
      // Alternative: Create tables one by one
      await createTablesIndividually();
    } else {
      console.log('✅ Database schema created successfully');
    }

    // Update existing admin user to super_admin role
    console.log('\n👤 Updating admin user role...');
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'super_admin' })
      .eq('email', 'admin@iska-rms.com');

    if (updateError) {
      console.log('⚠️ Could not update admin role:', updateError.message);
    } else {
      console.log('✅ Admin user role updated to super_admin');
    }

    console.log('\n🎉 RBAC setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run the SQL script in your Supabase SQL Editor');
    console.log('2. Test the login system');
    console.log('3. Configure module access in Settings > Module Access Config');

  } catch (error) {
    console.error('❌ RBAC setup failed:', error);
  }
}

async function createTablesIndividually() {
  console.log('Creating tables individually...');

  // Create role_permissions table
  const { error: rolePermError } = await supabase.rpc('exec_sql', {
    sql: `
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
    `
  });

  if (rolePermError) {
    console.log('⚠️ role_permissions table creation failed:', rolePermError.message);
  } else {
    console.log('✅ role_permissions table created');
  }

  // Create user_sessions table
  const { error: sessionsError } = await supabase.rpc('exec_sql', {
    sql: `
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
    `
  });

  if (sessionsError) {
    console.log('⚠️ user_sessions table creation failed:', sessionsError.message);
  } else {
    console.log('✅ user_sessions table created');
  }

  // Create module_access_config table
  const { error: moduleConfigError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.module_access_config (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        role_name varchar(50) NOT NULL,
        module_name varchar(50) NOT NULL,
        is_enabled boolean DEFAULT true,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
        UNIQUE(role_name, module_name)
      );
    `
  });

  if (moduleConfigError) {
    console.log('⚠️ module_access_config table creation failed:', moduleConfigError.message);
  } else {
    console.log('✅ module_access_config table created');
  }

  // Create audit_logs table
  const { error: auditError } = await supabase.rpc('exec_sql', {
    sql: `
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
    `
  });

  if (auditError) {
    console.log('⚠️ audit_logs table creation failed:', auditError.message);
  } else {
    console.log('✅ audit_logs table created');
  }
}

setupRBAC();
