const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndFixDatabase() {
  try {
    console.log('🔍 Checking database structure...');

    // Check if subscribers table exists
    const { data: subscribersCheck, error: subscribersError } = await supabase
      .from('subscribers')
      .select('count')
      .limit(1);
    
    if (subscribersError && subscribersError.code === '42P01') {
      console.log('❌ Subscribers table does not exist - creating it...');
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE public.subscribers (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            email text NOT NULL UNIQUE,
            first_name text,
            last_name text,
            source text DEFAULT 'public',
            created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
          );
        `
      });
      if (createError) console.log('Error creating subscribers:', createError.message);
      else console.log('✅ Subscribers table created');
    } else {
      console.log('✅ Subscribers table exists');
    }

    // Check module_styles table structure
    const { data: moduleStylesCheck, error: moduleStylesError } = await supabase
      .from('module_styles')
      .select('*')
      .limit(1);
    
    if (moduleStylesError) {
      console.log('❌ Error checking module_styles:', moduleStylesError.message);
    } else {
      console.log('✅ module_styles table exists');
      
      // Check if section_name column exists
      const { data: columnCheck, error: columnError } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'module_styles' 
          AND column_name = 'section_name';
        `
      });
      
      if (columnError || !columnCheck || columnCheck.length === 0) {
        console.log('❌ section_name column missing - adding it...');
        const { error: addError } = await supabase.rpc('exec_sql', {
          sql: `
            ALTER TABLE public.module_styles 
            ADD COLUMN section_name varchar,
            ADD COLUMN settings jsonb,
            ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());
          `
        });
        if (addError) console.log('Error adding columns:', addError.message);
        else console.log('✅ Added missing columns to module_styles');
      } else {
        console.log('✅ section_name column exists');
      }
    }

    // Check room_grades table structure
    const { data: roomGradesCheck, error: roomGradesError } = await supabase
      .from('room_grades')
      .select('*')
      .limit(1);
    
    if (roomGradesError) {
      console.log('❌ Error checking room_grades:', roomGradesError.message);
    } else {
      console.log('✅ room_grades table exists');
      
      // Check if description column exists
      const { data: descCheck, error: descError } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'room_grades' 
          AND column_name = 'description';
        `
      });
      
      if (descError || !descCheck || descCheck.length === 0) {
        console.log('❌ Missing columns in room_grades - adding them...');
        const { error: addError } = await supabase.rpc('exec_sql', {
          sql: `
            ALTER TABLE public.room_grades 
            ADD COLUMN description text,
            ADD COLUMN photos jsonb,
            ADD COLUMN amenities jsonb,
            ADD COLUMN features jsonb;
          `
        });
        if (addError) console.log('Error adding columns:', addError.message);
        else console.log('✅ Added missing columns to room_grades');
      } else {
        console.log('✅ room_grades has all required columns');
      }
    }

    console.log('✅ Database check and fix completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAndFixDatabase();
