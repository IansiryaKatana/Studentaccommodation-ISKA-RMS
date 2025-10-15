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
  const [currentStudio, setCurrentStudio] = useState<Studio | null>(null);
  const [durations, setDurations] = useState<Duration[]>([]);
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRebooking, setIsRebooking] = useState(false);
  const [showRebookingDialog, setShowRebookingDialog] = useState(false);
  const [rebookingData, setRebookingData] = useState<RebookingFormData>({
    durationId: '',
    installmentPlanId: '',
    depositAmount: 99
  });

  // Get next academic year
  const getNextAcademicYear = (): string => {
    if (!selectedAcademicYear || selectedAcademicYear === 'all') {
      console.log('🔍 No selected academic year, using default fallback: 2026/2027');
      return '2026/2027'; // Default fallback
    }
    
    // Calculate the next academic year based on the current year
    const currentStartYear = parseInt(selectedAcademicYear.split('/')[0]); // Get "2025" from "2025/2026"
    const nextStartYear = currentStartYear + 1;
    const nextEndYear = nextStartYear + 1;
    const calculatedYear = `${nextStartYear}/${nextEndYear}`;
    
    console.log('🔍 Academic year calculation:', {
      selectedAcademicYear,
      currentStartYear,
      nextStartYear,
      nextEndYear,
      calculatedYear,
      availableAcademicYears
    });
    
    // Check if the calculated year exists in available years
    if (availableAcademicYears.includes(calculatedYear)) {
      console.log('✅ Found calculated year in available years:', calculatedYear);
      return calculatedYear;
    }
    
    // If not found, return the calculated year anyway (it might not be set up yet)
    console.log('⚠️ Calculated year not in available years, using anyway:', calculatedYear);
    return calculatedYear;
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

      // Load current student booking to get the current studio
      if (selectedAcademicYear && selectedAcademicYear !== 'all') {
        try {
          console.log('🔍 Loading current booking for student:', studentId, 'academic year:', selectedAcademicYear);
          console.log('🔍 Student data:', studentData);
          
          // Try to get current booking using student ID directly (fallback for students without user_id)
          const currentBooking = await ApiService.getStudentBookingByStudentId(studentId, selectedAcademicYear);
          console.log('🔍 Current booking result:', currentBooking);
        
          if (currentBooking && currentBooking.studio) {
            setCurrentStudio(currentBooking.studio);
            console.log('✅ Found current studio for rebooking:', currentBooking.studio.studio_number, 'ID:', currentBooking.studio.id);
          } else {
            console.log('⚠️ No current booking found for academic year:', selectedAcademicYear);
            setCurrentStudio(null);
          }
        } catch (error) {
          console.log('⚠️ Error loading current booking:', error);
          setCurrentStudio(null);
        }
      } else {
        setCurrentStudio(null);
      }

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

      // Load installment plans for the next academic year
      try {
        const academicYearPlans = await ApiService.getAcademicYearInstallmentPlans(nextAcademicYear);
        if (academicYearPlans && academicYearPlans.length > 0) {
          // Use academic year specific plans
          const plans = academicYearPlans.map(ayp => ayp.installment_plan).filter(Boolean);
          setInstallmentPlans(plans);
          console.log('✅ Loaded academic year specific installment plans');
        } else {
          // Fallback to universal plans
          const plansData = await ApiService.getInstallmentPlans();
          setInstallmentPlans(plansData);
          console.log('⚠️ No academic year specific plans found, using universal plans');
        }
      } catch (error) {
        // Error loading academic year plans, using universal plans
        const plansData = await ApiService.getInstallmentPlans();
        setInstallmentPlans(plansData);
        console.log('⚠️ Error loading academic year plans, using universal plans');
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
    // Check if student has a booking for the current academic year and a current studio
    const hasCurrentBooking = student && selectedAcademicYear && selectedAcademicYear !== 'all';
    const hasCurrentStudio = currentStudio !== null;
    return !!(
      hasCurrentBooking && 
      hasCurrentStudio &&
      nextAcademicYear
    );
  };

  const handleRebookingSubmit = async () => {
    if (!student || !currentStudio || !rebookingData.durationId) {
      toast({
        title: "Validation Error",
        description: "Please select a duration. Studio will be automatically selected.",
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
      const rebookingDataPayload = {
        original_student_id: studentId,
        current_academic_year: selectedAcademicYear,
        new_academic_year: nextAcademicYear,
        studio_id: currentStudio?.id, // Use current studio instead of selected studio
        duration_id: rebookingData.durationId,
        installment_plan_id: rebookingData.installmentPlanId || undefined,
        deposit_amount: rebookingData.depositAmount,
        deposit_paid: true,
        stripe_payment_intent_id: paymentIntentId,
        status: 'confirmed'
      };
      
      // Creating rebooking record
      
      const rebookingRecord = await ApiService.createRebookingRecord(rebookingDataPayload);

      // Check if student already has a booking for the next academic year
      console.log('🔍 Checking for existing booking for student:', student?.id, 'in academic year:', nextAcademicYear);
      
      let newBooking;
      try {
        const existingBooking = await ApiService.getCurrentStudentBooking(student?.id || '', nextAcademicYear);
        if (existingBooking) {
          console.log('⚠️ Student already has a booking for', nextAcademicYear, ':', existingBooking.id);
          // Update the existing booking instead of creating a new one
          newBooking = await ApiService.updateStudentBooking(existingBooking.id, {
            studio_id: currentStudio?.id, // Use current studio instead of selected studio
            duration_id: rebookingData.durationId,
            check_in_date: calculateCheckInDate(nextAcademicYear),
            check_out_date: calculateCheckOutDate(nextAcademicYear),
            weekly_rate: student?.weekly_rate || 0,
            total_amount: student?.total_amount || 0,
            status: 'confirmed',
            deposit_paid: true,
            wants_installments: !!rebookingData.installmentPlanId,
            installment_plan_id: rebookingData.installmentPlanId
          });
          
          console.log('✅ Updated existing booking:', newBooking.id);
        } else {
          console.log('✅ No existing booking found, creating new one for', nextAcademicYear);
          
          // Create new student booking for next academic year (NO student duplication!)
          const selectedDuration = durations.find(d => d.id === rebookingData.durationId);
          const newBookingData = {
            student_id: student?.id, // Same student record - no duplication!
            academic_year: nextAcademicYear,
            studio_id: currentStudio?.id, // Use current studio instead of selected studio
            duration_id: rebookingData.durationId,
            // Calculate dates dynamically for the next academic year
            check_in_date: calculateCheckInDate(nextAcademicYear),
            check_out_date: calculateCheckOutDate(nextAcademicYear),
            weekly_rate: student?.weekly_rate || 0,
            total_amount: student?.total_amount || 0,
            status: 'confirmed' as const,
            deposit_paid: true,
            wants_installments: !!rebookingData.installmentPlanId,
            installment_plan_id: rebookingData.installmentPlanId
          };

          newBooking = await ApiService.createStudentBooking(newBookingData);
          console.log('✅ Created new booking:', newBooking.id);
        }
        
        // Update rebooking record with booking ID
        await ApiService.updateRebookingRecord(rebookingRecord.id, {
          student_booking_id: newBooking.id // Store booking ID in the correct field
        });
        
      } catch (error) {
        console.error('💥 Error checking/creating student booking:', error);
        throw error;
      }

      // Check and create/update studio occupancy for next academic year
      console.log('🔍 Checking for existing studio occupancy for studio:', currentStudio?.id, 'in academic year:', nextAcademicYear);
      
      try {
        // Check if studio is already occupied for this academic year
        const { data: existingOccupancy, error: occupancyError } = await supabase
          .from('studio_occupancy')
          .select('*')
          .eq('studio_id', currentStudio?.id)
          .eq('academic_year', nextAcademicYear)
          .single();

        if (existingOccupancy && !occupancyError) {
          console.log('⚠️ Studio already occupied for', nextAcademicYear, ':', existingOccupancy.id);
          // Update existing occupancy
          await supabase
            .from('studio_occupancy')
            .update({
              student_id: student?.id,
              status: 'occupied',
              check_in_date: calculateCheckInDate(nextAcademicYear),
              check_out_date: calculateCheckOutDate(nextAcademicYear)
            })
            .eq('id', existingOccupancy.id);
          
          console.log('✅ Updated existing studio occupancy:', existingOccupancy.id);
        } else {
          console.log('✅ No existing occupancy found, creating new one for', nextAcademicYear);
          // Create new studio occupancy
          await ApiService.createStudioOccupancy({
            studio_id: currentStudio?.id, // Use current studio instead of selected studio
            academic_year: nextAcademicYear,
            student_id: student?.id, // Same student ID - no duplication!
            status: 'occupied',
            check_in_date: calculateCheckInDate(nextAcademicYear),
            check_out_date: calculateCheckOutDate(nextAcademicYear)
          });
          console.log('✅ Created new studio occupancy');
        }
      } catch (error) {
        console.error('💥 Error with studio occupancy:', error);
        // Don't throw here - studio occupancy is not critical for rebooking success
        console.log('⚠️ Continuing without studio occupancy update');
      }

      // Create financial records for the new booking
      let financialRecords;
      try {
        financialRecords = await ApiService.createStudentFinancialRecordsDirect(
          newBooking.id, // Use booking ID instead of student ID
          {
            depositAmount: rebookingData.depositAmount,
            totalAmount: newBooking.total_amount || 0, // Use booking's total amount
            installmentPlanId: rebookingData.installmentPlanId,
            durationId: rebookingData.durationId,
            createdBy: '423b2f89-ed35-4537-866e-d4fe702e577c', // Admin user ID
            depositPaid: true,
            academicYear: nextAcademicYear
          }
        );
        console.log('✅ Financial records created successfully');
      } catch (error) {
        console.error('⚠️ Edge Function failed, creating basic invoice manually:', error);
        // Fallback: Create a basic deposit invoice manually
        const depositInvoice = await ApiService.createInvoice({
          student_id: student?.id,
          student_booking_id: newBooking.id,
          invoice_number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
          amount: rebookingData.depositAmount,
          due_date: new Date().toISOString().split('T')[0],
          status: 'paid',
          invoice_type: 'deposit',
          academic_year: nextAcademicYear,
          created_by: '423b2f89-ed35-4537-866e-d4fe702e577c'
        });
        
        financialRecords = {
          depositInvoice,
          installmentInvoices: []
        };
        console.log('✅ Fallback invoice created:', depositInvoice.id);
      }

      // Create payment record for the deposit
      const paymentData = {
        invoice_id: financialRecords.depositInvoice.id,
        amount: rebookingData.depositAmount,
        method: 'stripe' as const, // Use 'stripe' instead of 'card'
        stripe_payment_intent_id: paymentIntentId,
        status: 'completed' as const,
        processed_at: new Date().toISOString(), // Use processed_at instead of payment_date
        xero_export_status: 'pending' as const,
        academic_year: nextAcademicYear,
        created_by: '423b2f89-ed35-4537-866e-d4fe702e577c' // Admin user ID
      };

      await ApiService.createPayment(paymentData);

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



  const updateDepositAmount = async (installmentPlanId?: string) => {
    if (installmentPlanId && installmentPlanId !== 'none') {
      try {
        // Try to get academic year specific deposit amount
        const academicYearPlan = await ApiService.getInstallmentPlanForAcademicYear(installmentPlanId, nextAcademicYear);
        const depositAmount = academicYearPlan?.deposit_amount || 99;
        
        setRebookingData(prev => ({
          ...prev,
          installmentPlanId,
          depositAmount
        }));
        
        // Updated deposit amount for academic year
      } catch (error) {
        // Error getting academic year specific deposit, using fallback
        // Fallback to universal plan
        const plan = installmentPlans.find(p => p.id === installmentPlanId);
        setRebookingData(prev => ({
          ...prev,
          installmentPlanId,
          depositAmount: plan?.deposit_amount || 99
        }));
      }
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
            <li>Must have an active studio assignment for current academic year</li>
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
                {currentStudio ? `Studio ${currentStudio.studio_number}` : 'No Studio Assigned'}
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
          {/* Current Studio Info */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">Rebooking Current Studio</h3>
                <p className="text-sm text-blue-700">
                  You will automatically rebook {currentStudio ? `Studio ${currentStudio.studio_number}` : 'your current studio'} for {nextAcademicYear}
                </p>
              </div>
            </div>
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
            disabled={!currentStudio || !rebookingData.durationId || isRebooking}
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
