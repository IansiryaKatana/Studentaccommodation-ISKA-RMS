import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import { Invoice } from '@/services/api';

interface DirectPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onConfirmPayment: (invoice: Invoice) => Promise<void>;
  isProcessing: boolean;
}

const DirectPaymentDialog: React.FC<DirectPaymentDialogProps> = ({
  isOpen,
  onClose,
  invoice,
  onConfirmPayment,
  isProcessing
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleConfirm = async () => {
    if (!invoice) return;
    await onConfirmPayment(invoice);
  };

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Enter your card details to complete the payment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Invoice Details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{invoice.invoice_number}</h3>
                <p className="text-sm text-gray-600">
                  Due: {new Date(invoice.due_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">£{invoice.total_amount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Stripe Card Element */}
          {stripe && elements && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Card Details</label>
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
              Your payment will be processed immediately via Stripe.
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
              `Pay £${invoice.total_amount.toFixed(2)}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DirectPaymentDialog;
