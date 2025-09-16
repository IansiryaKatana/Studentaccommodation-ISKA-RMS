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

async function checkDatabaseDiscrepancies() {
  console.log('🔍 Checking database for discrepancies...');
  
  try {
    // Check all relevant tables
    const tables = [
      'students', 'invoices', 'payments', 
      'student_agreements', 'studios', 'room_grades', 'pricing_matrix'
    ];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(5);
      
      if (error) {
        console.log(`❌ Error accessing ${table}:`, error.message);
      } else {
        console.log(`✅ ${table}: ${data?.length || 0} records found`);
      }
    }
    
    // Check for orphaned records
    console.log('\n🔍 Checking for orphaned records...');
    
    // Check invoices without students
    const { data: orphanedInvoices, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, students!inner(*)')
      .limit(10);
    
    if (invoiceError) {
      console.log('❌ Error checking orphaned invoices:', invoiceError.message);
    } else {
      console.log(`✅ Invoices with valid students: ${orphanedInvoices?.length || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

async function removeExistingData() {
  console.log('\n🗑️ Removing existing student records and invoices...');
  
  try {
    // Delete in correct order to avoid foreign key constraints
    const tablesToClean = [
      'payments',
      'invoices', 
      'student_agreements',
      'students'
    ];
    
    for (const table of tablesToClean) {
      console.log(`🗑️ Cleaning ${table}...`);
      
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
      
      if (error) {
        console.log(`❌ Error cleaning ${table}:`, error.message);
      } else {
        console.log(`✅ ${table} cleaned successfully`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error removing existing data:', error);
  }
}

async function createNewStudents() {
  console.log('\n👥 Creating new students...');
  
  const students = [
    {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      birthday: '1995-03-15',
      address_line1: '123 Main St',
      post_code: 'G1 1AA',
      town: 'Glasgow',
      country: 'United Kingdom',
      ethnicity: 'White British',
      gender: 'Male',
      ucas_id: 'UCAS001',
      academic_year: '2024-2025',
      year_of_study: '2',
      field_of_study: 'Computer Science',
      guarantor_name: 'Jane Doe',
      guarantor_email: 'jane.doe@email.com',
      guarantor_phone: '+1234567891',
      guarantor_relationship: 'Mother',
      wants_installments: true,
      deposit_paid: true,
      total_amount: 5000
    },
    {
      first_name: 'Sarah',
      last_name: 'Smith',
      email: 'sarah.smith@example.com',
      phone: '+1234567892',
      birthday: '1998-07-22',
      address_line1: '456 Oak Ave',
      post_code: 'G2 2BB',
      town: 'Glasgow',
      country: 'United Kingdom',
      ethnicity: 'White British',
      gender: 'Female',
      ucas_id: 'UCAS002',
      academic_year: '2024-2025',
      year_of_study: '1',
      field_of_study: 'Psychology',
      guarantor_name: 'Mike Smith',
      guarantor_email: 'mike.smith@email.com',
      guarantor_phone: '+1234567893',
      guarantor_relationship: 'Father',
      wants_installments: true,
      deposit_paid: false,
      total_amount: 4500
    },
    {
      first_name: 'Michael',
      last_name: 'Johnson',
      email: 'michael.johnson@example.com',
      phone: '+1234567894',
      birthday: '1993-11-08',
      address_line1: '789 Pine Rd',
      post_code: 'G3 3CC',
      town: 'Glasgow',
      country: 'United Kingdom',
      ethnicity: 'Black British',
      gender: 'Male',
      ucas_id: 'UCAS003',
      academic_year: '2024-2025',
      year_of_study: '3',
      field_of_study: 'Engineering',
      guarantor_name: 'Lisa Johnson',
      guarantor_email: 'lisa.johnson@email.com',
      guarantor_phone: '+1234567895',
      guarantor_relationship: 'Sister',
      wants_installments: false,
      deposit_paid: true,
      total_amount: 5500
    },
    {
      first_name: 'Emily',
      last_name: 'Brown',
      email: 'emily.brown@example.com',
      phone: '+1234567896',
      birthday: '1997-04-12',
      address_line1: '321 Elm St',
      post_code: 'G4 4DD',
      town: 'Glasgow',
      country: 'United Kingdom',
      ethnicity: 'Asian British',
      gender: 'Female',
      ucas_id: 'UCAS004',
      academic_year: '2024-2025',
      year_of_study: '2',
      field_of_study: 'Business',
      guarantor_name: 'David Brown',
      guarantor_email: 'david.brown@email.com',
      guarantor_phone: '+1234567897',
      guarantor_relationship: 'Father',
      wants_installments: true,
      deposit_paid: true,
      total_amount: 4800
    }
  ];
  
  try {
    const { data: createdStudents, error } = await supabase
      .from('students')
      .insert(students)
      .select();
    
    if (error) {
      console.error('❌ Error creating students:', error);
      return [];
    }
    
    console.log(`✅ Created ${createdStudents.length} students successfully`);
    return createdStudents;
    
  } catch (error) {
    console.error('❌ Error creating students:', error);
    return [];
  }
}

async function createInvoices(students) {
  console.log('\n💰 Creating invoices...');
  
  if (!students || students.length === 0) {
    console.log('❌ No students available for invoices');
    return;
  }
  
  // Get the admin user ID
  const { data: adminUser, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'admin@iska-rms.com')
    .single();
  
  if (userError || !adminUser) {
    console.error('❌ Error getting admin user:', userError);
    return [];
  }
  
  const invoices = [];
  
  students.forEach((student, index) => {
    const baseAmount = 500.00; // Base amount per session
    const taxRate = 0.20; // 20% VAT
    const taxAmount = baseAmount * taxRate;
    const totalAmount = baseAmount + taxAmount;
    
    invoices.push({
      invoice_number: `INV-${Date.now()}-${index + 1}`,
      reservation_id: null, // No reservation for student bookings
      amount: baseAmount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      status: 'pending',
      created_by: adminUser.id // Use actual admin user ID
    });
  });
  
  try {
    const { data: createdInvoices, error } = await supabase
      .from('invoices')
      .insert(invoices)
      .select();
    
    if (error) {
      console.error('❌ Error creating invoices:', error);
      return [];
    }
    
    console.log(`✅ Created ${createdInvoices.length} invoices successfully`);
    return createdInvoices;
    
  } catch (error) {
    console.error('❌ Error creating invoices:', error);
    return [];
  }
}

async function createStudentAgreements(students) {
  console.log('\n📋 Creating student agreements...');
  
  if (!students || students.length === 0) {
    console.log('❌ No students available for agreements');
    return [];
  }
  
  console.log('⚠️ Skipping student agreements creation due to schema issues');
  return [];
}

async function main() {
  console.log('🚀 Starting database cleanup and setup...\n');
  
  try {
    // Step 1: Check for discrepancies
    await checkDatabaseDiscrepancies();
    
    // Step 2: Remove existing data
    await removeExistingData();
    
    // Step 3: Create new students
    const students = await createNewStudents();
    
    // Step 4: Create invoices
    const invoices = await createInvoices(students);
    
    // Step 5: Create student agreements
    const agreements = await createStudentAgreements(students);
    
    console.log('\n✅ Database cleanup and setup completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Students created: ${students.length}`);
    console.log(`   - Invoices created: ${invoices.length}`);
    console.log(`   - Agreements created: ${agreements.length}`);
    
    console.log('\n📋 Note: The invoices you see in the student invoices page are dynamically generated from student data and installment plans.');
    console.log('   The invoices created in this script are stored in the invoices table and will appear in the main invoices list.');
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
  }
}

// Run the script
main();
