// Simple browser script to create admin user
// Run this in your browser console

const SUPABASE_URL = "https://vwgczfdedacpymnxzxcp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Z2N6ZmRlZGFjcHltbnh6eGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTYzMzksImV4cCI6MjA2OTY5MjMzOX0.-Be0-yqpi5dYGlZF7-5hDWasoyqXzI3VpFlhdnNB7ew";

const supabase = window.supabase || createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Try to create user with signUp
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@iska-rms.com',
      password: 'password123',
      options: {
        data: {
          first_name: 'Admin',
          last_name: 'User',
          role: 'administrator'
        }
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      
      // If user already exists, try to sign in
      if (authError.message.includes('already registered')) {
        console.log('User already exists, trying to sign in...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'admin@iska-rms.com',
          password: 'password123',
        });
        
        if (signInError) {
          console.error('Sign in error:', signInError);
        } else {
          console.log('✅ Successfully signed in:', signInData);
        }
      }
      return;
    }

    console.log('✅ Admin user created:', authData);
    console.log('Email: admin@iska-rms.com');
    console.log('Password: password123');

    // Create user record in our table
    if (authData.user) {
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
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Test login function
async function testLogin() {
  try {
    console.log('Testing login...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@iska-rms.com',
      password: 'password123',
    });

    if (error) {
      console.error('Login failed:', error);
    } else {
      console.log('✅ Login successful:', data);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}

// Check current session
async function checkSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session error:', error);
    } else {
      console.log('Current session:', session);
    }
  } catch (error) {
    console.error('Session check error:', error);
  }
}

// Run the functions
console.log('=== AUTH FIX SCRIPT ===');
console.log('1. Creating admin user...');
createAdminUser();

console.log('2. Testing login...');
setTimeout(testLogin, 2000);

console.log('3. Checking session...');
setTimeout(checkSession, 4000); 