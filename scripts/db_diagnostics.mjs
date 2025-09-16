import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !serviceKey) {
  console.error('Missing env: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
const anon = anonKey ? createClient(url, anonKey, { auth: { persistSession: false } }) : null;

async function checkTableExists(table) {
  try {
    const { error } = await admin.from(table).select('id', { head: true, count: 'exact' }).limit(1);
    if (error && error.code === '42P01') return { exists: false };
    if (error) return { exists: true, note: `select head error: ${error.message}` };
    return { exists: true };
  } catch (e) {
    return { exists: false, note: String(e) };
  }
}

async function main() {
  console.log('Supabase diagnostics starting...');
  console.log('URL present:', !!url, 'Service key present:', !!serviceKey);

  // Students recent
  const { data: recentStudents, error: studentsErr } = await admin
    .from('students')
    .select('id, first_name, last_name, email, total_amount, wants_installments, installment_plan_id, deposit_paid, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  if (studentsErr) console.log('students error:', studentsErr);
  console.log('Recent students:', recentStudents?.map(s => ({ id: s.id, email: s.email, total_amount: s.total_amount, plan: s.installment_plan_id, deposit_paid: s.deposit_paid })) ?? []);

  // student_installments existence and sample rows
  const installmentsTable = await checkTableExists('student_installments');
  console.log('student_installments exists:', installmentsTable.exists, installmentsTable.note ? `note: ${installmentsTable.note}` : '');
  if (installmentsTable.exists) {
    const { data: recentInst, error: instErr, count: instCount } = await admin
      .from('student_installments')
      .select('id, student_id, installment_number, amount, due_date, status, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(10);
    if (instErr) console.log('student_installments error:', instErr);
    console.log('student_installments count:', instCount ?? 'unknown');
    console.log('Recent student_installments:', recentInst ?? []);
  }

  // invoices schema: does student_id exist?
  let invoicesHasStudentId = null;
  try {
    const { error } = await admin.from('invoices').select('id, student_id').limit(1);
    if (error) {
      if ((error.message || '').toLowerCase().includes("could not find the 'student_id'")) {
        invoicesHasStudentId = false;
      } else {
        console.log('invoices select id,student_id error:', error.message);
        invoicesHasStudentId = false; // assume absent if unknown
      }
    } else {
      invoicesHasStudentId = true;
    }
  } catch (e) {
    invoicesHasStudentId = false;
  }
  console.log('invoices has student_id column:', invoicesHasStudentId);

  // Recent invoices (last 24h)
  const sinceIso = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { data: recentInvoices, error: invErr } = await admin
    .from('invoices')
    .select('id, invoice_number, amount, total_amount, due_date, status, created_by, created_at')
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false })
    .limit(25);
  if (invErr) console.log('invoices error:', invErr);
  console.log('Recent invoices (24h):', recentInvoices ?? []);

  // Test anon access to student_installments (infer RLS)
  if (anon) {
    try {
      const { data, error } = await anon.from('student_installments').select('id').limit(1);
      if (error) console.log('anon student_installments error (RLS likely active):', error.code, error.message);
      else console.log('anon student_installments sample:', data);
    } catch (e) {
      console.log('anon student_installments thrown:', String(e));
    }
  }

  console.log('Diagnostics complete.');
}

main().catch(e => {
  console.error('Diagnostics failed:', e);
  process.exit(1);
});


