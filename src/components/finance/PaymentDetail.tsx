
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  DollarSign,
  Calendar,
  User,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService, Payment } from '@/services/api';

interface PaymentWithDetails extends Payment {
  invoice?: any;
  student?: any;
}

const PaymentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentWithDetails | null>(null);

  useEffect(() => {
    if (id) {
      fetchPaymentData();
    }
  }, [id]);

  const fetchPaymentData = async () => {
    try {
      setIsLoading(true);
      const payment = await ApiService.getPaymentById(id!);
      if (payment) {
        // Fetch related invoice and student data
        const invoice = await ApiService.getInvoiceById(payment.invoice_id);
        let student = null;
        if (invoice) {
          const reservation = await ApiService.getReservationById(invoice.reservation_id);
          if (reservation?.student_id) {
            student = await ApiService.getStudentById(reservation.student_id);
          }
        }
        
        setPaymentData({
          ...payment,
          invoice,
          student
        });
      }
    } catch (error) {
      console.error('Error fetching payment:', error);
      toast({
        title: "Error",
        description: "Failed to load payment details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!paymentData) return;
    
    try {
      setIsSaving(true);
      await ApiService.updatePayment(paymentData.id, {
        amount: paymentData.amount,
        method: paymentData.method,
        status: paymentData.status
      });
      
      toast({
        title: "Payment Updated",
        description: "Payment details have been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Error",
        description: "Failed to update payment.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (paymentData) {
      setPaymentData({ ...paymentData, status: newStatus as any });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'processing': return 'secondary';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading payment details...</span>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Not Found</h3>
            <p className="text-gray-500 mb-4">The payment you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/finance')}>
              Back to Finance
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/finance')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Finance
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Details</h1>
            <p className="text-gray-600">Payment #{paymentData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(paymentData.status)}>
            {paymentData.status.charAt(0).toUpperCase() + paymentData.status.slice(1)}
          </Badge>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment ID</label>
                  <p className="text-gray-900">{paymentData.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-gray-900">£{paymentData.amount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Method</label>
                  {isEditing ? (
                    <Select value={paymentData.method} onValueChange={(value) => setPaymentData({ ...paymentData, method: value as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-900">{paymentData.method.replace('_', ' ').charAt(0).toUpperCase() + paymentData.method.replace('_', ' ').slice(1)}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  {isEditing ? (
                    <Select value={paymentData.status} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-900">{paymentData.status.charAt(0).toUpperCase() + paymentData.status.slice(1)}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                  <p className="text-gray-900">{paymentData.transaction_id || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Processed At</label>
                  <p className="text-gray-900">
                    {paymentData.processed_at 
                      ? new Date(paymentData.processed_at).toLocaleDateString()
                      : 'Not processed yet'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Student Name</label>
                  <p className="text-gray-900">
                    {paymentData.student?.user?.first_name} {paymentData.student?.user?.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Student ID</label>
                  <p className="text-gray-900">{paymentData.student?.student_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{paymentData.student?.user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{paymentData.student?.user?.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Invoice Number</label>
                  <p className="text-gray-900">{paymentData.invoice?.invoice_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Invoice Amount</label>
                  <p className="text-gray-900">£{paymentData.invoice?.amount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Due Date</label>
                  <p className="text-gray-900">
                    {paymentData.invoice?.due_date 
                      ? new Date(paymentData.invoice.due_date).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Invoice Status</label>
                  <Badge variant={getStatusBadgeVariant(paymentData.invoice?.status)}>
                    {paymentData.invoice?.status?.charAt(0).toUpperCase() + paymentData.invoice?.status?.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">£{paymentData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium">{paymentData.method.replace('_', ' ').charAt(0).toUpperCase() + paymentData.method.replace('_', ' ').slice(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">{paymentData.status.charAt(0).toUpperCase() + paymentData.status.slice(1)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg">£{paymentData.amount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="w-full" disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)} 
                    className="w-full"
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View Invoice
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;
