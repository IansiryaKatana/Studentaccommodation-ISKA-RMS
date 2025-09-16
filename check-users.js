// Script to check existing users in your Supabase database
// Run this in your browser console

const SUPABASE_URL = "https://vwgczfdedacpymnxzxcp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Z2N6ZmRlZGFjcHltbnh6eGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTYzMzksImV4cCI6MjA2OTY5MjMzOX0.-Be0-yqpi5dYGlZF7-5hDWasoyqXzI3VpFlhdnNB7ew";

// For browser console, use this:
const supabase = window.supabase || createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkUsers() {
  try {
    console.log('Checking existing users...');
    
    // Check users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    console.log('Users in database:', users);
    
    if (users && users.length > 0) {
      console.log('Available login credentials:');
      users.forEach(user => {
        console.log(`Email: ${user.email}, Role: ${user.role}, Active: ${user.is_active}`);
      });
    } else {
      console.log('No users found in database');
    }

  } catch (error) {
    console.error('Error checking users:', error);
  }
}

// Run the function
checkUsers(); 