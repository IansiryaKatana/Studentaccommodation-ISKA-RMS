import { supabase } from '../supabase/client';
import type { 
  StripePaymentIntent, 
  CreatePaymentIntentRequest, 
  StripeCustomer,
  StripeInvoice 
} from './types';

const STRIPE_API_BASE = import.meta.env.VITE_STRIPE_API_BASE || 'https://api.stripe.com/v1';

export class StripeService {
  private static async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${STRIPE_API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Create a payment intent
  static async createPaymentIntent(data: CreatePaymentIntentRequest | any): Promise<StripePaymentIntent> {
    const formData = new URLSearchParams({
      amount: data.amount.toString(),
      currency: data.currency,
      // Stripe supports customer, but not direct customer_email in PI creation.
      // We pass email via metadata for test simplicity.
      // customer_email: data.customer_email,
      metadata: JSON.stringify({
        booking_id: data.booking_id,
        ...data.metadata,
      }),
    });

    return this.makeRequest('/payment_intents', {
      method: 'POST',
      body: formData,
    });
  }

  // Create or get a customer
  static async createCustomer(email: string, name?: string, phone?: string): Promise<StripeCustomer> {
    const formData = new URLSearchParams({
      email,
      ...(name && { name }),
      ...(phone && { phone }),
    });

    return this.makeRequest('/customers', {
      method: 'POST',
      body: formData,
    });
  }

  // Get customer by email
  static async getCustomerByEmail(email: string): Promise<StripeCustomer | null> {
    const customers = await this.makeRequest(`/customers?email=${encodeURIComponent(email)}`);
    return customers.data.length > 0 ? customers.data[0] : null;
  }

  // Create an invoice
  static async createInvoice(customerId: string, amount: number, currency: string = 'gbp'): Promise<StripeInvoice> {
    const formData = new URLSearchParams({
      customer: customerId,
      currency,
      collection_method: 'charge_automatically',
      auto_advance: 'true',
    });

    const invoice = await this.makeRequest('/invoices', {
      method: 'POST',
      body: formData,
    });

    // Add invoice item
    const itemFormData = new URLSearchParams({
      invoice: invoice.id,
      amount: amount.toString(),
      currency,
      description: 'Room booking payment',
    });

    await this.makeRequest('/invoiceitems', {
      method: 'POST',
      body: itemFormData,
    });

    return invoice;
  }

  // Finalize and pay invoice
  static async finalizeAndPayInvoice(invoiceId: string): Promise<StripeInvoice> {
    // Finalize the invoice
    await this.makeRequest(`/invoices/${invoiceId}/finalize`, {
      method: 'POST',
    });

    // Pay the invoice
    return this.makeRequest(`/invoices/${invoiceId}/pay`, {
      method: 'POST',
    });
  }

  // Get payment intent by ID
  static async getPaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent> {
    return this.makeRequest(`/payment_intents/${paymentIntentId}`);
  }

  // Refund a payment
  static async refundPayment(paymentIntentId: string, amount?: number): Promise<any> {
    const formData = new URLSearchParams({
      payment_intent: paymentIntentId,
      ...(amount && { amount: amount.toString() }),
    });

    return this.makeRequest('/refunds', {
      method: 'POST',
      body: formData,
    });
  }

  // Save payment record to Supabase
  static async savePaymentRecord(paymentData: {
    invoice_id: string;
    amount: number;
    method: string;
    stripe_payment_intent_id: string;
    status: string;
    created_by: string;
  }) {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save payment record: ${error.message}`);
    }

    return data;
  }

  // Update invoice status in Supabase
  static async updateInvoiceStatus(invoiceId: string, status: string, stripePaymentIntentId?: string) {
    const updateData: any = { status };
    if (stripePaymentIntentId) {
      updateData.stripe_payment_intent_id = stripePaymentIntentId;
    }

    const { data, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', invoiceId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update invoice status: ${error.message}`);
    }

    return data;
  }
} 