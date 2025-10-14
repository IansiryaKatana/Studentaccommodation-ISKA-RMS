
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2, Save, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
import { Skeleton } from '@/components/ui/skeleton';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [invoiceData, setInvoiceData] = useState({
    reservationId: '',
    amount: 0,
    dueDate: '',
    description: '',
    notes: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }
  ]);

  // Fetch form data
  const [reservations, setReservations] = useState<any[]>([]);

  const { selectedAcademicYear } = useAcademicYear();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationsData = await ApiService.getReservations(selectedAcademicYear);
        setReservations(reservationsData);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        toast({
          title: "Error",
          description: "Failed to load reservations. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    fetchReservations();
  }, [toast, selectedAcademicYear]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    // Validate required fields
    if (!invoiceData.reservationId || !invoiceData.dueDate || items.some(item => !item.description || item.rate <= 0)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const totalAmount = calculateTotal();
      const invoiceNumber = await ApiService.generateInvoiceNumber();
      
      const invoiceDataToSubmit = {
        invoice_number: invoiceNumber,
        reservation_id: invoiceData.reservationId,
        amount: totalAmount,
        tax_amount: 0, // No tax for now
        total_amount: totalAmount,
        due_date: invoiceData.dueDate,
        status: 'pending' as const,
        created_by: 'current-user-id', // This should come from auth context
        academic_year: selectedAcademicYear
      };

      await ApiService.createInvoice(invoiceDataToSubmit);
      
      toast({
        title: isDraft ? "Invoice Saved as Draft" : "Invoice Created",
        description: isDraft ? "Invoice has been saved as draft." : "Invoice has been created and is ready to send.",
      });

      navigate('/finance');
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error Creating Invoice",
        description: "There was an error creating the invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Details Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Invoice Items Skeleton */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-5">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="col-span-2">
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="col-span-2">
                      <Skeleton className="h-4 w-12 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="col-span-2">
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="col-span-1">
                      <Skeleton className="h-10 w-10" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Summary Skeleton */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
          <p className="text-gray-600">Generate a new invoice for a student</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save as Draft"
            )}
          </Button>
          <Button onClick={() => handleSubmit(false)} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Invoice
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Reservation *</label>
                  <Select value={invoiceData.reservationId} onValueChange={(value) => setInvoiceData({ ...invoiceData, reservationId: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select reservation" />
                    </SelectTrigger>
                    <SelectContent>
                      {reservations.map(res => (
                        <SelectItem key={res.id} value={res.id}>
                          {res.reservation_number} - {res.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Due Date *</label>
                  <Input
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Input
                  value={invoiceData.description}
                  onChange={(e) => setInvoiceData({ ...invoiceData, description: e.target.value })}
                  placeholder="Invoice description"
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <Textarea
                  value={invoiceData.notes}
                  onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                  placeholder="Additional notes"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Invoice Items
                <Button onClick={addItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <label className="text-sm font-medium text-gray-700">Description *</label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Item description"
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700">Qty</label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700">Rate</label>
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700">Amount</label>
                      <div className="mt-1 px-3 py-2 bg-gray-50 border rounded-md text-sm font-medium">
                        ${item.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      {items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
