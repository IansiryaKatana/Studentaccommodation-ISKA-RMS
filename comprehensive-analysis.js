// Comprehensive Database and Module Analysis for ISKA RMS
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

async function comprehensiveAnalysis() {
  console.log('🔍 COMPREHENSIVE ISKA RMS ANALYSIS');
  console.log('==================================\n');

  try {
    // 1. Get all tables from information_schema
    console.log('📊 DATABASE SCHEMA ANALYSIS');
    console.log('---------------------------');
    
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_all_tables');
    
    if (tablesError) {
      // Fallback: manually check known tables
      console.log('Using fallback table analysis...');
      const knownTables = [
        'users', 'students', 'invoices', 'payments', 'studios', 
        'room_grades', 'student_agreements', 'module_styles', 
        'branding', 'subscribers', 'installment_plans', 'student_installments',
        'tourist_profiles', 'reservations', 'cleaning_tasks', 'cleaning_schedules',
        'user_roles', 'role_permissions', 'user_sessions', 'module_access_config',
        'student_option_fields', 'pricing_matrix', 'site_leads', 'notifications',
        'audit_logs', 'system_settings', 'email_templates', 'sms_templates'
      ];
      
      for (const table of knownTables) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          const { count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          console.log(`✅ ${table}: ${count || 0} records`);
        }
      }
    } else {
      console.log(`Found ${tables.length} tables:`);
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }

    // 2. Analyze Dashboard Modules
    console.log('\n📁 DASHBOARD MODULES ANALYSIS');
    console.log('-----------------------------');
    
    // Get modules from MainLayout
    const dashboardModules = [
      'leads', 'ota-bookings', 'students', 'studios', 
      'cleaning', 'finance', 'data', 'settings', 
      'web-access', 'branding', 'student-portal'
    ];
    
    console.log('Dashboard modules:');
    dashboardModules.forEach((module, index) => {
      console.log(`  ${index + 1}. ${module}`);
    });

    // 3. Analyze Current User Roles
    console.log('\n👥 USER ROLES ANALYSIS');
    console.log('----------------------');
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('role, is_active, email')
      .order('role');
    
    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
    } else {
      const roleCounts = {};
      users.forEach(user => {
        roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
      });
      
      console.log('Current user roles:');
      Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`  - ${role}: ${count} users`);
      });
      
      console.log('\nUser details:');
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role}) - ${user.is_active ? 'Active' : 'Inactive'}`);
      });
    }

    // 4. Check Module Styles Configuration
    console.log('\n🎨 MODULE STYLES ANALYSIS');
    console.log('-------------------------');
    
    const { data: moduleStyles, error: stylesError } = await supabase
      .from('module_styles')
      .select('*')
      .order('module_name');
    
    if (stylesError) {
      console.log('❌ Error fetching module styles:', stylesError.message);
    } else {
      console.log(`Found ${moduleStyles.length} module style configurations:`);
      moduleStyles.forEach(style => {
        console.log(`  - ${style.module_name}: ${style.gradient_colors || 'No gradient'}`);
      });
    }

    // 5. Analyze Branding Configuration
    console.log('\n🏢 BRANDING ANALYSIS');
    console.log('-------------------');
    
    const { data: branding, error: brandingError } = await supabase
      .from('branding')
      .select('*');
    
    if (brandingError) {
      console.log('❌ Error fetching branding:', brandingError.message);
    } else {
      console.log(`Found ${branding.length} branding configurations:`);
      branding.forEach(brand => {
        console.log(`  - Company: ${brand.company_name || 'Not set'}`);
        console.log(`  - Address: ${brand.address || 'Not set'}`);
        console.log(`  - Coordinates: ${brand.latitude || 'N/A'}, ${brand.longitude || 'N/A'}`);
      });
    }

    // 6. Check for RLS and Auth Status
    console.log('\n🔒 SECURITY ANALYSIS');
    console.log('-------------------');
    console.log('❌ RLS is currently disabled (as intended)');
    console.log('❌ Authentication is disabled (using mock user)');
    console.log('✅ Ready for role-based access control implementation');

    // 7. Detailed Recommendations
    console.log('\n💡 DETAILED RECOMMENDATIONS');
    console.log('---------------------------');
    console.log('1. Create role_permissions table for module access control');
    console.log('2. Create user_sessions table for session management');
    console.log('3. Create module_access_config table for Super Admin configuration');
    console.log('4. Implement authentication context and providers');
    console.log('5. Add module access configuration page to Settings');
    console.log('6. Implement role-based routing and component protection');
    console.log('7. Add login/logout functionality');
    console.log('8. Create student portal redirect logic');
    console.log('9. Set up proper user role management');
    console.log('10. Implement audit logging for security');

    // 8. Module Access Mapping
    console.log('\n🗺️ PROPOSED MODULE ACCESS MAPPING');
    console.log('--------------------------------');
    console.log('Super Admin: All modules + Module Access Config');
    console.log('Admin: All modules except Module Access Config');
    console.log('Salesperson: Leads, Students, Studios');
    console.log('Reservationist: OTA Bookings, Students, Studios');
    console.log('Accountant: Finance, Students');
    console.log('Operations Manager: All except Finance, Module Access Config');
    console.log('Cleaner: Cleaning, Studios');
    console.log('Student: Student Portal only');

  } catch (error) {
    console.error('❌ Analysis failed:', error);
  }
}

comprehensiveAnalysis();
