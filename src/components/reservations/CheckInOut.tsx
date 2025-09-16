
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogIn, 
  LogOut, 
  Search, 
  Clock, 
  User,
  Key,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import { format, isToday, parseISO } from 'date-fns';

interface TouristReservation {
  id: string;
  reservation_number: string;
  tourist_profile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  studio?: {
    studio_number: string;
    room_grade?: {
      name: string;
    };
  };
  check_in_date: string;
  check_out_date: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
}

const CheckInOut = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<TouristReservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<TouristReservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<TouristReservation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('checkin');
  
  // Check-in/out form state
  const [formData, setFormData] = useState({
    keyNumber: '',
    notes: '',
    roomCondition: 'good', // good, fair, poor
    hasDeposit: false,
    depositAmount: 0
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [reservations, searchTerm, activeTab]);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getTouristReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast({
        title: "Error",
        description: "Failed to load reservations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = reservations.filter(reservation => {
      const fullName = `${reservation.tourist_profile?.first_name} ${reservation.tourist_profile?.last_name}`.toLowerCase();
      const email = reservation.tourist_profile?.email?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      
      return fullName.includes(search) || 
             email.includes(search) || 
             reservation.reservation_number.toLowerCase().includes(search) ||
             reservation.studio?.studio_number?.toLowerCase().includes(search);
    });

    // Filter by tab and today's date
    const today = new Date();
    filtered = filtered.filter(reservation => {
      if (activeTab === 'checkin') {
        return reservation.status === 'confirmed' && 
               isToday(parseISO(reservation.check_in_date));
      } else {
        return reservation.status === 'checked_in' && 
               isToday(parseISO(reservation.check_out_date));
      }
    });

    setFilteredReservations(filtered);
  };

  const handleCheckIn = async () => {
    if (!selectedReservation) return;

    try {
      await ApiService.updateTouristReservation(selectedReservation.id, {
        status: 'checked_in',
        check_in_notes: formData.notes,
        key_number: formData.keyNumber
      });

      toast({
        title: "Success",
        description: `${selectedReservation.tourist_profile?.first_name} checked in successfully`,
      });

      // Reset form and refresh data
      setFormData({
        keyNumber: '',
        notes: '',
        roomCondition: 'good',
        hasDeposit: false,
        depositAmount: 0
      });
      setSelectedReservation(null);
      fetchReservations();
    } catch (error) {
      console.error('Error during check-in:', error);
      toast({
        title: "Error",
        description: "Failed to check in guest",
        variant: "destructive",
      });
    }
  };

  const handleCheckOut = async () => {
    if (!selectedReservation) return;

    try {
      await ApiService.updateTouristReservation(selectedReservation.id, {
        status: 'checked_out',
        check_out_notes: formData.notes,
        room_condition: formData.roomCondition
      });

      toast({
        title: "Success",
        description: `${selectedReservation.tourist_profile?.first_name} checked out successfully`,
      });

      // Reset form and refresh data
      setFormData({
        keyNumber: '',
        notes: '',
        roomCondition: 'good',
        hasDeposit: false,
        depositAmount: 0
      });
      setSelectedReservation(null);
      fetchReservations();
    } catch (error) {
      console.error('Error during check-out:', error);
      toast({
        title: "Error",
        description: "Failed to check out guest",
        variant: "destructive",
      });
    }
  };

  const renderReservationCard = (reservation: TouristReservation, showCheckInButton: boolean = false) => (
    <Card 
      key={reservation.id} 
      className={`cursor-pointer transition-colors ${
        selectedReservation?.id === reservation.id ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => setSelectedReservation(reservation)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <div className="font-medium">
                {reservation.tourist_profile?.first_name} {reservation.tourist_profile?.last_name}
              </div>
              <div className="text-sm text-gray-500">{reservation.tourist_profile?.email}</div>
              <div className="text-sm text-blue-600">
                {reservation.studio?.studio_number} • {reservation.reservation_number}
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge 
              variant={reservation.status === 'checked_in' ? 'default' : 'secondary'}
            >
              {reservation.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <div className="text-xs text-gray-500 mt-1">
              {activeTab === 'checkin' ? 'Check-in' : 'Check-out'}: {format(parseISO(activeTab === 'checkin' ? reservation.check_in_date : reservation.check_out_date), 'MMM d, yyyy')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tourist Check-in/Check-out</h1>
          <p className="text-gray-600 mt-1">Process tourist arrivals and departures</p>
        </div>
        <Button onClick={() => navigate('/ota-bookings/tourists/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservation Selection */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="checkin">
                <LogIn className="h-4 w-4 mr-2" />
                Check-in Today
              </TabsTrigger>
              <TabsTrigger value="checkout">
                <LogOut className="h-4 w-4 mr-2" />
                Check-out Today
              </TabsTrigger>
            </TabsList>

            <TabsContent value="checkin" className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8">Loading reservations...</div>
              ) : filteredReservations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No check-ins scheduled for today
                </div>
              ) : (
                filteredReservations.map(reservation => renderReservationCard(reservation, true))
              )}
            </TabsContent>

            <TabsContent value="checkout" className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8">Loading reservations...</div>
              ) : filteredReservations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No check-outs scheduled for today
                </div>
              ) : (
                filteredReservations.map(reservation => renderReservationCard(reservation))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Check-in/out Form */}
        <div>
          {selectedReservation ? (
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {activeTab === 'checkin' ? (
                    <LogIn className="h-5 w-5 text-green-600" />
                  ) : (
                    <LogOut className="h-5 w-5 text-red-600" />
                  )}
                  {activeTab === 'checkin' ? 'Check-in' : 'Check-out'}: {selectedReservation.tourist_profile?.first_name} {selectedReservation.tourist_profile?.last_name}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Guest Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Email:</span> {selectedReservation.tourist_profile?.email}
                    </div>
                    <div>
                      <span className="font-medium">Studio:</span> {selectedReservation.studio?.studio_number}
                    </div>
                    <div>
                      <span className="font-medium">Reservation:</span> {selectedReservation.reservation_number}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {selectedReservation.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                </div>

                {activeTab === 'checkin' ? (
                  // Check-in form
                  <>
                    <div>
                      <Label htmlFor="keyNumber">Room Key Number *</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Key className="h-4 w-4 text-gray-400" />
                        <Input
                          id="keyNumber"
                          value={formData.keyNumber}
                          onChange={(e) => setFormData({...formData, keyNumber: e.target.value})}
                          placeholder="Enter key number"
                        />
                    </div>
                  </div>
                  
                    <div>
                      <Label htmlFor="notes">Check-in Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Any special notes or requests..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleCheckIn}
                        className="flex-1"
                        disabled={!formData.keyNumber}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Check-in
                      </Button>
                      <Button 
                        variant="ghost"
                        onClick={() => navigate(`/ota-bookings/tourists/${selectedReservation.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                  </div>
                  </>
                ) : (
                  // Check-out form
                  <>
                    <div>
                      <Label htmlFor="roomCondition">Room Condition *</Label>
                      <select
                        id="roomCondition"
                        value={formData.roomCondition}
                        onChange={(e) => setFormData({...formData, roomCondition: e.target.value})}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="good">Good - No issues</option>
                        <option value="fair">Fair - Minor issues</option>
                        <option value="poor">Poor - Significant damage</option>
                      </select>
                </div>

                    <div>
                      <Label htmlFor="notes">Check-out Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Describe any damage or issues found..."
                        rows={4}
                      />
        </div>

                    {formData.roomCondition === 'poor' && (
                      <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-red-800">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="font-medium">Damage Reported</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          Please ensure detailed damage notes are provided and notify maintenance.
                        </p>
              </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleCheckOut}
                        className="flex-1"
                        variant={formData.roomCondition === 'poor' ? 'destructive' : 'default'}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Check-out
                      </Button>
                      <Button 
                        variant="ghost"
                        onClick={() => navigate(`/ota-bookings/tourists/${selectedReservation.id}`)}
                      >
                        <Eye className="h-4 w-4" />
              </Button>
                    </div>
                  </>
                )}
            </CardContent>
          </Card>
          ) : (
          <Card>
              <CardContent className="text-center py-12 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a guest to begin {activeTab === 'checkin' ? 'check-in' : 'check-out'}</p>
            </CardContent>
          </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInOut;
