const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function addStudentAgreementsData() {
  console.log('🔧 Adding Student Agreements Data (Service Role)...\n');

  try {
    // Get existing students
    console.log('1. Fetching existing students...');
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id, student_id')
      .limit(5);

    if (studentsError) {
      console.log('❌ Error fetching students:', studentsError.message);
      return;
    }

    console.log(`✅ Found ${students?.length || 0} students`);

    // Add dummy agreements for each student
    console.log('\n2. Adding dummy agreements...');
    for (const student of students || []) {
      const agreements = [
        {
          student_id: student.id,
          title: 'Accommodation Agreement',
          description: 'Standard accommodation agreement for the academic year',
          document_url: 'https://example.com/agreements/accommodation.pdf',
          status: 'signed',
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        },
        {
          student_id: student.id,
          title: 'House Rules Agreement',
          description: 'Rules and regulations for living in the accommodation',
          document_url: 'https://example.com/agreements/house-rules.pdf',
          status: 'pending',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        },
        {
          student_id: student.id,
          title: 'Payment Plan Agreement',
          description: 'Agreement for installment payment plan',
          document_url: 'https://example.com/agreements/payment-plan.pdf',
          status: 'signed',
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
        }
      ];

      for (const agreement of agreements) {
        const { error: insertError } = await supabase
          .from('student_agreements')
          .insert(agreement);

        if (insertError) {
          console.log(`❌ Error inserting agreement for ${student.student_id}:`, insertError.message);
        } else {
          console.log(`✅ Added agreement "${agreement.title}" for ${student.student_id}`);
        }
      }
    }

    // Verify the data was added
    console.log('\n3. Verifying data...');
    const { data: agreements, error: verifyError } = await supabase
      .from('student_agreements')
      .select('*')
      .limit(10);

    if (verifyError) {
      console.log('❌ Error verifying data:', verifyError.message);
    } else {
      console.log(`✅ Total agreements in database: ${agreements?.length || 0}`);
    }

    console.log('\n📋 Summary:');
    console.log(`- Added agreements for ${students?.length || 0} students`);
    console.log('- Students can now view agreements in their portal');

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

addStudentAgreementsData(); 