const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addDefaultAcademicYears() {
  console.log('🚀 Adding default academic years...');

  const defaultYears = [
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
  ];

  try {
    const { data, error } = await supabase
      .from('academic_years')
      .upsert(defaultYears, { onConflict: 'name' })
      .select();

    if (error) {
      console.error('❌ Error adding default academic years:', error);
      return false;
    }

    console.log('✅ Default academic years added successfully!');
    console.log('📊 Created/Updated', data.length, 'academic years:');
    data.forEach(year => {
      console.log(`   - ${year.name} (${year.start_date} to ${year.end_date}) ${year.is_current ? '[CURRENT]' : ''}`);
    });

    return true;
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

addDefaultAcademicYears()
  .then(success => {
    if (success) {
      console.log('\n🎉 Academic Years system is now fully ready!');
      console.log('You can now navigate to Data Management → Academic Years');
    } else {
      console.log('\n❌ Failed to add default academic years');
    }
  });
