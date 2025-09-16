import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import { Invoice } from '@/services/api';

interface FlexiblePaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onConfirmPayment: (amount: number, method: string, reference: string) => Promise<void>;
  isProcessing: boolean;
}

const FlexiblePaymentDialog: React.FC<FlexiblePaymentDialogProps> = ({
  isOpen,
  onClose,
  invoice,
  onConfirmPayment,
  isProcessing
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState<string>('stripe');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [errors, setErrors] = useState<{ amount?: string; reference?: string }>({});

  // Initialize payment amount when invoice changes
  useEffect(() => {
    if (invoice) {
      setPaymentAmount(invoice.total_amount.toString());
    }
  }, [invoice]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setPaymentMethod('stripe');
      setReferenceNumber('');
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: { amount?: string; reference?: string } = {};

    // Validate amount
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Please enter a valid payment amount';
    } else if (invoice && amount < invoice.total_amount) {
      newErrors.amount = `Minimum payment amount is £${invoice.total_amount}`;
    }

    // Validate reference number for non-Stripe payments
    if (paymentMethod !== 'stripe' && !referenceNumber.trim()) {
      newErrors.reference = 'Reference number is required for this payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validateForm()) return;

    const amount = parseFloat(paymentAmount);
    await onConfirmPayment(amount, paymentMethod, referenceNumber);
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'stripe': return 'Credit/Debit Card (Stripe)';
      case 'bank_transfer': return 'Direct Bank Transfer';
      case 'cheque': return 'Cheque';
      case 'paypal': return 'PayPal';
      default: return method;
    }
  };

  const isStripeMethod = paymentMethod === 'stripe';

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
          <DialogDescription>
            Pay for invoice {invoice.invoice_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Invoice Details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{invoice.invoice_number}</p>
                <p className="text-sm text-gray-600">
                  Due: {new Date(invoice.due_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">£{invoice.total_amount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Amount Due</p>
              </div>
            </div>
          </div>

          {/* Payment Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount (£)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min={invoice.total_amount}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder={`Minimum: £${invoice.total_amount}`}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stripe">Credit/Debit Card (Stripe)</SelectItem>
                <SelectItem value="bank_transfer">Direct Bank Transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reference Number (for non-Stripe payments) */}
          {!isStripeMethod && (
            <div className="space-y-2">
              <Label htmlFor="reference">
                Reference Number/ID/Account Number *
              </Label>
              <Input
                id="reference"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder={
                  paymentMethod === 'bank_transfer' ? 'Bank transfer reference' :
                  paymentMethod === 'cheque' ? 'Cheque number' :
                  'PayPal transaction ID'
                }
              />
              {errors.reference && (
                <p className="text-sm text-red-600">{errors.reference}</p>
              )}
            </div>
          )}

          {/* Stripe Card Element */}
          {isStripeMethod && stripe && elements && (
            <div className="space-y-2">
              <Label>Card Details</Label>
              <div className="p-4 border rounded-lg">
                <CardElement
                  options={{
                    hidePostalCode: true,
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              {isStripeMethod ? (
                'Your payment will be processed immediately via Stripe.'
              ) : (
                'Your payment will be submitted for approval. You will be notified once it\'s processed.'
              )}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing || !stripe}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              `Pay £${paymentAmount || '0'}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FlexiblePaymentDialog;
