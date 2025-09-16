
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApiService, StudentWithUser, Reservation, Invoice } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Clock, Building, Calendar, FileText, Eye, Loader2 } from 'lucide-react';

interface StudentOverviewProps {
  studentId: string;
}

const StudentOverview = ({ studentId }: StudentOverviewProps) => {
  const { toast } = useToast();
  const [student, setStudent] = useState<StudentWithUser | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);
      
      // Get student data with studio details
      const studentData = await ApiService.getStudentByIdWithDetails(studentId);
      setStudent(studentData);
      
      // Get reservation data (may be null for direct bookings)
      try {
        const reservationData = await ApiService.getReservationByStudentId(studentId);
        setReservation(reservationData);
      } catch (error) {
        console.log('No reservation found for student (direct booking)');
        setReservation(null);
      }
      
      // Get invoices data
      try {
        const invoicesData = await ApiService.getInvoicesByStudentId(studentId);
        setInvoices(invoicesData);
      } catch (error) {
        console.log('No invoices found for student');
        setInvoices([]);
      }
      
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch student data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Loading student data...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Student not found</p>
      </div>
    );
  }

  // Calculate amounts from invoices if no reservation exists
  const totalAmount = reservation?.total_amount || invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'completed').reduce((sum, inv) => sum + inv.amount, 0);
  const owedAmount = totalAmount - paidAmount;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {student.user ? `${student.user.first_name} ${student.user.last_name}` : `${student.first_name || 'Unknown'} ${student.last_name || 'Student'}`}
        </h1>
        <p className="text-gray-600">
          Student ID: {student.student_id} • 
          Studio: {student.studio?.studio_number 
            ? `Studio ${student.studio.studio_number}` 
            : student.studio_id 
              ? `Studio ${student.studio_id}` 
              : 'Not assigned'
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Full accommodation cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Owed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">£{owedAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Outstanding balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">£{paidAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total payments received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Studio Details</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {student.studio?.studio_number 
                ? `Studio ${student.studio.studio_number}` 
                : reservation?.studio_id || student.studio_id || 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {student.studio?.room_grade?.name || reservation?.duration_id || student.academic_year || 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
              <p className="mt-1 text-sm text-gray-500">
                This student doesn't have any invoices yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{invoice.invoice_number}</h3>
                      <p className="text-sm text-gray-600">Issued: {invoice.created_at}</p>
                      <p className="text-sm text-gray-600">Due: {invoice.due_date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">£{invoice.amount.toLocaleString()}</p>
                    </div>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
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

export default StudentOverview;
