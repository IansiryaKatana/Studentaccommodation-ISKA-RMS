
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ApiService, CleaningTaskWithDetails, CleanerWithUser, Studio, User } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
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
import { StatsCardSkeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

const CleaningOverview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedAcademicYear } = useAcademicYear();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [cleaningTasks, setCleaningTasks] = useState<CleaningTaskWithDetails[]>([]);
  const [cleaners, setCleaners] = useState<CleanerWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Dialog states
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showAddCleanerDialog, setShowAddCleanerDialog] = useState(false);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Form data
  const [newTask, setNewTask] = useState({
    studio_id: '',
    cleaner_id: '',
    scheduled_date: '',
    scheduled_time: '09:00',
    estimated_duration: 120,
    notes: ''
  });
  
  const [newCleaner, setNewCleaner] = useState({
    user_id: ''
  });

  useEffect(() => {
    fetchCleaningData();
  }, [selectedAcademicYear]);

  // Filtered list for search; used by bulk-select and rendering
  const filteredTasks = useMemo(() => {
    const term = (searchTerm || '').toLowerCase().trim();
    if (!term) return cleaningTasks;
    return cleaningTasks.filter(task => {
      const studioNum = task.studio?.studio_number?.toString().toLowerCase() || '';
      const roomGrade = task.studio?.room_grade?.name?.toLowerCase() || '';
      const cleanerName = task.cleaner ? `${task.cleaner.user?.first_name || ''} ${task.cleaner.user?.last_name || ''}`.toLowerCase() : '';
      return (
        studioNum.includes(term) ||
        roomGrade.includes(term) ||
        cleanerName.includes(term)
      );
    });
  }, [cleaningTasks, searchTerm]);

  // Add real-time updates for cleaning task changes
  useEffect(() => {
    const handleCleaningTaskUpdate = () => {
      fetchCleaningData();
    };

    // Listen for custom events from other components
    window.addEventListener('cleaningTaskUpdated', handleCleaningTaskUpdate);
    window.addEventListener('cleaningTaskCreated', handleCleaningTaskUpdate);
    window.addEventListener('cleaningTaskDeleted', handleCleaningTaskUpdate);

    return () => {
      window.removeEventListener('cleaningTaskUpdated', handleCleaningTaskUpdate);
      window.removeEventListener('cleaningTaskCreated', handleCleaningTaskUpdate);
      window.removeEventListener('cleaningTaskDeleted', handleCleaningTaskUpdate);
    };
  }, []);

  const fetchCleaningData = async () => {
    try {
      setIsLoading(true);
      const [tasksData, cleanersData, studiosData, usersData] = await Promise.all([
        ApiService.getCleaningTasks(selectedAcademicYear),
        ApiService.getCleaners(),
        ApiService.getStudios(),
        ApiService.getUsers()
      ]);
      setCleaningTasks(tasksData);
      setCleaners(cleanersData);
      setStudios(studiosData);
      setUsers(usersData);
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

  const handleCreateTask = async () => {
    try {
      if (!newTask.studio_id || !newTask.scheduled_date) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      await ApiService.createCleaningTask({
        studio_id: newTask.studio_id,
        cleaner_id: newTask.cleaner_id || undefined,
        scheduled_date: newTask.scheduled_date,
        scheduled_time: newTask.scheduled_time,
        estimated_duration: newTask.estimated_duration,
        status: 'pending',
        notes: newTask.notes,
        academic_year: selectedAcademicYear,
        created_by: 'current_user' // TODO: Get from auth context
      });

      toast({
        title: "Success",
        description: "Cleaning task created successfully.",
      });

      setNewTask({
        studio_id: '',
        cleaner_id: '',
        scheduled_date: '',
        scheduled_time: '09:00',
        estimated_duration: 120,
        notes: ''
      });
      setShowAddTaskDialog(false);
      fetchCleaningData();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create cleaning task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateCleaner = async () => {
    try {
      if (!newCleaner.user_id) {
        toast({
          title: "Validation Error",
          description: "Please select a user.",
          variant: "destructive",
        });
        return;
      }

      await ApiService.createCleaner({
        user_id: newCleaner.user_id,
        is_active: true
      });

      toast({
        title: "Success",
        description: "Cleaner added successfully.",
      });

      setNewCleaner({ user_id: '' });
      setShowAddCleanerDialog(false);
      fetchCleaningData();
    } catch (error) {
      console.error('Error creating cleaner:', error);
      toast({
        title: "Error",
        description: "Failed to add cleaner. Please try again.",
        variant: "destructive",
      });
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

  // Bulk operations
  const handleTaskSelection = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks([...selectedTasks, taskId]);
    } else {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(filteredTasks.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleBulkAssign = async (cleanerId: string) => {
    try {
      const promises = selectedTasks.map(taskId => 
        ApiService.updateCleaningTask(taskId, { cleaner_id: cleanerId })
      );
      await Promise.all(promises);
      
      toast({
        title: "Success",
        description: `${selectedTasks.length} tasks assigned successfully`,
      });
      
      setSelectedTasks([]);
      fetchCleaningData();
    } catch (error) {
      console.error('Error bulk assigning tasks:', error);
      toast({
        title: "Error",
        description: "Failed to assign tasks",
        variant: "destructive",
      });
    }
  };

  const handleBulkComplete = async () => {
    try {
      const promises = selectedTasks.map(taskId => 
        ApiService.updateCleaningTask(taskId, { 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
      );
      await Promise.all(promises);
      
      toast({
        title: "Success",
        description: `${selectedTasks.length} tasks completed successfully`,
      });
      
      setSelectedTasks([]);
      fetchCleaningData();
    } catch (error) {
      console.error('Error bulk completing tasks:', error);
      toast({
        title: "Error",
        description: "Failed to complete tasks",
        variant: "destructive",
      });
    }
  };

  // Smart scheduling - auto-assign tasks based on cleaner availability
  const handleSmartSchedule = async () => {
    try {
      const unassignedTasks = cleaningTasks.filter(task => !task.cleaner_id);
      const availableCleaners = cleaners.filter(cleaner => cleaner.is_active);
      
      if (unassignedTasks.length === 0) {
        toast({
          title: "Info",
          description: "All tasks are already assigned",
        });
        return;
      }

      if (availableCleaners.length === 0) {
        toast({
          title: "Warning",
          description: "No available cleaners found",
          variant: "destructive",
        });
        return;
      }

      // Simple round-robin assignment
      const promises = unassignedTasks.map((task, index) => {
        const cleaner = availableCleaners[index % availableCleaners.length];
        return ApiService.updateCleaningTask(task.id, { cleaner_id: cleaner.id });
      });

      await Promise.all(promises);
      
      toast({
        title: "Success",
        description: `${unassignedTasks.length} tasks auto-assigned successfully`,
      });
      
      fetchCleaningData();
    } catch (error) {
      console.error('Error smart scheduling:', error);
      toast({
        title: "Error",
        description: "Failed to auto-assign tasks",
        variant: "destructive",
      });
    }
  };

  // Individual task actions
  const handleCompleteTask = async (taskId: string) => {
    try {
      await ApiService.updateCleaningTask(taskId, {
        status: 'completed',
        completed_at: new Date().toISOString()
      });
      
      toast({
        title: "Success",
        description: "Task completed successfully",
      });
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this cleaning task?')) {
      return;
    }

    try {
      await ApiService.deleteCleaningTask(taskId);
      
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <StatsCardSkeleton key={index} />
            ))}
          </>
        ) : (
          stats.map((stat, index) => (
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
          ))
        )}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="cleaners">Cleaners</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        {/* Today Tab */}
        <TabsContent value="today">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle>Today's Cleaning Schedule</CardTitle>
                <CardDescription>
                  Manage daily cleaning tasks and room assignments
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {selectedTasks.length > 0 && (
                  <div className="flex items-center space-x-2 mr-4">
                    <span className="text-sm text-gray-600">
                      {selectedTasks.length} selected
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowBulkActions(!showBulkActions)}
                    >
                      Bulk Actions
                    </Button>
                  </div>
                )}
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSmartSchedule}
                  title="Auto-assign unassigned tasks to available cleaners"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Smart Schedule
                </Button>
                <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create Cleaning Task</DialogTitle>
                      <DialogDescription>
                        Add a new cleaning task for a studio.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="studio" className="text-right">
                          Studio *
                        </Label>
                        <Select value={newTask.studio_id} onValueChange={(value) => setNewTask({...newTask, studio_id: value})}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select studio" />
                          </SelectTrigger>
                          <SelectContent>
                            {studios.map((studio) => (
                              <SelectItem key={studio.id} value={studio.id}>
                                {studio.studio_number} - {studio.room_grade?.name || 'No Grade'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cleaner" className="text-right">
                          Cleaner
                        </Label>
                        <Select value={newTask.cleaner_id} onValueChange={(value) => setNewTask({...newTask, cleaner_id: value})}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select cleaner (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {cleaners.map((cleaner) => (
                              <SelectItem key={cleaner.id} value={cleaner.id}>
                                {cleaner.user.first_name} {cleaner.user.last_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Date *
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={newTask.scheduled_date}
                          onChange={(e) => setNewTask({...newTask, scheduled_date: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                          Time
                        </Label>
                        <Input
                          id="time"
                          type="time"
                          value={newTask.scheduled_time}
                          onChange={(e) => setNewTask({...newTask, scheduled_time: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">
                          Duration (min)
                        </Label>
                        <Input
                          id="duration"
                          type="number"
                          value={newTask.estimated_duration}
                          onChange={(e) => setNewTask({...newTask, estimated_duration: parseInt(e.target.value) || 120})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                          Notes
                        </Label>
                        <Textarea
                          id="notes"
                          value={newTask.notes}
                          onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                          className="col-span-3"
                          placeholder="Optional notes..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setShowAddTaskDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleCreateTask}>
                        Create Task
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Bulk Actions Dropdown */}
              {showBulkActions && selectedTasks.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-blue-900">
                        Bulk Actions for {selectedTasks.length} tasks:
                      </span>
                      <div className="flex items-center space-x-2">
                        <select 
                          className="px-3 py-1 border border-blue-300 rounded text-sm"
                          onChange={(e) => {
                            if (e.target.value) {
                              handleBulkAssign(e.target.value);
                              setShowBulkActions(false);
                            }
                          }}
                        >
                          <option value="">Assign to Cleaner</option>
                          {cleaners.map(cleaner => (
                            <option key={cleaner.id} value={cleaner.id}>
                              {cleaner.user?.first_name} {cleaner.user?.last_name}
                            </option>
                          ))}
                        </select>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={handleBulkComplete}
                        >
                          Mark Complete
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={async () => {
                            if (!confirm(`Delete ${selectedTasks.length} tasks? This cannot be undone.`)) return;
                            try {
                              await Promise.all(selectedTasks.map(id => ApiService.deleteCleaningTask(id)));
                              toast({ title: 'Success', description: 'Selected tasks deleted' });
                              setSelectedTasks([]);
                              fetchCleaningData();
                            } catch (e) {
                              console.error(e);
                              toast({ title: 'Error', description: 'Failed to delete selected tasks', variant: 'destructive' });
                            }
                          }}
                        >
                          Bulk Delete
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedTasks([])}
                        >
                          Clear Selection
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        <input
                          type="checkbox"
                          checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </th>
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
                        <td colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <p className="text-sm text-gray-500">Loading cleaning tasks...</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTasks
                        .filter(task => {
                          // Only tasks scheduled for today
                          try {
                            const today = new Date();
                            const d = new Date(task.scheduled_date);
                            return d.getFullYear() === today.getFullYear() &&
                                   d.getMonth() === today.getMonth() &&
                                   d.getDate() === today.getDate();
                          } catch {
                            return false;
                          }
                        })
                        .map((task) => (
                        <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={selectedTasks.includes(task.id)}
                              onChange={(e) => handleTaskSelection(task.id, e.target.checked)}
                              className="rounded border-gray-300"
                            />
                          </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">
                                {task.studio ? task.studio.studio_number : 'No Studio Assigned'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {task.studio?.room_grade?.name || 'No Room Grade'}
                              </div>
                              {task.reservation_id && (
                                <div className="text-xs text-blue-600 mt-1">
                                  Reservation: {task.reservation_id.slice(0, 8)}...
                                </div>
                              )}
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
                              {task.status !== 'completed' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleCompleteTask(task.id)}
                                  title="Mark as completed"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-600"
                                title="Delete task"
                              >
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

        {/* Upcoming Tab */}
        <TabsContent value="upcoming">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Cleaning Tasks</CardTitle>
                <CardDescription>
                  Tasks scheduled for future dates
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Room</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Cleaner</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Time</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <p className="text-sm text-gray-500">Loading cleaning tasks...</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTasks
                        .filter(task => {
                          // Future dates only
                          try {
                            const today = new Date();
                            const d = new Date(task.scheduled_date);
                            return d > new Date(today.getFullYear(), today.getMonth(), today.getDate());
                          } catch {
                            return false;
                          }
                        })
                        .map(task => (
                          <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">
                                {task.studio ? task.studio.studio_number : 'No Studio Assigned'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {task.studio?.room_grade?.name || 'No Room Grade'}
                              </div>
                              {task.reservation_id && (
                                <div className="text-xs text-blue-600 mt-1">
                                  Reservation: {task.reservation_id.slice(0, 8)}...
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-gray-900">
                                {task.cleaner ? `${task.cleaner.user.first_name} ${task.cleaner.user.last_name}` : 'Unassigned'}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-gray-900">
                                {task.scheduled_date}
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
                              <span className={`px-2 py-1 rounded text-xs ${getPriorityBadge('normal')}`}>Normal</span>
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
                <Dialog open={showAddCleanerDialog} onOpenChange={setShowAddCleanerDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Cleaner
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Cleaner</DialogTitle>
                      <DialogDescription>
                        Assign a user as a cleaner for the cleaning team.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="user" className="text-right">
                          User *
                        </Label>
                        <Select value={newCleaner.user_id} onValueChange={(value) => setNewCleaner({...newCleaner, user_id: value})}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                          <SelectContent>
                            {users
                              .filter(user => !cleaners.some(cleaner => cleaner.user_id === user.id))
                              .map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.first_name} {user.last_name} ({user.email})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setShowAddCleanerDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleCreateCleaner}>
                        Add Cleaner
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  <>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Card key={index} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-gray-200 rounded mb-4"></div>
                          <div className="h-3 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
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
