
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ApiService, CleaningTaskWithDetails, CleanerWithUser } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  CalendarDays, 
  Users, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Trash2,
  Edit,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CleaningOverview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [cleaningTasks, setCleaningTasks] = useState<CleaningTaskWithDetails[]>([]);
  const [cleaners, setCleaners] = useState<CleanerWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCleaningData();
  }, []);

  const fetchCleaningData = async () => {
    try {
      setIsLoading(true);
      const [tasksData, cleanersData] = await Promise.all([
        ApiService.getCleaningTasks(),
        ApiService.getCleaners()
      ]);
      setCleaningTasks(tasksData);
      setCleaners(cleanersData);
    } catch (error) {
      console.error('Error fetching cleaning data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cleaning data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats from real data
  const stats = [
    {
      title: 'Total Tasks',
      value: cleaningTasks.length.toString(),
      icon: CalendarDays,
      color: 'text-blue-600'
    },
    {
      title: 'Completed Today',
      value: cleaningTasks.filter(task => 
        task.status === 'completed' && 
        task.scheduled_date === new Date().toISOString().split('T')[0]
      ).length.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Tourist Checkouts',
      value: cleaningTasks.filter(task => 
        task.notes && task.notes.includes('Check-out cleaning')
      ).length.toString(),
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Pending Tasks',
      value: cleaningTasks.filter(task => task.status === 'pending').length.toString(),
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: 'secondary' as const, color: 'bg-green-100 text-green-800' },
      'in-progress': { variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
      pending: { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      active: { variant: 'secondary' as const, color: 'bg-green-100 text-green-800' },
      break: { variant: 'secondary' as const, color: 'bg-orange-100 text-orange-800' },
      inactive: { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' }
    };

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      normal: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    };

    return colors[priority as keyof typeof colors] || colors.normal;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Daily Schedule</TabsTrigger>
          <TabsTrigger value="cleaners">Cleaners</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        {/* Daily Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle>Today's Cleaning Schedule</CardTitle>
                <CardDescription>
                  Manage daily cleaning tasks and room assignments
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by room number or cleaner name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Room</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Cleaner</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Time</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Priority</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Notes</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Loading cleaning tasks...</p>
                        </td>
                      </tr>
                    ) : (
                      cleaningTasks.map((task) => (
                        <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">
                              {task.studio ? task.studio.studio_number : 'No Studio Assigned'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {task.studio?.room_grade?.name || 'No Room Grade'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-900">
                              {task.cleaner ? `${task.cleaner.user.first_name} ${task.cleaner.user.last_name}` : 'Unassigned'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-900">
                              {task.scheduled_time} ({task.estimated_duration} min)
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusBadge(task.status).color}>
                              {task.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {task.notes || 'No notes'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cleaners Tab */}
        <TabsContent value="cleaners">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle>Cleaner Management</CardTitle>
                <CardDescription>
                  Manage cleaner profiles and daily assignments
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/cleaning/add-cleaner')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Cleaner
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  <div className="col-span-full text-center py-8">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Loading cleaners...</p>
                  </div>
                ) : (
                  cleaners.map((cleaner) => (
                    <Card key={cleaner.id} className="hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => navigate(`/cleaning/cleaner/${cleaner.id}`)}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {`${cleaner.user.first_name} ${cleaner.user.last_name}`}
                          </h3>
                          <Badge className={getStatusBadge(cleaner.is_active ? 'active' : 'inactive').color}>
                            {cleaner.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Hourly Rate:</span> £{cleaner.hourly_rate}
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span> {cleaner.user.phone || 'No phone'}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {cleaner.user.email}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar View Tab */}
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  Schedule for {selectedDate?.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cleaningTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium">{task.scheduled_time}</div>
                        <div>
                          <div className="font-medium">
                            {task.studio ? task.studio.studio_number : 'No Studio Assigned'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {task.cleaner ? `${task.cleaner.user.first_name} ${task.cleaner.user.last_name}` : 'Unassigned'}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusBadge(task.status).color}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CleaningOverview;
