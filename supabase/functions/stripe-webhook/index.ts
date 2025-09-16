// Deno Edge Function: stripe-webhook
// Handles Stripe webhook events for payment processing

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the webhook secret from environment
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Get the request body and signature
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Verify the webhook signature
    const crypto = await import('https://deno.land/std@0.208.0/crypto/mod.ts');
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const timestamp = signature.split(',')[0].split('=')[1];
    const v1 = signature.split(',')[1].split('=')[1];
    const payload = `${timestamp}.${body}`;
    
    const signatureToVerify = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const signatureHex = Array.from(new Uint8Array(signatureToVerify))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (signatureHex !== v1) {
      console.error('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Parse the event
    const event: StripeEvent = JSON.parse(body);
    console.log(`Received webhook event: ${event.type}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing');
      return new Response(JSON.stringify({ error: 'Supabase not configured' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object, supabase);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object, supabase);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object, supabase);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object, supabase);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any, supabase: any) {
  console.log('Payment succeeded:', paymentIntent.id);
  
  // Update payment status in your database
  const { error } = await supabase
    .from('payments')
    .update({ 
      status: 'succeeded',
      stripe_payment_intent_id: paymentIntent.id,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  if (error) {
    console.error('Error updating payment:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: any, supabase: any) {
  console.log('Payment failed:', paymentIntent.id);
  
  // Update payment status in your database
  const { error } = await supabase
    .from('payments')
    .update({ 
      status: 'failed',
      stripe_payment_intent_id: paymentIntent.id,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  if (error) {
    console.error('Error updating payment:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: any, supabase: any) {
  console.log('Invoice payment succeeded:', invoice.id);
  
  // Update invoice status in your database
  const { error } = await supabase
    .from('invoices')
    .update({ 
      status: 'paid',
      stripe_invoice_id: invoice.id,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_invoice_id', invoice.id);

  if (error) {
    console.error('Error updating invoice:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: any, supabase: any) {
  console.log('Invoice payment failed:', invoice.id);
  
  // Update invoice status in your database
  const { error } = await supabase
    .from('invoices')
    .update({ 
      status: 'payment_failed',
      stripe_invoice_id: invoice.id,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_invoice_id', invoice.id);

  if (error) {
    console.error('Error updating invoice:', error);
  }
}

Deno.serve(handler);
