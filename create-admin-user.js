// Script to create admin user in Supabase
// Run this as a Node.js script

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

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@iska-rms.com',
      password: 'password123',
      email_confirm: true
    });

    if (authError) {
      console.error('Auth error:', authError);
      return;
    }

    console.log('Auth user created:', authData);

    // Step 2: Create user profile in users table
    if (authData.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: 'admin@iska-rms.com',
            first_name: 'Admin',
            last_name: 'User',
            role: 'administrator',
            is_active: true,
            phone: '+1234567890'
          }
        ])
        .select()
        .single();

      if (userError) {
        console.error('User profile error:', userError);
        return;
      }

      console.log('User profile created:', userData);
      console.log('✅ Admin user created successfully!');
      console.log('Email: admin@iska-rms.com');
      console.log('Password: password123');
    }

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the function
createAdminUser(); 