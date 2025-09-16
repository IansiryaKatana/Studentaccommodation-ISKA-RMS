const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function createTable() {
  console.log('🔧 Creating staff_agreements table...\n');

  try {
    // Try to create the table by inserting a record
    // This will fail if the table doesn't exist, but we'll catch the error
    const { data, error } = await supabase
      .from('staff_agreements')
      .insert({
        title: 'Test Agreement',
        description: 'Test description',
        document_url: 'https://example.com/test.pdf',
        agreement_type: 'test'
      })
      .select();

    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Table does not exist. Please create it manually in Supabase dashboard.');
        console.log('\n📋 Steps to create the table:');
        console.log('1. Go to https://supabase.com/dashboard');
        console.log('2. Select your project');
        console.log('3. Go to SQL Editor (left sidebar)');
        console.log('4. Run this SQL:');
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

-- Add dummy data
INSERT INTO staff_agreements (title, description, document_url, agreement_type, due_date) VALUES
  ('Accommodation Agreement', 'Standard accommodation agreement for all students', 'https://example.com/agreements/accommodation.pdf', 'accommodation', NOW() + INTERVAL '30 days'),
  ('House Rules Agreement', 'Rules and regulations for living in the accommodation', 'https://example.com/agreements/house-rules.pdf', 'house_rules', NOW() + INTERVAL '7 days'),
  ('Payment Plan Agreement', 'Agreement for installment payment plan', 'https://example.com/agreements/payment-plan.pdf', 'payment', NOW() + INTERVAL '14 days');
        `);
      } else {
        console.log('❌ Error:', error.message);
      }
      return;
    }

    console.log('✅ Table exists and test record inserted successfully');
    
    // Clean up the test record
    await supabase
      .from('staff_agreements')
      .delete()
      .eq('title', 'Test Agreement');
      
    console.log('✅ Test record cleaned up');

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

createTable();
