const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseService = createClient(supabaseUrl, serviceRoleKey);

async function debugAccess() {
  console.log('🔍 Debugging Academic Years Access...\n');

  // Check policies
  console.log('📋 Checking RLS policies...');
  const { data: policies, error: policiesError } = await supabaseService
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'academic_years');

  if (policiesError) {
    console.log('⚠️  Could not fetch policies:', policiesError.message);
  } else {
    console.log(`Found ${policies?.length || 0} policies:`);
    policies?.forEach(p => {
      console.log(`  - ${p.policyname} (${p.cmd})`);
    });
  }

  // Check if RLS is enabled
  console.log('\n🔒 Checking if RLS is enabled...');
  const { data: tableInfo, error: tableError } = await supabaseService.rpc('exec_sql', {
    sql: `SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'academic_years';`
  }).catch(() => ({ data: null, error: { message: 'exec_sql not available' } }));

  if (tableError) {
    console.log('⚠️  Could not check RLS status');
  } else if (tableInfo) {
    console.log('✅ RLS status checked');
  }

  // Try to read with anon key (simulating browser)
  console.log('\n📡 Testing anon key access (like your browser)...');
  const { data: anonData, error: anonError } = await supabase
    .from('academic_years')
    .select('*');

  if (anonError) {
    console.log('❌ Anon key error:', anonError.message);
    console.log('   Code:', anonError.code);
    console.log('   Details:', anonError.details);
    console.log('   Hint:', anonError.hint);
  } else {
    console.log('✅ Anon key success:', anonData?.length || 0, 'records');
  }

  // Check with service key
  console.log('\n📡 Testing service key access...');
  const { data: serviceData, error: serviceError } = await supabaseService
    .from('academic_years')
    .select('*');

  if (serviceError) {
    console.log('❌ Service key error:', serviceError.message);
  } else {
    console.log('✅ Service key success:', serviceData?.length || 0, 'records');
    serviceData?.forEach(year => {
      console.log(`   - ${year.name} (${year.start_date} to ${year.end_date})`);
    });
  }

  // Suggest solution
  if (!anonError && anonData && anonData.length > 0) {
    console.log('\n🎉 Access is working! The data should be visible in your app.');
  } else {
    console.log('\n❌ Access is blocked. The RLS policies are not working correctly.');
    console.log('\n💡 Solution: Disable RLS temporarily to test:');
    console.log('Run this SQL in Supabase Dashboard:\n');
    console.log('ALTER TABLE academic_years DISABLE ROW LEVEL SECURITY;');
    console.log('\nThis will make the data visible. Then we can fix the policies properly.');
  }
}

debugAccess();
