const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addLeadOptionFieldsData() {
  try {
    console.log('Adding lead option fields data...');

    // Check if data already exists
    const { data: existingData, error: checkError } = await supabase
      .from('lead_option_fields')
      .select('*')
      .eq('field_name', 'room_grade');

    if (checkError) {
      console.error('Error checking existing data:', checkError);
      return;
    }

    if (existingData && existingData.length > 0) {
      console.log('Lead option fields data already exists, skipping...');
      return;
    }

    // Insert the data
    const { data, error } = await supabase
      .from('lead_option_fields')
      .insert([
        {
          field_name: 'room_grade',
          field_type: 'select',
          field_label: 'Desired Room Grade',
          is_required: true,
          options: ['Silver', 'Gold', 'Platinum', 'Rhodium', 'Thodium Plus'],
          is_active: true
        },
        {
          field_name: 'duration',
          field_type: 'select',
          field_label: 'Desired Duration',
          is_required: true,
          options: ['45-weeks', '51-weeks', 'Daily', 'Weekly'],
          is_active: true
        },
        {
          field_name: 'response_category',
          field_type: 'select',
          field_label: 'Response Category',
          is_required: false,
          options: ['Hot', 'Warm', 'Cold'],
          is_active: true
        },
        {
          field_name: 'follow_up_stage',
          field_type: 'select',
          field_label: 'Follow-up Stage',
          is_required: false,
          options: ['Initial Contact', 'Information Sent', 'Proposal Sent', 'Follow-up Needed', 'Negotiating'],
          is_active: true
        }
      ]);

    if (error) {
      console.error('Error inserting data:', error);
      return;
    }

    console.log('Successfully added lead option fields data:', data);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addLeadOptionFieldsData(); 