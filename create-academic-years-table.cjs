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
    // Create the table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
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
        ALTER TABLE academic_years ADD CONSTRAINT IF NOT EXISTS check_academic_year_dates 
        CHECK (start_date < end_date);

        -- Add unique index for current academic year
        CREATE UNIQUE INDEX IF NOT EXISTS idx_academic_years_current 
        ON academic_years (is_current) 
        WHERE is_current = true;

        -- Add indexes for performance
        CREATE INDEX IF NOT EXISTS idx_academic_years_active ON academic_years (is_active);
        CREATE INDEX IF NOT EXISTS idx_academic_years_dates ON academic_years (start_date, end_date);
        CREATE INDEX IF NOT EXISTS idx_academic_years_name ON academic_years (name);
      `
    });

    if (createError) {
      console.error('❌ Error creating table:', createError);
      return false;
    }

    console.log('✅ Table created successfully');

    // Insert default academic years
    console.log('📝 Inserting default academic years...');
    
    const { error: insertError } = await supabase
      .from('academic_years')
      .upsert([
        {
          name: '2024/2025',
          start_date: '2024-09-01',
          end_date: '2025-07-01',
          is_current: false,
          is_active: true,
          description: 'Previous academic year'
        },
        {
          name: '2025/2026',
          start_date: '2025-09-01',
          end_date: '2026-07-01',
          is_current: true,
          is_active: true,
          description: 'Current academic year'
        },
        {
          name: '2026/2027',
          start_date: '2026-09-01',
          end_date: '2027-07-01',
          is_current: false,
          is_active: true,
          description: 'Future academic year'
        }
      ], { onConflict: 'name' });

    if (insertError) {
      console.error('❌ Error inserting default data:', insertError);
      return false;
    }

    console.log('✅ Default academic years inserted successfully');

    // Enable RLS
    console.log('🔒 Setting up Row Level Security...');
    
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Enable RLS
        ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;

        -- Allow authenticated users to read academic years
        DROP POLICY IF EXISTS "Users can view academic years" ON academic_years;
        CREATE POLICY "Users can view academic years" ON academic_years
          FOR SELECT USING (auth.role() = 'authenticated');

        -- Allow admins to manage academic years
        DROP POLICY IF EXISTS "Admins can manage academic years" ON academic_years;
        CREATE POLICY "Admins can manage academic years" ON academic_years
          FOR ALL USING (
            auth.uid() IN (
              SELECT id FROM users 
              WHERE role IN ('super_admin', 'admin')
            )
          );
      `
    });

    if (rlsError) {
      console.error('❌ Error setting up RLS:', rlsError);
      return false;
    }

    console.log('✅ RLS policies created successfully');

    // Verify the table was created
    const { data, error: selectError } = await supabase
      .from('academic_years')
      .select('*')
      .order('start_date', { ascending: false });

    if (selectError) {
      console.error('❌ Error verifying table:', selectError);
      return false;
    }

    console.log('🎉 Academic Years table created successfully!');
    console.log('📊 Found', data.length, 'academic years:');
    data.forEach(year => {
      console.log(`   - ${year.name} (${year.start_date} to ${year.end_date}) ${year.is_current ? '[CURRENT]' : ''}`);
    });

    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the script
createAcademicYearsTable()
  .then(success => {
    if (success) {
      console.log('\n✅ Setup complete! You can now use the Academic Years management system.');
    } else {
      console.log('\n❌ Setup failed. Please check the errors above.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
