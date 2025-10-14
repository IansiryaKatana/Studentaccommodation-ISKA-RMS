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
import { ApiService, Reservation } from '@/services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useAcademicYear } from '@/contexts/AcademicYearContext';

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
  const { selectedAcademicYear } = useAcademicYear();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCalendarEvents();
  }, [currentDate, selectedAcademicYear]);

  const fetchCalendarEvents = async () => {
    try {
      setIsLoading(true);
      
      // Get all reservations with details for the selected academic year
      const reservations = await ApiService.getRecentReservations({
        academicYear: selectedAcademicYear,
        limit: 1000, // Get a large number to ensure we get all reservations
        type: 'student' // Only student reservations for this calendar
      });
      
      // Transform reservations into calendar events
      const calendarEvents: CalendarEvent[] = [];
      
      reservations.forEach((reservation: any) => {
        // Add check-in event
        if (reservation.check_in_date) {
          const studentName = reservation.student?.user 
            ? `${reservation.student.user.first_name} ${reservation.student.user.last_name}`
            : 'Unknown Student';
            
          calendarEvents.push({
            id: `${reservation.id}-checkin`,
            date: reservation.check_in_date,
            type: 'checkin',
            student: {
              id: reservation.student_id,
              name: studentName,
              studio_number: reservation.studio?.studio_number
            }
          });
        }
        
        // Add check-out event
        if (reservation.check_out_date) {
          const studentName = reservation.student?.user 
            ? `${reservation.student.user.first_name} ${reservation.student.user.last_name}`
            : 'Unknown Student';
            
          calendarEvents.push({
            id: `${reservation.id}-checkout`,
            date: reservation.check_out_date,
            type: 'checkout',
            student: {
              id: reservation.student_id,
              name: studentName,
              studio_number: reservation.studio?.studio_number
            }
          });
        }
      });
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      setEvents([]);
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

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Skeleton */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid Skeleton */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-2 text-center">
                      <Skeleton className="h-4 w-8 mx-auto" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Calendar</h1>
          <p className="text-gray-600 mt-1">
            Track student check-ins and check-outs
            {selectedAcademicYear && selectedAcademicYear !== 'all' && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Academic Year: {selectedAcademicYear}
              </span>
            )}
          </p>
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