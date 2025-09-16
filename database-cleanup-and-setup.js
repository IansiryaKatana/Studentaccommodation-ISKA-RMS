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
      'students', 'student_bookings', 'invoices', 'payments', 
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
    
    // Check student bookings without students
    const { data: orphanedBookings, error: bookingError } = await supabase
      .from('student_bookings')
      .select('*, students!inner(*)')
      .limit(10);
    
    if (bookingError) {
      console.log('❌ Error checking orphaned bookings:', bookingError.message);
    } else {
      console.log(`✅ Student bookings with valid students: ${orphanedBookings?.length || 0}`);
    }
    
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
      'student_bookings',
      'student_agreements',
      'students'
    ];
    
    for (const table of tablesToClean) {
      console.log(`🗑️ Cleaning ${table}...`);
      
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', 0); // Delete all records
      
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
      date_of_birth: '1995-03-15',
      address: '123 Main St, City, State 12345',
      emergency_contact: 'Jane Doe',
      emergency_phone: '+1234567891',
      medical_conditions: 'None',
      allergies: 'None',
      status: 'active',
      enrollment_date: new Date().toISOString(),
      notes: 'New student created for testing'
    },
    {
      first_name: 'Sarah',
      last_name: 'Smith',
      email: 'sarah.smith@example.com',
      phone: '+1234567892',
      date_of_birth: '1998-07-22',
      address: '456 Oak Ave, City, State 12345',
      emergency_contact: 'Mike Smith',
      emergency_phone: '+1234567893',
      medical_conditions: 'Asthma',
      allergies: 'Peanuts',
      status: 'active',
      enrollment_date: new Date().toISOString(),
      notes: 'New student created for testing'
    },
    {
      first_name: 'Michael',
      last_name: 'Johnson',
      email: 'michael.johnson@example.com',
      phone: '+1234567894',
      date_of_birth: '1993-11-08',
      address: '789 Pine Rd, City, State 12345',
      emergency_contact: 'Lisa Johnson',
      emergency_phone: '+1234567895',
      medical_conditions: 'None',
      allergies: 'None',
      status: 'active',
      enrollment_date: new Date().toISOString(),
      notes: 'New student created for testing'
    },
    {
      first_name: 'Emily',
      last_name: 'Brown',
      email: 'emily.brown@example.com',
      phone: '+1234567896',
      date_of_birth: '1997-04-12',
      address: '321 Elm St, City, State 12345',
      emergency_contact: 'David Brown',
      emergency_phone: '+1234567897',
      medical_conditions: 'None',
      allergies: 'Shellfish',
      status: 'active',
      enrollment_date: new Date().toISOString(),
      notes: 'New student created for testing'
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

async function createStudentBookings(students) {
  console.log('\n📅 Creating student bookings...');
  
  if (!students || students.length === 0) {
    console.log('❌ No students available for bookings');
    return;
  }
  
  // Get available studios
  const { data: studios, error: studioError } = await supabase
    .from('studios')
    .select('*')
    .limit(5);
  
  if (studioError || !studios || studios.length === 0) {
    console.log('❌ No studios available for bookings');
    return;
  }
  
  const bookings = [];
  const startDate = new Date();
  
  students.forEach((student, index) => {
    const studio = studios[index % studios.length];
    const bookingDate = new Date(startDate);
    bookingDate.setDate(startDate.getDate() + index + 1);
    
    bookings.push({
      student_id: student.id,
      studio_id: studio.id,
      booking_date: bookingDate.toISOString().split('T')[0],
      start_time: '09:00:00',
      end_time: '11:00:00',
      duration_hours: 2,
      status: 'confirmed',
      notes: `Booking for ${student.first_name} ${student.last_name}`,
      created_at: new Date().toISOString()
    });
  });
  
  try {
    const { data: createdBookings, error } = await supabase
      .from('student_bookings')
      .insert(bookings)
      .select();
    
    if (error) {
      console.error('❌ Error creating bookings:', error);
      return [];
    }
    
    console.log(`✅ Created ${createdBookings.length} student bookings successfully`);
    return createdBookings;
    
  } catch (error) {
    console.error('❌ Error creating bookings:', error);
    return [];
  }
}

async function createInvoices(students, bookings) {
  console.log('\n💰 Creating invoices...');
  
  if (!students || students.length === 0) {
    console.log('❌ No students available for invoices');
    return;
  }
  
  const invoices = [];
  
  students.forEach((student, index) => {
    const booking = bookings?.[index];
    const baseAmount = 50.00; // Base amount per session
    const taxRate = 0.08; // 8% tax
    const taxAmount = baseAmount * taxRate;
    const totalAmount = baseAmount + taxAmount;
    
    invoices.push({
      student_id: student.id,
      booking_id: booking?.id || null,
      invoice_number: `INV-${Date.now()}-${index + 1}`,
      amount: baseAmount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      status: 'pending',
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      description: `Invoice for ${student.first_name} ${student.last_name} - Studio Session`,
      notes: 'Generated automatically',
      created_at: new Date().toISOString()
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
    return;
  }
  
  const agreements = students.map(student => ({
    student_id: student.id,
    agreement_type: 'studio_usage',
    status: 'active',
    terms_accepted: true,
    agreement_date: new Date().toISOString(),
    expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
    notes: `Agreement for ${student.first_name} ${student.last_name}`,
    created_at: new Date().toISOString()
  }));
  
  try {
    const { data: createdAgreements, error } = await supabase
      .from('student_agreements')
      .insert(agreements)
      .select();
    
    if (error) {
      console.error('❌ Error creating agreements:', error);
      return [];
    }
    
    console.log(`✅ Created ${createdAgreements.length} student agreements successfully`);
    return createdAgreements;
    
  } catch (error) {
    console.error('❌ Error creating agreements:', error);
    return [];
  }
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
    
    // Step 4: Create student bookings
    const bookings = await createStudentBookings(students);
    
    // Step 5: Create invoices
    const invoices = await createInvoices(students, bookings);
    
    // Step 6: Create student agreements
    const agreements = await createStudentAgreements(students);
    
    console.log('\n✅ Database cleanup and setup completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Students created: ${students.length}`);
    console.log(`   - Bookings created: ${bookings.length}`);
    console.log(`   - Invoices created: ${invoices.length}`);
    console.log(`   - Agreements created: ${agreements.length}`);
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
  }
}

// Run the script
main();
