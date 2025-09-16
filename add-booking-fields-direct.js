// Direct script to add booking fields to students table using service role
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function addBookingFieldsDirect() {
  try {
    console.log('🔧 Adding booking fields to students table directly...\n');
    
    // Method 1: Try using SQL function if available
    console.log('1️⃣ Attempting to use SQL function...');
    try {
      const { error: sqlError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE students ADD COLUMN IF NOT EXISTS duration_name TEXT;
          ALTER TABLE students ADD COLUMN IF NOT EXISTS duration_type TEXT;
          ALTER TABLE students ADD COLUMN IF NOT EXISTS check_in_date DATE;
        `
      });

      if (!sqlError) {
        console.log('✅ Successfully added columns using SQL function!');
        await verifyColumns();
        return;
      } else {
        console.log('❌ SQL function not available:', sqlError.message);
      }
    } catch (error) {
      console.log('❌ SQL function failed:', error.message);
    }

    // Method 2: Try using REST API directly
    console.log('\n2️⃣ Attempting direct REST API approach...');
    try {
      const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
        },
        body: JSON.stringify({
          sql: `
            ALTER TABLE students ADD COLUMN IF NOT EXISTS duration_name TEXT;
            ALTER TABLE students ADD COLUMN IF NOT EXISTS duration_type TEXT;
            ALTER TABLE students ADD COLUMN IF NOT EXISTS check_in_date DATE;
          `
        })
      });

      if (response.ok) {
        console.log('✅ Successfully added columns using REST API!');
        await verifyColumns();
        return;
      } else {
        const errorText = await response.text();
        console.log('❌ REST API failed:', errorText);
      }
    } catch (error) {
      console.log('❌ REST API error:', error.message);
    }

    // Method 3: Manual instructions
    console.log('\n3️⃣ Automatic methods failed. Manual steps required:');
    console.log('\n📝 Please run these SQL commands in your Supabase Dashboard:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/vwgczfdedacpymnxzxcp/sql');
    console.log('   2. Run these commands:');
    console.log('   ');
    console.log('   ALTER TABLE students ADD COLUMN IF NOT EXISTS duration_name TEXT;');
    console.log('   ALTER TABLE students ADD COLUMN IF NOT EXISTS duration_type TEXT;');
    console.log('   ALTER TABLE students ADD COLUMN IF NOT EXISTS check_in_date DATE;');
    console.log('   ');
    console.log('   3. Click "Run" to execute');
    console.log('\n✅ After running the SQL, test with: node test-booking-data-flow.js');

  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

async function verifyColumns() {
  console.log('\n🔍 Verifying columns were added...');
  try {
    const { data: students, error } = await supabase
      .from('students')
      .select('id, first_name, last_name, duration_name, duration_type, check_in_date')
      .limit(1);

    if (error) {
      console.error('❌ Verification failed:', error.message);
    } else {
      console.log('✅ Columns verified successfully!');
      console.log('📊 Sample data structure:');
      if (students && students.length > 0) {
        console.log(JSON.stringify(students[0], null, 2));
      } else {
        console.log('No students found, but columns exist.');
      }
    }
  } catch (error) {
    console.error('❌ Verification error:', error);
  }
}

addBookingFieldsDirect();