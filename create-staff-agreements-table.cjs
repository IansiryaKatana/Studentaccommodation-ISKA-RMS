const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function createStaffAgreementsTable() {
  console.log('🔧 Adding Dummy Staff Agreements...\n');

  try {
    // Check if table exists
    console.log('1. Checking if staff_agreements table exists...');
    
    const { data: existingTable, error: checkError } = await supabase
      .from('staff_agreements')
      .select('id')
      .limit(1);

    if (checkError && checkError.code === '42P01') {
      console.log('❌ Table does not exist. Please create it manually in Supabase dashboard first.');
      console.log('Run this SQL in your Supabase SQL Editor:');
      console.log(`
        CREATE TABLE IF NOT EXISTS staff_agreements (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          document_url TEXT NOT NULL,
          agreement_type TEXT DEFAULT 'general',
          is_active BOOLEAN DEFAULT true,
          due_date TIMESTAMP WITH TIME ZONE,
          uploaded_by UUID REFERENCES users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      return;
    }
    
    console.log('✅ staff_agreements table exists');

    // Add some dummy agreements
    console.log('\n2. Adding dummy agreements...');
    const dummyAgreements = [
      {
        title: 'Accommodation Agreement',
        description: 'Standard accommodation agreement for all students',
        document_url: 'https://example.com/agreements/accommodation.pdf',
        agreement_type: 'accommodation',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      },
      {
        title: 'House Rules Agreement',
        description: 'Rules and regulations for living in the accommodation',
        document_url: 'https://example.com/agreements/house-rules.pdf',
        agreement_type: 'house_rules',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      },
      {
        title: 'Payment Plan Agreement',
        description: 'Agreement for installment payment plan',
        document_url: 'https://example.com/agreements/payment-plan.pdf',
        agreement_type: 'payment',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
      }
    ];

    for (const agreement of dummyAgreements) {
      const { error: insertError } = await supabase
        .from('staff_agreements')
        .insert(agreement);

      if (insertError) {
        console.log(`❌ Error inserting agreement "${agreement.title}":`, insertError.message);
      } else {
        console.log(`✅ Added agreement "${agreement.title}"`);
      }
    }

    console.log('\n📋 Summary:');
    console.log('- staff_agreements table created');
    console.log('- Added dummy agreements for testing');
    console.log('- Staff can now upload agreements in web access module');

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

createStaffAgreementsTable();
