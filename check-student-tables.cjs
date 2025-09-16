const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkStudentTables() {
  console.log('🔍 Checking Student Portal Tables...\n');

  try {
    // Check student_agreements table
    console.log('1. Checking student_agreements table...');
    const { data: agreements, error: agreementsError } = await supabase
      .from('student_agreements')
      .select('*')
      .limit(1);

    if (agreementsError) {
      console.log('❌ student_agreements table does not exist or has issues');
      console.log('   Error:', agreementsError.message);
    } else {
      console.log('✅ student_agreements table exists');
      console.log(`   Found ${agreements?.length || 0} records`);
    }

    // Check maintenance_requests table
    console.log('\n2. Checking maintenance_requests table...');
    const { data: maintenance, error: maintenanceError } = await supabase
      .from('maintenance_requests')
      .select('*')
      .limit(1);

    if (maintenanceError) {
      console.log('❌ maintenance_requests table does not exist or has issues');
      console.log('   Error:', maintenanceError.message);
    } else {
      console.log('✅ maintenance_requests table exists');
      console.log(`   Found ${maintenance?.length || 0} records`);
    }

    // Check if we have any students with reservations
    console.log('\n3. Checking students with reservations...');
    const { data: studentsWithReservations, error: studentsError } = await supabase
      .from('students')
      .select(`
        id,
        student_id,
        user:users(id, email, first_name, last_name),
        reservations:reservations(id, status, total_amount)
      `)
      .limit(5);

    if (studentsError) {
      console.log('❌ Error fetching students with reservations:', studentsError.message);
    } else {
      console.log(`✅ Found ${studentsWithReservations?.length || 0} students`);
      if (studentsWithReservations && studentsWithReservations.length > 0) {
        console.log('Sample student with reservation:', {
          id: studentsWithReservations[0].id,
          student_id: studentsWithReservations[0].student_id,
          user: studentsWithReservations[0].user ? 'Has user account' : 'No user account',
          reservations: studentsWithReservations[0].reservations?.length || 0
        });
      }
    }

    console.log('\n📋 Summary:');
    console.log('- student_agreements table:', agreementsError ? 'Missing' : 'Exists');
    console.log('- maintenance_requests table:', maintenanceError ? 'Missing' : 'Exists');
    console.log('- Students with reservations:', studentsWithReservations?.length || 0);

    if (agreementsError || maintenanceError) {
      console.log('\n💡 Solution: Create the missing tables or add dummy data');
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

checkStudentTables(); 