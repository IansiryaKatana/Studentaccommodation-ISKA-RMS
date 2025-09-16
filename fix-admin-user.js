// Script to add admin user to users table
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://vwgczfdedacpymnxzxcp.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function fixAdminUser() {
  try {
    console.log('Fixing admin user...');
    
    // Step 1: Get the user from auth
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Auth error:', authError);
      return;
    }

    const adminUser = authData.users.find(user => user.email === 'admin@iska-rms.com');
    
    if (!adminUser) {
      console.error('❌ Admin user not found in auth');
      return;
    }

    console.log('Found admin user in auth:', adminUser.id);

    // Step 2: Check if user exists in users table
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@iska-rms.com')
      .maybeSingle();

    if (checkError) {
      console.error('Check error:', checkError);
      return;
    }

    if (existingUser) {
      console.log('✅ Admin user already exists in users table');
      return;
    }

    // Step 3: Create user profile in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: adminUser.id,
          email: 'admin@iska-rms.com',
          first_name: 'Admin',
          last_name: 'User',
          role: 'administrator',
          is_active: true,
          phone: '+1234567890',
          password_hash: 'dummy_hash_for_admin' // Required field
        }
      ])
      .select()
      .single();

    if (userError) {
      console.error('User profile error:', userError);
      return;
    }

    console.log('✅ User profile created:', userData);
    console.log('✅ Admin user fixed successfully!');

  } catch (error) {
    console.error('Error fixing admin user:', error);
  }
}

// Run the function
fixAdminUser();
