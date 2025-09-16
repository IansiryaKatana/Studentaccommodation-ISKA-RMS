const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixDatabaseErrors() {
  try {
    console.log('🔧 Fixing database errors...');

    // 1. Create subscribers table
    console.log('Creating subscribers table...');
    const { error: subscribersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.subscribers (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          email text NOT NULL UNIQUE,
          first_name text,
          last_name text,
          source text DEFAULT 'public',
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );
      `
    });
    if (subscribersError) console.log('Subscribers table error:', subscribersError.message);

    // 2. Add missing columns to room_grades table
    console.log('Adding columns to room_grades table...');
    const { error: roomGradesError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.room_grades 
        ADD COLUMN IF NOT EXISTS description text,
        ADD COLUMN IF NOT EXISTS photos jsonb,
        ADD COLUMN IF NOT EXISTS amenities jsonb,
        ADD COLUMN IF NOT EXISTS features jsonb;
      `
    });
    if (roomGradesError) console.log('Room grades error:', roomGradesError.message);

    // 3. Add missing columns to module_styles table
    console.log('Adding columns to module_styles table...');
    const { error: moduleStylesError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.module_styles 
        ADD COLUMN IF NOT EXISTS section_name varchar,
        ADD COLUMN IF NOT EXISTS settings jsonb,
        ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());
      `
    });
    if (moduleStylesError) console.log('Module styles error:', moduleStylesError.message);

    // 4. Add unique constraint for module_styles
    console.log('Adding unique constraint to module_styles...');
    const { error: constraintError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.module_styles 
        ADD CONSTRAINT IF NOT EXISTS module_styles_module_section_unique 
        UNIQUE (module_name, section_name);
      `
    });
    if (constraintError) console.log('Constraint error:', constraintError.message);

    // 5. Create trigger function
    console.log('Creating trigger function...');
    const { error: triggerFuncError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = timezone('utc'::text, now());
            RETURN NEW;
        END;
        $$ language 'plpgsql';
      `
    });
    if (triggerFuncError) console.log('Trigger function error:', triggerFuncError.message);

    // 6. Create trigger
    console.log('Creating trigger...');
    const { error: triggerError } = await supabase.rpc('exec_sql', {
      sql: `
        DROP TRIGGER IF EXISTS update_module_styles_updated_at ON public.module_styles;
        CREATE TRIGGER update_module_styles_updated_at 
          BEFORE UPDATE ON public.module_styles 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
      `
    });
    if (triggerError) console.log('Trigger error:', triggerError.message);

    // 7. Enable RLS and add policies for subscribers
    console.log('Setting up RLS for subscribers...');
    const { error: subscribersRlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Enable read access for all users" ON public.subscribers;
        CREATE POLICY "Enable read access for all users" ON public.subscribers
          FOR SELECT USING (true);
        
        DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.subscribers;
        CREATE POLICY "Enable insert for authenticated users only" ON public.subscribers
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      `
    });
    if (subscribersRlsError) console.log('Subscribers RLS error:', subscribersRlsError.message);

    // 8. Enable RLS and add policies for module_styles
    console.log('Setting up RLS for module_styles...');
    const { error: moduleStylesRlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.module_styles ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Enable read access for all users" ON public.module_styles;
        CREATE POLICY "Enable read access for all users" ON public.module_styles
          FOR SELECT USING (true);
        
        DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.module_styles;
        CREATE POLICY "Enable insert for authenticated users only" ON public.module_styles
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
        
        DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.module_styles;
        CREATE POLICY "Enable update for authenticated users only" ON public.module_styles
          FOR UPDATE USING (auth.role() = 'authenticated');
      `
    });
    if (moduleStylesRlsError) console.log('Module styles RLS error:', moduleStylesRlsError.message);

    // 9. Enable RLS and add policies for room_grades
    console.log('Setting up RLS for room_grades...');
    const { error: roomGradesRlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.room_grades ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Enable read access for all users" ON public.room_grades;
        CREATE POLICY "Enable read access for all users" ON public.room_grades
          FOR SELECT USING (true);
        
        DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.room_grades;
        CREATE POLICY "Enable insert for authenticated users only" ON public.room_grades
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
        
        DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.room_grades;
        CREATE POLICY "Enable update for authenticated users only" ON public.room_grades
          FOR UPDATE USING (auth.role() = 'authenticated');
      `
    });
    if (roomGradesRlsError) console.log('Room grades RLS error:', roomGradesRlsError.message);

    console.log('✅ Database fixes completed!');
    
  } catch (error) {
    console.error('❌ Error fixing database:', error);
  }
}

fixDatabaseErrors();
