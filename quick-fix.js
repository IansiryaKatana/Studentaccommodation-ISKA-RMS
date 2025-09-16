// Quick fix script - run this in your browser console
// This will create the admin user and fix the profile issue

const SUPABASE_URL = "https://vwgczfdedacpymnxzxcp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Z2N6ZmRlZGFjcHltbnh6eGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTYzMzksImV4cCI6MjA2OTY5MjMzOX0.-Be0-yqpi5dYGlZF7-5hDWasoyqXzI3VpFlhdnNB7ew";

const supabase = window.supabase || createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function quickFix() {
  try {
    console.log('=== QUICK FIX STARTING ===');
    
    // Step 1: Sign out if logged in
    await supabase.auth.signOut();
    console.log('✅ Signed out');
    
    // Step 2: Create admin user
    console.log('Creating admin user...');
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
          return;
        }
        
        console.log('✅ Successfully signed in:', signInData);
        
        // Create user in users table
        if (signInData.user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .upsert([{
              id: signInData.user.id,
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
      }
      return;
    }

    console.log('✅ Admin user created:', authData);
    
    // Step 3: Create user in users table
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
    
    console.log('\n🎉 SUCCESS! You can now log in with:');
    console.log('Email: admin@iska-rms.com');
    console.log('Password: password123');
    
    // Step 4: Test login
    console.log('\nTesting login...');
    const { data: testData, error: testError } = await supabase.auth.signInWithPassword({
      email: 'admin@iska-rms.com',
      password: 'password123',
    });
    
    if (testError) {
      console.error('Test login failed:', testError);
    } else {
      console.log('✅ Test login successful!');
      console.log('User ID:', testData.user.id);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the fix
quickFix(); 