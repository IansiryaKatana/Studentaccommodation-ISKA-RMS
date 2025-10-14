import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ApiService, Refund, RefundReason, Reservation } from '@/services/api';

interface RefundManagementProps {
  reservation: Reservation;
  onRefundCreated?: () => void;
}

const RefundManagement: React.FC<RefundManagementProps> = ({ reservation, onRefundCreated }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [refundReasons, setRefundReasons] = useState<RefundReason[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refundData, setRefundData] = useState({
    amount: 0,
    reason: '',
    refund_type: 'full' as 'full' | 'partial' | 'deposit_only',
    notes: ''
  });

  useEffect(() => {
    fetchRefunds();
    fetchRefundReasons();
  }, [reservation.id]);

  const fetchRefunds = async () => {
    try {
      const data = await ApiService.getRefundsByReservation(reservation.id);
      setRefunds(data);
    } catch (error) {
      console.error('Error fetching refunds:', error);
      toast({
        title: "Error",
        description: "Failed to fetch refunds.",
        variant: "destructive",
      });
    }
  };

  const fetchRefundReasons = async () => {
    try {
      const data = await ApiService.getRefundReasons();
      setRefundReasons(data);
    } catch (error) {
      console.error('Error fetching refund reasons:', error);
    }
  };

  const handleCreateRefund = async () => {
    if (!refundData.amount || !refundData.reason) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      await ApiService.createRefund({
        reservation_id: reservation.id,
        amount: refundData.amount,
        reason: refundData.reason,
        refund_type: refundData.refund_type,
        created_by: '00000000-0000-0000-0000-000000000000' // Default admin user ID
      });

      toast({
        title: "Refund Created",
        description: "Refund has been created successfully.",
      });

      setIsDialogOpen(false);
      setRefundData({ amount: 0, reason: '', refund_type: 'full', notes: '' });
      fetchRefunds();
      onRefundCreated?.();
    } catch (error) {
      console.error('Error creating refund:', error);
      toast({
        title: "Error",
        description: "Failed to create refund. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRefundTypeColor = (type: string) => {
    switch (type) {
      case 'full': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'deposit_only': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalRefunded = () => {
    return refunds.reduce((total, refund) => total + refund.amount, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Refund Management</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRefunds}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  Create Refund
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Refund</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Refund Amount (£)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={refundData.amount}
                      onChange={(e) => setRefundData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="refund_type">Refund Type</Label>
                    <Select
                      value={refundData.refund_type}
                      onValueChange={(value: 'full' | 'partial' | 'deposit_only') => 
                        setRefundData(prev => ({ ...prev, refund_type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Refund</SelectItem>
                        <SelectItem value="partial">Partial Refund</SelectItem>
                        <SelectItem value="deposit_only">Deposit Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Refund Reason</Label>
                    <Select
                      value={refundData.reason}
                      onValueChange={(value) => setRefundData(prev => ({ ...prev, reason: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {refundReasons.map((reason) => (
                          <SelectItem key={reason.id} value={reason.name}>
                            {reason.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={refundData.notes}
                      onChange={(e) => setRefundData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRefund} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Refund"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Total Reservation Amount</p>
              <p className="text-lg font-semibold">£{reservation.total_amount?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Refunded</p>
              <p className="text-lg font-semibold text-red-600">£{getTotalRefunded().toFixed(2)}</p>
            </div>
          </div>

          {/* Refunds List */}
          {refunds.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-medium">Refund History</h4>
              {refunds.map((refund) => (
                <div key={refund.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getRefundTypeColor(refund.refund_type)}>
                      {refund.refund_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <div>
                      <p className="font-medium">£{refund.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{refund.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(refund.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(refund.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No refunds have been created for this reservation.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RefundManagement; 