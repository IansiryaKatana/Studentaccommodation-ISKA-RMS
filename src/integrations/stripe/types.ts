export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  booking_id: string;
  customer_email: string;
  metadata?: Record<string, string>;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

export interface StripeInvoice {
  id: string;
  amount_paid: number;
  amount_due: number;
  currency: string;
  status: string;
  customer: string;
  created: number;
  due_date?: number;
} 