// Deno Edge Function: create-student-invoices
// Creates deposit, main, and installment invoices and stores student_installments

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

type Input = {
  studentId: string;
  totalAmount: number;
  depositAmount: number;
  installmentPlanId?: string;
  durationId?: string;
  createdBy?: string;
  depositPaid?: boolean;
  academicYear?: string;
};

type Json = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateDueDates(count: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(now);
    d.setMonth(d.getMonth() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

async function getBaseSeq(admin: any): Promise<{ year: number; seq: number }> {
  const y = new Date().getFullYear();
  const { data } = await admin
    .from('invoices')
    .select('invoice_number')
    .order('created_at', { ascending: false })
    .limit(1);
  let seq = 1;
  if (data && data.length > 0) {
    const m = /INV-(\d{4})-(\d{4})/.exec(data[0].invoice_number);
    if (m && parseInt(m[1]) === y) seq = parseInt(m[2]) + 1;
  }
  return { year: y, seq };
}

function buildInvoiceNumber(year: number, seq: number): string {
  return `INV-${year}-${String(seq).padStart(4, '0')}`;
}

async function createInvoiceWithRetry(admin: any, year: number, startSeq: number, payload: any, maxAttempts = 15) {
  for (let i = 0; i < maxAttempts; i++) {
    const invoice_number = buildInvoiceNumber(year, startSeq + i);
    const insert = { ...payload, invoice_number };
    const { data, error } = await admin.from('invoices').insert(insert).select().single();
    if (!error) return data;
    // duplicate key
    if (error.code === '23505') continue;
    throw new Error(JSON.stringify(error));
  }
  throw new Error('Unable to generate unique invoice_number after retries');
}

async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { studentId, totalAmount, depositAmount, installmentPlanId, createdBy, depositPaid, academicYear }: Input = await req.json();
    if (!studentId || !totalAmount || depositAmount == null) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Use non-reserved secret names set via supabase secrets
    const supabaseUrl = Deno.env.get('SERVICE_SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    // resolve created_by to a valid users.id to satisfy FK
    let createdById = createdBy || '';
    if (!createdById) {
      const { data: anyUser } = await admin.from('users').select('id').limit(1).maybeSingle();
      createdById = anyUser?.id || '';
    }
    if (!createdById) {
      return new Response(JSON.stringify({ error: 'No valid created_by user found. Create at least one user or pass createdBy.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // verify student exists
    const { data: student, error: studentErr } = await admin.from('students').select('id').eq('id', studentId).single();
    if (studentErr || !student) {
      return new Response(JSON.stringify({ error: 'Student not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Get installment plan
    let plan: any = null;
    if (installmentPlanId) {
      const { data: p, error } = await admin.from('installment_plans').select('*').eq('id', installmentPlanId).single();
      if (error) {
        return new Response(JSON.stringify({ error: `Installment plan not found: ${error.message}` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      plan = p;
    }

    const invoices: any[] = [];
    const createdAt = new Date().toISOString();

    // establish base sequence for this batch
    const { year, seq } = await getBaseSeq(admin);
    let nextSeq = seq;

    // deposit invoice (always create)
    const depInv = await createInvoiceWithRetry(admin, year, nextSeq, {
      reservation_id: null,
      student_id: studentId,
      amount: depositAmount,
      tax_amount: 0,
      total_amount: depositAmount,
      due_date: createdAt.split('T')[0],
      status: depositPaid ? 'completed' : 'pending',
      created_by: createdById,
      academic_year: academicYear,
    });
    invoices.push(depInv);
    nextSeq += 1;

    // If deposit is paid, create a payment record
    if (depositPaid && depositAmount > 0) {
      const { error: paymentError } = await admin.from('payments').insert({
        invoice_id: depInv.id,
        amount: depositAmount,
        method: 'deposit',
        status: 'completed',
        reference_number: `DEP-${studentId.substring(0, 8)}-${Date.now()}`,
        created_by: createdById,
        created_at: createdAt,
      });

      if (paymentError) {
        console.error('Error creating deposit payment record:', paymentError);
        // Don't throw error - this shouldn't block invoice creation
      } else {
        console.log('✅ Deposit payment record created');
      }
    }

    const installments: any[] = [];
    const installmentInvoices: any[] = [];
    let mainInv: any = null;

    if (plan && plan.number_of_installments > 0) {
      // When installments exist, skip main invoice - installments will cover the remaining amount
      const remaining = Math.max(0, totalAmount - depositAmount);
      const base = Math.ceil(remaining / plan.number_of_installments);
      const last = remaining - base * (plan.number_of_installments - 1);
      const dueDates: string[] = Array.isArray(plan.due_dates) && plan.due_dates.length > 0
        ? plan.due_dates
        : generateDueDates(plan.number_of_installments);

      // build inserts
      const installmentRows = [] as any[];
      const invoiceRows = [] as any[];
      for (let i = 0; i < plan.number_of_installments; i++) {
        const amount = i === plan.number_of_installments - 1 ? last : base;
        const due = dueDates[i] || generateDueDates(plan.number_of_installments)[i];
        installmentRows.push({
          student_id: studentId,
          installment_plan_id: plan.id,
          installment_number: i + 1,
          due_date: due,
          amount,
          status: 'pending',
          created_at: createdAt,
        });
        invoiceRows.push({
          reservation_id: null,
          student_id: studentId,
          amount,
          tax_amount: 0,
          total_amount: amount,
          due_date: due,
          status: 'pending',
          created_by: createdById,
          academic_year: academicYear,
        });
      }

      // inserts
      const { data: storedInst, error: instErr } = await admin
        .from('student_installments')
        .upsert(installmentRows, { onConflict: 'student_id,installment_plan_id,installment_number' })
        .select();
      if (instErr) throw new Error(JSON.stringify(instErr));
      installments.push(...(storedInst ?? []));

      // Insert installment invoices with retry per row to avoid unique conflicts
      for (const row of invoiceRows) {
        const inv = await createInvoiceWithRetry(admin, year, nextSeq, row);
        nextSeq += 1;
        installmentInvoices.push(inv);
        invoices.push(inv);
      }
    } else {
      // When no installments, create main invoice for the remaining amount
      mainInv = await createInvoiceWithRetry(admin, year, nextSeq, {
        reservation_id: null,
        student_id: studentId,
        amount: totalAmount - depositAmount, // Remaining amount after deposit
        tax_amount: 0,
        total_amount: totalAmount - depositAmount,
        due_date: createdAt.split('T')[0],
        status: 'pending',
        created_by: createdById,
        academic_year: academicYear,
      });
      invoices.push(mainInv);
      nextSeq += 1;
    }

    const body: Json = {
      depositInvoice: depInv,
      mainInvoice: mainInv,
      installmentInvoices,
      installments,
    };
    return new Response(JSON.stringify(body), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('Edge Function error:', e);
    const msg = e instanceof Error ? e.message : (() => { try { return JSON.stringify(e); } catch { return String(e); } })();
    console.error('Error message:', msg);
    return new Response(JSON.stringify({ error: msg, details: e }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
}

Deno.serve(handler);


