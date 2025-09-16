
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiService, Reservation, StudentWithUser, StudentDocument } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users, Search, Loader2, FileText, Calendar, MapPin, GraduationCap, Phone, Mail, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface StudentBookingWithDetails extends Reservation {
  student?: StudentWithUser;
  documents?: StudentDocument[];
}

const StudentsBookings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studentBookings, setStudentBookings] = useState<StudentBookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [documentFilter, setDocumentFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<StudentBookingWithDetails | null>(null);

  useEffect(() => {
    fetchStudentBookings();
  }, []);

  const fetchStudentBookings = async () => {
    try {
      setIsLoading(true);
      const reservations = await ApiService.getReservations();
      const studentReservations = reservations.filter(reservation => reservation.type === 'student');
      
      // Fetch detailed information for each student booking
      const bookingsWithDetails = await Promise.all(
        studentReservations.map(async (reservation) => {
          try {
            const student = reservation.student_id ? await ApiService.getStudentById(reservation.student_id) : null;
            const documents = student ? await ApiService.getStudentDocuments(student.id) : [];
            
            return {
              ...reservation,
              student,
              documents
            };
          } catch (error) {
            console.error(`Error fetching details for reservation ${reservation.id}:`, error);
            return {
              ...reservation,
              student: null,
              documents: []
            };
          }
        })
      );
      
      setStudentBookings(bookingsWithDetails);
    } catch (error) {
      console.error('Error fetching student bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch student bookings. Please try again.",
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

  const getDocumentStatus = (documents: StudentDocument[], documentType: string) => {
    const doc = documents.find(d => d.document_type === documentType);
    return doc ? 'uploaded' : 'missing';
  };

  const getDocumentStatusColor = (status: string) => {
    return status === 'uploaded' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const filteredBookings = studentBookings.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      booking.reservation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.student?.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.student?.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.student?.ucas_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.student?.field_of_study?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    const matchesDocument = documentFilter === 'all' || 
      (booking.documents && booking.documents.length > 0);

    return matchesSearch && matchesStatus && matchesDocument;
  });

  const handleViewStudent = (studentId: string) => {
    navigate(`/student-portal/${studentId}`);
  };

  const handleViewDetails = (booking: StudentBookingWithDetails) => {
    setSelectedBooking(booking);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      passport: 'Passport',
      visa: 'Visa',
      utility_bill: 'Utility Bill',
      guarantor_id: 'Guarantor ID',
      bank_statement: 'Bank Statement',
      proof_of_income: 'Proof of Income'
    };
    return labels[type] || type;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Bookings</h1>
          <p className="text-gray-600">Manage student accommodation bookings and documents</p>
        </div>
        <Button onClick={() => navigate('/students/add-booking')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Student Booking
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                className="pl-10" 
                placeholder="Search by name, UCAS ID, or field..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="checked_out">Checked Out</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={documentFilter} onValueChange={setDocumentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by documents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="with_documents">With Documents</SelectItem>
                <SelectItem value="without_documents">Without Documents</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDocumentFilter('all');
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Loading student bookings...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Student Information */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {booking.student?.user.first_name} {booking.student?.user.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            UCAS ID: {booking.student?.ucas_id || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                          <span>{booking.student?.field_of_study || 'Field not specified'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Year: {booking.student?.year_of_study || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{booking.student?.country || 'Country not specified'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Information */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900">Booking Details</h4>
                        <p className="text-sm text-gray-600">#{booking.reservation_number}</p>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-in:</span>
                          <span className="font-medium">{formatDate(booking.check_in_date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-out:</span>
                          <span className="font-medium">{formatDate(booking.check_out_date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-medium">£{booking.total_amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deposit:</span>
                          <span className="font-medium">£{booking.deposit_amount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Document Status and Actions */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900">Document Status</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {['passport', 'visa', 'utility_bill', 'guarantor_id', 'bank_statement', 'proof_of_income'].map((docType) => (
                            <Badge 
                              key={docType} 
                              className={`text-xs ${getDocumentStatusColor(getDocumentStatus(booking.documents || [], docType))}`}
                            >
                              {getDocumentTypeLabel(docType)}: {getDocumentStatus(booking.documents || [], docType)}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(booking)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        {booking.student && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewStudent(booking.student!.id)}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            Portal
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredBookings.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No student bookings found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || statusFilter !== 'all' || documentFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by creating a new student booking.'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed View Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Student Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="text-sm">{selectedBooking.student?.user.first_name} {selectedBooking.student?.user.last_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-sm">{selectedBooking.student?.user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-sm">{selectedBooking.student?.user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">UCAS ID</label>
                      <p className="text-sm">{selectedBooking.student?.ucas_id || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Field of Study</label>
                      <p className="text-sm">{selectedBooking.student?.field_of_study || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Year of Study</label>
                      <p className="text-sm">{selectedBooking.student?.year_of_study || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Country</label>
                      <p className="text-sm">{selectedBooking.student?.country || 'Not specified'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Guarantor Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Guarantor Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="text-sm">{selectedBooking.student?.guarantor_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-sm">{selectedBooking.student?.guarantor_email || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-sm">{selectedBooking.student?.guarantor_phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Relationship</label>
                      <p className="text-sm">{selectedBooking.student?.guarantor_relationship || 'Not specified'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Required Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['passport', 'visa', 'utility_bill', 'guarantor_id', 'bank_statement', 'proof_of_income'].map((docType) => {
                      const doc = selectedBooking.documents?.find(d => d.document_type === docType);
                      const status = getDocumentStatus(selectedBooking.documents || [], docType);
                      
                      return (
                        <div key={docType} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{getDocumentTypeLabel(docType)}</p>
                            <p className="text-sm text-gray-600">
                              {status === 'uploaded' ? doc?.file_name : 'Not uploaded'}
                            </p>
                          </div>
                          <Badge className={getDocumentStatusColor(status)}>
                            {status === 'uploaded' ? 'Uploaded' : 'Missing'}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Booking Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Reservation Number</label>
                        <p className="text-sm font-mono">#{selectedBooking.reservation_number}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Studio ID</label>
                        <p className="text-sm">{selectedBooking.studio_id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Check-in Date</label>
                        <p className="text-sm">{formatDate(selectedBooking.check_in_date)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Check-out Date</label>
                        <p className="text-sm">{formatDate(selectedBooking.check_out_date)}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Total Amount</label>
                        <p className="text-lg font-semibold">£{selectedBooking.total_amount}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Deposit Amount</label>
                        <p className="text-sm">£{selectedBooking.deposit_amount}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Balance Due</label>
                        <p className="text-sm">£{selectedBooking.balance_due}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <Badge className={getStatusColor(selectedBooking.status)}>
                          {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsBookings;
