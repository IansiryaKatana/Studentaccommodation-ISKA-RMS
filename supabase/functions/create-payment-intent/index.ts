// Deno Edge Function: create-payment-intent
// Creates a Stripe PaymentIntent server-side and returns client_secret

type Input = {
  amount: number; // in minor units (pence)
  currency?: string; // default gbp
  customer_email?: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body: Input = await req.json();
    const { amount, currency = 'gbp', customer_email } = body;
    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid amount' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const secret = Deno.env.get('STRIPE_SECRET_KEY');
    if (!secret) {
      return new Response(JSON.stringify({ error: 'Stripe secret not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const form = new URLSearchParams();
    form.set('amount', String(amount));
    form.set('currency', currency);
    // Enable automatic payment methods for simpler integration
    form.set('automatic_payment_methods[enabled]', 'true');
    if (customer_email) form.set('metadata[customer_email]', customer_email);

    const resp = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });
    const json = await resp.json();
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: json?.error?.message || 'Stripe error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ id: json.id, client_secret: json.client_secret }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
}

Deno.serve(handler);


