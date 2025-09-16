// Deno Edge Function: create-tourist-invoice
// Creates invoice for tourist booking using service role

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

type Input = {
  reservationId: string;
  amount: number;
  createdBy: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const { reservationId, amount, createdBy }: Input = await req.json();
    if (!reservationId || !amount) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Use non-reserved secret names set via supabase secrets
    const supabaseUrl = Deno.env.get('SERVICE_SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    
    // resolve created_by to a valid users.id to satisfy FK
    let createdById = createdBy || '';
    if (!createdById) {
      const { data: anyUser } = await admin.from('users').select('id').limit(1).single();
      createdById = anyUser?.id || '';
    }
    if (!createdById) {
      return new Response(JSON.stringify({ error: 'No valid created_by user found. Create at least one user or pass createdBy.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // verify reservation exists
    const { data: reservation, error: reservationErr } = await admin.from('reservations').select('id, check_in_date').eq('id', reservationId).single();
    if (reservationErr || !reservation) {
      return new Response(JSON.stringify({ error: 'Reservation not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const createdAt = new Date().toISOString();

    // establish base sequence for this batch
    const { year, seq } = await getBaseSeq(admin);

    // create tourist invoice
    const invoice = await createInvoiceWithRetry(admin, year, seq, {
      reservation_id: reservationId,
      amount: amount,
      tax_amount: 0,
      total_amount: amount,
      due_date: reservation.check_in_date,
      status: 'pending',
      created_by: createdById,
    });

    return new Response(JSON.stringify({ 
      success: true, 
      invoice 
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Error creating tourist invoice:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
}

export { handler };
