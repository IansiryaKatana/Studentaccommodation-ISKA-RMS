const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Database configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createStudentBookingsTable() {
  console.log('🔧 Creating student_bookings table...\n');
  
  try {
    // Create the student_bookings table using raw SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.student_bookings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
          studio_id UUID REFERENCES public.studios(id) ON DELETE CASCADE,
          booking_date DATE NOT NULL,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL,
          duration_hours DECIMAL(4,2) NOT NULL,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_student_bookings_student_id ON public.student_bookings(student_id);
        CREATE INDEX IF NOT EXISTS idx_student_bookings_studio_id ON public.student_bookings(studio_id);
        CREATE INDEX IF NOT EXISTS idx_student_bookings_booking_date ON public.student_bookings(booking_date);
        CREATE INDEX IF NOT EXISTS idx_student_bookings_status ON public.student_bookings(status);
        
        -- Enable RLS
        ALTER TABLE public.student_bookings ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies
        CREATE POLICY "Enable read access for authenticated users" ON public.student_bookings
          FOR SELECT USING (auth.role() = 'authenticated');
        
        CREATE POLICY "Enable insert access for authenticated users" ON public.student_bookings
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
        
        CREATE POLICY "Enable update access for authenticated users" ON public.student_bookings
          FOR UPDATE USING (auth.role() = 'authenticated');
        
        CREATE POLICY "Enable delete access for authenticated users" ON public.student_bookings
          FOR DELETE USING (auth.role() = 'authenticated');
      `
    });
    
    if (error) {
      console.error('❌ Error creating student_bookings table:', error);
      return false;
    }
    
    console.log('✅ Student_bookings table created successfully');
    
    // Verify the table was created
    const { data: testData, error: testError } = await supabase
      .from('student_bookings')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error verifying table creation:', testError);
      return false;
    }
    
    console.log('✅ Student_bookings table is accessible');
    return true;
    
  } catch (error) {
    console.error('❌ Error creating student_bookings table:', error);
    return false;
  }
}

// Run the script
createStudentBookingsTable();
