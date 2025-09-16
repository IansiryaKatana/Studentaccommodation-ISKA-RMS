
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, MapPin, Search, Loader2, Eye, Calendar, User, CreditCard, CheckCircle, LogOut, Edit3, CheckSquare, Square, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const TouristsBookings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [touristBookings, setTouristBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkEditData, setBulkEditData] = useState({
    status: '',
    guest_status_id: '',
    notes: ''
  });
  const [bookingSources, setBookingSources] = useState<any[]>([]);
  const [guestStatuses, setGuestStatuses] = useState<any[]>([]);

  useEffect(() => {
    fetchTouristBookings();
    fetchBookingSources();
    fetchGuestStatuses();
  }, []);

  const fetchTouristBookings = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching tourist reservations...');
      const reservations = await ApiService.getTouristReservations();
      console.log('Tourist reservations received:', reservations);
      setTouristBookings(reservations);
    } catch (error) {
      console.error('Error fetching tourist bookings:', error);
      // Log more details about the error
      if (error && typeof error === 'object' && 'message' in error) {
        console.error('Error message:', error.message);
      }
      if (error && typeof error === 'object' && 'details' in error) {
        console.error('Error details:', error.details);
      }
      toast({
        title: "Error",
        description: "Failed to fetch tourist bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'checked_in': return 'bg-blue-100 text-blue-800';
      case 'checked_out': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGuestStatusColor = (status: any) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    return `bg-${status.color}-100 text-${status.color}-800`;
  };

  const filteredBookings = touristBookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    return (
              booking.tourist_profiles?.first_name?.toLowerCase().includes(searchLower) ||
        booking.tourist_profiles?.last_name?.toLowerCase().includes(searchLower) ||
        booking.tourist_profiles?.email?.toLowerCase().includes(searchLower) ||
      booking.reservation_number?.toLowerCase().includes(searchLower) ||
      booking.studio?.studio_number?.toLowerCase().includes(searchLower) ||
      booking.booking_source?.name?.toLowerCase().includes(searchLower)
    );
  });

  const handleRowClick = (bookingId: string) => {
            navigate(`/ota-bookings/tourists/${bookingId}`);
  };

  const handleCheckInOut = (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
            navigate(`/ota-bookings/tourists/${bookingId}/checkinout`);
  };

  const fetchBookingSources = async () => {
    try {
      const sources = await ApiService.getTouristBookingSources();
      setBookingSources(sources);
    } catch (error) {
      console.error('Error fetching booking sources:', error);
    }
  };

  const fetchGuestStatuses = async () => {
    try {
      const statuses = await ApiService.getTouristGuestStatuses();
      setGuestStatuses(statuses);
    } catch (error) {
      console.error('Error fetching guest statuses:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedBookings.size === filteredBookings.length) {
      setSelectedBookings(new Set());
    } else {
      setSelectedBookings(new Set(filteredBookings.map(booking => booking.id)));
    }
  };

  const handleSelectBooking = (bookingId: string) => {
    const newSelected = new Set(selectedBookings);
    if (newSelected.has(bookingId)) {
      newSelected.delete(bookingId);
    } else {
      newSelected.add(bookingId);
    }
    setSelectedBookings(newSelected);
  };

  const handleBulkEdit = async () => {
    if (selectedBookings.size === 0) return;

    setIsBulkUpdating(true);
    const updates: any = {};
    
    if (bulkEditData.status) updates.status = bulkEditData.status;
    if (bulkEditData.guest_status_id) updates.guest_status_id = bulkEditData.guest_status_id;
    if (bulkEditData.notes) updates.notes = bulkEditData.notes;

    if (Object.keys(updates).length === 0) {
      toast({
        title: "No Changes",
        description: "Please select at least one field to update.",
        variant: "destructive",
      });
      setIsBulkUpdating(false);
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const bookingId of selectedBookings) {
      try {
        await ApiService.updateReservation(bookingId, updates);
        successCount++;
      } catch (error) {
        console.error(`Error updating booking ${bookingId}:`, error);
        errorCount++;
      }
    }

    setIsBulkUpdating(false);
    setIsBulkEditOpen(false);
    setSelectedBookings(new Set());
    setBulkEditData({ status: '', guest_status_id: '', notes: '' });

    // Refresh the data
    await fetchTouristBookings();

    toast({
      title: "Bulk Update Complete",
      description: `Successfully updated ${successCount} bookings. ${errorCount} failed.`,
      variant: errorCount > 0 ? "default" : "default",
    });
  };

  const handleBulkDelete = async () => {
    if (selectedBookings.size === 0) return;

    setIsBulkDeleting(true);
    let successCount = 0;
    let errorCount = 0;

    for (const bookingId of selectedBookings) {
      try {
        await ApiService.deleteReservation(bookingId);
        successCount++;
      } catch (error) {
        console.error(`Error deleting booking ${bookingId}:`, error);
        errorCount++;
      }
    }

    setIsBulkDeleting(false);
    setIsBulkDeleteOpen(false);
    setSelectedBookings(new Set());

    // Refresh the data
    await fetchTouristBookings();

    toast({
      title: "Bulk Delete Complete",
      description: `Successfully deleted ${successCount} bookings. ${errorCount} failed.`,
      variant: errorCount > 0 ? "destructive" : "default",
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tourist Bookings</h1>
          <p className="text-gray-600">Manage short-term tourist accommodation</p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedBookings.size > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {selectedBookings.size} selected
              </Badge>
              <Dialog open={isBulkEditOpen} onOpenChange={setIsBulkEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Bulk Edit
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Dialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Bulk Delete
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Bulk Edit Tourist Bookings</DialogTitle>
                    <DialogDescription>
                      Update {selectedBookings.size} selected bookings. Leave fields empty to keep current values.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <Select value={bulkEditData.status} onValueChange={(value) => setBulkEditData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="checked_in">Checked In</SelectItem>
                          <SelectItem value="checked_out">Checked Out</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="guest_status" className="text-right">
                        Guest Status
                      </Label>
                      <Select value={bulkEditData.guest_status_id} onValueChange={(value) => setBulkEditData(prev => ({ ...prev, guest_status_id: value }))}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select guest status" />
                        </SelectTrigger>
                        <SelectContent>
                          {guestStatuses.map((status) => (
                            <SelectItem key={status.id} value={status.id}>
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">
                        Notes
                      </Label>
                      <Input
                        id="notes"
                        value={bulkEditData.notes}
                        onChange={(e) => setBulkEditData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Add notes..."
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsBulkEditOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleBulkEdit} disabled={isBulkUpdating}>
                      {isBulkUpdating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Bookings'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Bulk Delete Tourist Bookings</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete {selectedBookings.size} selected bookings? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-gray-600 mb-4">
                      This will permanently delete:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>All selected tourist bookings</li>
                      <li>Associated invoices and payments</li>
                      <li>Tourist profiles (if no other bookings exist)</li>
                      <li>Studio assignments will be updated to vacant</li>
                    </ul>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsBulkDeleteOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleBulkDelete} disabled={isBulkDeleting}>
                      {isBulkDeleting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        'Delete Bookings'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
          <Button onClick={() => navigate('/ota-bookings/tourists/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tourist Booking
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                className="pl-10" 
                placeholder="Search by name, email, booking number, studio..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Tourist Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Loading tourist bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No tourist bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedBookings.size === filteredBookings.length && filteredBookings.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Booking Details</TableHead>
                    <TableHead>Studio</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow 
                      key={booking.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleRowClick(booking.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedBookings.has(booking.id)}
                          onCheckedChange={() => handleSelectBooking(booking.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <User className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                                        <div className="font-medium">
              {booking.tourist_profiles?.first_name || ''} {booking.tourist_profiles?.last_name || ''}
            </div>
            <div className="text-sm text-gray-500">
              {booking.tourist_profiles?.email || ''}
            </div>
            <div className="text-sm text-gray-500">
              {booking.tourist_profiles?.phone || ''}
            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">
                            {booking.reservation_number || ''}
                          </div>
                          <div className="text-sm text-gray-500">
                            Source: {booking.booking_source?.name || 'Not specified'}
                          </div>
                          {booking.guest_status && (
                            <Badge className={`mt-1 ${getGuestStatusColor(booking.guest_status)}`}>
                              {booking.guest_status.name}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            {booking.studio?.studio_number || ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div className="text-sm">
                            <div>Check-in: {booking.check_in_date ? format(new Date(booking.check_in_date), 'MMM dd, yyyy') : ''}</div>
                            <div>Check-out: {booking.check_out_date ? format(new Date(booking.check_out_date), 'MMM dd, yyyy') : ''}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <div className="text-sm">
                            <div className="font-medium">£{(booking.total_amount || 0).toFixed(2)}</div>
                            <div className="text-gray-500">£{(booking.price_per_night || 0).toFixed(2)}/night</div>
                            {(booking.deposit_amount || 0) > 0 && (
                              <div className="text-gray-500">Deposit: £{(booking.deposit_amount || 0).toFixed(2)}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status?.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(booking.id);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {(booking.status === 'confirmed' || booking.status === 'checked_in') && (
                            <Button 
                              variant={booking.status === 'confirmed' ? 'default' : 'destructive'}
                              size="sm"
                              onClick={(e) => handleCheckInOut(booking.id, e)}
                            >
                              {booking.status === 'confirmed' ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Check In
                                </>
                              ) : (
                                <>
                                  <LogOut className="h-4 w-4 mr-1" />
                                  Check Out
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TouristsBookings;
