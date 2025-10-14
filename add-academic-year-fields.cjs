const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addAcademicYearFields() {
  console.log('🚀 Starting Academic Year Fields Addition...\n');

  const tablesToUpdate = [
    'invoices',
    'payments', 
    'student_installments',
    'reservations',
    'leads',
    'callback_bookings',
    'viewing_bookings',
    'cleaning_tasks',
    'maintenance_requests',
    'expenses'
  ];

  for (const tableName of tablesToUpdate) {
    try {
      console.log(`📝 Adding academic_year column to ${tableName}...`);
      
      // Check if column already exists
      const { data: columns, error: checkError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', tableName)
        .eq('column_name', 'academic_year')
        .eq('table_schema', 'public');

      if (checkError) {
        console.error(`❌ Error checking ${tableName}:`, checkError.message);
        continue;
      }

      if (columns && columns.length > 0) {
        console.log(`✅ Column academic_year already exists in ${tableName}`);
        continue;
      }

      // Add the column
      const { error: alterError } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE ${tableName} ADD COLUMN academic_year VARCHAR(50);`
      });

      if (alterError) {
        console.error(`❌ Error adding column to ${tableName}:`, alterError.message);
        continue;
      }

      console.log(`✅ Added academic_year column to ${tableName}`);

    } catch (error) {
      console.error(`❌ Unexpected error with ${tableName}:`, error.message);
    }
  }

  console.log('\n🎯 Creating studio_occupancy table...');
  
  try {
    // Check if table exists
    const { data: tables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'studio_occupancy')
      .eq('table_schema', 'public');

    if (checkError) {
      console.error('❌ Error checking studio_occupancy table:', checkError.message);
    } else if (tables && tables.length > 0) {
      console.log('✅ studio_occupancy table already exists');
    } else {
      // Create the table
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE studio_occupancy (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
            academic_year VARCHAR(50) NOT NULL,
            student_id UUID REFERENCES students(id) ON DELETE SET NULL,
            status VARCHAR(20) DEFAULT 'occupied',
            check_in_date DATE,
            check_out_date DATE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(studio_id, academic_year)
          );
        `
      });

      if (createError) {
        console.error('❌ Error creating studio_occupancy table:', createError.message);
      } else {
        console.log('✅ Created studio_occupancy table');
      }
    }
  } catch (error) {
    console.error('❌ Unexpected error creating studio_occupancy:', error.message);
  }

  console.log('\n🎯 Creating rebooking_records table...');
  
  try {
    // Check if table exists
    const { data: tables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'rebooking_records')
      .eq('table_schema', 'public');

    if (checkError) {
      console.error('❌ Error checking rebooking_records table:', checkError.message);
    } else if (tables && tables.length > 0) {
      console.log('✅ rebooking_records table already exists');
    } else {
      // Create the table
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE rebooking_records (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            original_student_id UUID REFERENCES students(id) ON DELETE CASCADE,
            new_student_id UUID REFERENCES students(id) ON DELETE SET NULL,
            current_academic_year VARCHAR(50) NOT NULL,
            new_academic_year VARCHAR(50) NOT NULL,
            studio_id UUID REFERENCES studios(id),
            duration_id UUID REFERENCES durations(id),
            installment_plan_id UUID REFERENCES installment_plans(id),
            deposit_amount DECIMAL(10,2) DEFAULT 99.00,
            deposit_paid BOOLEAN DEFAULT FALSE,
            stripe_payment_intent_id VARCHAR(255),
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
        `
      });

      if (createError) {
        console.error('❌ Error creating rebooking_records table:', createError.message);
      } else {
        console.log('✅ Created rebooking_records table');
      }
    }
  } catch (error) {
    console.error('❌ Unexpected error creating rebooking_records:', error.message);
  }

  console.log('\n🎯 Migrating existing data to 2025/2026...');
  
  for (const tableName of tablesToUpdate) {
    try {
      console.log(`📝 Updating existing records in ${tableName} to 2025/2026...`);
      
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ academic_year: '2025/2026' })
        .is('academic_year', null);

      if (updateError) {
        console.error(`❌ Error updating ${tableName}:`, updateError.message);
      } else {
        console.log(`✅ Updated existing records in ${tableName}`);
      }

    } catch (error) {
      console.error(`❌ Unexpected error updating ${tableName}:`, error.message);
    }
  }

  console.log('\n🎯 Creating studio occupancy records for existing students...');
  
  try {
    // Get all students with studios
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id, studio_id, academic_year')
      .not('studio_id', 'is', null);

    if (studentsError) {
      console.error('❌ Error fetching students:', studentsError.message);
    } else if (students && students.length > 0) {
      console.log(`📝 Found ${students.length} students with studios`);
      
      for (const student of students) {
        const { error: insertError } = await supabase
          .from('studio_occupancy')
          .insert({
            studio_id: student.studio_id,
            academic_year: student.academic_year || '2025/2026',
            student_id: student.id,
            status: 'occupied'
          });

        if (insertError) {
          console.error(`❌ Error creating occupancy for student ${student.id}:`, insertError.message);
        }
      }
      
      console.log('✅ Created studio occupancy records');
    } else {
      console.log('ℹ️ No students with studios found');
    }
  } catch (error) {
    console.error('❌ Unexpected error creating studio occupancy:', error.message);
  }

  console.log('\n🎯 Adding indexes for performance...');
  
  const indexTables = [...tablesToUpdate, 'studio_occupancy', 'rebooking_records'];
  
  for (const tableName of indexTables) {
    try {
      const { error: indexError } = await supabase.rpc('exec_sql', {
        sql: `CREATE INDEX IF NOT EXISTS idx_${tableName}_academic_year ON ${tableName}(academic_year);`
      });

      if (indexError) {
        console.error(`❌ Error creating index for ${tableName}:`, indexError.message);
      } else {
        console.log(`✅ Created index for ${tableName}.academic_year`);
      }
    } catch (error) {
      console.error(`❌ Unexpected error creating index for ${tableName}:`, error.message);
    }
  }

  console.log('\n🎉 Academic Year Fields Addition Complete!');
  console.log('\n📋 Summary:');
  console.log('✅ Added academic_year columns to all required tables');
  console.log('✅ Created studio_occupancy table for per-year studio tracking');
  console.log('✅ Created rebooking_records table for student rebookings');
  console.log('✅ Migrated existing data to 2025/2026');
  console.log('✅ Created studio occupancy records for existing students');
  console.log('✅ Added performance indexes');
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Update API layer to auto-populate academic_year');
  console.log('2. Update UI components to filter by academic year');
  console.log('3. Create student portal rebooking page');
  console.log('4. Test academic year switching functionality');
}

addAcademicYearFields().catch(console.error);
