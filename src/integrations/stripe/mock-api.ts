// Mock API endpoint for creating payment intents
// In production, this would be a real backend endpoint

import { StripeService } from './service';

export const createPaymentIntent = async (data: {
  amount: number;
  currency: string;
  invoice_id: string;
  customer_email: string;
}) => {
  try {
    // In a real implementation, this would call your backend
    // For now, we'll simulate a successful payment intent creation
    
    const mockPaymentIntent = {
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      client_secret: `pi_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: data.amount,
      currency: data.currency,
      status: 'requires_payment_method',
      created: Date.now(),
    };

    return {
      success: true,
      clientSecret: mockPaymentIntent.client_secret,
      paymentIntent: mockPaymentIntent,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
};

// Mock webhook handler for payment confirmations
export const handlePaymentWebhook = async (event: any) => {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        console.log('Payment succeeded:', event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        // Handle failed payment
        console.log('Payment failed:', event.data.object);
        break;
      
      default:
        console.log('Unhandled event type:', event.type);
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw new Error('Webhook handling failed');
  }
};

// Mock function to simulate backend API call
export const mockApiCall = async (endpoint: string, data: any) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  switch (endpoint) {
    case '/api/create-payment-intent':
      return createPaymentIntent(data);
    
    case '/api/stripe-webhook':
      return handlePaymentWebhook(data);
    
    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
}; 