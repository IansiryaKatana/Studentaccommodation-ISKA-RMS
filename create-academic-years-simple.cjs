const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please check your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAcademicYearsTable() {
  console.log('🚀 Creating academic_years table...');

  try {
    // First, let's check if the table already exists
    const { data: existingData, error: checkError } = await supabase
      .from('academic_years')
      .select('id')
      .limit(1);

    if (!checkError) {
      console.log('✅ Academic years table already exists!');
      
      // Just verify we have data
      const { data, error: selectError } = await supabase
        .from('academic_years')
        .select('*')
        .order('start_date', { ascending: false });

      if (selectError) {
        console.error('❌ Error reading existing data:', selectError);
        return false;
      }

      console.log('📊 Found', data.length, 'academic years:');
      data.forEach(year => {
        console.log(`   - ${year.name} (${year.start_date} to ${year.end_date}) ${year.is_current ? '[CURRENT]' : ''}`);
      });

      return true;
    }

    console.log('❌ Table does not exist. Please create it manually in Supabase SQL Editor.');
    console.log('\n📋 Copy and paste this SQL into your Supabase SQL Editor:');
    console.log('\n' + '='.repeat(80));
    console.log(`
-- Create academic_years table for managing academic year definitions
CREATE TABLE IF NOT EXISTS academic_years (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraint to ensure start_date < end_date
ALTER TABLE academic_years ADD CONSTRAINT check_academic_year_dates 
CHECK (start_date < end_date);

-- Add unique index for current academic year
CREATE UNIQUE INDEX idx_academic_years_current 
ON academic_years (is_current) 
WHERE is_current = true;

-- Add indexes for performance
CREATE INDEX idx_academic_years_active ON academic_years (is_active);
CREATE INDEX idx_academic_years_dates ON academic_years (start_date, end_date);
CREATE INDEX idx_academic_years_name ON academic_years (name);

-- Insert default academic years
INSERT INTO academic_years (name, start_date, end_date, is_current, description) VALUES
('2024/2025', '2024-09-01', '2025-07-01', false, 'Previous academic year'),
('2025/2026', '2025-09-01', '2026-07-01', true, 'Current academic year'),
('2026/2027', '2026-09-01', '2027-07-01', false, 'Future academic year')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read academic years
CREATE POLICY "Users can view academic years" ON academic_years
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow admins to manage academic years
CREATE POLICY "Admins can manage academic years" ON academic_years
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM users 
      WHERE role IN ('super_admin', 'admin')
    )
  );
`);
    console.log('='.repeat(80));
    console.log('\n📝 Instructions:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL above');
    console.log('4. Click "Run" to execute');
    console.log('5. Come back and refresh your application');

    return false;

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the script
createAcademicYearsTable()
  .then(success => {
    if (success) {
      console.log('\n✅ Academic Years table is ready! You can now use the management system.');
    } else {
      console.log('\n⚠️  Please create the table manually using the SQL above.');
    }
  })
  .catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
