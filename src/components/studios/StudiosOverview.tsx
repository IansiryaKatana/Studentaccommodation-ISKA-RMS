import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { ApiService } from '@/services/api';
import PaymentEventService, { PaymentEvent } from '@/services/paymentEventService';

const StudiosOverview = () => {
  const [stats, setStats] = useState({
    totalStudios: 0,
    availableStudios: 0,
    occupiedStudios: 0,
    maintenanceStudios: 0,
    cleaningStudios: 0,
    dirtyStudios: 0,
    totalRevenue: 0
  });
  const [recentStudios, setRecentStudios] = useState([]);
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
    
    window.addEventListener('studioStatusUpdated', handleStudioStatusUpdate as EventListener);
    
    return () => {
      // Cleanup: unregister listener when component unmounts
      paymentEventService.unregisterListener('StudiosOverview');
      window.removeEventListener('studioStatusUpdated', handleStudioStatusUpdate as EventListener);
    };
  }, []);

  // Handle payment events for real-time revenue updates
  const handlePaymentEvent = async (event: PaymentEvent) => {
    console.log('🏢 Studios module received payment event:', event);
    
    // Refresh studio stats to show updated revenue
    await fetchStats();
  };

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const studios = await ApiService.getStudiosWithDetails();
      
      // Calculate basic stats from actual data
      const totalStudios = studios.length;
      
      // Count studios with actual current reservations (more accurate than status)
      const actuallyOccupied = studios.filter(s => s.current_reservation !== null).length;
      
      // Count by status for other stats
      const availableStudios = studios.filter(s => s.status === 'vacant' && !s.current_reservation).length;
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

      // Get recent studios for the table
      const sortedStudios = studios
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 6);
      setRecentStudios(sortedStudios);
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
        {statsCards.map((stat, index) => (
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
        ))}
      </div>

      {/* Recent Studios Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Studios</CardTitle>
            <Link to="/studios/list">
              <Button variant="outline" size="sm">
                View All Studios
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <p>Loading studios...</p>
            </div>
          ) : recentStudios.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No studios found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Studio Number</TableHead>
                  <TableHead>Room Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentStudios.map((studio) => (
                  <TableRow key={studio.id}>
                    <TableCell>
                      <div className="font-medium">
                        {studio.studio_number}
                      </div>
                    </TableCell>
                    <TableCell>
                      {studio.room_grade?.name || 'Not assigned'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(studio.current_reservation ? 'occupied' : studio.status)}`}>
                        {studio.current_reservation ? 'Occupied' : studio.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {studio.floor !== null && studio.floor !== undefined 
                        ? (studio.floor === 0 ? 'Ground floor' : `Floor ${studio.floor}`)
                        : 'Not specified'}
                    </TableCell>
                    <TableCell>
                      {new Date(studio.created_at).toLocaleDateString()}
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
