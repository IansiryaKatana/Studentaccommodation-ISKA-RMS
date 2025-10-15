// Debug script to check existing students and their invoices
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qjqjqjqjqjqjqjqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcWpxanFqcWpxanFqcWpxanFqcWoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjQ5NzQwMCwiZXhwIjoyMDUyMDczNDAwfQ.example';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugExistingInvoices() {
  console.log('🔍 Debugging existing students and invoices...\n');
  
  try {
    // Get all students
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id, first_name, last_name, email, academic_year, created_at')
      .order('created_at', { ascending: false });
    
    if (studentsError) {
      console.error('❌ Error fetching students:', studentsError);
      return;
    }
    
    console.log(`📊 Found ${students.length} students:`);
    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.first_name} ${student.last_name} (${student.email}) - Academic Year: ${student.academic_year} - Created: ${student.created_at}`);
    });
    
    console.log('\n🔍 Checking invoices for each student...\n');
    
    // Check invoices for each student
    for (const student of students) {
      console.log(`\n👤 Student: ${student.first_name} ${student.last_name} (${student.id})`);
      
      // Get invoices for this student
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('student_id', student.id)
        .order('created_at', { ascending: false });
      
      if (invoicesError) {
        console.error(`❌ Error fetching invoices for ${student.first_name}:`, invoicesError);
        continue;
      }
      
      if (invoices && invoices.length > 0) {
        console.log(`✅ Found ${invoices.length} invoices:`);
        invoices.forEach((invoice, index) => {
          console.log(`  ${index + 1}. ${invoice.invoice_number} - ${invoice.type} - £${invoice.total_amount} - Status: ${invoice.status} - Academic Year: ${invoice.academic_year}`);
        });
      } else {
        console.log(`❌ No invoices found for ${student.first_name}`);
      }
    }
    
    // Also check all invoices in the system
    console.log('\n🔍 All invoices in the system:');
    const { data: allInvoices, error: allInvoicesError } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allInvoicesError) {
      console.error('❌ Error fetching all invoices:', allInvoicesError);
      return;
    }
    
    console.log(`📊 Total invoices in system: ${allInvoices.length}`);
    allInvoices.forEach((invoice, index) => {
      console.log(`${index + 1}. ${invoice.invoice_number} - Student: ${invoice.student_id} - Type: ${invoice.type} - £${invoice.total_amount} - Academic Year: ${invoice.academic_year}`);
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugExistingInvoices();
