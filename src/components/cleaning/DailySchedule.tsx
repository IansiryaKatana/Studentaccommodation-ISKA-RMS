
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ApiService, CleaningTaskWithDetails } from '@/services/api';

const DailySchedule = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cleaningTasks, setCleaningTasks] = useState<CleaningTaskWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCleaningTasks();
  }, []);

  const fetchCleaningTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const tasks = await ApiService.getCleaningTasks();
      setCleaningTasks(tasks);
    } catch (err) {
      console.error('Error fetching cleaning tasks:', err);
      setError('Failed to load cleaning tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: 'secondary' as const, color: 'bg-green-100 text-green-800' },
      'in_progress': { variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
      scheduled: { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      pending: { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' },
      cancelled: { variant: 'secondary' as const, color: 'bg-red-100 text-red-800' },
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

  // Filter tasks based on search term
  const filteredTasks = cleaningTasks.filter(task => {
    const searchLower = searchTerm.toLowerCase();
    const studioNumber = task.studio?.studio_number?.toLowerCase() || '';
    const cleanerName = task.cleaner ? 
      `${task.cleaner.user.first_name} ${task.cleaner.user.last_name}`.toLowerCase() : '';
    const notes = task.notes?.toLowerCase() || '';
    
    return studioNumber.includes(searchLower) || 
           cleanerName.includes(searchLower) || 
           notes.includes(searchLower);
  });

  return (
    <div className="space-y-6 p-6">
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
            <Button 
              size="sm"
              onClick={() => navigate('/cleaning/add-task')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by room number, cleaner, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Loading cleaning tasks...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">
                {searchTerm ? 'No cleaning tasks found matching your search' : 'No cleaning tasks scheduled'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
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
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusBadge(task.status).color}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailySchedule;
