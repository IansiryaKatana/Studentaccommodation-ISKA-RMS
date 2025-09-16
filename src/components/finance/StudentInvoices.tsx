import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Download, 
  Calendar, 
  DollarSign, 
  Users,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileText
} from 'lucide-react';
import { ApiService, Invoice, Student } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import PaymentEventService from '@/services/paymentEventService';

interface StudentInvoice {
  id: string;
  student: Student;
  total_amount: number;
  deposit_amount: number;
  installment_plan_id?: string;
  mini_invoices: MiniInvoice[];
  progress_percentage: number;
  created_at: string;
}

interface MiniInvoice {
  id: string;
  type: 'deposit' | 'installment';
  amount: number;
  due_date: string;
  status: 'pending' | 'completed' | 'overdue';
  installment_number?: number;
  paid_date?: string;
}

const StudentInvoices = () => {
  const [studentInvoices, setStudentInvoices] = useState<StudentInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedInvoice, setSelectedInvoice] = useState<StudentInvoice | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentInvoices();
    
    // Listen for payment events to refresh data
    const handlePaymentEvent = (event: any) => {
      console.log('💰 Payment event received in Finance module, refreshing student invoices...');
      fetchStudentInvoices();
    };
    
    PaymentEventService.getInstance().registerListener('finance-student-invoices', handlePaymentEvent);
    
    return () => {
      PaymentEventService.getInstance().unregisterListener('finance-student-invoices');
    };
  }, []);

  const fetchStudentInvoices = async () => {
    try {
      setLoading(true);
      const students = await ApiService.getStudents();
      
      // Create student invoices using ACTUAL invoice data from invoices table
      const invoices: StudentInvoice[] = await Promise.all(
        students.map(async (student) => {
          try {
            // Get ACTUAL invoices for this student from the invoices table
            let actualInvoices: any[] = [];
            try {
              actualInvoices = await ApiService.getInvoicesByStudentId(student.id);
            } catch (error) {
              console.log(`No invoices found for student ${student.id}`);
            }
            
            // Convert actual invoices to mini invoices format for display
            const miniInvoices: MiniInvoice[] = actualInvoices.map((invoice) => ({
              id: invoice.id,
              type: invoice.type || 'installment',
              amount: invoice.total_amount,
              due_date: invoice.due_date,
              status: invoice.status,
              paid_date: invoice.status === 'completed' ? invoice.updated_at : undefined,
              invoice_number: invoice.invoice_number
            }));
            
            // Calculate progress percentage based on ACTUAL invoice data
            const totalAmount = actualInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
            const paidAmount = actualInvoices
              .filter(inv => inv.status === 'completed')
              .reduce((sum, inv) => sum + inv.total_amount, 0);
            
            const progressPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
            
            return {
              id: student.id,
              student,
              total_amount: totalAmount,
              deposit_amount: actualInvoices.find(inv => inv.type === 'deposit')?.total_amount || 0,
              installment_plan_id: student.installment_plan_id,
              mini_invoices: miniInvoices,
              progress_percentage: progressPercentage,
              created_at: student.created_at
            };
          } catch (studentError) {
            console.error(`Error processing student ${student.id}:`, studentError);
            // Return empty structure if no invoices found
            return {
              id: student.id,
              student,
              total_amount: 0,
              deposit_amount: 0,
              installment_plan_id: student.installment_plan_id,
              mini_invoices: [],
              progress_percentage: 0,
              created_at: student.created_at
            };
          }
        })
      );
      
      setStudentInvoices(invoices);
    } catch (error) {
      console.error('Error fetching student invoices:', error);
      toast({
        title: "Error",
        description: "Failed to load student invoices",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800',
      overdue: 'bg-red-100 text-red-800' // Keep for backward compatibility
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    // Handle invalid amounts
    if (amount === null || amount === undefined || isNaN(amount)) {
      console.warn('Invalid amount for formatting:', amount);
      return '£0.00';
    }
    
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const toggleRowExpansion = (invoiceId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(invoiceId)) {
      newExpanded.delete(invoiceId);
    } else {
      newExpanded.add(invoiceId);
    }
    setExpandedRows(newExpanded);
  };

  const filteredInvoices = studentInvoices.filter(invoice => {
    const studentName = `${invoice.student.user?.first_name || ''} ${invoice.student.user?.last_name || ''}`.toLowerCase();
    const matchesSearch = studentName.includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      const hasPending = invoice.mini_invoices.some(inv => inv.status === 'pending');
      const hasOverdue = invoice.mini_invoices.some(inv => inv.status === 'overdue');
      
      switch (statusFilter) {
        case 'pending':
          matchesStatus = hasPending;
          break;
        case 'completed':
          matchesStatus = invoice.progress_percentage === 100;
          break;
        case 'overdue':
          matchesStatus = hasOverdue;
          break;
      }
    }
    
    return matchesSearch && matchesStatus;
  });

  const handleViewInvoice = (invoice: StudentInvoice) => {
    setSelectedInvoice(invoice);
    setShowDetailDialog(true);
  };

  const handleEditInvoice = (invoiceId: string) => {
    navigate(`/finance/student-invoices/${invoiceId}/edit`);
  };

  const handleDownloadInvoice = (invoice: StudentInvoice) => {
    toast({
      title: "Download",
      description: `Downloading student invoice for ${invoice.student.user?.first_name} ${invoice.student.user?.last_name}`,
    });
  };

  const stats = {
    total: studentInvoices.length,
    pending: studentInvoices.filter(inv => inv.mini_invoices.some(mini => mini.status === 'pending')).length,
    completed: studentInvoices.filter(inv => inv.progress_percentage === 100).length,
    totalAmount: studentInvoices.reduce((sum, inv) => sum + inv.total_amount, 0)
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Invoices</h1>
          <p className="text-muted-foreground">Manage student installment plans and payments</p>
        </div>
        <Button onClick={() => navigate('/finance/student-invoices/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Student Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Invoices</CardTitle>
              <CardDescription>Manage student installment plans and payment progress</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      <span className="ml-2">Loading student invoices...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-gray-500">No student invoices found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  // Note: data-lov-id warning is from browser extension, not our code
                  <React.Fragment key={invoice.id}>
                    {/* Main Invoice Row */}
                    <TableRow>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(invoice.id)}
                        >
                          {expandedRows.has(invoice.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">
                              {invoice.student.user?.first_name || invoice.student.first_name 
                                ? `${invoice.student.user?.first_name || invoice.student.first_name} ${invoice.student.user?.last_name || invoice.student.last_name}`
                                : 'Student Name Not Set'
                              }
                            </div>
                            <div className="text-sm text-gray-500">
                              {invoice.student.user?.email || invoice.student.email || 'No email set'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(invoice.total_amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={invoice.progress_percentage} className="w-20" />
                          <span className="text-sm text-gray-600">
                            {Math.round(invoice.progress_percentage)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {invoice.progress_percentage === 100 ? (
                          <Badge className="bg-green-100 text-green-700">Completed</Badge>
                        ) : invoice.mini_invoices.some(inv => inv.status === 'overdue') ? (
                          <Badge className="bg-red-100 text-red-700">Overdue</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditInvoice(invoice.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Mini Invoices Row */}
                    {expandedRows.has(invoice.id) && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-gray-50">
                          <div className="p-4">
                            <h4 className="font-medium mb-3">Payment Breakdown</h4>
                            <div className="space-y-2">
                              {invoice.mini_invoices.map((miniInvoice) => (
                                <div key={miniInvoice.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                  <div className="flex items-center space-x-3">
                                    {miniInvoice.type === 'deposit' ? (
                                      <CreditCard className="h-4 w-4 text-blue-600" />
                                    ) : (
                                      <FileText className="h-4 w-4 text-green-600" />
                                    )}
                                    <div>
                                      <div className="font-medium">
                                        {miniInvoice.type === 'deposit' 
                                          ? 'Deposit' 
                                          : `Installment ${miniInvoice.installment_number}`
                                        }
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        Due: {new Date(miniInvoice.due_date).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <span className="font-medium">
                                      {(() => {
                                        console.log('Mini invoice amount:', miniInvoice.amount, typeof miniInvoice.amount);
                                        return formatCurrency(miniInvoice.amount);
                                      })()}
                                    </span>
                                    <Badge className={getStatusColor(miniInvoice.status)}>
                                      {miniInvoice.status}
                                    </Badge>
                                    {miniInvoice.paid_date && (
                                      <span className="text-sm text-gray-500">
                                        Paid: {new Date(miniInvoice.paid_date).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                                         )}
                   </React.Fragment>
                 ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Student Invoice Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected student invoice
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Student Name</p>
                  <p className="text-lg">
                    {(() => {
                      const first = selectedInvoice.student.user?.first_name || selectedInvoice.student.first_name;
                      const last = selectedInvoice.student.user?.last_name || selectedInvoice.student.last_name;
                      if (first || last) return `${first || ''} ${last || ''}`.trim();
                      return 'Student Name Not Set';
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg">{selectedInvoice.student.user?.email || selectedInvoice.student.email || 'No email set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedInvoice.total_amount)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Progress</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={selectedInvoice.progress_percentage} className="w-32" />
                    <span className="text-lg font-bold">{Math.round(selectedInvoice.progress_percentage)}%</span>
                  </div>
                </div>
              </div>
              
              {/* Payment Breakdown */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Payment Breakdown</h4>
                <div className="space-y-2">
                  {selectedInvoice.mini_invoices.map((miniInvoice) => (
                    <div key={miniInvoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {miniInvoice.type === 'deposit' ? (
                          <CreditCard className="h-4 w-4 text-blue-600" />
                        ) : (
                          <FileText className="h-4 w-4 text-green-600" />
                        )}
                        <div>
                          <div className="font-medium">
                            {miniInvoice.type === 'deposit' 
                              ? 'Deposit' 
                              : `Installment ${miniInvoice.installment_number}`
                            }
                          </div>
                          <div className="text-sm text-gray-500">
                            Due: {new Date(miniInvoice.due_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">
                          {formatCurrency(miniInvoice.amount)}
                        </span>
                        <Badge className={getStatusColor(miniInvoice.status)}>
                          {miniInvoice.status}
                        </Badge>
                        {miniInvoice.paid_date && (
                          <span className="text-sm text-gray-500">
                            Paid: {new Date(miniInvoice.paid_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentInvoices;
