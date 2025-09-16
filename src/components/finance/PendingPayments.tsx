import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, Clock, CheckCircle, XCircle, Filter, Loader2, Eye, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { createClient } from '@supabase/supabase-js';

// Service role client singleton - outside component to prevent multiple instances
let serviceRoleClient: any = null;
const getServiceRoleClient = () => {
  if (!serviceRoleClient) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
    serviceRoleClient = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false }
    });
  }
  return serviceRoleClient;
};

interface PendingPayment {
  id: string;
  invoice_id: string;
  student_id: string;
  amount: number;
  method: 'bank_transfer' | 'cash' | 'check';
  status: 'pending' | 'completed' | 'failed';
  approval_status: 'pending' | 'approved' | 'rejected';
  reference_number: string; // This will be mapped from 'notes'
  created_by: string;
  created_at: string;
  updated_at?: string;
  // Joined data
  invoice?: {
    id: string;
    invoice_number: string;
    total_amount: number;
    due_date: string;
    status: string;
  };
  student?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

const PendingPayments: React.FC = () => {
  const { toast } = useToast();
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [processingAction, setProcessingAction] = useState<string | null>(null);


  const fetchPendingPayments = async () => {
    try {
      setIsLoading(true);
      
      // For now, we'll fetch from a hypothetical pending_payments table
      // In a real implementation, this would be a separate table
      const serviceClient = getServiceRoleClient();
      
      // Get all payments with pending approval status and non-Stripe methods
      const { data: payments, error } = await serviceClient
        .from('payments')
        .select('*')
        .in('method', ['bank_transfer', 'cash', 'check'])
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!payments || payments.length === 0) {
        setPendingPayments([]);
        return;
      }

      // Get invoice IDs and student IDs for the payments
      const invoiceIds = payments.map(p => p.invoice_id).filter(Boolean);
      const studentIds = new Set<string>();

      // Fetch invoices for these payments
      const { data: invoices, error: invoiceError } = await serviceClient
        .from('invoices')
        .select('id, invoice_number, total_amount, due_date, status, student_id')
        .in('id', invoiceIds);

      if (invoiceError) {
        console.warn('Error fetching invoices:', invoiceError);
      }

      // Collect student IDs from invoices
      invoices?.forEach(invoice => {
        if (invoice.student_id) {
          studentIds.add(invoice.student_id);
        }
      });

      // Fetch students for these invoices
      let students: any[] = [];
      if (studentIds.size > 0) {
        const { data: studentsData, error: studentError } = await serviceClient
          .from('students')
          .select('id, first_name, last_name, email')
          .in('id', Array.from(studentIds));

        if (studentError) {
          console.warn('Error fetching students:', studentError);
        } else {
          students = studentsData || [];
        }
      }

      // Transform the data to match our interface
      const transformedPayments: PendingPayment[] = payments.map(payment => {
        const invoice = invoices?.find(inv => inv.id === payment.invoice_id);
        const student = students.find(std => std.id === invoice?.student_id);

        return {
          id: payment.id,
          invoice_id: payment.invoice_id,
          student_id: invoice?.student_id || '',
          amount: payment.amount,
          method: payment.method as 'bank_transfer' | 'cash' | 'check',
          status: payment.status as 'pending' | 'completed' | 'failed',
          approval_status: payment.approval_status as 'pending' | 'approved' | 'rejected',
          reference_number: payment.notes || '',
          created_by: payment.created_by,
          created_at: payment.created_at,
          updated_at: payment.updated_at,
          invoice: invoice ? {
            id: invoice.id,
            invoice_number: invoice.invoice_number,
            total_amount: invoice.total_amount,
            due_date: invoice.due_date,
            status: invoice.status
          } : undefined,
          student: student ? {
            id: student.id,
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email
          } : undefined
        };
      });

      setPendingPayments(transformedPayments);
      console.log('📋 Pending payments loaded:', transformedPayments.length);
      
      if (transformedPayments.length === 0) {
        console.log('ℹ️ No pending payments found. This is normal if no offline payments have been submitted.');
      }
      
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      toast({
        title: "Error",
        description: "Failed to load pending payments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const handleApprovePayment = async (paymentId: string) => {
    try {
      setProcessingAction(paymentId);
      
      const serviceClient = getServiceRoleClient();
      
      // Get the payment details
      const payment = pendingPayments.find(p => p.id === paymentId);
      if (!payment) throw new Error('Payment not found');

      // Update payment approval status to approved
      const { error: paymentError } = await serviceClient
        .from('payments')
        .update({
          approval_status: 'approved',
          approved_by: 'system', // In a real app, this would be the current user ID
          approved_at: new Date().toISOString(),
          status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (paymentError) throw paymentError;

      // Update invoice status to completed
      const { error: invoiceError } = await serviceClient
        .from('invoices')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.invoice_id);

      if (invoiceError) throw invoiceError;

      // Update student installment status if applicable
      if (payment.invoice?.student_id) {
        const { error: installmentError } = await serviceClient
          .from('student_installments')
          .update({
            status: 'completed',
            paid_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('student_id', payment.invoice.student_id)
          .eq('amount', payment.amount)
          .eq('status', 'pending');

        if (installmentError) {
          console.warn('Could not update installment status:', installmentError);
        }
      }

      toast({
        title: "Payment Approved",
        description: `Payment of £${payment.amount.toFixed(2)} has been approved and processed.`,
      });

      // Refresh the list
      await fetchPendingPayments();

    } catch (error) {
      console.error('Error approving payment:', error);
      toast({
        title: "Error",
        description: "Failed to approve payment",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    try {
      setProcessingAction(paymentId);
      
      const serviceClient = getServiceRoleClient();
      
      // Update payment approval status to rejected
      const { error } = await serviceClient
        .from('payments')
        .update({
          approval_status: 'rejected',
          rejection_reason: 'Rejected by admin',
          status: 'failed'
        })
        .eq('id', paymentId);

      if (error) throw error;

      const payment = pendingPayments.find(p => p.id === paymentId);
      
      toast({
        title: "Payment Rejected",
        description: `Payment of £${payment?.amount.toFixed(2)} has been rejected.`,
      });

      // Refresh the list
      await fetchPendingPayments();

    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast({
        title: "Error",
        description: "Failed to reject payment",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const getStatusColor = (approvalStatus: string) => {
    switch (approvalStatus) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'bank_transfer': return 'bg-blue-100 text-blue-800';
      case 'cash': return 'bg-green-100 text-green-800';
      case 'check': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = pendingPayments.filter(payment => {
    const matchesSearch = 
      payment.invoice?.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const stats = {
    total: pendingPayments.length,
    pending: pendingPayments.filter(p => p.approval_status === 'pending').length,
    approved: pendingPayments.filter(p => p.approval_status === 'approved').length,
    rejected: pendingPayments.filter(p => p.approval_status === 'rejected').length,
    totalAmount: pendingPayments
      .filter(p => p.approval_status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0)
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Payments</h1>
        <p className="text-gray-600">Review and approve offline payments from students</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-900">£{stats.totalAmount.toFixed(2)}</p>
              </div>
              <div className="text-2xl font-bold text-gray-900">£</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by invoice number, student name, email, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="check">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pending Payments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Pending Payments ({filteredPayments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading pending payments...</span>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 mb-2">No pending payments found</p>
              <p className="text-sm text-gray-400">
                {searchTerm || statusFilter !== 'all' || methodFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Students can submit offline payments using the "Add Payment" button in their portal'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {payment.student?.first_name} {payment.student?.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">{payment.student?.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">£{payment.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><span className="font-medium">Invoice:</span> {payment.invoice?.invoice_number}</p>
                          <p><span className="font-medium">Reference:</span> {payment.reference_number}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Due Date:</span> {new Date(payment.invoice?.due_date || '').toLocaleDateString()}</p>
                          <p><span className="font-medium">Method:</span> 
                            <Badge className={`ml-2 ${getMethodColor(payment.method)}`}>
                              {payment.method.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Badge className={getStatusColor(payment.approval_status)}>
                        {payment.approval_status.toUpperCase()}
                      </Badge>
                      
                      {payment.approval_status === 'pending' && (
                        <div className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Approve Payment</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to approve this payment of £{payment.amount.toFixed(2)} 
                                  from {payment.student?.first_name} {payment.student?.last_name}?
                                  <br /><br />
                                  This will mark the invoice as completed and update any related installments.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleApprovePayment(payment.id)}
                                  disabled={processingAction === payment.id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {processingAction === payment.id ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                      Processing...
                                    </>
                                  ) : (
                                    'Approve Payment'
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reject Payment</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to reject this payment of £{payment.amount.toFixed(2)} 
                                  from {payment.student?.first_name} {payment.student?.last_name}?
                                  <br /><br />
                                  This will mark the payment as failed and it will need to be resubmitted.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRejectPayment(payment.id)}
                                  disabled={processingAction === payment.id}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {processingAction === payment.id ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                      Processing...
                                    </>
                                  ) : (
                                    'Reject Payment'
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
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

export default PendingPayments;
