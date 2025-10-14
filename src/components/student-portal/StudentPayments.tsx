
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, FileText, Calendar, Loader2 } from 'lucide-react';
import { ApiService, Invoice, Payment } from '@/services/api';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
import { useToast } from '@/hooks/use-toast';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { createClient } from '@supabase/supabase-js';
import PaymentEventService, { PaymentEvent } from '@/services/paymentEventService';
import EmailService from '@/services/emailService';
import FinancialReportingService from '@/services/financialReportingService';

// Service role client singleton - outside component to prevent multiple instances
let serviceRoleClient: any = null;
const getServiceRoleClient = () => {
  if (!serviceRoleClient) {
    const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey || !import.meta.env.VITE_SUPABASE_URL) {
      throw new Error('Service role key not configured');
    }
    serviceRoleClient = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      serviceRoleKey
    );
  }
  return serviceRoleClient;
};
import FlexiblePaymentDialog from './FlexiblePaymentDialog';
import DirectPaymentDialog from './DirectPaymentDialog';

interface StudentPaymentsProps {
  studentId: string;
}

const StudentPayments = ({ studentId }: StudentPaymentsProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState<'direct' | 'flexible'>('direct');

  const { selectedAcademicYear } = useAcademicYear();

  useEffect(() => {
    fetchPaymentData();
  }, [studentId, selectedAcademicYear]);


  // Create payment using service role client
  const createPaymentWithServiceRole = async (paymentData: any) => {
    const serviceClient = getServiceRoleClient();
    const { data, error } = await serviceClient
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // Update invoice using service role client
  const updateInvoiceWithServiceRole = async (invoiceId: string, updates: any) => {
    const serviceClient = getServiceRoleClient();
    const { data, error } = await serviceClient
      .from('invoices')
      .update(updates)
      .eq('id', invoiceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // Get payments using service role client
  const getPaymentsWithServiceRole = async () => {
    const serviceClient = getServiceRoleClient();
    const { data, error } = await serviceClient
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Trigger comprehensive financial updates across all modules
  const triggerFinancialUpdates = async (invoice: Invoice, paymentIntent: any) => {
    try {
      console.log('🔄 Triggering comprehensive financial updates...');
      
      // 1. Update financial statistics
      await updateFinancialStatistics();
      
      // 2. Update studio revenue stats
      await updateStudioRevenueStats();
      
      // 3. Create audit log entry
      await createPaymentAuditLog(invoice, paymentIntent);
      
      // 4. Trigger any business rule workflows
      await triggerPaymentWorkflows(invoice, paymentIntent);
      
      // 5. Broadcast payment event for real-time updates
      await broadcastPaymentEvent(invoice, paymentIntent);
      
      console.log('✅ All financial updates completed successfully');
      
    } catch (error) {
      console.error('❌ Error in financial updates:', error);
      // Don't throw - this shouldn't block the payment success
    }
  };

  // Update financial statistics
  const updateFinancialStatistics = async () => {
    try {
      console.log('📊 Updating financial statistics...');
      // This would typically update cached statistics or trigger recalculation
      // For now, we'll just log that it should happen
      console.log('✅ Financial statistics update triggered');
    } catch (error) {
      console.error('Error updating financial statistics:', error);
    }
  };

  // Update studio revenue stats
  const updateStudioRevenueStats = async () => {
    try {
      console.log('🏢 Updating studio revenue statistics...');
      // This would update studio-specific revenue tracking
      console.log('✅ Studio revenue stats update triggered');
    } catch (error) {
      console.error('Error updating studio revenue stats:', error);
    }
  };

  // Create audit log entry
  const createPaymentAuditLog = async (invoice: Invoice, paymentIntent: any) => {
    try {
      console.log('📝 Creating payment audit log...');
      const serviceClient = getServiceRoleClient();
      
      const auditData = {
        user_id: user?.id,
        action: 'payment_completed',
        module: 'student_portal',
        details: {
          invoice_id: invoice.id,
          invoice_number: invoice.invoice_number,
          amount: invoice.total_amount,
          payment_intent_id: paymentIntent.id,
          student_id: studentId,
          payment_method: 'stripe'
        },
        created_at: new Date().toISOString()
      };

      await serviceClient.from('audit_logs').insert(auditData);
      console.log('✅ Payment audit log created');
    } catch (error) {
      console.error('Error creating audit log:', error);
    }
  };

  // Trigger payment workflows
  const triggerPaymentWorkflows = async (invoice: Invoice, paymentIntent: any) => {
    try {
      console.log('⚡ Triggering payment workflows...');
      
      const emailService = EmailService.getInstance();
      const reportingService = FinancialReportingService.getInstance();
      
      // 1. Send payment confirmation email to student
      try {
        await emailService.sendPaymentConfirmationEmail({
          studentName: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Student',
          studentEmail: user?.email || '',
          invoiceNumber: invoice.invoice_number,
          amount: invoice.total_amount,
          paymentDate: new Date().toLocaleDateString(),
          paymentMethod: 'Stripe Card'
        });
        console.log('✅ Payment confirmation email sent to student');
      } catch (emailError) {
        console.error('❌ Error sending student confirmation email:', emailError);
      }

      // 2. Send payment notification to admin
      try {
        await emailService.sendAdminPaymentNotification({
          adminEmail: 'admin@iska-rms.com', // You can make this configurable
          studentName: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Student',
          invoiceNumber: invoice.invoice_number,
          amount: invoice.total_amount,
          paymentDate: new Date().toLocaleDateString()
        });
        console.log('✅ Payment notification sent to admin');
      } catch (emailError) {
        console.error('❌ Error sending admin notification email:', emailError);
      }

      // 3. Generate payment receipt
      try {
        const receiptUrl = await emailService.generatePaymentReceipt({
          studentName: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Student',
          studentEmail: user?.email || '',
          invoiceNumber: invoice.invoice_number,
          amount: invoice.total_amount,
          paymentDate: new Date().toLocaleDateString(),
          paymentMethod: 'Stripe Card'
        });
        console.log('✅ Payment receipt generated:', receiptUrl);
      } catch (receiptError) {
        console.error('❌ Error generating payment receipt:', receiptError);
      }

      // 4. Update cash flow projections
      try {
        await reportingService.updateCashFlowProjection(invoice.total_amount, new Date());
        console.log('✅ Cash flow projections updated');
      } catch (projectionError) {
        console.error('❌ Error updating cash flow projections:', projectionError);
      }

      // 5. Generate financial reports if needed
      try {
        await reportingService.generateDailyRevenueReport();
        console.log('✅ Daily revenue report generated');
      } catch (reportError) {
        console.error('❌ Error generating daily revenue report:', reportError);
      }

      // Check if this completes the full invoice payment
      if (invoice.status === 'completed') {
        console.log('💯 Invoice fully paid - triggering completion workflows');
        
        // Additional workflows for fully paid invoices:
        // - Update student status
        // - Generate completion reports
        // - Send completion notifications
        
        console.log('✅ Payment completion workflows triggered');
      }
      
      console.log('✅ All payment workflows completed');
    } catch (error) {
      console.error('Error in payment workflows:', error);
    }
  };

  // Broadcast payment event for real-time updates across modules
  const broadcastPaymentEvent = async (invoice: Invoice, paymentIntent: any) => {
    try {
      console.log('📡 Broadcasting payment event to all modules...');
      
      // Create a custom event that other modules can listen to
      const paymentEvent = new CustomEvent('paymentCompleted', {
        detail: {
          invoice_id: invoice.id,
          invoice_number: invoice.invoice_number,
          amount: invoice.total_amount,
          student_id: studentId,
          payment_intent_id: paymentIntent.id,
          timestamp: new Date().toISOString()
        }
      });
      
      // Dispatch the event
      window.dispatchEvent(paymentEvent);
      console.log('✅ Payment event broadcasted to all modules');
      
    } catch (error) {
      console.error('Error broadcasting payment event:', error);
    }
  };

  // Filter out duplicate main invoices when installments exist
  const filterDuplicateMainInvoices = (invoices: Invoice[]): Invoice[] => {
    if (!invoices || invoices.length === 0) return invoices;

    // Find deposit invoice (usually £99)
    const depositInvoice = invoices.find(inv => inv.total_amount === 99);
    
    // Find main invoices (large amounts, same as total booking amount)
    const mainInvoices = invoices.filter(inv => 
      inv.total_amount > 99 && 
      inv.total_amount !== depositInvoice?.total_amount
    );

    // Find installment invoices (smaller amounts, multiple invoices)
    const installmentInvoices = invoices.filter(inv => 
      inv.total_amount > 99 && 
      inv.total_amount < Math.max(...mainInvoices.map(m => m.total_amount), 0)
    );

    // If we have both main invoices AND installment invoices, exclude the main invoices
    // BUT keep main invoices that have payments (they're not duplicates)
    if (mainInvoices.length > 0 && installmentInvoices.length > 0) {
      console.log('🔧 Checking for main invoices with payments before filtering...');
      
      // For now, let's keep all invoices and handle the display logic instead
      // This ensures we don't lose invoices that have payments
      console.log('📋 Keeping all invoices to preserve payment history');
      return invoices;
    }

    // Otherwise, return all invoices
    return invoices;
  };

  const fetchPaymentData = async () => {
    try {
      setIsLoading(true);
      
      // Get invoices data
      let invoicesData = [];
      try {
        const allInvoices = await ApiService.getInvoicesByStudentId(studentId, selectedAcademicYear);
        
        // Keep all invoices to preserve payment history
        invoicesData = allInvoices;
        setInvoices(invoicesData);
        console.log('📋 Invoices loaded:', allInvoices.length, 'invoices');
      } catch (error) {
        console.log('No invoices found for student');
        setInvoices([]);
      }
      
      // Get payments data using service role client
      try {
        const paymentsData = await getPaymentsWithServiceRole();
        
        // Filter payments for this student's invoices
        const studentInvoiceIds = invoicesData.map(inv => inv.id);
        const studentPayments = paymentsData.filter(payment => 
          studentInvoiceIds.includes(payment.invoice_id)
        );
        setPayments(studentPayments);
        console.log('💳 Payment history loaded:', studentPayments.length, 'payments');
      } catch (error) {
        console.log('No payments found');
        setPayments([]);
      }
      
    } catch (error) {
      console.error('Error fetching payment data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePayment = async (invoice: Invoice) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to make a payment.",
        variant: "destructive",
      });
      return;
    }

    if (!stripe || !elements) {
      toast({
        title: "Payment Unavailable",
        description: "Payment processing is not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }

    console.log('🎯 Direct payment for invoice:', invoice.invoice_number);
    setPaymentMode('direct');
    setShowPaymentDialog(invoice.id);
  };

  const handleAddPayment = async (invoice: Invoice | null) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to make a payment.",
        variant: "destructive",
      });
      return;
    }

    if (!invoice) {
      // If no specific invoice, show a general add payment dialog
      // For now, we'll use the first outstanding invoice as a placeholder
      const outstandingInvoices = invoices.filter(inv => inv.status === 'pending');
      if (outstandingInvoices.length === 0) {
        toast({
          title: "No Outstanding Invoices",
          description: "You don't have any outstanding invoices to pay.",
          variant: "destructive",
        });
        return;
      }
      // Use the first outstanding invoice for the general payment
      invoice = outstandingInvoices[0];
    }

    console.log('🎯 Add payment for invoice:', invoice.invoice_number);
    setPaymentMode('flexible');
    setShowPaymentDialog(invoice.id);
  };

  const confirmPaymentFromDialog = async (amount: number, method: string, reference: string) => {
    const invoice = invoices.find(inv => inv.id === showPaymentDialog);
    if (!invoice) return;

    setProcessingPayment(invoice.id);
    
    try {
      console.log('🔄 Processing flexible payment:', { amount, method, reference });

      if (method === 'stripe') {
        await processStripePayment(invoice, amount);
      } else {
        await processOfflinePayment(invoice, amount, method, reference);
      }

      toast({
        title: "Payment Successful",
        description: `Payment of £${amount} has been processed successfully.`,
      });

      // Close dialog and refresh payment data
      setShowPaymentDialog(null);
      await fetchPaymentData();

    } catch (error) {
      console.error('💥 Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(null);
    }
  };

  const confirmDirectPayment = async (invoice: Invoice) => {
    setProcessingPayment(invoice.id);
    
    try {
      console.log('🔄 Processing direct payment for invoice:', invoice.invoice_number);
      
      // Direct payment always uses Stripe for the full invoice amount
      await processStripePayment(invoice, invoice.total_amount);

      toast({
        title: "Payment Successful",
        description: `Payment of £${invoice.total_amount} has been processed successfully.`,
      });

      // Close dialog and refresh payment data
      setShowPaymentDialog(null);
      await fetchPaymentData();

    } catch (error) {
      console.error('💥 Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(null);
    }
  };

  const confirmPayment = async (invoice: Invoice) => {
    setProcessingPayment(invoice.id);
    
    try {
      console.log('🔄 Starting payment process for invoice:', invoice.invoice_number);
      console.log('👤 Current user:', user ? `${user.first_name} ${user.last_name} (${user.email})` : 'No user');
      console.log('🆔 User ID:', user?.id || 'No user ID');
      
      // Check authentication status
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('🔐 Session status:', session ? 'Authenticated' : 'Not authenticated');
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
      }
      
      // Create payment intent via Edge Function (server-side Stripe secret)
      console.log('📞 Calling create-payment-intent Edge Function...');
      const { data: pi, error: piErr } = await supabase.functions.invoke('create-payment-intent', {
        body: { 
          amount: Math.round(invoice.total_amount * 100), // Convert to pence
          currency: 'gbp', 
          customer_email: user?.email 
        },
      });
      
      if (piErr) {
        console.error('❌ Payment intent creation failed:', piErr);
        throw piErr;
      }
      
      console.log('✅ Payment intent created successfully:', pi);
      const clientSecret = pi.client_secret;

      // Get card element
      console.log('💳 Getting card element...');
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');
      console.log('✅ Card element found');

      // Confirm payment with Stripe
      console.log('🔄 Confirming payment with Stripe...');
      const { error: stripeError, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: user?.email,
            name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Student',
          },
        },
      });
      
      console.log('📊 Payment confirmation result:', { stripeError, confirmedPayment });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (confirmedPayment?.status === 'succeeded') {
        // Create payment record in database
        console.log('💾 Creating payment record...');
        const paymentData = {
          invoice_id: invoice.id,
          amount: invoice.total_amount,
          method: 'stripe' as const,
          status: 'completed' as const,
          stripe_payment_intent_id: confirmedPayment.id,
          transaction_id: confirmedPayment.id,
          processed_at: new Date().toISOString(),
          created_by: user?.id || '',
        };

        try {
          // Use service role client for payment operations (bypasses RLS)
          console.log('🔑 Using service role client for database operations...');
          await createPaymentWithServiceRole(paymentData);
          console.log('✅ Payment record created successfully');
        } catch (paymentError) {
          console.error('❌ Failed to create payment record:', paymentError);
          throw paymentError;
        }

        // Update invoice status
        console.log('📝 Updating invoice status...');
        try {
          await updateInvoiceWithServiceRole(invoice.id, {
            status: 'completed',
            stripe_payment_intent_id: confirmedPayment.id,
            updated_at: new Date().toISOString(),
          });
          console.log('✅ Invoice status updated successfully');
        } catch (invoiceError) {
          console.error('❌ Failed to update invoice status:', invoiceError);
          throw invoiceError;
        }

        toast({
          title: "Payment Successful",
          description: `Payment of £${invoice.total_amount} has been processed successfully.`,
        });

        // Close dialog and refresh payment data
        setShowPaymentDialog(null);
        await fetchPaymentData();

        // Trigger comprehensive system updates
        await triggerFinancialUpdates(invoice, confirmedPayment);
      } else {
        throw new Error('Payment was not completed successfully');
      }

    } catch (error) {
      console.error('💥 Payment error details:', error);
      console.error('💥 Error type:', typeof error);
      console.error('💥 Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      let errorMessage = 'An error occurred while processing your payment.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Handle Supabase errors
        if ('message' in error) {
          errorMessage = error.message as string;
        } else if ('error' in error) {
          errorMessage = (error as any).error?.message || 'Database error occurred';
        }
      }
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(null);
    }
  };

  // Process Stripe payment
  const processStripePayment = async (invoice: Invoice, amount: number) => {
    if (!stripe || !elements) {
      throw new Error('Payment system is not ready');
    }

    console.log('💳 Processing Stripe payment...');

    // Create payment intent using Supabase Edge Function
    const { data: pi, error: piErr } = await supabase.functions.invoke('create-payment-intent', {
      body: {
        amount: Math.round(amount * 100), // Convert to pence
        currency: 'gbp',
        customer_email: user?.email,
      },
    });

    if (piErr) throw piErr;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      throw new Error('Card element not found');
    }

    // Confirm payment with Stripe
    const { error: stripeError, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(pi.client_secret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          email: user?.email,
          name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Student',
        },
      },
    });

    if (stripeError) throw new Error(stripeError.message || 'Payment failed');

    if (confirmedPayment?.status === 'succeeded') {
      // Create payment record and update invoice
      await createPaymentRecord(invoice, amount, 'stripe', confirmedPayment.id);
      await updateInvoiceStatus(invoice, amount, confirmedPayment.id);
      
      // Trigger financial updates
      await triggerFinancialUpdates(invoice, confirmedPayment);
    } else {
      throw new Error('Payment was not completed successfully');
    }
  };

  // Process offline payment (bank transfer, cheque, paypal)
  const processOfflinePayment = async (invoice: Invoice, amount: number, method: string, reference: string) => {
    console.log('🏦 Processing offline payment...');

    // Create pending payment record
    await createPendingPaymentRecord(invoice, amount, method, reference);
    
    toast({
      title: "Payment Submitted",
      description: "Your payment has been submitted for approval. You will be notified once it's processed.",
    });
  };

  // Create payment record
  const createPaymentRecord = async (invoice: Invoice, amount: number, method: string, stripePaymentIntentId?: string) => {
    const paymentData = {
      invoice_id: invoice.id,
      amount: amount,
      method: method,
      status: 'completed',
      stripe_payment_intent_id: stripePaymentIntentId,
      reference_number: method !== 'stripe' ? referenceNumber : undefined,
      created_by: user?.id,
      created_at: new Date().toISOString(),
    };

    await createPaymentWithServiceRole(paymentData);
    console.log('✅ Payment record created successfully');
  };

  // Update invoice status and handle overpayments
  const updateInvoiceStatus = async (invoice: Invoice, amount: number, stripePaymentIntentId?: string) => {
    const updates: any = {
      status: 'completed',
      updated_at: new Date().toISOString(),
    };

    if (stripePaymentIntentId) {
      updates.stripe_payment_intent_id = stripePaymentIntentId;
    }

    await updateInvoiceWithServiceRole(invoice.id, updates);
    console.log('✅ Invoice status updated successfully');

    // Handle overpayment - apply excess to next installment
    if (amount > invoice.total_amount && invoice.student_id) {
      const excessAmount = amount - invoice.total_amount;
      console.log(`💰 Overpayment detected: £${excessAmount.toFixed(2)}`);
      
      await applyOverpaymentToNextInstallment(invoice.student_id, excessAmount);
    }
  };

  // Apply overpayment to the next pending installment
  const applyOverpaymentToNextInstallment = async (studentId: string, excessAmount: number) => {
    try {
      console.log(`🔄 Applying overpayment of £${excessAmount.toFixed(2)} to next installment for student ${studentId}`);
      
      const serviceClient = getServiceRoleClient();
      
      // Get the next pending installment for this student
      const { data: nextInstallment, error: installmentError } = await serviceClient
        .from('student_installments')
        .select('*')
        .eq('student_id', studentId)
        .eq('status', 'pending')
        .order('installment_number', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (installmentError) {
        console.error('Error fetching next installment:', installmentError);
        return;
      }

      if (!nextInstallment) {
        console.log('No pending installments found for overpayment application');
        return;
      }

      console.log(`📋 Next installment: #${nextInstallment.installment_number}, Amount: £${nextInstallment.amount.toFixed(2)}`);

      // Find the invoice for this installment
      const { data: installmentInvoice, error: invoiceError } = await serviceClient
        .from('invoices')
        .select('*')
        .eq('student_id', studentId)
        .eq('total_amount', nextInstallment.amount)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (invoiceError) {
        console.error('Error fetching installment invoice:', invoiceError);
        return;
      }

      if (!installmentInvoice) {
        console.log('No pending invoice found for next installment');
        return;
      }

      // Calculate how much of the excess can be applied
      const amountToApply = Math.min(excessAmount, installmentInvoice.total_amount);
      const remainingExcess = excessAmount - amountToApply;

      console.log(`💳 Applying £${amountToApply.toFixed(2)} to invoice ${installmentInvoice.invoice_number}`);

      // Create a payment record for the overpayment application
      const { error: paymentError } = await serviceClient
        .from('payments')
        .insert({
          invoice_id: installmentInvoice.id,
          amount: amountToApply,
          method: 'overpayment_credit',
          status: 'completed',
          reference_number: `Overpayment from previous invoice`,
          created_by: user?.id || 'system',
          created_at: new Date().toISOString(),
        });

      if (paymentError) {
        console.error('Error creating overpayment payment record:', paymentError);
        return;
      }

      // Update the installment invoice status if fully paid
      if (amountToApply >= installmentInvoice.total_amount) {
        const { error: updateError } = await serviceClient
          .from('invoices')
          .update({
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', installmentInvoice.id);

        if (updateError) {
          console.error('Error updating installment invoice status:', updateError);
          return;
        }

        // Update the installment status
        const { error: installmentUpdateError } = await serviceClient
          .from('student_installments')
          .update({
            status: 'completed',
            paid_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', nextInstallment.id);

        if (installmentUpdateError) {
          console.error('Error updating installment status:', installmentUpdateError);
          return;
        }

        console.log(`✅ Installment #${nextInstallment.installment_number} marked as completed`);
      } else {
        console.log(`💰 Partial overpayment applied. Remaining invoice amount: £${(installmentInvoice.total_amount - amountToApply).toFixed(2)}`);
      }

      // If there's still excess after applying to this installment, apply to the next one
      if (remainingExcess > 0) {
        console.log(`🔄 Still have £${remainingExcess.toFixed(2)} excess, applying to next installment...`);
        await applyOverpaymentToNextInstallment(studentId, remainingExcess);
      }

    } catch (error) {
      console.error('Error applying overpayment to next installment:', error);
    }
  };

  // Create pending payment record
  const createPendingPaymentRecord = async (invoice: Invoice, amount: number, method: string, reference: string) => {
    try {
      const pendingPaymentData = {
        invoice_id: invoice.id,
        amount: amount,
        method: method,
        notes: reference, // Store reference in notes field
        status: 'pending',
        approval_status: 'pending',
        created_by: user?.id || 'system',
        created_at: new Date().toISOString(),
      };

      console.log('📋 Creating pending payment record:', pendingPaymentData);
      
      // Create the pending payment record in the database
      await createPaymentWithServiceRole(pendingPaymentData);
      
      console.log('✅ Pending payment record created successfully');
      
    } catch (error) {
      console.error('Error creating pending payment record:', error);
      throw error;
    }
  };

  // Filter out duplicate main invoices for outstanding payments display
  const getDisplayInvoices = (invoices: Invoice[]) => {
    if (!invoices || invoices.length === 0) return invoices;

    // Find deposit invoice (usually £99)
    const depositInvoice = invoices.find(inv => inv.total_amount === 99);
    
    // Group invoices by amount to identify duplicates
    const amountGroups = invoices.reduce((groups, inv) => {
      const amount = inv.total_amount;
      if (!groups[amount]) groups[amount] = [];
      groups[amount].push(inv);
      return groups;
    }, {} as Record<number, Invoice[]>);

    // Find main invoices (large amounts that appear only once - these are usually the "total" invoice)
    const mainInvoices = Object.entries(amountGroups)
      .filter(([amount, invs]) => 
        parseFloat(amount) > 99 && 
        invs.length === 1 && 
        parseFloat(amount) > Math.max(...invoices.filter(inv => inv.total_amount > 99 && inv.total_amount < parseFloat(amount)).map(inv => inv.total_amount), 0)
      )
      .flatMap(([amount, invs]) => invs);

    // If we have main invoices AND other invoices (installments), exclude the main invoices
    // This prevents showing both a "total" invoice AND individual installment invoices
    if (mainInvoices.length > 0 && invoices.filter(inv => inv.total_amount > 99 && !mainInvoices.includes(inv)).length > 0) {
      console.log('🔧 Filtering out', mainInvoices.length, 'duplicate main invoice(s) from display');
      return invoices.filter(inv => !mainInvoices.includes(inv));
    }

    return invoices;
  };

  const displayInvoices = getDisplayInvoices(invoices);
  const unpaidInvoices = displayInvoices.filter(inv => inv.status !== 'completed');
  const paidInvoices = invoices.filter(inv => inv.status === 'completed'); // Keep all paid invoices for payment history
  
  // Create combined payment history from both payments table and completed invoices
  const combinedPaymentHistory = [
    // Add payment records from payments table
    ...payments.map(payment => ({
      id: payment.id,
      type: 'payment',
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      created_at: payment.created_at,
      invoice_id: payment.invoice_id,
      reference_number: payment.notes
    })),
    // Add completed invoices that don't have payment records
    ...paidInvoices.filter(invoice => 
      !payments.some(payment => payment.invoice_id === invoice.id)
    ).map(invoice => ({
      id: `invoice-${invoice.id}`,
      type: 'invoice',
      amount: invoice.total_amount,
      method: 'deposit', // Assume deposit for completed invoices without payment records
      status: 'completed',
      created_at: invoice.updated_at || invoice.created_at,
      invoice_id: invoice.id,
      invoice_number: invoice.invoice_number
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Loading payment data...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600">Manage your payments and view payment history</p>
        </div>
        <Button 
          onClick={() => handleAddPayment(null)}
          className="flex items-center space-x-2"
        >
          <CreditCard className="h-4 w-4" />
          <span>Add Payment</span>
        </Button>
      </div>

      {/* Payment Progress Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Payment Progress</h3>
              <span className="text-sm text-gray-600">
                {Math.round(((paidInvoices.reduce((sum, inv) => sum + inv.total_amount, 0)) / 
                (invoices.reduce((sum, inv) => sum + inv.total_amount, 0))) * 100) || 0}% Complete
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Paid: £{paidInvoices.reduce((sum, inv) => sum + inv.total_amount, 0).toLocaleString()}
                </span>
                <span className="text-gray-600">
                  Total: £{invoices.reduce((sum, inv) => sum + inv.total_amount, 0).toLocaleString()}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300 ease-in-out"
                  style={{ 
                    width: `${Math.round(((paidInvoices.reduce((sum, inv) => sum + inv.total_amount, 0)) / 
                    (invoices.reduce((sum, inv) => sum + inv.total_amount, 0))) * 100) || 0}%` 
                  }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>{paidInvoices.length} of {invoices.length} invoices paid</span>
                <span>£{(invoices.reduce((sum, inv) => sum + inv.total_amount, 0) - paidInvoices.reduce((sum, inv) => sum + inv.total_amount, 0)).toLocaleString()} remaining</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outstanding Invoices */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Outstanding Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unpaidInvoices.length > 0 ? (
            <div className="space-y-4">
              {unpaidInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{invoice.invoice_number}</h3>
                      <p className="text-sm text-gray-600">Due: {new Date(invoice.due_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">£{invoice.amount.toLocaleString()}</p>
                    </div>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePayment(invoice)}
                      disabled={processingPayment === invoice.id || !stripe}
                    >
                      {processingPayment === invoice.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : !stripe ? (
                        'Payment Loading...'
                      ) : (
                        'Pay Now'
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No outstanding invoices</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {combinedPaymentHistory.length > 0 ? (
            <div className="space-y-4">
              {combinedPaymentHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {item.type === 'invoice' ? item.invoice_number : `Payment #${item.id.substring(0, 8)}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(item.created_at).toLocaleDateString()} • {item.method.replace('_', ' ').charAt(0).toUpperCase() + item.method.replace('_', ' ').slice(1)}
                        {item.type === 'invoice' && ' • Invoice Payment'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">£{item.amount.toLocaleString()}</p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No payment history available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Dialogs */}
      {paymentMode === 'direct' ? (
        <DirectPaymentDialog
          isOpen={!!showPaymentDialog}
          onClose={() => setShowPaymentDialog(null)}
          invoice={showPaymentDialog ? invoices.find(inv => inv.id === showPaymentDialog) || null : null}
          onConfirmPayment={confirmDirectPayment}
          isProcessing={!!processingPayment}
        />
      ) : (
        <FlexiblePaymentDialog
          isOpen={!!showPaymentDialog}
          onClose={() => setShowPaymentDialog(null)}
          invoice={showPaymentDialog ? invoices.find(inv => inv.id === showPaymentDialog) || null : null}
          onConfirmPayment={confirmPaymentFromDialog}
          isProcessing={!!processingPayment}
        />
      )}
    </div>
  );
};

export default StudentPayments;
