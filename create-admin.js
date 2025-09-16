const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://vwgczfdedacpymnxzxcp.supabase.co";
// You'll need to get this from your Supabase Dashboard
const SUPABASE_SERVICE_ROLE_KEY = "YOUR_SERVICE_ROLE_KEY";

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Create admin client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

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

    // Create user in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email: 'admin@iska-rms.com',
        first_name: 'Admin',
        last_name: 'User',
        role: 'administrator',
        is_active: true,
        phone: '+1234567890',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (userError) {
      console.error('User table error:', userError);
    } else {
      console.log('✅ User created in users table:', userData);
    }

    console.log('\n🎉 Admin user created successfully!');
    console.log('Email: admin@iska-rms.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error:', error);
  }
}

createAdminUser(); 