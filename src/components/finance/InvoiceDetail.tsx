
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Download,
  Send,
  FileText,
  Calendar,
  User,
  DollarSign,
  Printer,
  Loader2,
  Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService, Invoice } from '@/services/api';
import { PDFService } from '@/services/pdfService';

interface InvoiceWithDetails extends Invoice {
  reservation?: any & { studio?: any };
  student?: any;
  tourist?: any;
}

const InvoiceDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceWithDetails | null>(null);

  useEffect(() => {
    if (id) {
      fetchInvoiceData();
    }
  }, [id]);

  const fetchInvoiceData = async () => {
    try {
      setIsLoading(true);
      const invoice = await ApiService.getInvoiceById(id!);
      if (invoice) {
        // Fetch related reservation data
        const reservation = await ApiService.getReservationById(invoice.reservation_id);
        
        let student = null;
        let tourist = null;
        
        if (reservation) {
          if (reservation.type === 'student' && reservation.student_id) {
            student = await ApiService.getStudentById(reservation.student_id);
          } else if (reservation.type === 'tourist' && reservation.tourist_id) {
            tourist = await ApiService.getTouristProfileById(reservation.tourist_id);
          }
        }
        
        setInvoiceData({
          ...invoice,
          reservation,
          student,
          tourist
        });
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast({
        title: "Error",
        description: "Failed to load invoice details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!invoiceData) return;
    
    try {
      setIsSaving(true);
      await ApiService.updateInvoice(invoiceData.id, {
        amount: invoiceData.amount,
        due_date: invoiceData.due_date,
        status: invoiceData.status
      });
      
      toast({
        title: "Invoice Updated",
        description: "Invoice details have been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to update invoice.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendInvoice = () => {
    toast({
      title: "Invoice Sent",
      description: "Invoice has been sent to the student's email address.",
    });
  };

  const handleDownloadPDF = async () => {
    if (!invoiceData) return;
    
    try {
      // Fetch branding information
      const branding = await ApiService.getBranding();
      
      // Generate PDF
      const pdf = await PDFService.generateInvoiceFromHTML({
        invoice: invoiceData,
        reservation: invoiceData.reservation,
        student: invoiceData.student,
        tourist: invoiceData.tourist,
        branding
      });
      
      // Download the PDF
      pdf.save(`invoice-${invoiceData.invoice_number}.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: "Invoice PDF has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF invoice.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading invoice details...</span>
        </div>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Invoice Not Found</h3>
            <p className="text-gray-500 mb-4">The invoice you're looking for doesn't exist.</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Invoice Details</h1>
            <p className="text-gray-600">{invoiceData.invoice_number}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(invoiceData.status)}>
            {invoiceData.status.charAt(0).toUpperCase() + invoiceData.status.slice(1)}
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
        {/* Invoice Information */}
        <div className="lg:col-span-2 space-y-6">
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
                  <p className="text-gray-900">{invoiceData.invoice_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Issue Date</label>
                  <p className="text-gray-900">{new Date(invoiceData.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Due Date</label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={invoiceData.due_date}
                      onChange={(e) => setInvoiceData({ ...invoiceData, due_date: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{new Date(invoiceData.due_date).toLocaleDateString()}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  {isEditing ? (
                    <Select value={invoiceData.status} onValueChange={(value) => setInvoiceData({ ...invoiceData, status: value as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-900">{invoiceData.status.charAt(0).toUpperCase() + invoiceData.status.slice(1)}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {invoiceData.reservation?.type === 'student' ? 'Student Information' : 'Tourist Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {invoiceData.reservation?.type === 'student' ? 'Student Name' : 'Tourist Name'}
                  </label>
                  <p className="text-gray-900">
                    {invoiceData.reservation?.type === 'student' 
                      ? `${invoiceData.student?.user?.first_name || ''} ${invoiceData.student?.user?.last_name || ''}`
                      : `${invoiceData.tourist?.first_name || ''} ${invoiceData.tourist?.last_name || ''}`
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {invoiceData.reservation?.type === 'student' ? 'Student ID' : 'Tourist ID'}
                  </label>
                  <p className="text-gray-900">
                    {invoiceData.reservation?.type === 'student' 
                      ? invoiceData.student?.student_id 
                      : invoiceData.tourist?.id
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">
                    {invoiceData.reservation?.type === 'student' 
                      ? invoiceData.student?.user?.email 
                      : invoiceData.tourist?.email
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">
                    {invoiceData.reservation?.type === 'student' 
                      ? invoiceData.student?.user?.phone 
                      : invoiceData.tourist?.phone
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Studio Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Studio Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Studio Number</label>
                  <p className="text-gray-900">{invoiceData.reservation?.studio?.studio_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Floor</label>
                  <p className="text-gray-900">{invoiceData.reservation?.studio?.floor || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-gray-900">{invoiceData.reservation?.studio?.status || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Reservation Number</label>
                  <p className="text-gray-900">{invoiceData.reservation?.reservation_number || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Invoice Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Reservation Payment</h4>
                    <p className="text-sm text-gray-500">Reservation #{invoiceData.reservation?.reservation_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">£{invoiceData.amount}</p>
                    <p className="text-sm text-gray-500">Amount</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">No notes available</p>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">£{invoiceData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">£{invoiceData.tax_amount || 0}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg">£{invoiceData.total_amount}</span>
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
                  <Button onClick={handleSendInvoice} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Invoice
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Invoice
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

export default InvoiceDetail;
