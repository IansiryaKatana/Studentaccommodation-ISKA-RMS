import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ApiService, Student, Studio, Duration, InstallmentPlan, RebookingRecord } from '@/services/api';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  CreditCard, 
  Home, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ArrowRight,
  User,
  Building
} from 'lucide-react';
import { format } from 'date-fns';
import { initializeStripe } from '@/integrations/stripe/client';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Helper functions for calculating academic year dates (same as DurationsManagement)
const calculateCheckInDate = (academicYear: string): string => {
  const year = parseInt(academicYear.split('/')[0]);
  return `${year}-09-01`;
};

const calculateCheckOutDate = (academicYear: string): string => {
  const year = parseInt(academicYear.split('/')[1]);
  return `${year}-07-01`;
};

// Stripe is now initialized at the route level in StudentPortal

// Rebooking Payment Dialog Component (same pattern as DirectPaymentDialog)
const RebookingPaymentDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  rebookingData: RebookingFormData;
  nextAcademicYear: string;
  onConfirmPayment: () => Promise<void>;
  isProcessing: boolean;
}> = ({ isOpen, onClose, rebookingData, nextAcademicYear, onConfirmPayment, isProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleConfirm = async () => {
    await onConfirmPayment();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Rebooking Payment</DialogTitle>
          <DialogDescription>
            Pay your deposit to secure your booking for {nextAcademicYear}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rebooking Details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Rebooking Deposit</h3>
                <p className="text-sm text-gray-600">
                  Academic Year: {nextAcademicYear}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">£{rebookingData.depositAmount.toFixed(2)}</p>
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
              `Pay £${rebookingData.depositAmount.toFixed(2)}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface StudentRebookingProps {
  studentId: string;
}

interface RebookingFormData {
  studioId: string;
  durationId: string;
  installmentPlanId?: string;
  depositAmount: number;
}


const StudentRebooking: React.FC<StudentRebookingProps> = ({ studentId }) => {
  const { toast } = useToast();
  const { selectedAcademicYear, availableAcademicYears } = useAcademicYear();
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [student, setStudent] = useState<Student | null>(null);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [durations, setDurations] = useState<Duration[]>([]);
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRebooking, setIsRebooking] = useState(false);
  const [showRebookingDialog, setShowRebookingDialog] = useState(false);
  const [rebookingData, setRebookingData] = useState<RebookingFormData>({
    studioId: '',
    durationId: '',
    installmentPlanId: '',
    depositAmount: 99
  });

  // Get next academic year
  const getNextAcademicYear = (): string => {
    if (!selectedAcademicYear || selectedAcademicYear === 'all') {
      return '2026/2027'; // Default fallback
    }
    
    const currentIndex = availableAcademicYears.indexOf(selectedAcademicYear);
    if (currentIndex < availableAcademicYears.length - 1) {
      return availableAcademicYears[currentIndex + 1];
    }
    
    // If no next year exists, create one based on current year
    const currentYear = selectedAcademicYear.split('/')[1]; // Get the end year (e.g., "2026" from "2025/2026")
    const nextYear = parseInt(currentYear) + 1;
    const yearAfter = nextYear + 1;
    return `${nextYear}/${yearAfter}`;
  };

  const nextAcademicYear = getNextAcademicYear();

  useEffect(() => {
    loadData();
  }, [studentId, selectedAcademicYear]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load student data
      const studentData = await ApiService.getStudentById(studentId);
      setStudent(studentData);

      // Load available studios for next academic year
      const studiosData = await ApiService.getStudios();
      setStudios(studiosData);

      // Load durations (filter to only active student durations)
      const allDurations = await ApiService.getDurations('student');
      // Filter to only active durations and remove duplicates by name
      const uniqueDurations = allDurations
        .filter(d => d.is_active)
        .reduce((acc, current) => {
          const existing = acc.find(d => d.name === current.name);
          if (!existing) {
            acc.push(current);
          }
          return acc;
        }, [] as Duration[]);
      setDurations(uniqueDurations);

      // Load installment plans
      const plansData = await ApiService.getInstallmentPlans();
      setInstallmentPlans(plansData);

      // Pre-select current studio if available
      if (studentData?.studio_id) {
        setRebookingData(prev => ({
          ...prev,
          studioId: studentData.studio_id
        }));
      }

    } catch (error) {
      console.error('Error loading rebooking data:', error);
      toast({
        title: "Error",
        description: "Failed to load rebooking data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canRebook = (): boolean => {
    return !!(
      student?.studio_id && 
      student?.academic_year === selectedAcademicYear &&
      selectedAcademicYear !== 'all' &&
      nextAcademicYear
    );
  };

  const handleRebookingSubmit = async () => {
    if (!student || !rebookingData.studioId || !rebookingData.durationId) {
      toast({
        title: "Validation Error",
        description: "Please select a studio and duration.",
        variant: "destructive",
      });
      return;
    }

    setShowRebookingDialog(true);
  };

  // Process Stripe payment (same logic as StudentPayments)
  const processStripePayment = async (amount: number): Promise<string> => {
    if (!stripe || !elements) {
      throw new Error('Payment system is not ready');
    }

    console.log('💳 Processing Stripe payment for rebooking...');

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

    if (stripeError) {
      throw new Error(stripeError.message || 'Payment failed');
    }

    if (!confirmedPayment) {
      throw new Error('Payment was not confirmed');
    }

    console.log('✅ Payment successful:', confirmedPayment.id);
    return confirmedPayment.id;
  };

  // Confirm rebooking payment (same pattern as confirmDirectPayment)
  const confirmRebookingPayment = async () => {
    setIsRebooking(true);
    
    try {
      console.log('🔄 Processing rebooking payment for amount:', rebookingData.depositAmount);
      
      // Process Stripe payment first
      const paymentIntentId = await processStripePayment(rebookingData.depositAmount);

      // Create rebooking record
      const rebookingRecord = await ApiService.createRebookingRecord({
        original_student_id: studentId,
        current_academic_year: selectedAcademicYear,
        new_academic_year: nextAcademicYear,
        studio_id: rebookingData.studioId,
        duration_id: rebookingData.durationId,
        installment_plan_id: rebookingData.installmentPlanId,
        deposit_amount: rebookingData.depositAmount,
        deposit_paid: true,
        stripe_payment_intent_id: paymentIntentId,
        status: 'confirmed'
      });

      // Create new student record for next academic year
      const selectedDuration = durations.find(d => d.id === rebookingData.durationId);
      const newStudentData = {
        user_id: student?.user_id,
        studio_id: rebookingData.studioId,
        academic_year: nextAcademicYear,
        // Calculate dates dynamically for the next academic year
        check_in_date: calculateCheckInDate(nextAcademicYear),
        check_out_date: calculateCheckOutDate(nextAcademicYear),
        duration_id: rebookingData.durationId,
        duration_name: selectedDuration?.name || '',
        duration_type: 'student' as const,
        weekly_rate: student?.weekly_rate || 0,
        total_amount: student?.total_amount || 0,
        deposit_paid: true,
        status: 'confirmed' as const,
        wants_installments: !!rebookingData.installmentPlanId,
        installment_plan_id: rebookingData.installmentPlanId,
        created_by: '423b2f89-ed35-4537-866e-d4fe702e577c' // Admin user ID
      };

      const newStudent = await ApiService.createStudent(newStudentData);

      // Update rebooking record with new student ID
      await ApiService.updateRebookingRecord(rebookingRecord.id, {
        new_student_id: newStudent.id
      });

      // Create studio occupancy for next academic year
      await ApiService.createStudioOccupancy({
        studio_id: rebookingData.studioId,
        academic_year: nextAcademicYear,
        student_id: newStudent.id,
        status: 'occupied',
        check_in_date: calculateCheckInDate(nextAcademicYear),
        check_out_date: calculateCheckOutDate(nextAcademicYear)
      });

      // Create invoice for the new academic year
      const invoiceData = {
        student_id: newStudent.id,
        academic_year: nextAcademicYear,
        amount: newStudentData.total_amount,
        due_date: calculateCheckInDate(nextAcademicYear), // Due on check-in date
        status: 'pending' as const,
        description: `Accommodation fees for ${nextAcademicYear}`,
        created_by: '423b2f89-ed35-4537-866e-d4fe702e577c' // Admin user ID
      };

      const invoice = await ApiService.createInvoice(invoiceData);

      // Create payment record for the deposit
      const paymentData = {
        student_id: newStudent.id,
        invoice_id: invoice.id,
        amount: rebookingData.depositAmount,
        payment_method: 'card' as const,
        payment_type: 'deposit' as const,
        stripe_payment_intent_id: paymentIntentId,
        status: 'completed' as const,
        payment_date: new Date().toISOString().split('T')[0],
        created_by: '423b2f89-ed35-4537-866e-d4fe702e577c' // Admin user ID
      };

      await ApiService.createPayment(paymentData);

      // If installment plan is selected, create installment records
      if (rebookingData.installmentPlanId) {
        const plan = installmentPlans.find(p => p.id === rebookingData.installmentPlanId);
        if (plan) {
          const remainingAmount = newStudentData.total_amount - rebookingData.depositAmount;
          const installmentAmount = remainingAmount / plan.installment_count;
          
          for (let i = 1; i <= plan.installment_count; i++) {
            const installmentData = {
              student_id: newStudent.id,
              invoice_id: invoice.id,
              installment_number: i,
              amount: installmentAmount,
              due_date: new Date(Date.now() + (i * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // 30 days apart
              status: 'pending' as const,
              created_by: '423b2f89-ed35-4537-866e-d4fe702e577c' // Admin user ID
            };
            
            await ApiService.createStudentInstallment(installmentData);
          }
        }
      }

      toast({
        title: "Rebooking Successful!",
        description: `You have successfully rebooked for ${nextAcademicYear}. Your deposit has been processed.`,
      });

      // Close dialog and refresh data
      setShowRebookingDialog(false);
      await loadData();

    } catch (error) {
      console.error('💥 Rebooking error:', error);
      toast({
        title: "Rebooking Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRebooking(false);
    }
  };



  const updateDepositAmount = (installmentPlanId?: string) => {
    if (installmentPlanId && installmentPlanId !== 'none') {
      const plan = installmentPlans.find(p => p.id === installmentPlanId);
      setRebookingData(prev => ({
        ...prev,
        installmentPlanId,
        depositAmount: plan?.deposit_amount || 99
      }));
    } else {
      setRebookingData(prev => ({
        ...prev,
        installmentPlanId: '',
        depositAmount: 99
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2 text-gray-600">Loading rebooking options...</p>
      </div>
    );
  }

  if (!canRebook()) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Not Eligible for Rebooking</h3>
        <p className="text-gray-600">
          You are not currently eligible to rebook for the next academic year.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Requirements:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Must have an active studio assignment</li>
            <li>Must be in the current academic year</li>
            <li>Next academic year must be available</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Current Booking Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Academic Year:</span>
              <Badge variant="outline">{selectedAcademicYear}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Studio:</span>
              <span className="font-medium">
                {studios.find(s => s.id === student?.studio_id)?.studio_number || student?.studio_id || 'Not assigned'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">Status:</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rebooking Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowRight className="h-5 w-5" />
            <span>Rebook for {nextAcademicYear}</span>
          </CardTitle>
          <CardDescription>
            Secure your accommodation for the next academic year with a deposit payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Studio Selection */}
          <div className="space-y-2">
            <Label htmlFor="studio">Studio Selection</Label>
            <Select
              value={rebookingData.studioId}
              onValueChange={(value) => setRebookingData(prev => ({ ...prev, studioId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select studio" />
              </SelectTrigger>
              <SelectContent>
                {studios.map((studio) => (
                  <SelectItem key={studio.id} value={studio.id}>
                    <div className="flex items-center space-x-2">
                      <Home className="h-4 w-4" />
                      <span>Studio {studio.studio_number}</span>
                      {studio.id === student?.studio_id && (
                        <Badge variant="secondary" className="text-xs">Current</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select
              value={rebookingData.durationId}
              onValueChange={(value) => setRebookingData(prev => ({ ...prev, durationId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((duration) => (
                  <SelectItem key={duration.id} value={duration.id}>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{duration.name}</span>
                      <span className="text-sm text-gray-500">({duration.weeks_count} weeks)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Installment Plan Selection */}
          <div className="space-y-2">
            <Label htmlFor="installment-plan">Payment Plan (Optional)</Label>
            <Select
              value={rebookingData.installmentPlanId || 'none'}
              onValueChange={updateDepositAmount}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Pay in full</SelectItem>
                {installmentPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>{plan.name}</span>
                      <span className="text-sm text-gray-500">(£{plan.deposit_amount} deposit)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Deposit Amount Display */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Required Deposit:</span>
              <span className="text-lg font-bold text-blue-600">
                £{rebookingData.depositAmount.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              This deposit secures your booking for {nextAcademicYear}
            </p>
          </div>

          {/* Rebooking Button */}
          <Button
            onClick={handleRebookingSubmit}
            disabled={!rebookingData.studioId || !rebookingData.durationId || isRebooking}
            className="w-full"
          >
            {isRebooking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Rebooking...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Rebook for {nextAcademicYear}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <RebookingPaymentDialog
        isOpen={showRebookingDialog}
        onClose={() => setShowRebookingDialog(false)}
        rebookingData={rebookingData}
        nextAcademicYear={nextAcademicYear}
        onConfirmPayment={confirmRebookingPayment}
        isProcessing={isRebooking}
      />
    </div>
  );
};

export default StudentRebooking;
