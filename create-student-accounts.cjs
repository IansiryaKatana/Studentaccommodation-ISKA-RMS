const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function createStudentAccounts() {
  console.log('🔧 Creating Student User Accounts...\n');

  try {
    // Get all students without user accounts
    console.log('1. Fetching students without user accounts...');
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*, user:users(*)')
      .is('user_id', null);

    if (studentsError) {
      console.error('❌ Error fetching students:', studentsError);
      return;
    }

    console.log(`✅ Found ${students?.length || 0} students without user accounts`);

    if (!students || students.length === 0) {
      console.log('✅ All students already have user accounts!');
      return;
    }

    // Create user accounts for each student
    for (const student of students) {
      console.log(`\n2. Creating user account for ${student.student_id}...`);
      
      try {
        // Create user in Supabase Auth
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: `${student.student_id.toLowerCase()}@student.ac.uk`,
          password: 'urbanportal123',
          email_confirm: true,
          user_metadata: {
            first_name: 'Student',
            last_name: student.student_id,
            role: 'student'
          }
        });

        if (authError) {
          console.error(`❌ Auth error for ${student.student_id}:`, authError.message);
          continue;
        }

        // Create user record in users table
        const { data: userRecord, error: userError } = await supabase
          .from('users')
          .insert({
            id: authUser.user.id,
            email: `${student.student_id.toLowerCase()}@student.ac.uk`,
            first_name: 'Student',
            last_name: student.student_id,
            role: 'student',
            is_active: true
          })
          .select()
          .single();

        if (userError) {
          console.error(`❌ User record error for ${student.student_id}:`, userError.message);
          continue;
        }

        // Update student record with user_id
        const { error: updateError } = await supabase
          .from('students')
          .update({ user_id: authUser.user.id })
          .eq('id', student.id);

        if (updateError) {
          console.error(`❌ Update error for ${student.student_id}:`, updateError.message);
          continue;
        }

        console.log(`✅ Successfully created user account for ${student.student_id}`);
        console.log(`   Email: ${student.student_id.toLowerCase()}@student.ac.uk`);
        console.log(`   Password: urbanportal123`);

      } catch (error) {
        console.error(`❌ Error creating account for ${student.student_id}:`, error.message);
      }
    }

    console.log('\n📋 Summary:');
    console.log(`- Students processed: ${students.length}`);
    console.log('- Default password for all accounts: urbanportal123');
    console.log('- Students can now login and access their portal');

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

createStudentAccounts(); 