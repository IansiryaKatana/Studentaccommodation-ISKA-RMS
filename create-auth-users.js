// Node.js script to create users in Supabase Authentication
// Run this with: node create-auth-users.js

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://vwgczfdedacpymnxzxcp.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "YOUR_SERVICE_ROLE_KEY"; // You need to get this from Supabase Dashboard

// Create admin client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  try {
    console.log('Creating admin user in Supabase Auth...');
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@iska-rms.com',
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'User',
        role: 'administrator'
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return;
    }

    console.log('✅ Admin user created in Auth:', authData);
    console.log('Email: admin@iska-rms.com');
    console.log('Password: password123');

    // Now create/update the user in our users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert([{
        id: authData.user.id,
        email: 'admin@iska-rms.com',
        first_name: 'Admin',
        last_name: 'User',
        role: 'administrator',
        is_active: true,
        phone: '+1234567890'
      }])
      .select()
      .single();

    if (userError) {
      console.error('User table error:', userError);
    } else {
      console.log('✅ User created in users table:', userData);
    }

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Alternative: Create multiple users
async function createMultipleUsers() {
  const users = [
    {
      email: 'admin@iska-rms.com',
      password: 'password123',
      first_name: 'Admin',
      last_name: 'User',
      role: 'administrator'
    },
    {
      email: 'sales@iska-rms.com',
      password: 'password123',
      first_name: 'Sales',
      last_name: 'Manager',
      role: 'salesperson'
    },
    {
      email: 'cleaner@iska-rms.com',
      password: 'password123',
      first_name: 'Cleaner',
      last_name: 'Staff',
      role: 'cleaner'
    }
  ];

  for (const user of users) {
    try {
      console.log(`Creating user: ${user.email}`);
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        }
      });

      if (authError) {
        console.error(`Error creating ${user.email}:`, authError);
        continue;
      }

      // Create in users table
      const { error: userError } = await supabase
        .from('users')
        .upsert([{
          id: authData.user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          is_active: true,
          phone: '+1234567890'
        }]);

      if (userError) {
        console.error(`Error creating user record for ${user.email}:`, userError);
      } else {
        console.log(`✅ Created user: ${user.email}`);
      }

    } catch (error) {
      console.error(`Error processing ${user.email}:`, error);
    }
  }
}

// Instructions for the user
console.log('=== SUPABASE AUTH USER CREATION ===');
console.log('');
console.log('To use this script, you need to:');
console.log('1. Install Node.js if you haven\'t already');
console.log('2. Install the Supabase client: npm install @supabase/supabase-js');
console.log('3. Get your Service Role Key from Supabase Dashboard:');
console.log('   - Go to https://supabase.com/dashboard');
console.log('   - Select your project');
console.log('   - Go to Settings → API');
console.log('   - Copy the "service_role" key (NOT the anon key)');
console.log('4. Replace YOUR_SERVICE_ROLE_KEY in this script');
console.log('5. Run: node create-auth-users.js');
console.log('');
console.log('Alternatively, you can create users manually in the Supabase Dashboard:');
console.log('1. Go to Authentication → Users');
console.log('2. Click "Add User"');
console.log('3. Enter email: admin@iska-rms.com');
console.log('4. Enter password: password123');
console.log('5. Check "Email Confirm"');
console.log('6. Click "Create User"');
console.log('');

// Uncomment one of these to run:
// createAdminUser();
// createMultipleUsers(); 