
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface CalendarEvent {
  id: string;
  type: 'checkin' | 'checkout';
  reservation: {
    id: string;
    reservation_number: string;
    tourist_profile?: {
      first_name: string;
      last_name: string;
    };
    studio?: {
      studio_number: string;
    };
    status: string;
  };
  date: string;
}

const CalendarView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
      const reservations = await ApiService.getTouristReservations();
      
      // Transform reservations into calendar events
      const calendarEvents: CalendarEvent[] = [];
      
      reservations.forEach(reservation => {
        // Check-in event
        if (reservation.check_in_date) {
          calendarEvents.push({
            id: `${reservation.id}-checkin`,
            type: 'checkin',
            reservation: reservation,
            date: reservation.check_in_date
          });
        }
        
        // Check-out event
        if (reservation.check_out_date) {
          calendarEvents.push({
            id: `${reservation.id}-checkout`,
            type: 'checkout',
            reservation: reservation,
            date: reservation.check_out_date
          });
        }
      });
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      toast({
        title: "Error",
        description: "Failed to load calendar events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'checked_in': return 'bg-blue-100 text-blue-800';
      case 'checked_out': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateStr);
  };

  const handleEditReservation = (reservationId: string) => {
    navigate(`/ota-bookings/tourists/${reservationId}`);
  };

  const handleDeleteReservation = async (reservationId: string) => {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      try {
        // Get the reservation details to find the studio ID
        const reservation = await ApiService.getReservationById(reservationId);
        
        // Update reservation status to cancelled
        await ApiService.updateTouristReservation(reservationId, { status: 'cancelled' });
        
        // Update studio status to vacant if reservation was found
        if (reservation?.studio_id) {
          try {
            await ApiService.updateStudioToVacant(reservation.studio_id);
            console.log('Studio status updated to vacant');
          } catch (studioError) {
            console.error('Error updating studio status:', studioError);
            // Don't fail the entire process if studio status update fails
          }
        }
        
        toast({
          title: "Success",
          description: "Reservation cancelled successfully",
        });
        fetchCalendarEvents(); // Refresh the calendar
      } catch (error) {
        console.error('Error cancelling reservation:', error);
        toast({
          title: "Error",
          description: "Failed to cancel reservation",
          variant: "destructive",
        });
      }
    }
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
                p-1 min-h-[80px] border rounded cursor-pointer transition-colors
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
                      {event.type === 'checkin' ? 'In:' : 'Out:'} {event.reservation.tourist_profile?.first_name}
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
            <Calendar className="h-5 w-5" />
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
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                    ) : (
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Users className="h-4 w-4 text-red-600" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">
                        {event.reservation.tourist_profile?.first_name} {event.reservation.tourist_profile?.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.reservation.studio?.studio_number} • {event.reservation.reservation_number}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={event.type === 'checkin' ? 'default' : 'destructive'}>
                      {event.type === 'checkin' ? 'Check-in' : 'Check-out'}
                    </Badge>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => navigate(`/ota-bookings/tourists/${event.reservation.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEditReservation(event.reservation.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteReservation(event.reservation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Skeleton */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid Skeleton */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                  
                  {/* Calendar days */}
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events Panel Skeleton */}
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Skeleton className="h-8 w-8 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-16" />
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
          <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-600 mt-1">View tourist bookings in calendar format</p>
        </div>
        <Button onClick={() => navigate('/ota-bookings/tourists/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
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

export default CalendarView;
