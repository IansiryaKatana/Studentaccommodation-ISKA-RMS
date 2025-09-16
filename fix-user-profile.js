// Script to fix user profile issue
// Run this in your browser console

const SUPABASE_URL = "https://vwgczfdedacpymnxzxcp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Z2N6ZmRlZGFjcHltbnh6eGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTYzMzksImV4cCI6MjA2OTY5MjMzOX0.-Be0-yqpi5dYGlZF7-5hDWasoyqXzI3VpFlhdnNB7ew";

const supabase = window.supabase || createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixUserProfile() {
  try {
    console.log('=== FIXING USER PROFILE ===');
    
    // Step 1: Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return;
    }
    
    if (!session) {
      console.log('No active session. Please log in first.');
      return;
    }
    
    console.log('Current user ID:', session.user.id);
    console.log('Current user email:', session.user.email);
    
    // Step 2: Check if user exists in users table
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (userError) {
      console.log('User not found in users table, creating...');
      
      // Step 3: Create user in users table
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          id: session.user.id,
          email: session.user.email,
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
      
      if (createError) {
        console.error('Error creating user:', createError);
        return;
      }
      
      console.log('✅ User created in users table:', newUser);
    } else {
      console.log('✅ User already exists in users table:', existingUser);
    }
    
    // Step 4: Test the profile loading
    const { data: testUser, error: testError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .eq('is_active', true)
      .single();
    
    if (testError) {
      console.error('Error testing user profile:', testError);
    } else {
      console.log('✅ User profile test successful:', testUser);
    }
    
  } catch (error) {
    console.error('Error fixing user profile:', error);
  }
}

// Alternative: Create admin user with proper credentials
async function createProperAdminUser() {
  try {
    console.log('=== CREATING PROPER ADMIN USER ===');
    
    // First, sign out if logged in
    await supabase.auth.signOut();
    
    // Create new admin user
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
      return;
    }
    
    console.log('✅ Admin user created in Auth:', authData);
    
    // Create user in users table
    if (authData.user) {
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
    }
    
    console.log('Login credentials:');
    console.log('Email: admin@iska-rms.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Check what users exist
async function checkUsers() {
  try {
    console.log('=== CHECKING USERS ===');
    
    // Check users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (usersError) {
      console.error('Users table error:', usersError);
    } else {
      console.log('Users in database:', users);
    }
    
    // Check auth users (this might not work from browser)
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      console.log('Current auth session:', session.user);
    } else {
      console.log('No auth session');
    }
    
  } catch (error) {
    console.error('Error checking users:', error);
  }
}

// Run the appropriate function
console.log('Choose a function to run:');
console.log('1. fixUserProfile() - Fix existing user profile');
console.log('2. createProperAdminUser() - Create new admin user');
console.log('3. checkUsers() - Check existing users');

// Uncomment the function you want to run:
// fixUserProfile();
// createProperAdminUser();
checkUsers(); 