import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, Eye, Edit, Trash2, Calendar, Mail, Phone } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ApiService, Lead } from '@/services/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatCardsCarousel } from '@/components/leads/StatCardsCarousel';


const BookedViewingLeads = () => {
  const [bookings, setBookings] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Lead | null>(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Fetch all leads and filter for viewing bookings
      const allLeads = await ApiService.getLeads();
      // Filter leads that have "Viewing booking requested for:" in notes
      const viewingBookings = allLeads.filter(lead => 
        lead.notes && lead.notes.includes('Viewing booking requested for:')
      );
      setBookings(viewingBookings);
    } catch (error) {
      console.error('Error fetching viewing bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async () => {
    if (!bookingToDelete) return;

    try {
      await ApiService.deleteLead(bookingToDelete.id);
      setBookings(bookings.filter(booking => booking.id !== bookingToDelete.id));
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    } catch (error) {
      console.error('Error deleting viewing booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCompactDateTime = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const hour = date.getHours();
    const minute = date.getMinutes();
    
    // Format day with ordinal (1st, 2nd, 3rd, 4th, etc.)
    const getOrdinal = (n: number) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    
    // Format time (7pm, 7am, 2:30pm, etc.)
    const formatTime = (h: number, m: number) => {
      if (m === 0) {
        return h === 0 ? '12am' : h === 12 ? '12pm' : h > 12 ? `${h - 12}pm` : `${h}am`;
      } else {
        const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
        const ampm = h >= 12 ? 'pm' : 'am';
        return `${displayHour}:${m.toString().padStart(2, '0')}${ampm}`;
      }
    };
    
    return `${getOrdinal(day)} ${month} ${formatTime(hour, minute)}`;
  };

  const formatBookingDateTime = (notes: any) => {
    if (!notes) {
      return 'N/A';
    }
    
    // Handle if notes is an array or object
    let notesString = '';
    if (Array.isArray(notes)) {
      notesString = notes.join(' ');
    } else if (typeof notes === 'object') {
      notesString = JSON.stringify(notes);
    } else {
      notesString = String(notes);
    }
    
    if (!notesString.includes('Viewing booking requested for:')) {
      return 'N/A';
    }
    
    // Extract datetime from notes: "Viewing booking requested for: 2024-01-15 14:30:00"
    const match = notesString.match(/Viewing booking requested for: (.+)/);
    if (match && match[1]) {
      const dateString = match[1].trim();
      
      // Clean up the date string - remove any extra characters
      const cleanDateString = dateString.replace(/[^\d\s\-:T]/g, '');
      
      // Try multiple date parsing strategies
      let date: Date | null = null;
      
      // Strategy 1: Handle MMDDYYYY format (like "09262025 7:00 1758913200")
      const mmddyyyyMatch = cleanDateString.match(/(\d{2})(\d{2})(\d{4})\s+(\d{1,2}):(\d{2})/);
      if (mmddyyyyMatch) {
        const [, month, day, year, hour, minute] = mmddyyyyMatch;
        date = new Date(`${year}-${month}-${day}T${hour.padStart(2, '0')}:${minute}:00`);
        if (!isNaN(date.getTime())) {
          return formatCompactDateTime(date);
        }
      }
      
      // Strategy 2: Direct parsing
      date = new Date(cleanDateString);
      if (!isNaN(date.getTime())) {
        return formatCompactDateTime(date);
      }
      
      // Strategy 3: Handle common WPForms formats
      // Format: "2024-01-15 14:30" or "2024-01-15T14:30:00"
      const isoMatch = cleanDateString.match(/(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2})/);
      if (isoMatch) {
        date = new Date(`${isoMatch[1]}T${isoMatch[2]}:00`);
        if (!isNaN(date.getTime())) {
          return formatCompactDateTime(date);
        }
      }
      
      // Strategy 4: Handle date only format
      const dateOnlyMatch = cleanDateString.match(/(\d{4}-\d{2}-\d{2})/);
      if (dateOnlyMatch) {
        date = new Date(`${dateOnlyMatch[1]}T12:00:00`);
        if (!isNaN(date.getTime())) {
          return formatCompactDateTime(date);
        }
      }
      
      // Strategy 5: Handle MM/DD/YYYY format
      const usDateMatch = cleanDateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (usDateMatch) {
        const [, month, day, year] = usDateMatch;
        date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T12:00:00`);
        if (!isNaN(date.getTime())) {
          return formatCompactDateTime(date);
        }
      }
      
      // If all parsing fails, return the raw string (truncated if too long)
      return cleanDateString.length > 50 ? cleanDateString.substring(0, 50) + '...' : cleanDateString;
    }
    
    return 'N/A';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booked a Viewing</h1>
            <p className="text-gray-600 mt-2">Leads from website viewing booking forms</p>
          </div>
        </div>
        
        <StatCardsCarousel leads={[]} loading={true} />
        
        <Card>
          <CardHeader>
            <CardTitle>Viewing Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booked a Viewing</h1>
          <p className="text-gray-600 mt-2">Leads from website viewing booking forms</p>
        </div>
      </div>

      <StatCardsCarousel leads={bookings} loading={loading} />

      <Card>
        <CardHeader>
          <CardTitle>Viewing Bookings ({bookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No viewing bookings found</p>
              <p className="text-gray-400 text-sm mt-2">Viewing bookings will appear here once the webhook is set up</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Room Grade</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Viewing Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow 
                      key={booking.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/leads/${booking.id}`)}
                    >
                      <TableCell className="font-medium">
                        {booking.first_name} {booking.last_name}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {booking.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{booking.email}</span>
                            </div>
                          )}
                          {booking.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{booking.phone}</span>
                            </div>
                          )}
                          {!booking.email && !booking.phone && (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{booking.room_grade_preference?.name || 'N/A'}</TableCell>
                      <TableCell>{booking.duration_type_preference?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {formatBookingDateTime(booking.notes)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(booking.estimated_revenue)}</TableCell>
                      <TableCell>
                        {booking.assigned_user ? 
                          `${booking.assigned_user.first_name} ${booking.assigned_user.last_name}` : 
                          'Unassigned'
                        }
                      </TableCell>
                      <TableCell>{formatDate(booking.created_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/leads/${booking.id}`);
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/leads/${booking.id}`);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
                                setBookingToDelete(booking);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Viewing Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {bookingToDelete?.first_name} {bookingToDelete?.last_name}'s viewing booking? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookedViewingLeads;
