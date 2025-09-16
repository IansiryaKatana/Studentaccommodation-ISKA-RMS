// Script to sync existing users from users table to Supabase Authentication
// Run this in your browser console

const SUPABASE_URL = "https://vwgczfdedacpymnxzxcp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Z2N6ZmRlZGFjcHltbnh6eGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTYzMzksImV4cCI6MjA2OTY5MjMzOX0.-Be0-yqpi5dYGlZF7-5hDWasoyqXzI3VpFlhdnNB7ew";

// For browser console, use this:
const supabase = window.supabase || createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function syncUsersToAuth() {
  try {
    console.log('Syncing users to Supabase Authentication...');
    
    // Step 1: Get all users from users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('is_active', true);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    console.log('Found users in database:', users);

    if (!users || users.length === 0) {
      console.log('No users found in database');
      return;
    }

    // Step 2: Create each user in Supabase Auth
    for (const user of users) {
      try {
        console.log(`Creating auth user for: ${user.email}`);
        
        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: 'password123', // Default password for all users
          email_confirm: true,
          user_metadata: {
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role
          }
        });

        if (authError) {
          console.error(`Error creating auth user for ${user.email}:`, authError);
          continue;
        }

        console.log(`✅ Created auth user for ${user.email}:`, authData);

        // Update the user record with the auth ID if it doesn't match
        if (authData.user && authData.user.id !== user.id) {
          const { error: updateError } = await supabase
            .from('users')
            .update({ id: authData.user.id })
            .eq('email', user.email);

          if (updateError) {
            console.error(`Error updating user ID for ${user.email}:`, updateError);
          } else {
            console.log(`Updated user ID for ${user.email}`);
          }
        }

      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error);
      }
    }

    console.log('✅ User sync completed!');
    console.log('All users now have password: password123');

  } catch (error) {
    console.error('Error syncing users:', error);
  }
}

// Alternative: Create admin user only
async function createAdminUserOnly() {
  try {
    console.log('Creating admin user in Supabase Auth...');
    
    // Create admin user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@iska-rms.com',
      password: 'password123',
    });

    if (authError) {
      console.error('Auth error:', authError);
      return;
    }

    console.log('✅ Admin user created in Auth:', authData);
    console.log('Email: admin@iska-rms.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the function you want:
// syncUsersToAuth(); // Uncomment to sync all users
createAdminUserOnly(); // Uncomment to create admin only 