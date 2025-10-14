const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runAcademicYearsMigration() {
  console.log('🚀 Running Academic Years migration...');

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20250109000007_create_academic_years_table.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      return false;
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('📄 Migration file loaded');

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`\n🔄 Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Some errors are expected (like "already exists")
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate key') ||
              error.message.includes('relation already exists')) {
            console.log(`⚠️  Statement ${i + 1}: ${error.message} (skipping)`);
            continue;
          } else {
            console.error(`❌ Statement ${i + 1} failed:`, error.message);
            return false;
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (execError) {
        console.error(`❌ Statement ${i + 1} execution error:`, execError.message);
        return false;
      }
    }

    // Verify the table was created
    console.log('\n🔍 Verifying table creation...');
    const { data, error: selectError } = await supabase
      .from('academic_years')
      .select('*')
      .order('start_date', { ascending: false });

    if (selectError) {
      console.error('❌ Error verifying table:', selectError);
      return false;
    }

    console.log('🎉 Academic Years migration completed successfully!');
    console.log('📊 Found', data.length, 'academic years:');
    data.forEach(year => {
      console.log(`   - ${year.name} (${year.start_date} to ${year.end_date}) ${year.is_current ? '[CURRENT]' : ''}`);
    });

    return true;

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return false;
  }
}

// Run the migration
runAcademicYearsMigration()
  .then(success => {
    if (success) {
      console.log('\n✅ Migration complete! You can now use the Academic Years management system.');
    } else {
      console.log('\n❌ Migration failed. Please check the errors above.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
