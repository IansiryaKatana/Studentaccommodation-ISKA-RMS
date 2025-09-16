import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  User,
  LogIn,
  LogOut,
  Clock
} from 'lucide-react';
import { ApiService } from '@/services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface CalendarEvent {
  id: string;
  date: string;
  type: 'checkin' | 'checkout';
  student: {
    id: string;
    name: string;
    studio_number?: string;
  };
}

const StudentCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCalendarEvents();
  }, [currentDate]);

  const fetchCalendarEvents = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement API call to get student check-in/check-out events
      // For now, we'll create some dummy data
      const dummyEvents: CalendarEvent[] = [
        {
          id: '1',
          date: format(new Date(), 'yyyy-MM-dd'),
          type: 'checkin',
          student: {
            id: '1',
            name: 'John Smith',
            studio_number: 'S101'
          }
        },
        {
          id: '2',
          date: format(addMonths(new Date(), 0), 'yyyy-MM-dd'),
          type: 'checkout',
          student: {
            id: '2',
            name: 'Jane Doe',
            studio_number: 'S102'
          }
        }
      ];
      setEvents(dummyEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateStr);
  };

  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add padding days for the calendar grid
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
    
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {allDays.map(day => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          
          return (
            <div
              key={day.toISOString()}
              className={`
                p-2 min-h-[80px] border rounded cursor-pointer transition-colors
                ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                ${isSelected ? 'ring-2 ring-blue-500' : ''}
                hover:bg-gray-50
              `}
              onClick={() => setSelectedDate(day)}
            >
              <div className="text-sm font-medium mb-1">
                {format(day, 'd')}
              </div>
              
              {dayEvents.length > 0 && (
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate ${
                        event.type === 'checkin' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {event.type === 'checkin' ? 'Check-in' : 'Check-out'}: {event.student.name}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSelectedDateDetails = () => {
    if (!selectedDate) return null;
    
    const dayEvents = getEventsForDate(selectedDate);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {format(selectedDate, 'MMMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dayEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No events on this date</p>
          ) : (
            <div className="space-y-3">
              {dayEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {event.type === 'checkin' ? (
                      <LogIn className="h-5 w-5 text-green-600" />
                    ) : (
                      <LogOut className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium">{event.student.name}</div>
                      <div className="text-sm text-gray-500">
                        Studio: {event.student.studio_number || 'Not assigned'}
                      </div>
                    </div>
                  </div>
                  <Badge variant={event.type === 'checkin' ? 'default' : 'destructive'}>
                    {event.type === 'checkin' ? 'Check-in' : 'Check-out'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
          
          {dayEvents.length > 0 && (
            <Button 
              className="w-full mt-4" 
              onClick={() => navigate('/students/checkin-checkout')}
            >
              Manage Check-ins/Check-outs
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Calendar</h1>
          <p className="text-gray-600 mt-1">Track student check-ins and check-outs</p>
        </div>
        <Button onClick={() => navigate('/students/checkin-checkout')}>
          <Clock className="h-4 w-4 mr-2" />
          Check-in/Check-out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {format(currentDate, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading calendar...</div>
              ) : (
                renderCalendarGrid()
              )}
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div>
          {renderSelectedDateDetails()}
        </div>
      </div>
    </div>
  );
};

export default StudentCalendar;