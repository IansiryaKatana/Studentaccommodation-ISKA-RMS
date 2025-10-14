import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApiService, Studio, RoomGrade, Reservation } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
import { 
  ArrowLeft, 
  Building2, 
  Search, 
  Filter, 
  Edit, 
  Loader2, 
  Users, 
  Calendar,
  MapPin,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  TrendingUp,
  CalendarDays,
  User,
  GraduationCap,
  Globe,
  Phone,
  Mail,
  FileText
} from 'lucide-react';

interface StudioWithDetails extends Studio {
  room_grade: RoomGrade;
  current_reservation?: Reservation;
  occupancy_stats: {
    total_days: number;
    occupied_days: number;
    occupancy_rate: number;
    total_revenue: number;
    average_daily_rate: number;
  };
}

interface ReservationWithDetails extends Reservation {
  student?: {
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  tourist?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  duration: {
    name: string;
    weeks_count: number;
  };
}

export default function StudioDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedAcademicYear } = useAcademicYear();
  
  const [studio, setStudio] = useState<StudioWithDetails | null>(null);
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    if (id) {
      loadStudioData();
    }
    
    // Listen for studio status updates from other modules
    const handleStudioStatusUpdate = (event: CustomEvent) => {
      const { studioId, newStatus } = event.detail;
      console.log(`🔄 Studio status update received in Detail: ${studioId} → ${newStatus}`);
      
      // If this is the current studio being viewed, refresh the data
      if (studioId === id) {
        loadStudioData();
      }
    };
    
    window.addEventListener('studioStatusUpdated', handleStudioStatusUpdate as EventListener);
    
    return () => {
      window.removeEventListener('studioStatusUpdated', handleStudioStatusUpdate as EventListener);
    };
  }, [id, selectedAcademicYear]);

  const loadStudioData = async () => {
    try {
      setLoading(true);
      
      // Load studio details
      const studioData = await ApiService.getStudioWithDetails(id!);
      setStudio(studioData);
      
      // Load all reservations for this studio
      const reservationsData = await ApiService.getReservationsByStudioId(id!, selectedAcademicYear);
      setReservations(reservationsData);
      
    } catch (error) {
      console.error('Error loading studio data:', error);
      toast({
        title: "Error",
        description: "Failed to load studio data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const guestName = reservation.student?.user 
      ? `${reservation.student.user.first_name} ${reservation.student.user.last_name}`
      : reservation.tourist?.user 
      ? `${reservation.tourist.user.first_name} ${reservation.tourist.user.last_name}`
      : '';

    const matchesSearch = guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.reservation_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    const matchesType = typeFilter === 'all' || reservation.type === typeFilter;
    
    let matchesDate = true;
    if (dateFilter === 'current') {
      const today = new Date();
      const checkIn = new Date(reservation.check_in_date);
      const checkOut = new Date(reservation.check_out_date);
      matchesDate = checkIn <= today && checkOut >= today;
    } else if (dateFilter === 'upcoming') {
      const today = new Date();
      const checkIn = new Date(reservation.check_in_date);
      matchesDate = checkIn > today;
    } else if (dateFilter === 'past') {
      const today = new Date();
      const checkOut = new Date(reservation.check_out_date);
      matchesDate = checkOut < today;
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const getStatusIcon = (status: Studio['status']) => {
    switch (status) {
      case 'occupied': return <Users className="h-4 w-4 text-green-600" />;
      case 'vacant': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'maintenance': return <Wrench className="h-4 w-4 text-orange-600" />;
      case 'cleaning': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'dirty': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Building2 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: Studio['status']) => {
    const variants = {
      occupied: 'default',
      vacant: 'secondary',
      maintenance: 'destructive',
      cleaning: 'outline',
      dirty: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getReservationStatusBadge = (status: Reservation['status']) => {
    const variants = {
      pending: 'outline',
      confirmed: 'secondary',
      checked_in: 'default',
      checked_out: 'secondary',
      cancelled: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const handleGuestClick = (reservation: ReservationWithDetails) => {
    if (reservation.type === 'student' && reservation.student_id) {
      navigate(`/students/${reservation.student_id}`);
    } else if (reservation.type === 'tourist' && reservation.tourist_id) {
                  navigate(`/ota-bookings/tourists/${reservation.tourist_id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Studio not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{studio.studio_number}</h1>
          <p className="text-muted-foreground">Studio Details & Reservation History</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/studios/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Studio
          </Button>
          <Button onClick={() => navigate(`/students/add-booking?studio=${id}`)}>
            <Calendar className="h-4 w-4 mr-2" />
            New Booking
          </Button>
          <Button variant="ghost" onClick={() => navigate('/studios/list')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Studios
          </Button>
        </div>
      </div>

      {/* Studio Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Studio Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Studio Number</h3>
              <p className="text-lg font-medium">{studio.studio_number}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Room Grade</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{studio.room_grade.name}</Badge>
                <span className="text-sm text-muted-foreground">
                  £{studio.room_grade.weekly_rate}/week
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Floor</h3>
              <p className="text-lg font-medium">
                {studio.floor !== null && studio.floor !== undefined 
                  ? (studio.floor === 0 ? 'Ground floor' : `Floor ${studio.floor}`)
                  : 'Not specified'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Current Status</h3>
              {getStatusBadge(studio.status)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studio.occupancy_stats.occupancy_rate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {studio.occupancy_stats.occupied_days} of {studio.occupancy_stats.total_days} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{studio.occupancy_stats.total_revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last 365 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Daily Rate</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{studio.occupancy_stats.average_daily_rate.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Per occupied day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservations.length}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Guest Info */}
      {studio.current_reservation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Current Guest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Guest Name</h3>
                <p className="text-lg font-medium">
                  {studio.current_reservation.student?.user 
                    ? `${studio.current_reservation.student.user.first_name} ${studio.current_reservation.student.user.last_name}`
                    : studio.current_reservation.tourist 
                    ? `${studio.current_reservation.tourist.first_name} ${studio.current_reservation.tourist.last_name}`
                    : 'Unknown'
                  }
                </p>
                <Badge variant="outline" className="mt-1">
                  {studio.current_reservation.type === 'student' ? 'Student' : 'Tourist'}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Check-in Date</h3>
                <p className="text-lg font-medium">
                  {new Date(studio.current_reservation.check_in_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Check-out Date</h3>
                <p className="text-lg font-medium">
                  {new Date(studio.current_reservation.check_out_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Total Amount</h3>
                <p className="text-lg font-medium">£{studio.current_reservation.total_amount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  £{studio.current_reservation.deposit_amount.toLocaleString()} deposit
                </p>
              </div>
            </div>
            
            {/* Additional Guest Information */}
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Contact Information</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {studio.current_reservation.student?.user?.email || 
                       studio.current_reservation.tourist?.email || 
                       'No email available'}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Reservation Details</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {studio.current_reservation.reservation_number}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reservations History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Reservation History
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search reservations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[200px]"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked_in">Checked In</SelectItem>
                  <SelectItem value="checked_out">Checked Out</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="tourist">Tourist</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reservation #</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow 
                  key={reservation.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleGuestClick(reservation)}
                >
                  <TableCell>
                    <div className="font-medium">{reservation.reservation_number}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {reservation.type === 'student' ? (
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Globe className="h-4 w-4 text-green-600" />
                      )}
                      <div>
                        <div className="font-medium">
                          {reservation.student?.user 
                            ? `${reservation.student.user.first_name} ${reservation.student.user.last_name}`
                            : reservation.tourist 
                            ? `${reservation.tourist.first_name} ${reservation.tourist.last_name}`
                            : 'Unknown'
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {reservation.student?.user?.email || reservation.tourist?.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={reservation.type === 'student' ? 'default' : 'secondary'}>
                      {reservation.type.charAt(0).toUpperCase() + reservation.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(reservation.check_in_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(reservation.check_out_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{reservation.duration?.name}</div>
                      <div className="text-muted-foreground">
                        {reservation.duration?.weeks_count} weeks
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getReservationStatusBadge(reservation.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">£{reservation.total_amount.toLocaleString()}</div>
                      <div className="text-muted-foreground">
                        £{reservation.deposit_amount.toLocaleString()} deposit
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(reservation.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredReservations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No reservations found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 