#!/usr/bin/env node

/**
 * Run leads module database migrations
 * This script creates the necessary tables for leads room grades and duration types
 * without interfering with the existing student module tables
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(migrationFile) {
  try {
    console.log(`📄 Reading migration: ${migrationFile}`);
    const migrationSQL = fs.readFileSync(migrationFile, 'utf8');
    
    console.log(`🚀 Executing migration: ${migrationFile}`);
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error(`❌ Migration failed: ${migrationFile}`);
      console.error('Error:', error);
      return false;
    }
    
    console.log(`✅ Migration completed: ${migrationFile}`);
    return true;
  } catch (error) {
    console.error(`❌ Migration failed: ${migrationFile}`);
    console.error('Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🎯 Starting leads module database migrations...\n');
  
  const migrations = [
    'supabase/migrations/20250109000002_create_lead_room_grades_and_durations.sql',
    'supabase/migrations/20250109000003_populate_lead_sources_from_csv.sql'
  ];
  
  let successCount = 0;
  let totalCount = migrations.length;
  
  for (const migration of migrations) {
    const migrationPath = path.join(process.cwd(), migration);
    
    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ Migration file not found: ${migrationPath}`);
      continue;
    }
    
    const success = await runMigration(migrationPath);
    if (success) {
      successCount++;
    }
    
    console.log(''); // Add spacing between migrations
  }
  
  console.log('📊 Migration Summary:');
  console.log(`   ✅ Successful: ${successCount}/${totalCount}`);
  console.log(`   ❌ Failed: ${totalCount - successCount}/${totalCount}`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 All migrations completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Your leads module now has separate room grade and duration type tables');
    console.log('   2. Use the LeadsCSVImport component to import your CSV data');
    console.log('   3. The new tables will not interfere with your student module');
  } else {
    console.log('\n⚠️  Some migrations failed. Please check the errors above.');
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the migrations
main().catch((error) => {
  console.error('❌ Migration script failed:', error);
  process.exit(1);
});
