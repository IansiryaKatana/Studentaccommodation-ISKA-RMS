
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, MoreHorizontal, Building2, Users, Globe, Calendar } from 'lucide-react';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Reservation {
  id: string;
  reservation_number: string;
  type: 'student' | 'tourist';
  check_in_date: string;
  check_out_date: string;
  status: string;
  total_amount: number;
  deposit_amount: number | null;
  balance_due: number;
  notes: string | null;
  created_at: string;
  studio?: {
    studio_number: string;
    room_grade?: {
      name: string;
    };
  };
  student?: {
    student_id: string;
    user?: {
      first_name: string;
      last_name: string;
    };
  };
  tourist?: {
    user?: {
      first_name: string;
      last_name: string;
    };
  };
  duration?: {
    name: string;
    weeks_count: number;
  };
}

export default function ReservationsOverview() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      console.log('Fetching reservations...');
      
      // Use a simpler query first to get basic reservation data
      const data = await ApiService.getReservations();

      if (!data) {
        console.error('No data returned from API');
        throw new Error('Failed to load bookings.');
      }

      console.log('Raw reservations data:', data);

      // Transform the data to match the expected interface
      const transformedData = data?.map(reservation => ({
        ...reservation,
        studio: null, // Will be populated later if needed
        student: null, // Will be populated later if needed
        tourist: null, // Will be populated later if needed
        duration: null, // Will be populated later if needed
      })) || [];

      console.log('Transformed reservations data:', transformedData);
      setReservations(transformedData);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.reservation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reservation.student?.user && 
        `${reservation.student.user.first_name} ${reservation.student.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (reservation.tourist?.user && 
        `${reservation.tourist.user.first_name} ${reservation.tourist.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (reservation.studio?.studio_number && reservation.studio.studio_number.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    const matchesType = typeFilter === 'all' || reservation.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'checked_in': return 'default';
      case 'checked_out': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    return type === 'student' ? 'default' : 'secondary';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getGuestName = (reservation: Reservation) => {
    if (reservation.student?.user) {
      return `${reservation.student.user.first_name} ${reservation.student.user.last_name}`;
    }
    if (reservation.tourist?.user) {
      return `${reservation.tourist.user.first_name} ${reservation.tourist.user.last_name}`;
    }
    return 'Unknown';
  };

  const getStudentId = (reservation: Reservation) => {
    return reservation.student?.student_id || 'N/A';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">OTA Bookings</h2>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            New Reservation
          </Button>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reservations</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Reservation
        </Button>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">


        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/students')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Student List</div>
            <p className="text-xs text-muted-foreground">
                              View student records (redirects to Students module)
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/ota-bookings/tourists')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tourist Bookings</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tourist List</div>
            <p className="text-xs text-muted-foreground">
                              View and manage tourist bookings
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/ota-bookings/calendar')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calendar View</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Calendar</div>
            <p className="text-xs text-muted-foreground">
                              View bookings in calendar format
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="checked_out">Checked Out</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="tourist">Tourist</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setTypeFilter('all');
            }}>
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({filteredReservations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reservation #</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Studio</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Balance Due</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">
                    {reservation.reservation_number}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{getGuestName(reservation)}</div>
                      {reservation.type === 'student' && (
                        <div className="text-sm text-gray-500">ID: {getStudentId(reservation)}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(reservation.type)}>
                      {reservation.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{reservation.studio?.studio_number || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{reservation.studio?.room_grade?.name || 'N/A'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {reservation.duration?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {formatDate(reservation.check_in_date)}
                  </TableCell>
                  <TableCell>
                    {formatDate(reservation.check_out_date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(reservation.status)}>
                      {reservation.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(reservation.total_amount)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(reservation.balance_due)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredReservations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
                              No bookings found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
