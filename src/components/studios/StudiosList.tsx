import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ApiService, Studio, RoomGrade, Reservation, StudioOccupancy } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
import { TableSkeleton } from '@/components/ui/skeleton';
import { 
  Building2, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  Eye, 
  Plus, 
  Loader2, 
  Users, 
  Calendar,
  MapPin,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench
} from 'lucide-react';

interface StudioWithDetails extends Studio {
  room_grade?: RoomGrade;
  current_reservation?: Reservation;
  current_occupancy?: StudioOccupancy; // Per academic year occupancy
  occupancy_stats?: {
    total_days: number;
    occupied_days: number;
    occupancy_rate: number;
    total_revenue: number;
    average_daily_rate: number;
  };
}

interface StudioStats {
  total_studios: number;
  occupied_studios: number;
  vacant_studios: number;
  maintenance_studios: number;
  cleaning_studios: number;
  dirty_studios: number;
  overall_occupancy_rate: number;
  total_revenue: number;
}

export default function StudiosList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedAcademicYear } = useAcademicYear();
  
  const [studios, setStudios] = useState<StudioWithDetails[]>([]);
  const [roomGrades, setRoomGrades] = useState<RoomGrade[]>([]);
  const [stats, setStats] = useState<StudioStats>({
    total_studios: 0,
    occupied_studios: 0,
    vacant_studios: 0,
    maintenance_studios: 0,
    cleaning_studios: 0,
    dirty_studios: 0,
    overall_occupancy_rate: 0,
    total_revenue: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [selectedStudios, setSelectedStudios] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roomGradeFilter, setRoomGradeFilter] = useState<string>('all');
  const [floorFilter, setFloorFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
    
    // Listen for studio status updates from other modules
    const handleStudioStatusUpdate = (event: CustomEvent) => {
      const { studioId, newStatus } = event.detail;
      console.log(`🔄 Studio status update received: ${studioId} → ${newStatus}`);
      
      // Update the specific studio's status in the current data
      setStudios(prevStudios => 
        prevStudios.map(studio => 
          studio.id === studioId 
            ? { ...studio, status: newStatus, current_reservation: null }
            : studio
        )
      );
      
      // Recalculate stats with updated data
      setStudios(prevStudios => {
        const updatedStudios = prevStudios.map(studio => 
          studio.id === studioId 
            ? { ...studio, status: newStatus, current_reservation: null }
            : studio
        );
        calculateStats(updatedStudios);
        return updatedStudios;
      });
    };
    
    window.addEventListener('studioStatusUpdated', handleStudioStatusUpdate as EventListener);
    
    return () => {
      window.removeEventListener('studioStatusUpdated', handleStudioStatusUpdate as EventListener);
    };
  }, [selectedAcademicYear]); // Reload when academic year changes

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load studios with detailed information first (don't block on status fix)
      const studiosData = await ApiService.getStudiosWithDetails(selectedAcademicYear);
      console.log('Studios data received:', studiosData);
      console.log('Studios with reservations:', studiosData.filter(s => s.current_reservation !== null));
      console.log('Studios marked as occupied:', studiosData.filter(s => s.status === 'occupied'));
      
      // Load academic year occupancy data (no force refresh for better performance)
      let occupancyData = [];
      try {
        occupancyData = await ApiService.getStudioOccupancy(selectedAcademicYear, false); // No force refresh
        console.log(`📊 Academic year ${selectedAcademicYear} occupancy data:`, occupancyData.length, 'records');
        console.log('Occupancy breakdown:', {
          occupied: occupancyData.filter(o => o.status === 'occupied').length,
          available: occupancyData.filter(o => o.status === 'available').length,
          other: occupancyData.filter(o => o.status !== 'occupied' && o.status !== 'available').length
        });
      } catch (error) {
        console.log('No occupancy data available yet:', error.message);
        // This is normal for a new installation - occupancy data will be created as needed
      }
      
      // Debug: Check reservation data structure
      studiosData.forEach(studio => {
        if (studio.current_reservation) {
          console.log(`Studio ${studio.studio_number} reservation:`, {
            type: studio.current_reservation.type,
            student: studio.current_reservation.student,
            tourist: studio.current_reservation.tourist,
            check_out_date: studio.current_reservation.check_out_date
          });
        }
      });
      
      // Merge occupancy data with studios and ensure all studios have proper data
      const validatedStudiosData = studiosData.map(studio => {
        const occupancy = occupancyData.find(o => o.studio_id === studio.id);
        
        // Determine the correct status based on occupancy data
        let finalStatus = studio.status; // Default to original status
        
        if (occupancy) {
          // Use occupancy status if available
          if (occupancy.status === 'occupied') {
            finalStatus = 'occupied';
          } else if (occupancy.status === 'available') {
            finalStatus = 'vacant';
          } else {
            finalStatus = occupancy.status; // Use other statuses as-is
          }
        } else if (selectedAcademicYear !== 'all') {
          // If no occupancy data for this academic year, check if studio has reservations
          const hasReservation = studio.current_reservation && 
            studio.current_reservation.academic_year === selectedAcademicYear;
          finalStatus = hasReservation ? 'occupied' : 'vacant';
        }
        
        return {
          ...studio,
          current_occupancy: occupancy,
          status: finalStatus,
          room_grade: studio.room_grade || { name: 'Unknown', weekly_rate: 0 },
          occupancy_stats: studio.occupancy_stats || {
            total_days: 0,
            occupied_days: 0,
            occupancy_rate: 0,
            total_revenue: 0,
            average_daily_rate: 0
          }
        };
      });
      
      setStudios(validatedStudiosData);
      
      // Debug: Show final status mapping
      console.log('🎯 Final studio status mapping for', selectedAcademicYear, ':');
      const statusBreakdown = validatedStudiosData.reduce((acc, studio) => {
        acc[studio.status] = (acc[studio.status] || 0) + 1;
        return acc;
      }, {});
      console.log('Status breakdown:', statusBreakdown);
      
      // Load room grades for filters
      const gradesData = await ApiService.getRoomGrades();
      setRoomGrades(gradesData);
      
      // Calculate stats
      calculateStats(validatedStudiosData);
      
      // Check for studios with incorrect status (occupied but no active reservation)
      const incorrectStatusStudios = validatedStudiosData.filter(studio => 
        studio.status === 'occupied' && !studio.current_reservation
      );
      
      if (incorrectStatusStudios.length > 0) {
        console.log(`Found ${incorrectStatusStudios.length} studios with incorrect status (occupied but no active reservation):`, 
          incorrectStatusStudios.map(s => s.studio_number));
        
        // Fix statuses in background (don't block UI)
        ApiService.fixStudioStatuses().catch(error => {
          console.error('Error fixing studio statuses:', error);
        });
      }
      
    } catch (error) {
      console.error('Error loading studios:', error);
      toast({
        title: "Error",
        description: "Failed to load studios data. Please try again.",
        variant: "destructive",
      });
      
      // Set empty data to prevent infinite loading
      setStudios([]);
      setRoomGrades([]);
      setStats({
        total_studios: 0,
        occupied_studios: 0,
        vacant_studios: 0,
        maintenance_studios: 0,
        overall_occupancy_rate: 0,
        total_revenue: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (studiosData: StudioWithDetails[]) => {
    const total = studiosData.length;
    
    // Count studios with actual current reservations OR assigned students
    const actuallyOccupied = studiosData.filter(s => 
      s.current_reservation !== null || (s.assigned_students && s.assigned_students.length > 0)
    ).length;
    
    // Count by status for other stats
    const vacant = studiosData.filter(s => 
      s.status === 'vacant' && !s.current_reservation && (!s.assigned_students || s.assigned_students.length === 0)
    ).length;
    const maintenance = studiosData.filter(s => s.status === 'maintenance').length;
    const cleaning = studiosData.filter(s => s.status === 'cleaning').length;
    const dirty = studiosData.filter(s => s.status === 'dirty').length;
    
    // Calculate occupancy rate based on actual reservations + students
    const occupancyRate = total > 0 ? (actuallyOccupied / total) * 100 : 0;
    
    // Calculate total revenue from occupancy stats
    const totalRevenue = studiosData.reduce((sum, studio) => {
      const revenue = studio.occupancy_stats?.total_revenue || 0;
      return sum + revenue;
    }, 0);

    setStats({
      total_studios: total,
      occupied_studios: actuallyOccupied, // Use actual reservations + students count
      vacant_studios: vacant,
      maintenance_studios: maintenance,
      cleaning_studios: cleaning,
      dirty_studios: dirty,
      overall_occupancy_rate: occupancyRate,
      total_revenue: totalRevenue
    });
  };

  const filteredStudios = studios.filter(studio => {
    const matchesSearch = studio.studio_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (studio.room_grade?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || studio.status === statusFilter;
    const matchesGrade = roomGradeFilter === 'all' || studio.room_grade_id === roomGradeFilter;
    const matchesFloor = floorFilter === 'all' || studio.floor?.toString() === floorFilter;
    
    return matchesSearch && matchesStatus && matchesGrade && matchesFloor;
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedStudios(filteredStudios.map(s => s.id));
    } else {
      setSelectedStudios([]);
    }
  };

  const handleSelectStudio = (studioId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudios(prev => [...prev, studioId]);
    } else {
      setSelectedStudios(prev => prev.filter(id => id !== studioId));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedStudios.map(id => ApiService.deleteStudio(id)));
      
      toast({
        title: "Success",
        description: `${selectedStudios.length} studios deleted successfully.`,
      });
      
      setSelectedStudios([]);
      setSelectAll(false);
      loadData();
    } catch (error) {
      console.error('Error deleting studios:', error);
      toast({
        title: "Error",
        description: "Failed to delete some studios.",
        variant: "destructive",
      });
    }
  };

  const handleBulkStatusUpdate = async (newStatus: Studio['status']) => {
    try {
      await Promise.all(selectedStudios.map(id => ApiService.updateStudioStatus(id, newStatus)));
      
      toast({
        title: "Success",
        description: `${selectedStudios.length} studios status updated successfully.`,
      });
      
      setSelectedStudios([]);
      setSelectAll(false);
      loadData();
    } catch (error) {
      console.error('Error updating studios:', error);
      toast({
        title: "Error",
        description: "Failed to update some studios.",
        variant: "destructive",
      });
    }
  };

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

  const getStatusBadge = (studio: StudioWithDetails) => {
    // Determine actual status based on current reservation
    let actualStatus = studio.status;
    let statusIcon = getStatusIcon(studio.status);
    
    // Override status if there's a current reservation
    if (studio.current_reservation) {
      actualStatus = 'occupied';
      statusIcon = <Users className="h-4 w-4 text-green-600" />;
    } else if (studio.status === 'occupied' && !studio.current_reservation) {
      // Studio marked as occupied but no current reservation - show as vacant
      actualStatus = 'vacant';
      statusIcon = <CheckCircle className="h-4 w-4 text-blue-600" />;
    }

    const variants = {
      occupied: 'default',
      vacant: 'secondary',
      maintenance: 'destructive',
      cleaning: 'outline',
      dirty: 'destructive'
    } as const;

    return (
      <Badge variant={variants[actualStatus]} className="flex items-center gap-1">
        {statusIcon}
        {actualStatus.charAt(0).toUpperCase() + actualStatus.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Studios Management</h1>
            <p className="text-muted-foreground">Loading studios data...</p>
          </div>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Studios Management</h1>
          <div className="text-muted-foreground">
            <p className="inline">Manage all studio units and their status</p>
            {selectedAcademicYear !== 'all' && (
              <span className="ml-2">
                • <Badge variant="outline" className="ml-1">{selectedAcademicYear}</Badge>
              </span>
            )}
          </div>
        </div>
        <Button onClick={() => navigate('/studios/add')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Studio
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Studios</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_studios}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overall_occupancy_rate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.occupied_studios} of {stats.total_studios} occupied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vacant_studios}</div>
            <p className="text-xs text-muted-foreground">
              Ready for booking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{stats.total_revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From all studios
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search studios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="vacant">Vacant</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="dirty">Dirty</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roomGradeFilter} onValueChange={setRoomGradeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Room Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {roomGrades.map(grade => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={floorFilter} onValueChange={setFloorFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Floors</SelectItem>
                  {Array.from(new Set(studios.map(s => s.floor).filter(Boolean))).sort().map(floor => (
                    <SelectItem key={floor} value={floor.toString()}>
                      {floor === 0 ? 'Ground floor' : `Floor ${floor}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedStudios.length > 0 && (
              <div className="flex gap-2">
                <Select onValueChange={(value) => handleBulkStatusUpdate(value as Studio['status'])}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacant">Set Vacant</SelectItem>
                    <SelectItem value="maintenance">Set Maintenance</SelectItem>
                    <SelectItem value="cleaning">Set Cleaning</SelectItem>
                    <SelectItem value="dirty">Set Dirty</SelectItem>
                  </SelectContent>
                </Select>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete ({selectedStudios.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Studios</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedStudios.length} selected studios? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Studio</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Guest</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudios.map((studio) => (
                            <TableRow 
              key={studio.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/studios/${studio.id}`)}
            >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedStudios.includes(studio.id)}
                      onCheckedChange={(checked) => handleSelectStudio(studio.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{studio.studio_number}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{studio.room_grade?.name || 'Unknown'}</Badge>
                      <span className="text-sm text-muted-foreground">
                        £{studio.room_grade?.weekly_rate || 0}/week
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {studio.floor !== null && studio.floor !== undefined 
                      ? (studio.floor === 0 ? 'Ground floor' : `Floor ${studio.floor}`)
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(studio)}
                  </TableCell>
                  <TableCell>
                    {studio.current_reservation ? (
                      <div className="text-sm">
                        <div className="font-medium">
                          {studio.current_reservation.type === 'student' 
                            ? (studio.current_reservation.student?.user 
                                ? `${studio.current_reservation.student.user.first_name || 'Unknown'} ${studio.current_reservation.student.user.last_name || ''}`.trim()
                                : `${studio.current_reservation.student?.first_name || 'Unknown'} ${studio.current_reservation.student?.last_name || ''}`.trim())
                            : (studio.current_reservation.tourist 
                                ? `${studio.current_reservation.tourist.first_name || 'Unknown'} ${studio.current_reservation.tourist.last_name || ''}`.trim()
                                : 'Unknown')
                          }
                        </div>
                        <div className="text-muted-foreground">
                          {studio.current_reservation.type === 'student' ? 'Student' : 'OTA Guest'} • Until {new Date(studio.current_reservation.check_out_date).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Available</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">£{(studio.occupancy_stats?.total_revenue || 0).toLocaleString()}</div>
                      <div className="text-muted-foreground">
                        £{(studio.occupancy_stats?.average_daily_rate || 0).toFixed(0)}/day avg
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                        <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/studios/${studio.id}`)}
                  >
                        <Eye className="h-4 w-4" />
                      </Button>
                                        <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/studios/${studio.id}/edit`)}
                  >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredStudios.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No studios found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 