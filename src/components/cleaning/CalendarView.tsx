
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { ApiService, CleaningTaskWithDetails } from '@/services/api';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
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

  // Filter tasks for selected date
  const getTasksForDate = (date: Date) => {
    if (!date) return [];
    
    const dateString = date.toISOString().split('T')[0];
    return cleaningTasks.filter(task => task.scheduled_date === dateString);
  };

  const selectedDateTasks = getTasksForDate(selectedDate || new Date());

  return (
    <div className="space-y-6 p-6">
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
            <CardDescription>
              Cleaning tasks scheduled for the selected date
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Loading cleaning tasks...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            ) : selectedDateTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No cleaning tasks scheduled for this date</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateTasks.map((task) => (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
