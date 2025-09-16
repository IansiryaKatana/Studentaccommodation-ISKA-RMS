// Check if the students table has the new fields
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function checkStudentsSchema() {
  try {
    console.log('🔍 Checking students table schema...\n');
    
    // Try to select a student with all the fields we need
    const { data: students, error } = await supabase
      .from('students')
      .select(`
        id,
        first_name,
        last_name,
        email,
        studio_id,
        check_in_date,
        duration_name,
        duration_type,
        total_amount,
        installment_plan_id
      `)
      .limit(1);

    if (error) {
      console.error('❌ Error fetching students:', error.message);
      console.log('\n🔧 The following fields might be missing from the database:');
      console.log('- check_in_date');
      console.log('- duration_name');
      console.log('- duration_type');
      console.log('\n💡 You need to add these fields to the students table in Supabase.');
      return;
    }

    if (students && students.length > 0) {
      console.log('✅ Students table schema check passed!');
      console.log('📊 Sample student data:');
      console.log(JSON.stringify(students[0], null, 2));
    } else {
      console.log('⚠️  No students found in the database.');
    }

    // Check if durations table exists and has data
    console.log('\n🔍 Checking durations table...');
    const { data: durations, error: durationsError } = await supabase
      .from('durations')
      .select('id, name, check_in_date, duration_type')
      .eq('duration_type', 'student')
      .limit(3);

    if (durationsError) {
      console.error('❌ Error fetching durations:', durationsError.message);
    } else if (durations && durations.length > 0) {
      console.log('✅ Durations table check passed!');
      console.log('📊 Available durations:');
      durations.forEach(d => {
        console.log(`- ${d.name} (${d.id}) - Check-in: ${d.check_in_date}`);
      });
    } else {
      console.log('⚠️  No student durations found.');
    }

  } catch (error) {
    console.error('❌ Schema check failed:', error);
  }
}

checkStudentsSchema();
