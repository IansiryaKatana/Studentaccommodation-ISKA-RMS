import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  CheckCircle,
  LogOut,
  User,
  Calendar,
  Building,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService, Reservation, TouristProfile, Studio } from '@/services/api';

interface TouristReservationWithDetails extends Reservation {
  tourist_profiles: TouristProfile;
  studio: Studio;
}

const TouristCheckInOut: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reservation, setReservation] = useState<TouristReservationWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      fetchReservationData();
    }

    // Listen for studio status updates to refresh reservation data
    const handleStudioStatusUpdate = async (event: CustomEvent) => {
      console.log('TouristCheckInOut: Received studio status update event:', event.detail);
      // Only refresh if this reservation's studio was updated
      if (reservation && event.detail.studioId === reservation.studio_id) {
        await fetchReservationData();
      }
    };

    window.addEventListener('studioStatusUpdated', handleStudioStatusUpdate as EventListener);
    
    return () => {
      window.removeEventListener('studioStatusUpdated', handleStudioStatusUpdate as EventListener);
    };
  }, [id, reservation]);

  const fetchReservationData = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getTouristReservationById(id!);
      setReservation(data);
    } catch (error) {
      console.error('Error fetching reservation:', error);
      toast({
        title: "Error",
        description: "Failed to load reservation details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!reservation) return;

    try {
      setIsProcessing(true);
      
      // Update reservation status to checked_in
      await ApiService.updateReservationWithCleaningIntegration(
        reservation.id,
        { status: 'checked_in' },
        '9afab6a3-f28e-46d2-9d80-8ab1a69e9a38' // Admin user ID
      );

      toast({
        title: "Check-in Successful",
        description: "Tourist has been checked in successfully.",
      });

      // Refresh data
      await fetchReservationData();
    } catch (error) {
      console.error('Error during check-in:', error);
      toast({
        title: "Error",
        description: "Failed to check in tourist.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    if (!reservation) return;

    try {
      setIsProcessing(true);
      
      // Update reservation status to checked_out
      await ApiService.updateReservationWithCleaningIntegration(
        reservation.id,
        { status: 'checked_out' },
        '9afab6a3-f28e-46d2-9d80-8ab1a69e9a38' // Admin user ID
      );

      // Update studio status to vacant
      if (reservation.studio_id) {
        try {
          await ApiService.updateStudioToVacant(reservation.studio_id);
          console.log('Studio status updated to vacant');
        } catch (studioError) {
          console.error('Error updating studio status:', studioError);
          // Don't fail the entire process if studio status update fails
        }
      }

      toast({
        title: "Check-out Successful",
        description: "Tourist has been checked out and cleaning task created.",
      });

      // Refresh data
      await fetchReservationData();
    } catch (error) {
      console.error('Error during check-out:', error);
      toast({
        title: "Error",
        description: "Failed to check out tourist.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'checked_in': return 'secondary';
      case 'checked_out': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'outline';
    }
  };

  const getStudioStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'vacant': return 'default';
      case 'occupied': return 'secondary';
      case 'dirty': return 'destructive';
      case 'cleaning': return 'outline';
      case 'maintenance': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading reservation details...</span>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Reservation Not Found</h3>
            <p className="text-gray-500 mb-4">The reservation you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/ota-bookings/tourists')}>
              Back to Tourist Bookings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/ota-bookings/tourists')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tourist Bookings
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tourist Check-In/Out</h1>
            <p className="text-gray-600">Reservation #{reservation.reservation_number}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(reservation.status)}>
            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1).replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tourist Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Tourist Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">First Name</label>
                <p className="text-gray-900">{reservation.tourist_profiles.first_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Name</label>
                <p className="text-gray-900">{reservation.tourist_profiles.last_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{reservation.tourist_profiles.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{reservation.tourist_profiles.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Studio Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Studio Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Studio Number</label>
                <p className="text-gray-900">{reservation.studio.studio_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Floor</label>
                <p className="text-gray-900">{reservation.studio.floor || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Badge variant={getStudioStatusBadgeVariant(reservation.studio.status)}>
                  {reservation.studio.status.charAt(0).toUpperCase() + reservation.studio.status.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Check-in Date</label>
                <p className="text-gray-900">{new Date(reservation.check_in_date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Check-out Date</label>
                <p className="text-gray-900">{new Date(reservation.check_out_date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Amount</label>
                <p className="text-gray-900">£{reservation.total_amount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Price per Night</label>
                <p className="text-gray-900">£{reservation.price_per_night}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check-In/Out Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Check-In/Out Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Textarea
                placeholder="Add notes for check-in/out..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
              
              <div className="flex gap-4">
                {reservation.status === 'confirmed' && (
                  <Button 
                    onClick={handleCheckIn} 
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Check In
                  </Button>
                )}
                
                {reservation.status === 'checked_in' && (
                  <Button 
                    onClick={handleCheckOut} 
                    disabled={isProcessing}
                    variant="destructive"
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4 mr-2" />
                    )}
                    Check Out
                  </Button>
                )}
              </div>

              {reservation.status === 'checked_out' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">Check-out Complete</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Cleaning task has been automatically created for this studio.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TouristCheckInOut; 