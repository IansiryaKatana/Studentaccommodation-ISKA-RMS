// Migration script to update existing students with missing booking data
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateStudentBookingData() {
  try {
    console.log('🔍 Checking for students with missing booking data...');
    
    // Get all students that are missing booking data
    const { data: students, error } = await supabase
      .from('students')
      .select(`
        id,
        first_name,
        last_name,
        studio_id,
        check_in_date,
        duration_name,
        duration_type
      `)
      .is('check_in_date', null)
      .not('studio_id', 'is', null);

    if (error) {
      console.error('Error fetching students:', error);
      return;
    }

    console.log(`📊 Found ${students.length} students with missing booking data`);

    if (students.length === 0) {
      console.log('✅ All students already have booking data!');
      return;
    }

    // Get available durations to set default values
    const { data: durations } = await supabase
      .from('durations')
      .select('*')
      .eq('duration_type', 'student')
      .eq('is_active', true);

    const defaultDuration = durations?.[0]; // Use first available duration

    if (!defaultDuration) {
      console.error('❌ No default duration found');
      return;
    }

    console.log(`📅 Using default duration: ${defaultDuration.name}`);

    // Update each student with default booking data
    for (const student of students) {
      try {
        const updateData = {
          check_in_date: defaultDuration.check_in_date,
          duration_name: defaultDuration.name,
          duration_type: defaultDuration.duration_type,
          updated_at: new Date().toISOString()
        };

        const { error: updateError } = await supabase
          .from('students')
          .update(updateData)
          .eq('id', student.id);

        if (updateError) {
          console.error(`❌ Error updating student ${student.first_name} ${student.last_name}:`, updateError);
        } else {
          console.log(`✅ Updated student: ${student.first_name} ${student.last_name}`);
        }
      } catch (error) {
        console.error(`❌ Error processing student ${student.first_name} ${student.last_name}:`, error);
      }
    }

    console.log('🎉 Migration completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
updateStudentBookingData();
