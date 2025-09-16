const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fixStudentAgreements() {
  console.log('🔧 Fixing Student Agreements...\n');

  try {
    // First, let's check what's in the table
    console.log('1. Checking current table state...');
    const { data: currentData, error: checkError } = await supabase
      .from('student_agreements')
      .select('*');

    if (checkError) {
      console.log('❌ Error checking table:', checkError.message);
    } else {
      console.log(`✅ Current records in table: ${currentData?.length || 0}`);
    }

    // Get students
    console.log('\n2. Fetching students...');
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id, student_id')
      .limit(5);

    if (studentsError) {
      console.log('❌ Error fetching students:', studentsError.message);
      return;
    }

    console.log(`✅ Found ${students?.length || 0} students`);

    // Try to insert data directly
    console.log('\n3. Inserting test data...');
    const testAgreement = {
      student_id: students[0].id,
      title: 'Test Agreement',
      description: 'Test agreement for debugging',
      document_url: 'https://example.com/test.pdf',
      status: 'pending',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('student_agreements')
      .insert(testAgreement)
      .select();

    if (insertError) {
      console.log('❌ Insert error:', insertError.message);
      console.log('💡 This suggests RLS is still active');
    } else {
      console.log('✅ Successfully inserted test data:', insertData);
    }

    // Check if we can read the data
    console.log('\n4. Checking if we can read data...');
    const { data: readData, error: readError } = await supabase
      .from('student_agreements')
      .select('*')
      .limit(5);

    if (readError) {
      console.log('❌ Read error:', readError.message);
    } else {
      console.log(`✅ Can read ${readData?.length || 0} records`);
      if (readData && readData.length > 0) {
        console.log('Sample record:', readData[0]);
      }
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

fixStudentAgreements(); 