// Add missing booking fields to students table
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function addStudentsBookingFields() {
  try {
    console.log('🔧 Adding booking fields to students table...\n');
    
    // Add the missing columns to the students table
    const { error: addColumnsError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Add check_in_date column
        ALTER TABLE students ADD COLUMN IF NOT EXISTS check_in_date DATE;
        
        -- Add duration_name column
        ALTER TABLE students ADD COLUMN IF NOT EXISTS duration_name TEXT;
        
        -- Add duration_type column
        ALTER TABLE students ADD COLUMN IF NOT EXISTS duration_type TEXT;
      `
    });

    if (addColumnsError) {
      console.error('❌ Error adding columns:', addColumnsError.message);
      
      // Try alternative approach using direct SQL
      console.log('🔄 Trying alternative approach...');
      
      // We'll need to use a different method since RPC might not be available
      console.log('⚠️  Manual SQL commands to run in Supabase SQL Editor:');
      console.log('ALTER TABLE students ADD COLUMN IF NOT EXISTS check_in_date DATE;');
      console.log('ALTER TABLE students ADD COLUMN IF NOT EXISTS duration_name TEXT;');
      console.log('ALTER TABLE students ADD COLUMN IF NOT EXISTS duration_type TEXT;');
      
      return;
    }

    console.log('✅ Successfully added booking fields to students table!');
    
    // Verify the fields were added
    console.log('\n🔍 Verifying the new fields...');
    const { data: students, error: verifyError } = await supabase
      .from('students')
      .select('id, first_name, last_name, check_in_date, duration_name, duration_type')
      .limit(1);

    if (verifyError) {
      console.error('❌ Error verifying fields:', verifyError.message);
    } else {
      console.log('✅ Fields verification successful!');
      if (students && students.length > 0) {
        console.log('📊 Sample data:', JSON.stringify(students[0], null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n💡 Manual steps:');
    console.log('1. Go to Supabase Dashboard > SQL Editor');
    console.log('2. Run these commands:');
    console.log('   ALTER TABLE students ADD COLUMN IF NOT EXISTS check_in_date DATE;');
    console.log('   ALTER TABLE students ADD COLUMN IF NOT EXISTS duration_name TEXT;');
    console.log('   ALTER TABLE students ADD COLUMN IF NOT EXISTS duration_type TEXT;');
  }
}

addStudentsBookingFields();
