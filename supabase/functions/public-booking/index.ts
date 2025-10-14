// Deno Edge Function: public-booking
// Handles public booking form submission with confirmed deposit (Stripe reference received from client)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

type Input = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  duration_id: string;
  room_grade_id: string;
  installment_plan_id: string;
  total_amount: number;
  deposit_amount: number;
  stripe_payment_intent_id: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body: Input = await req.json();
    const {
      first_name, last_name, email, phone,
      duration_id, room_grade_id, installment_plan_id,
      total_amount, deposit_amount, stripe_payment_intent_id,
    } = body;
    if (!first_name || !last_name || !email || !duration_id || !room_grade_id || !installment_plan_id || !total_amount || !deposit_amount || !stripe_payment_intent_id) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUrl = Deno.env.get('SERVICE_SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    // Get the current academic year from the database
    const { data: currentAcademicYear, error: yearError } = await admin
      .from('academic_years')
      .select('name')
      .eq('is_current', true)
      .single()

    let academicYear = '2025/2026' // Fallback default
    if (!yearError && currentAcademicYear) {
      academicYear = currentAcademicYear.name
    } else {
      console.log('Could not fetch current academic year, using fallback:', academicYear)
    }

    // Create minimal student
    const { data: student, error: studentErr } = await admin
      .from('students')
      .insert({
        first_name, last_name, email, phone,
        studio_id: null,
        room_grade_id,
        academic_year: academicYear, // Use current academic year from database
        wants_installments: true,
        installment_plan_id,
        deposit_paid: true,
        total_amount,
      })
      .select('*')
      .single();
    if (studentErr) throw new Error(JSON.stringify(studentErr));

    // Create invoices and installments
    const { data: invs, error: invErr } = await admin.functions.invoke('create-student-invoices', {
      body: {
        studentId: student.id,
        totalAmount: total_amount,
        depositAmount: deposit_amount,
        installmentPlanId: installment_plan_id,
      },
      // Use service role to call the other function from server-side
      headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
    });
    if (invErr) throw new Error(JSON.stringify(invErr));

    // Mark deposit invoice paid
    const depositInvoice = invs?.depositInvoice;
    if (depositInvoice?.id) {
      const { error: payErr } = await admin.from('payments').insert({
        invoice_id: depositInvoice.id,
        amount: depositInvoice.total_amount,
        method: 'stripe',
        status: 'completed',
        stripe_payment_intent_id,
        created_by: 'system',
      });
      if (payErr) throw new Error(JSON.stringify(payErr));
      const { error: updErr } = await admin.from('invoices').update({ status: 'completed', stripe_payment_intent_id }).eq('id', depositInvoice.id);
      if (updErr) throw new Error(JSON.stringify(updErr));
    }

    return new Response(JSON.stringify({ student_id: student.id, deposit_invoice_id: invs?.depositInvoice?.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : (() => { try { return JSON.stringify(e); } catch { return String(e); } })();
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
}

Deno.serve(handler);


