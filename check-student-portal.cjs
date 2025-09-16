const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkStudentPortal() {
  console.log('🔍 Checking Student Portal Database State...\n');

  try {
    // Check if we have any students
    console.log('1. Checking students table...');
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*, user:users(*)')
      .limit(5);

    if (studentsError) {
      console.error('❌ Error fetching students:', studentsError);
    } else {
      console.log(`✅ Found ${students?.length || 0} students`);
      if (students && students.length > 0) {
        console.log('Sample student:', {
          id: students[0].id,
          student_id: students[0].student_id,
          user: students[0].user ? {
            id: students[0].user.id,
            email: students[0].user.email,
            first_name: students[0].user.first_name,
            last_name: students[0].user.last_name,
            role: students[0].user.role,
            is_active: students[0].user.is_active
          } : 'No user record'
        });
      }
    }

    // Check if we have any users with student role
    console.log('\n2. Checking users with student role...');
    const { data: studentUsers, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'student')
      .limit(5);

    if (usersError) {
      console.error('❌ Error fetching student users:', usersError);
    } else {
      console.log(`✅ Found ${studentUsers?.length || 0} users with student role`);
      if (studentUsers && studentUsers.length > 0) {
        console.log('Sample student user:', {
          id: studentUsers[0].id,
          email: studentUsers[0].email,
          first_name: studentUsers[0].first_name,
          last_name: studentUsers[0].last_name,
          role: studentUsers[0].role,
          is_active: studentUsers[0].is_active
        });
      }
    }

    // Check if we have any reservations for students
    console.log('\n3. Checking student reservations...');
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('*')
      .eq('type', 'student')
      .limit(5);

    if (reservationsError) {
      console.error('❌ Error fetching student reservations:', reservationsError);
    } else {
      console.log(`✅ Found ${reservations?.length || 0} student reservations`);
      if (reservations && reservations.length > 0) {
        console.log('Sample reservation:', {
          id: reservations[0].id,
          student_id: reservations[0].student_id,
          status: reservations[0].status,
          total_amount: reservations[0].total_amount
        });
      }
    }

    // Check if we have any invoices for students
    console.log('\n4. Checking student invoices...');
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .limit(5);

    if (invoicesError) {
      console.error('❌ Error fetching invoices:', invoicesError);
    } else {
      console.log(`✅ Found ${invoices?.length || 0} invoices`);
      if (invoices && invoices.length > 0) {
        console.log('Sample invoice:', {
          id: invoices[0].id,
          reservation_id: invoices[0].reservation_id,
          amount: invoices[0].amount,
          status: invoices[0].status
        });
      }
    }

    console.log('\n📋 Summary:');
    console.log(`- Students: ${students?.length || 0}`);
    console.log(`- Student Users: ${studentUsers?.length || 0}`);
    console.log(`- Student Reservations: ${reservations?.length || 0}`);
    console.log(`- Invoices: ${invoices?.length || 0}`);

    if (!students || students.length === 0) {
      console.log('\n⚠️  No students found - this is why the portal is blank!');
      console.log('💡 Solution: Add some students with user accounts first.');
    } else if (!studentUsers || studentUsers.length === 0) {
      console.log('\n⚠️  No users with student role found - students need user accounts!');
      console.log('💡 Solution: Create user accounts for existing students.');
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

checkStudentPortal(); 