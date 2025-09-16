const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function describeMaintenanceTable() {
  try {
    console.log('🔧 Describing maintenance_requests table...');

    // Try to get table info using information_schema
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'maintenance_requests')
      .eq('table_schema', 'public');

    if (error) {
      console.error('❌ Error querying information_schema:', error);
      
      // Try a different approach - just try to select with different column names
      console.log('🔍 Trying to identify columns by testing different names...');
      
      const testColumns = [
        'id', 'student_id', 'title', 'description', 'category', 'priority', 'status',
        'notes', 'created_at', 'updated_at', 'user_id', 'request_type', 'issue_type'
      ];
      
      for (const col of testColumns) {
        try {
          const { error: testError } = await supabase
            .from('maintenance_requests')
            .select(col)
            .limit(1);
          
          if (!testError) {
            console.log(`✅ Column exists: ${col}`);
          } else {
            console.log(`❌ Column doesn't exist: ${col}`);
          }
        } catch (e) {
          console.log(`❌ Column doesn't exist: ${col}`);
        }
      }
      
    } else {
      console.log('📋 Table columns:');
      data.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the check
describeMaintenanceTable();

