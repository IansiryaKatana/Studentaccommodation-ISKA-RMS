const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function createStudentAgreementsTable() {
  console.log('🔧 Creating Student Agreements Table...\n');

  try {
    // Create the student_agreements table
    console.log('1. Creating student_agreements table...');
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS student_agreements (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          student_id UUID REFERENCES students(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT,
          document_url TEXT,
          signed_document_url TEXT,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'overdue')),
          uploaded_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          due_date TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (createError) {
      console.log('❌ Error creating table:', createError.message);
      return;
    }

    console.log('✅ student_agreements table created successfully');

    // Get existing students
    console.log('\n2. Fetching existing students...');
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
    console.log('\n3. Adding dummy agreements...');
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

    console.log('\n📋 Summary:');
    console.log('- student_agreements table created');
    console.log(`- Added agreements for ${students?.length || 0} students`);
    console.log('- Students can now view agreements in their portal');

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

createStudentAgreementsTable(); 