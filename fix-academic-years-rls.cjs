const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Need: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixRLSPolicies() {
  console.log('🔧 Fixing Academic Years RLS policies...\n');

  const policies = [
    {
      name: 'Drop old policies',
      sql: `
        DROP POLICY IF EXISTS "Users can view academic years" ON academic_years;
        DROP POLICY IF EXISTS "Admins can manage academic years" ON academic_years;
      `
    },
    {
      name: 'Create read policy',
      sql: `
        CREATE POLICY "authenticated_users_read_academic_years" ON academic_years
          FOR SELECT 
          TO authenticated
          USING (true);
      `
    },
    {
      name: 'Create insert policy',
      sql: `
        CREATE POLICY "admins_insert_academic_years" ON academic_years
          FOR INSERT 
          TO authenticated
          WITH CHECK (
            EXISTS (
              SELECT 1 FROM users 
              WHERE users.id = auth.uid() 
              AND users.role IN ('super_admin', 'admin')
            )
          );
      `
    },
    {
      name: 'Create update policy',
      sql: `
        CREATE POLICY "admins_update_academic_years" ON academic_years
          FOR UPDATE 
          TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM users 
              WHERE users.id = auth.uid() 
              AND users.role IN ('super_admin', 'admin')
            )
          );
      `
    },
    {
      name: 'Create delete policy',
      sql: `
        CREATE POLICY "admins_delete_academic_years" ON academic_years
          FOR DELETE 
          TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM users 
              WHERE users.id = auth.uid() 
              AND users.role IN ('super_admin', 'admin')
            )
          );
      `
    }
  ];

  try {
    for (const policy of policies) {
      console.log(`📝 ${policy.name}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: policy.sql });
      
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        
        // If exec_sql doesn't work, provide manual instructions
        if (error.code === 'PGRST202') {
          console.log('\n⚠️  Cannot execute SQL directly. Please run this SQL manually in Supabase Dashboard:\n');
          console.log('='.repeat(80));
          policies.forEach(p => {
            console.log(`-- ${p.name}`);
            console.log(p.sql.trim());
            console.log('');
          });
          console.log('='.repeat(80));
          return false;
        }
      } else {
        console.log(`✅ ${policy.name} - Success`);
      }
    }

    console.log('\n🎉 RLS policies updated successfully!');
    console.log('Refresh your application and navigate to Data Management → Academic Years');
    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

fixRLSPolicies();
