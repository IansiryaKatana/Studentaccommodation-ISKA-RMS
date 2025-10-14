import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { ApiService } from '@/services/api';
import PaymentEventService, { PaymentEvent } from '@/services/paymentEventService';
import { TableSkeleton, StatsCardSkeleton } from '@/components/ui/skeleton';
import { useAcademicYear } from '@/contexts/AcademicYearContext';

const StudiosOverview = () => {
  const { selectedAcademicYear } = useAcademicYear();
  const [stats, setStats] = useState({
    totalStudios: 0,
    availableStudios: 0,
    occupiedStudios: 0,
    maintenanceStudios: 0,
    cleaningStudios: 0,
    dirtyStudios: 0,
    totalRevenue: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Register for payment events to update revenue stats in real-time
    const paymentEventService = PaymentEventService.getInstance();
    paymentEventService.registerListener('StudiosOverview', handlePaymentEvent);
    
    // Listen for studio status updates from other modules
    const handleStudioStatusUpdate = (event: CustomEvent) => {
      const { studioId, newStatus } = event.detail;
      console.log(`🔄 Studio status update received in Overview: ${studioId} → ${newStatus}`);
      
      // Refresh stats to reflect studio status changes
      fetchStats();
    };

    // Listen for new reservations to refresh stats
    const handleNewReservation = (event: CustomEvent) => {
      console.log(`🔄 New reservation created, refreshing StudiosOverview stats`);
      fetchStats();
    };
    
    // Listen for student assignments (which also affect studio occupancy)
    const handleStudentAssignment = (event: CustomEvent) => {
      const { reason } = event.detail || {};
      if (reason === 'student_assigned') {
        console.log(`🔄 Student assigned to studio, refreshing StudiosOverview stats`);
        fetchStats();
      }
    };
    
    window.addEventListener('studioStatusUpdated', handleStudioStatusUpdate as EventListener);
    window.addEventListener('newReservationCreated', handleNewReservation as EventListener);
    
    return () => {
      // Cleanup: unregister listener when component unmounts
      paymentEventService.unregisterListener('StudiosOverview');
      window.removeEventListener('studioStatusUpdated', handleStudioStatusUpdate as EventListener);
      window.removeEventListener('newReservationCreated', handleNewReservation as EventListener);
    };
  }, [selectedAcademicYear]);

  // Handle payment events for real-time revenue updates
  const handlePaymentEvent = async (event: PaymentEvent) => {
    console.log('🏢 Studios module received payment event:', event);
    
    // Refresh studio stats to show updated revenue
    await fetchStats();
  };

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const studios = await ApiService.getStudiosWithDetails(selectedAcademicYear);
      
      // Get academic year specific occupancy data (no force refresh for better performance)
      let occupancyData = [];
      try {
        occupancyData = await ApiService.getStudioOccupancy(selectedAcademicYear, false); // No force refresh
      } catch (error) {
        console.log('No occupancy data available yet:', error.message);
        // This is normal for a new installation - occupancy data will be created as needed
      }
      
      // Calculate basic stats from actual data (same logic as StudiosList)
      const totalStudios = studios.length;
      
      // Count studios with actual current reservations OR assigned students
      const actuallyOccupied = studios.filter(s => 
        s.current_reservation !== null || (s.assigned_students && s.assigned_students.length > 0)
      ).length;
      
      // Count available studios (vacant status and no current reservation and no students)
      const availableStudios = studios.filter(s => 
        s.status === 'vacant' && !s.current_reservation && (!s.assigned_students || s.assigned_students.length === 0)
      ).length;
      
      // Debug logging
      console.log('🏢 StudiosOverview stats calculation:', {
        totalStudios,
        actuallyOccupied,
        availableStudios,
        studiosWithReservations: studios.filter(s => s.current_reservation !== null).length,
        vacantStudios: studios.filter(s => s.status === 'vacant').length,
        academicYear: selectedAcademicYear
      });
      
      // Count by status for other stats (these are studio-level, not academic year specific)
      const maintenanceStudios = studios.filter(s => s.status === 'maintenance').length;
      const cleaningStudios = studios.filter(s => s.status === 'cleaning').length;
      const dirtyStudios = studios.filter(s => s.status === 'dirty').length;
      
      // Calculate total revenue from occupancy stats (more accurate)
      const totalRevenue = studios.reduce((sum, studio) => {
        return sum + (studio.occupancy_stats?.total_revenue || 0);
      }, 0);
      
      setStats({
        totalStudios,
        availableStudios,
        occupiedStudios: actuallyOccupied, // Use actual reservations count
        maintenanceStudios,
        cleaningStudios,
        dirtyStudios,
        totalRevenue
      });

      // Get recent reservations for the table
      try {
        const recentReservationsData = await ApiService.getRecentReservations({
          academicYear: selectedAcademicYear,
          limit: 10
        });
        setRecentReservations(recentReservationsData);
      } catch (error) {
        console.log('No recent reservations found:', error.message);
        setRecentReservations([]);
      }
    } catch (error) {
      console.error('Error fetching studio stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Studios',
      value: stats.totalStudios,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Available',
      value: stats.availableStudios,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Occupied',
      value: stats.occupiedStudios,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Maintenance',
      value: stats.maintenanceStudios,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Cleaning',
      value: stats.cleaningStudios,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Dirty',
      value: stats.dirtyStudios,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total Revenue',
      value: `£${stats.totalRevenue.toLocaleString()}`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      vacant: 'bg-green-100 text-green-800',
      occupied: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-orange-100 text-orange-800',
      dirty: 'bg-yellow-100 text-yellow-800',
      cleaning: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Studios Overview</h1>
          <p className="text-gray-600 mt-1">Manage studio accommodations and availability</p>
        </div>
        <Link to="/studios/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Studio
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
        {isLoading ? (
          <>
            {Array.from({ length: 7 }).map((_, index) => (
              <StatsCardSkeleton key={index} />
            ))}
          </>
        ) : (
          statsCards.map((stat, index) => (
          <Card key={index} className={`${stat.bgColor} border-0`}>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color} break-words`}>
                  {isLoading ? '...' : stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))
        )}
      </div>

      {/* Recent Reservations Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Reservations</CardTitle>
            <Link to="/studios/list">
              <Button variant="outline" size="sm">
                View All Studios
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} columns={6} />
          ) : recentReservations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No recent reservations found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Studio</TableHead>
                  <TableHead>Room Grade</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Check-in / Check-out</TableHead>
                  <TableHead>Guest</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <div className="font-medium">
                        Studio {reservation.studio?.studio_number}
                      </div>
                    </TableCell>
                    <TableCell>
                      {reservation.studio?.room_grade?.name || 'Not assigned'}
                    </TableCell>
                    <TableCell>
                      {reservation.studio?.floor !== null && reservation.studio?.floor !== undefined 
                        ? (reservation.studio.floor === 0 ? 'Ground floor' : `Floor ${reservation.studio.floor}`)
                        : 'Not specified'}
                    </TableCell>
                    <TableCell>
                      {reservation.duration?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(reservation.check_in_date).toLocaleDateString()}</div>
                        <div className="text-gray-500">to {new Date(reservation.check_out_date).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {reservation.type === 'student' ? (
                          <div>
                            <div className="font-medium">
                              {reservation.student?.user?.first_name} {reservation.student?.user?.last_name}
                            </div>
                            <div className="text-gray-500 text-xs">Student</div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium">
                              {reservation.tourist?.first_name} {reservation.tourist?.last_name}
                            </div>
                            <div className="text-gray-500 text-xs">Tourist</div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudiosOverview;
