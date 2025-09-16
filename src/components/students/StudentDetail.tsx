
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  User, 
  GraduationCap, 
  CreditCard, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Clock,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService, StudentWithUser } from '@/services/api';

const StudentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Live data from database
  const [studentData, setStudentData] = useState<StudentWithUser | null>(null);
  const [reservation, setReservation] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchStudentData();
    }
  }, [id]);

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);
      const student = await ApiService.getStudentById(id!);
      if (student) {
        setStudentData(student);
        
        // Fetch related data
        const [reservationData, invoicesData] = await Promise.all([
          ApiService.getReservationByStudentId(student.id),
          ApiService.getInvoicesByStudentId(student.id)
        ]);
        
        setReservation(reservationData);
        setInvoices(invoicesData || []);
      }
    } catch (error) {
      console.error('Error fetching student:', error);
      toast({
        title: "Error",
        description: "Failed to load student details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!studentData || !id) return;
    
    try {
      setIsSaving(true);
      
      const updateData = {
        university: studentData.university,
        course: studentData.course,
        year_of_study: studentData.year_of_study,
        emergency_contact_name: studentData.emergency_contact_name,
        emergency_contact_phone: studentData.emergency_contact_phone,
        guarantor_name: studentData.guarantor_name,
        guarantor_phone: studentData.guarantor_phone,
        guarantor_email: studentData.guarantor_email,
        guarantor_address: studentData.guarantor_address,
        guarantor_relationship: studentData.guarantor_relationship
      };
      
      await ApiService.updateStudent(id, updateData);
      
      toast({
        title: "Student Updated",
        description: "Student information has been successfully updated.",
      });
      
      setIsEditing(false);
      fetchStudentData(); // Refresh data
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchStudentData(); // Reset to original data
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading student details...</span>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Student not found</h2>
          <Button onClick={() => navigate('/students')} className="mt-4">
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'graduated':
        return <Badge variant="outline">Graduated</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const paymentHistory = [
    { date: '2024-01-15', amount: 800, method: 'Credit Card', status: 'Completed' },
    { date: '2023-12-15', amount: 800, method: 'Bank Transfer', status: 'Completed' },
    { date: '2023-11-15', amount: 800, method: 'Credit Card', status: 'Completed' }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/students')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {studentData.user?.first_name || studentData.first_name || 'Unknown'} {studentData.user?.last_name || studentData.last_name || 'Student'}
            </h1>
            <p className="text-gray-600">Student ID: {studentData.student_id || studentData.id}</p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge('active')}
            {getPaymentBadge('paid')}
          </div>
        </div>
        
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Student
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={studentData.user?.first_name || ''}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={studentData.user?.last_name || ''}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={studentData.user?.email || ''}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={studentData.user?.phone || ''}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        value={studentData.university}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="course">Course</Label>
                      <Input
                        id="course"
                        value={studentData.course}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={studentData.student_id}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        value={studentData.emergency_contact_name}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                      <Input
                        id="emergencyPhone"
                        value={studentData.emergency_contact_phone}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="checkInDate">Check-in Date</Label>
                        <Input
                          id="checkInDate"
                          type="date"
                          value={reservation?.check_in_date || ''}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="checkOutDate">Check-out Date</Label>
                        <Input
                          id="checkOutDate"
                          type="date"
                          value={reservation?.check_out_date || ''}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="specialRequirements">Special Requirements</Label>
                      <Textarea
                        id="specialRequirements"
                        value={reservation?.notes || ''}
                        disabled={!isEditing}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{studentData.user?.email || 'No email available'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{studentData.user?.phone || 'No phone available'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>Room {reservation?.studio?.studio_number || 'Not assigned'}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        value={studentData.university}
                        onChange={(e) => setStudentData(prev => prev ? { ...prev, university: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="course">Course</Label>
                      <Input
                        id="course"
                        value={studentData.course}
                        onChange={(e) => setStudentData(prev => prev ? { ...prev, course: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={studentData.student_id}
                        onChange={(e) => setStudentData(prev => prev ? { ...prev, student_id: e.target.value } : null)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Room Number</label>
                      <p className="text-gray-900">{reservation?.studio?.studio_number || 'Not assigned'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Student ID</label>
                      <p className="text-gray-900">{studentData.student_id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">University</label>
                      <p className="text-gray-900">{studentData.university}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Course</label>
                      <p className="text-gray-900">{studentData.course}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Year of Study</label>
                      <p className="text-gray-900">{studentData.year_of_study}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Name</label>
                      <p className="text-gray-900">{studentData.emergency_contact_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Phone</label>
                      <p className="text-gray-900">{studentData.emergency_contact_phone}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Contact Name</Label>
                      <Input
                        id="emergencyContact"
                        value={studentData.emergency_contact_name}
                        onChange={(e) => setStudentData(prev => prev ? { ...prev, emergency_contact_name: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        value={studentData.emergency_contact_phone}
                        onChange={(e) => setStudentData(prev => prev ? { ...prev, emergency_contact_phone: e.target.value } : null)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Name</label>
                      <p className="text-gray-900">{studentData.emergency_contact_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Phone</label>
                      <p className="text-gray-900">{studentData.emergency_contact_phone}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Accommodation Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Accommodation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkInDate">Check-in Date</Label>
                        <Input
                          id="checkInDate"
                          type="date"
                          value={reservation?.check_in_date || ''}
                          onChange={(e) => setReservation(prev => prev ? { ...prev, check_in_date: e.target.value } : null)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkOutDate">Check-out Date</Label>
                        <Input
                          id="checkOutDate"
                          type="date"
                          value={reservation?.check_out_date || ''}
                          onChange={(e) => setReservation(prev => prev ? { ...prev, check_out_date: e.target.value } : null)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialRequirements">Special Requirements</Label>
                      <Textarea
                        id="specialRequirements"
                        value={reservation?.notes || ''}
                        onChange={(e) => setReservation(prev => prev ? { ...prev, notes: e.target.value } : null)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Check-in Date</label>
                      <p className="text-gray-900">{reservation?.check_in_date || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Check-out Date</label>
                      <p className="text-gray-900">{reservation?.check_out_date || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Special Requirements</label>
                      <p className="text-gray-900">{reservation?.notes || 'None'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Due:</span>
                    <span className="font-medium">£{reservation?.total_amount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Paid:</span>
                    <span className="text-green-600 font-medium">£{(reservation?.total_amount || 0) - (reservation?.balance_due || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance:</span>
                    <span className={`font-medium ${reservation?.balance_due || 0 > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      £{reservation?.balance_due || 0}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Payment:</span>
                      <span className="font-medium">
                        {invoices.length > 0 
                          ? new Date(invoices[0]?.due_date || '').toLocaleDateString()
                          : 'No upcoming payments'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">£{payment.amount}</div>
                        <div className="text-sm text-gray-500">{payment.method}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{new Date(payment.date).toLocaleDateString()}</div>
                        <Badge variant="outline" className="mt-1">{payment.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents & Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No documents uploaded</h3>
                <p className="mt-1 text-sm text-gray-500">Upload documents for this student.</p>
                <div className="mt-6">
                  <Button>Upload Document</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activity History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">Student record created</div>
                    <div className="text-sm text-gray-500">January 15, 2024 at 10:30 AM</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">Room A101 assigned</div>
                    <div className="text-sm text-gray-500">January 15, 2024 at 10:35 AM</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">Payment received - £800</div>
                    <div className="text-sm text-gray-500">January 15, 2024 at 2:15 PM</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetail;
