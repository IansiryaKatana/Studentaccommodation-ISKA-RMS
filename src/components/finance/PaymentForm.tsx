import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import { initializeStripe } from '@/integrations/stripe/client';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe dynamically
const stripePromise = initializeStripe();

interface PaymentFormProps {
  invoiceId: string;
  amount: number;
  customerEmail: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  total_amount: number;
  due_date: string;
  status: string;
  reservation?: {
    reservation_number: string;
    studios?: {
      studio_number: string;
    };
  };
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const CheckoutForm: React.FC<{
  invoice: Invoice;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ invoice, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'cash' | 'check'>('card');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Stripe Not Configured",
        description: "Please configure your Stripe keys in Settings > Config Management to enable card payments.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // For non-card payments, create a manual payment record
      if (paymentMethod !== 'card') {
        await ApiService.createPayment({
          invoice_id: invoice.id,
          amount: invoice.total_amount,
          method: paymentMethod,
          status: 'completed',
          created_by: 'system', // In real app, get from auth context
        });

        toast({
          title: "Payment Successful",
          description: `${paymentMethod.toUpperCase()} payment recorded successfully.`,
        });
        onSuccess();
        return;
      }

      // For card payments, use Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment intent (using mock API for testing)
      const { mockApiCall } = await import('@/integrations/stripe/mock-api');
      const result = await mockApiCall('/api/create-payment-intent', {
        amount: invoice.total_amount * 100, // Convert to cents
        currency: 'gbp',
        invoice_id: invoice.id,
        customer_email: 'test@example.com', // In real app, get from auth context
      });

      if (!result.success) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = result;

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: 'test@example.com', // In real app, get from auth context
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Create payment record
        await ApiService.createPayment({
          invoice_id: invoice.id,
          amount: invoice.total_amount,
          method: 'stripe',
          status: 'completed',
          stripe_payment_intent_id: paymentIntent.id,
          created_by: 'system', // In real app, get from auth context
        });

        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="payment-method">Payment Method</Label>
          <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Credit/Debit Card</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="check">Check</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {paymentMethod === 'card' && (
          <div>
            <Label>Card Details</Label>
            <div className="mt-2 p-3 border rounded-md">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
        )}

        {paymentMethod !== 'card' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                {paymentMethod === 'bank_transfer' && 'Bank transfer details will be provided after booking confirmation.'}
                {paymentMethod === 'cash' && 'Cash payments can be made at our office during business hours.'}
                {paymentMethod === 'check' && 'Please make checks payable to ISKA RMS and mail to our office.'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay £{invoice.total_amount.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = ({
  invoiceId,
  amount,
  customerEmail,
  onSuccess,
  onCancel,
}) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const data = await ApiService.getInvoiceById(invoiceId);
      setInvoice(data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      // For testing purposes, create a mock invoice if the real one doesn't exist
      if (invoiceId === 'test-invoice-123') {
        setInvoice({
          id: 'test-invoice-123',
          invoice_number: 'INV-TEST-001',
          amount: amount,
          total_amount: amount,
          due_date: new Date().toISOString(),
          status: 'pending',
          reservation: {
            reservation_number: 'RES-TEST-001',
            studios: {
              studio_number: 'S101'
            }
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentDialog(false);
    onSuccess?.();
  };

  const handlePaymentCancel = () => {
    setShowPaymentDialog(false);
    onCancel?.();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6 text-center">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">Invoice not found</p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Complete your payment for invoice {invoice.invoice_number}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Invoice Number</Label>
              <p className="text-sm text-muted-foreground">{invoice.invoice_number}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Amount Due</Label>
              <p className="text-lg font-semibold">£{invoice.total_amount.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Due Date</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(invoice.due_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge variant={invoice.status === 'pending' ? 'default' : 'secondary'}>
                {invoice.status}
              </Badge>
            </div>
          </div>

          {invoice.reservation && (
            <div className="p-3 bg-gray-50 rounded-md">
              <Label className="text-sm font-medium">Reservation Details</Label>
              <p className="text-sm text-muted-foreground">
                {invoice.reservation.reservation_number}
                {invoice.reservation.studios && ` - Studio ${invoice.reservation.studios.studio_number}`}
              </p>
            </div>
          )}

          <Button
            onClick={() => setShowPaymentDialog(true)}
            className="w-full"
            disabled={invoice.status !== 'pending'}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Now
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Enter your payment details to complete the transaction.
            </DialogDescription>
          </DialogHeader>
          
          <Elements stripe={stripePromise}>
            <CheckoutForm
              invoice={invoice}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </Elements>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentForm; 