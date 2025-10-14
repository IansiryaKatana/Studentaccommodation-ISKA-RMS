const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addCurrencyTimezoneColumns() {
  try {
    console.log('Adding currency and timezone columns to branding table...');
    
    // Add currency column
    const { error: currencyError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE branding ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'GBP';`
    });
    
    if (currencyError) {
      console.log('Currency column error:', currencyError);
    } else {
      console.log('✅ Currency column added successfully');
    }
    
    // Add timezone column
    const { error: timezoneError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE branding ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'Europe/London';`
    });
    
    if (timezoneError) {
      console.log('Timezone column error:', timezoneError);
    } else {
      console.log('✅ Timezone column added successfully');
    }
    
    // Update existing branding record with default values
    const { error: updateError } = await supabase
      .from('branding')
      .update({
        currency: 'GBP',
        timezone: 'Europe/London'
      })
      .is('currency', null);
    
    if (updateError) {
      console.log('Update error:', updateError);
    } else {
      console.log('✅ Existing branding records updated with default values');
    }
    
    // Verify the changes
    const { data, error: selectError } = await supabase
      .from('branding')
      .select('id, company_name, currency, timezone')
      .single();
    
    if (selectError) {
      console.log('Select error:', selectError);
    } else {
      console.log('✅ Verification successful:');
      console.log('Company:', data.company_name);
      console.log('Currency:', data.currency);
      console.log('Timezone:', data.timezone);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

addCurrencyTimezoneColumns();
