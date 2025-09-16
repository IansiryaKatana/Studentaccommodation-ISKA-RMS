import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Calendar, 
  CreditCard, 
  FileText, 
  Phone, 
  Mail, 
  Building,
  Clock,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

const TouristDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTouristBooking();
    }
  }, [id]);

  const fetchTouristBooking = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getTouristReservationById(id!);
      setBooking(data);
    } catch (error) {
      console.error('Error fetching tourist booking:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tourist booking details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'checked_in': return 'bg-blue-100 text-blue-800';
      case 'checked_out': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGuestStatusColor = (status: any) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    return `bg-${status.color}-100 text-${status.color}-800`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Loading tourist booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">Tourist booking not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tourist Booking Details</h1>
          <p className="text-gray-600">Reservation #{booking.reservation_number}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(booking.status)}>
            {booking.status?.replace('_', ' ').toUpperCase()}
          </Badge>
          {booking.guest_status && (
            <Badge className={getGuestStatusColor(booking.guest_status)}>
              {booking.guest_status.name}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
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
                  <label className="text-sm font-medium text-gray-500">First Name</label>
                  <p className="text-lg">{booking.tourist_profiles?.first_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Name</label>
                  <p className="text-lg">{booking.tourist_profiles?.last_name}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="text-lg">{booking.tourist_profiles?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </label>
                  <p className="text-lg">{booking.tourist_profiles?.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Studio
                  </label>
                  <p className="text-lg font-medium">{booking.studio?.studio_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Booking Source</label>
                  <p className="text-lg">{booking.booking_source?.name || 'Not specified'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Check-in Date
                  </label>
                  <p className="text-lg">{format(new Date(booking.check_in_date), 'EEEE, MMMM dd, yyyy')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Check-out Date
                  </label>
                  <p className="text-lg">{format(new Date(booking.check_out_date), 'EEEE, MMMM dd, yyyy')}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duration
                </label>
                <p className="text-lg">
                  {Math.ceil((new Date(booking.check_out_date).getTime() - new Date(booking.check_in_date).getTime()) / (1000 * 60 * 60 * 24))} nights
                </p>
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
                  <label className="text-sm font-medium text-gray-500">Price per Night</label>
                  <p className="text-lg font-medium">£{booking.price_per_night?.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Amount</label>
                  <p className="text-lg font-medium">£{booking.total_amount?.toFixed(2)}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Deposit Amount</label>
                  <p className="text-lg">£{booking.deposit_amount?.toFixed(2) || '0.00'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Discount Amount</label>
                  <p className="text-lg">£{booking.discount_amount?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Balance Due</label>
                <p className="text-lg font-medium">£{booking.balance_due?.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {booking.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{booking.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Edit Booking
              </Button>
              <Button className="w-full" variant="outline">
                Send Invoice
              </Button>
              <Button className="w-full" variant="outline">
                Mark as Checked In
              </Button>
              <Button className="w-full" variant="outline">
                Mark as Checked Out
              </Button>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm font-medium">
                  {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Updated:</span>
                <span className="text-sm font-medium">
                  {format(new Date(booking.updated_at), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Booking Type:</span>
                <span className="text-sm font-medium capitalize">{booking.type}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TouristDetail; 