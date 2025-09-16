import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function runMigration() {
  try {
    console.log('Running student fields migration...');

    // Add personal information fields
    console.log('Adding personal information fields...');
    const { error: error1 } = await supabase
      .from('students')
      .select('id')
      .limit(1);
    
    if (error1) {
      console.error('Error accessing students table:', error1);
      return;
    }

    // Since we can't use RPC directly, let's check if the fields exist by trying to select them
    console.log('Checking existing fields...');
    const { data, error } = await supabase
      .from('students')
      .select('id, birthday, ethnicity, gender, ucas_id, country, address_line1, post_code, town, academic_year, year_of_study, field_of_study, guarantor_name, guarantor_email, guarantor_phone, guarantor_relationship, wants_installments, installment_plan_id, deposit_paid, studio_id, total_amount, passport_file_url, visa_file_url, utility_bill_file_url, guarantor_id_file_url, bank_statement_file_url, proof_of_income_file_url, guarantor_address')
      .limit(1);

    if (error) {
      console.log('Some fields are missing. This is expected if the migration hasn\'t been run yet.');
      console.log('Error details:', error.message);
    } else {
      console.log('All fields are present in the students table!');
      console.log('Available fields:', Object.keys(data[0] || {}));
    }

    console.log('Migration check completed. If fields are missing, they need to be added manually in the Supabase dashboard.');
  } catch (error) {
    console.error('Migration check failed:', error);
  }
}

runMigration();
