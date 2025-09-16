// Comprehensive System Analysis for ISKA RMS
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

async function analyzeSystem() {
  console.log('🔍 ISKA RMS SYSTEM ANALYSIS');
  console.log('==========================\n');

  try {
    // 1. Analyze Database Schema
    console.log('📊 DATABASE SCHEMA ANALYSIS');
    console.log('---------------------------');
    
    const tables = [
      'users', 'students', 'invoices', 'payments', 'studios', 
      'room_grades', 'student_agreements', 'module_styles', 
      'branding', 'subscribers', 'installment_plans', 'student_installments'
    ];

    for (const table of tables) {
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

    // 2. Analyze Current User Roles
    console.log('\n👥 USER ROLES ANALYSIS');
    console.log('----------------------');
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('role, is_active')
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
    }

    // 3. Analyze Module Structure
    console.log('\n📁 MODULE STRUCTURE ANALYSIS');
    console.log('----------------------------');
    
    const modules = [
      'leads', 'ota-bookings', 'students', 'studios', 
      'cleaning', 'finance', 'data', 'settings', 
      'web-access', 'branding'
    ];
    
    console.log('Available modules:');
    modules.forEach(module => {
      console.log(`  - ${module}`);
    });

    // 4. Check for RLS Policies
    console.log('\n🔒 RLS POLICIES ANALYSIS');
    console.log('------------------------');
    
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_rls_policies');
    
    if (policiesError) {
      console.log('❌ RLS policies check failed (function may not exist)');
      console.log('   This is expected if RLS was disabled');
    } else {
      console.log(`✅ Found ${policies?.length || 0} RLS policies`);
    }

    // 5. Authentication Status
    console.log('\n🔐 AUTHENTICATION STATUS');
    console.log('------------------------');
    console.log('❌ Authentication is currently disabled (using mock user)');
    console.log('✅ Ready to implement role-based access control');

    // 6. Recommendations
    console.log('\n💡 RECOMMENDATIONS');
    console.log('------------------');
    console.log('1. Create role_permissions table for module access control');
    console.log('2. Create user_sessions table for session management');
    console.log('3. Implement authentication context and providers');
    console.log('4. Add module access configuration page');
    console.log('5. Implement role-based routing and component protection');
    console.log('6. Add login/logout functionality');
    console.log('7. Create student portal redirect logic');

  } catch (error) {
    console.error('❌ Analysis failed:', error);
  }
}

analyzeSystem();
