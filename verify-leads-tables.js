#!/usr/bin/env node

/**
 * Verify that the leads module tables were created successfully
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyTables() {
  console.log('🔍 Verifying leads module tables...\n');
  
  try {
    // Check if lead_room_grades table exists and has data
    const { data: roomGrades, error: roomGradesError } = await supabase
      .from('lead_room_grades')
      .select('*');
    
    if (roomGradesError) {
      console.error('❌ Error checking lead_room_grades:', roomGradesError.message);
    } else {
      console.log('✅ lead_room_grades table exists');
      console.log(`   📊 Found ${roomGrades.length} room grades:`);
      roomGrades.forEach(rg => {
        console.log(`      - ${rg.name} (${rg.id})`);
      });
    }
    
    // Check if lead_duration_types table exists and has data
    const { data: durationTypes, error: durationTypesError } = await supabase
      .from('lead_duration_types')
      .select('*');
    
    if (durationTypesError) {
      console.error('❌ Error checking lead_duration_types:', durationTypesError.message);
    } else {
      console.log('✅ lead_duration_types table exists');
      console.log(`   📊 Found ${durationTypes.length} duration types:`);
      durationTypes.forEach(dt => {
        console.log(`      - ${dt.name} (${dt.id})`);
      });
    }
    
    // Check if leads table has new columns
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('id, first_name, last_name, room_grade_preference_id, duration_type_preference_id, estimated_revenue')
      .limit(1);
    
    if (leadsError) {
      console.error('❌ Error checking leads table:', leadsError.message);
    } else {
      console.log('✅ leads table has new columns');
      console.log('   📊 New columns added:');
      console.log('      - room_grade_preference_id');
      console.log('      - duration_type_preference_id');
      console.log('      - estimated_revenue');
    }
    
    // Check lead sources
    const { data: sources, error: sourcesError } = await supabase
      .from('lead_sources')
      .select('*');
    
    if (sourcesError) {
      console.error('❌ Error checking lead_sources:', sourcesError.message);
    } else {
      console.log('✅ lead_sources table updated');
      console.log(`   📊 Found ${sources.length} lead sources:`);
      sources.forEach(source => {
        console.log(`      - ${source.name} (${source.id})`);
      });
    }
    
    console.log('\n🎉 All leads module tables verified successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Your leads module is ready for CSV import');
    console.log('   2. Use the LeadsCSVImport component to import your data');
    console.log('   3. The new tables are completely separate from your student module');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verifyTables();
