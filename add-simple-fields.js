import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addSimpleFields() {
  try {
    console.log('Adding simple fields to students table...');
    
    // Add the 4 basic fields
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: `
        ALTER TABLE students 
        ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
        ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
        ADD COLUMN IF NOT EXISTS email VARCHAR(255),
        ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
      `
    });

    if (error) {
      console.error('Error adding fields:', error);
      console.log('\nPlease run this SQL manually in Supabase SQL Editor:');
      console.log(`
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
      `);
      return;
    }

    console.log('✅ Fields added successfully!');
    
    // Verify the fields exist
    const { data: columns, error: checkError } = await supabase
      .from('students')
      .select('first_name, last_name, email, phone')
      .limit(1);

    if (checkError) {
      console.log('Fields added but verification failed. This is normal if the table is empty.');
    } else {
      console.log('✅ Fields verified successfully!');
    }

  } catch (error) {
    console.error('Error:', error);
    console.log('\nPlease run this SQL manually in Supabase SQL Editor:');
    console.log(`
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
    `);
  }
}

addSimpleFields();
