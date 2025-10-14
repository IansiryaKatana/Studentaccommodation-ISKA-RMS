const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Checking Academic Years...\n');

// Try with anon key first
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWithAnonKey() {
  console.log('📡 Checking with Anon Key...');
  
  const { data, error } = await supabase
    .from('academic_years')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    console.error('❌ Error with Anon Key:', error);
    return null;
  }

  console.log('✅ Anon Key Success!');
  console.log('📊 Found', data?.length || 0, 'academic years');
  if (data && data.length > 0) {
    data.forEach(year => {
      console.log(`   - ${year.name} (${year.start_date} to ${year.end_date}) ${year.is_current ? '[CURRENT]' : ''}`);
    });
  }
  
  return data;
}

async function checkWithServiceKey() {
  if (!serviceRoleKey) {
    console.log('\n⚠️  No service role key found, skipping service key check');
    return null;
  }

  console.log('\n📡 Checking with Service Role Key...');
  const supabaseService = createClient(supabaseUrl, serviceRoleKey);
  
  const { data, error } = await supabaseService
    .from('academic_years')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    console.error('❌ Error with Service Key:', error);
    return null;
  }

  console.log('✅ Service Key Success!');
  console.log('📊 Found', data?.length || 0, 'academic years');
  if (data && data.length > 0) {
    data.forEach(year => {
      console.log(`   - ${year.name} (${year.start_date} to ${year.end_date}) ${year.is_current ? '[CURRENT]' : ''}`);
    });
  }
  
  return data;
}

async function checkCurrentUser() {
  console.log('\n👤 Checking current user...');
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.log('❌ Not authenticated:', error.message);
    return null;
  }
  
  if (!user) {
    console.log('⚠️  No user logged in');
    return null;
  }
  
  console.log('✅ User logged in:', user.email);
  console.log('   User ID:', user.id);
  
  return user;
}

async function run() {
  await checkCurrentUser();
  const anonData = await checkWithAnonKey();
  const serviceData = await checkWithServiceKey();
  
  console.log('\n📋 Summary:');
  console.log('   Anon Key:', anonData ? `${anonData.length} records` : 'Failed');
  console.log('   Service Key:', serviceData ? `${serviceData.length} records` : serviceRoleKey ? 'Failed' : 'Not configured');
  
  if (!anonData && serviceData) {
    console.log('\n⚠️  Issue: RLS policies are blocking anon key access');
    console.log('💡 Solution: Update RLS policies in Supabase Dashboard');
  }
}

run().catch(console.error);
