
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Loader2, User, MapPin, CreditCard, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format, differenceInDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ApiService, TouristBookingSource, TouristGuestStatus } from '@/services/api';
import { supabase } from '@/integrations/supabase/client';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
import StudioSelect from '@/components/ui/studio-select';
import StudioOccupancyDialog from '@/components/ui/studio-occupancy-dialog';

const AddTouristBooking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedAcademicYear } = useAcademicYear();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Tourist Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Booking Information
    studioId: '',
    checkinDate: null as Date | null,
    checkoutDate: null as Date | null,
    bookingSource: '',
    guestStatus: '',
    
    // Pricing
    pricePerNight: 0,
    totalRevenue: 0,
    depositAmount: 0,
    discountAmount: 0,
    balanceDue: 0,
    
    // Additional Information
    notes: ''
  });

  // Fetch form data
  const [studios, setStudios] = useState<any[]>([]);
  const [bookingSources, setBookingSources] = useState<TouristBookingSource[]>([]);
  const [guestStatuses, setGuestStatuses] = useState<TouristGuestStatus[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Studio occupancy dialog state
  const [occupancyDialog, setOccupancyDialog] = useState({
    isOpen: false,
    studioNumber: '',
    occupantName: '',
    occupantEmail: '',
    reservationType: 'tourist' as 'student' | 'tourist',
    checkInDate: '',
    checkOutDate: ''
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setIsDataLoading(true);
        const [studiosData, bookingSourcesData, guestStatusesData] = await Promise.all([
          ApiService.getAvailableStudios(),
          ApiService.getTouristBookingSources(),
          ApiService.getTouristGuestStatuses()
        ]);
        
        setStudios(studiosData);
        setBookingSources(bookingSourcesData);
        setGuestStatuses(guestStatusesData);
      } catch (error) {
        console.error('Error fetching form data:', error);
        toast({
          title: "Error",
          description: "Failed to load form data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchFormData();
  }, [toast]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate total revenue when dates or price change
  useEffect(() => {
    if (formData.checkinDate && formData.checkoutDate && formData.pricePerNight) {
      const days = differenceInDays(formData.checkoutDate, formData.checkinDate);
      const total = days * formData.pricePerNight;
      const balance = total - formData.depositAmount - formData.discountAmount;
      setFormData(prev => ({ 
        ...prev, 
        totalRevenue: total,
        balanceDue: Math.max(0, balance)
      }));
    }
  }, [formData.checkinDate, formData.checkoutDate, formData.pricePerNight, formData.depositAmount, formData.discountAmount]);

  const handleSubmit = async () => {
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.studioId || !formData.checkinDate || 
        !formData.checkoutDate || formData.pricePerNight <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and ensure price is greater than 0.",
        variant: "destructive",
      });
      return;
    }

    // Check if studio is still available before proceeding
    if (formData.studioId) {
      try {
        const occupancyInfo = await ApiService.getStudioOccupancyInfo(formData.studioId);
        
        if (occupancyInfo?.currentReservation) {
          const reservation = occupancyInfo.currentReservation;
          const occupantName = reservation.student 
            ? `${reservation.student.user.first_name} ${reservation.student.user.last_name}`
            : `${reservation.tourist?.first_name} ${reservation.tourist?.last_name}`;
          
          const occupantEmail = reservation.student 
            ? reservation.student.user.email
            : reservation.tourist?.email || '';
          
          setOccupancyDialog({
            isOpen: true,
            studioNumber: occupancyInfo.studio.studio_number,
            occupantName,
            occupantEmail,
            reservationType: reservation.type,
            checkInDate: reservation.check_in_date,
            checkOutDate: reservation.check_out_date
          });
          return;
        }
      } catch (error) {
        console.error('Error checking studio occupancy:', error);
        // Continue with submission if we can't check occupancy
      }
    }

    try {
      setIsLoading(true);

      // Create tourist profile data
      const touristProfileData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone
      };

      // Create reservation data
      const reservationData = {
        type: 'tourist' as const,
        studio_id: formData.studioId,
        check_in_date: format(formData.checkinDate!, 'yyyy-MM-dd'),
        check_out_date: format(formData.checkoutDate!, 'yyyy-MM-dd'),
        status: 'pending' as const,
        booking_source_id: formData.bookingSource || null,
        guest_status_id: formData.guestStatus || null,
        price_per_night: formData.pricePerNight,
        total_amount: formData.totalRevenue,
        deposit_amount: formData.depositAmount,
        discount_amount: formData.discountAmount,
        balance_due: formData.balanceDue,
        notes: `Tourist: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
Booking Source: ${formData.bookingSource}
Guest Status: ${formData.guestStatus}

${formData.notes}`,
        created_by: '423b2f89-ed35-4537-866e-d4fe702e577c', // Admin user ID
        academic_year: selectedAcademicYear
      };

      // Use the new API method to create tourist reservation
      const result = await ApiService.createTouristReservation({
        touristProfile: touristProfileData,
        reservation: reservationData
      });

      // Update studio status to occupied
      if (formData.studioId) {
        try {
          await ApiService.updateStudioToOccupied(formData.studioId);
          console.log('Studio status updated to occupied');
        } catch (error) {
          console.error('Error updating studio status:', error);
          // Don't fail the entire process if studio status update fails
          toast({
            title: "Warning",
            description: "Booking created but studio status may not have been updated. Please check the studio status manually.",
            variant: "destructive",
          });
        }
      }
      
      toast({
        title: "Booking Created Successfully",
        description: `Tourist booking for ${formData.firstName} ${formData.lastName} has been created.`,
      });
      
      navigate('/ota-bookings/tourists');
    } catch (error) {
      console.error('Error creating booking:', error);
      
      // Provide more specific error messages
      let errorMessage = "There was an error creating the booking. Please try again.";
      
      if (error && typeof error === 'object' && 'message' in error) {
        const errorObj = error as any;
        if (errorObj.message?.includes('duplicate key')) {
          errorMessage = "A booking with this reservation number already exists. Please try again.";
        } else if (errorObj.message?.includes('foreign key')) {
          errorMessage = "Invalid studio or booking source selected. Please check your selections.";
        } else if (errorObj.message?.includes('not null')) {
          errorMessage = "Please fill in all required fields.";
        } else {
          errorMessage = errorObj.message || errorMessage;
        }
      }
      
      toast({
        title: "Error Creating Booking",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <Skeleton className="h-10 w-80 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tourist Information Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Information Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Information Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons Skeleton */}
              <div className="flex gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            {/* Summary Skeleton */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add Tourist Booking</h1>
          <p className="text-gray-600 text-lg">Create a new short-term accommodation booking for tourists</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tourist Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Tourist Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>


              </CardContent>
            </Card>

            {/* Booking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Booking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="studio">Studio *</Label>
                  <StudioSelect
                    value={formData.studioId}
                    onChange={(value) => updateFormData('studioId', value)}
                    placeholder="Select studio"
                    showOccupied={true}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Check-in Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.checkinDate ? format(formData.checkinDate, 'PPP') : 'Select check-in'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.checkinDate}
                          onSelect={(date) => updateFormData('checkinDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Check-out Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.checkoutDate ? format(formData.checkoutDate, 'PPP') : 'Select check-out'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.checkoutDate}
                          onSelect={(date) => updateFormData('checkoutDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bookingSource">Booking Source</Label>
                    <Select value={formData.bookingSource} onValueChange={(value) => updateFormData('bookingSource', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select booking source" />
                      </SelectTrigger>
                      <SelectContent>
                        {bookingSources.map((source) => (
                          <SelectItem key={source.id} value={source.id}>
                            {source.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="guestStatus">Guest Status</Label>
                    <Select value={formData.guestStatus} onValueChange={(value) => updateFormData('guestStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select guest status" />
                      </SelectTrigger>
                      <SelectContent>
                        {guestStatuses.map((status) => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Pricing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pricePerNight">Price per Night (£) *</Label>
                    <Input
                      id="pricePerNight"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.pricePerNight || ''}
                      onChange={(e) => updateFormData('pricePerNight', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalRevenue">Total Revenue (£)</Label>
                    <Input
                      id="totalRevenue"
                      type="number"
                      value={formData.totalRevenue || ''}
                      readOnly
                      className="bg-gray-50"
                      placeholder="Auto-calculated"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="depositAmount">Deposit Amount (£)</Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.depositAmount || ''}
                      onChange={(e) => updateFormData('depositAmount', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discountAmount">Discount Amount (£)</Label>
                    <Input
                      id="discountAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.discountAmount || ''}
                      onChange={(e) => updateFormData('discountAmount', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="balanceDue">Balance Due (£)</Label>
                  <Input
                    id="balanceDue"
                    type="number"
                    value={formData.balanceDue || ''}
                    readOnly
                    className="bg-gray-50"
                    placeholder="Auto-calculated"
                  />
                </div>

                {/* Duration Summary */}
                {formData.checkinDate && formData.checkoutDate && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Duration: {differenceInDays(formData.checkoutDate, formData.checkinDate)} nights
                    </p>
                    {formData.pricePerNight > 0 && (
                      <p className="text-sm text-blue-800">
                        Total Revenue: £{(formData.totalRevenue || 0).toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.notes || ''}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                    placeholder="Enter any additional notes or special requirements..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Guest:</span>
                    <span className="text-sm font-medium">
                      {formData.firstName} {formData.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm font-medium">{formData.phone}</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Studio:</span>
                    <span className="text-sm font-medium">
                      {studios.find(s => s.id === formData.studioId)?.studio_number || 'Not selected'}
                    </span>
                  </div>

                  {formData.checkinDate && formData.checkoutDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Nights:</span>
                      <span className="text-sm font-medium">
                        {differenceInDays(formData.checkoutDate, formData.checkinDate)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Revenue:</span>
                    <span className="text-sm font-medium">£{(formData.totalRevenue || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Deposit:</span>
                    <span className="text-sm font-medium">£{(formData.depositAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Discount:</span>
                    <span className="text-sm font-medium">£{(formData.discountAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-semibold">Balance Due:</span>
                    <span className="text-sm font-semibold">£{(formData.balanceDue || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Booking...
                      </>
                    ) : (
                      "Create Tourist Booking"
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/ota-bookings/tourists')}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Studio Occupancy Dialog */}
        <StudioOccupancyDialog
          isOpen={occupancyDialog.isOpen}
          onClose={() => setOccupancyDialog(prev => ({ ...prev, isOpen: false }))}
          studioNumber={occupancyDialog.studioNumber}
          occupantName={occupancyDialog.occupantName}
          occupantEmail={occupancyDialog.occupantEmail}
          reservationType={occupancyDialog.reservationType}
          checkInDate={occupancyDialog.checkInDate}
          checkOutDate={occupancyDialog.checkOutDate}
        />
      </div>
    </div>
  );
};

export default AddTouristBooking;
