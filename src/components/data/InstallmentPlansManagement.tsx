
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { ApiService, InstallmentPlan } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  CheckCircle,
  Loader2,
  Calendar,
  AlertTriangle,
  Save,
  X
} from 'lucide-react';


const InstallmentPlansManagement = () => {
  const { toast } = useToast();
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InstallmentPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPlan, setNewPlan] = useState({ 
    name: '', 
    description: '',
    number_of_installments: '',
    discount_percentage: '',
    late_fee_percentage: '',
    late_fee_flat: '',
    due_dates: [] as string[],
    deposit_amount: 500
  });

  useEffect(() => {
    fetchInstallmentPlans();
  }, []);

  const fetchInstallmentPlans = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getInstallmentPlans();
      setInstallmentPlans(data || []);
    } catch (error) {
      console.error('Error fetching installment plans:', error);
      toast({
        title: "Error",
        description: "Failed to fetch installment plans. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetNewPlan = () => {
    setNewPlan({ 
      name: '', 
      description: '',
      number_of_installments: '',
      discount_percentage: '',
      late_fee_percentage: '',
      late_fee_flat: '',
      due_dates: [],
      deposit_amount: 500
    });
  };

  const handleAddPlan = async () => {
    if (!newPlan.name || !newPlan.number_of_installments) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPlan.due_dates.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one due date.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const planData = {
        name: newPlan.name,
        description: newPlan.description,
        number_of_installments: parseInt(newPlan.number_of_installments),
        discount_percentage: parseFloat(newPlan.discount_percentage) || 0,
        late_fee_percentage: parseFloat(newPlan.late_fee_percentage) || 0,
        late_fee_flat: parseFloat(newPlan.late_fee_flat) || 0,
        due_dates: newPlan.due_dates,
        deposit_amount: newPlan.deposit_amount,
        is_active: true
      };
      
      await ApiService.createInstallmentPlan(planData);
      await fetchInstallmentPlans();
      resetNewPlan();
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Installment plan added successfully.",
      });
    } catch (error) {
      console.error('Error adding installment plan:', error);
      toast({
        title: "Error",
        description: "Failed to add installment plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPlan = async () => {
    if (!editingPlan) return;

    if (!editingPlan.name || !editingPlan.number_of_installments) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingPlan.due_dates.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one due date.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const updates = {
        name: editingPlan.name,
        description: editingPlan.description,
        number_of_installments: editingPlan.number_of_installments,
        discount_percentage: editingPlan.discount_percentage,
        late_fee_percentage: editingPlan.late_fee_percentage,
        late_fee_flat: editingPlan.late_fee_flat,
        due_dates: editingPlan.due_dates,
        deposit_amount: editingPlan.deposit_amount,
        is_active: editingPlan.is_active
      };
      
      await ApiService.updateInstallmentPlan(editingPlan.id, updates);
      await fetchInstallmentPlans();
      setEditingPlan(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Installment plan updated successfully.",
      });
    } catch (error) {
      console.error('Error updating installment plan:', error);
      toast({
        title: "Error",
        description: "Failed to update installment plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      await ApiService.deleteInstallmentPlan(id);
      await fetchInstallmentPlans();
      toast({
        title: "Success",
        description: "Installment plan deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting installment plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete installment plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const plan = installmentPlans.find(p => p.id === id);
      if (plan) {
        await ApiService.updateInstallmentPlan(id, { is_active: !plan.is_active });
        await fetchInstallmentPlans();
        toast({
          title: "Success",
          description: "Installment plan status updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating installment plan:', error);
      toast({
        title: "Error",
        description: "Failed to update installment plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (plan: InstallmentPlan) => {
    setEditingPlan({ ...plan });
    setIsEditDialogOpen(true);
  };

  const addDueDate = (plan: 'new' | 'edit') => {
    const today = new Date().toISOString().split('T')[0];
    if (plan === 'new') {
      setNewPlan(prev => ({
        ...prev,
        due_dates: [...prev.due_dates, today]
      }));
    } else if (editingPlan) {
      setEditingPlan(prev => prev ? {
        ...prev,
        due_dates: [...prev.due_dates, today]
      } : null);
    }
  };

  const removeDueDate = (index: number, plan: 'new' | 'edit') => {
    if (plan === 'new') {
      setNewPlan(prev => ({
        ...prev,
        due_dates: prev.due_dates.filter((_, i) => i !== index)
      }));
    } else if (editingPlan) {
      setEditingPlan(prev => prev ? {
        ...prev,
        due_dates: prev.due_dates.filter((_, i) => i !== index)
      } : null);
    }
  };

  const updateDueDate = (index: number, date: string, plan: 'new' | 'edit') => {
    if (plan === 'new') {
      setNewPlan(prev => ({
        ...prev,
        due_dates: prev.due_dates.map((d, i) => i === index ? date : d)
      }));
    } else if (editingPlan) {
      setEditingPlan(prev => prev ? {
        ...prev,
        due_dates: prev.due_dates.map((d, i) => i === index ? date : d)
      } : null);
    }
  };

  const renderDueDatesSection = (plan: 'new' | 'edit') => {
    const dueDates = plan === 'new' ? newPlan.due_dates : (editingPlan?.due_dates || []);
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Due Dates</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addDueDate(plan)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Date
          </Button>
        </div>
        {dueDates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No due dates added</p>
        ) : (
          <div className="space-y-2">
            {dueDates.map((date, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => updateDueDate(index, e.target.value, plan)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeDueDate(index, plan)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPlanForm = (plan: 'new' | 'edit') => {
    if (plan === 'new') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name-new">Plan Name *</Label>
            <Input
              id="name-new"
              placeholder="e.g., 3 Installments"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description-new">Description</Label>
            <Textarea
              id="description-new"
              placeholder="e.g., Pay in 3 installments for student accommodation"
              value={newPlan.description}
              onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="number_of_installments-new">Number of Installments *</Label>
              <Input
                id="number_of_installments-new"
                type="number"
                placeholder="e.g., 3"
                value={newPlan.number_of_installments}
                onChange={(e) => setNewPlan({ ...newPlan, number_of_installments: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="deposit_amount-new">Deposit Amount (£)</Label>
              <Input
                id="deposit_amount-new"
                type="number"
                step="0.01"
                placeholder="e.g., 500"
                value={newPlan.deposit_amount}
                onChange={(e) => setNewPlan({ ...newPlan, deposit_amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="discount_percentage-new">Discount (%)</Label>
              <Input
                id="discount_percentage-new"
                type="number"
                step="0.01"
                placeholder="e.g., 5"
                value={newPlan.discount_percentage}
                onChange={(e) => setNewPlan({ ...newPlan, discount_percentage: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="late_fee_percentage-new">Late Fee (%)</Label>
              <Input
                id="late_fee_percentage-new"
                type="number"
                step="0.01"
                placeholder="e.g., 5"
                value={newPlan.late_fee_percentage}
                onChange={(e) => setNewPlan({ ...newPlan, late_fee_percentage: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="late_fee_flat-new">Late Fee Flat (£)</Label>
              <Input
                id="late_fee_flat-new"
                type="number"
                step="0.01"
                placeholder="e.g., 25"
                value={newPlan.late_fee_flat}
                onChange={(e) => setNewPlan({ ...newPlan, late_fee_flat: e.target.value })}
              />
            </div>
          </div>
          {renderDueDatesSection(plan)}
        </div>
      );
    } else if (editingPlan) {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name-edit">Plan Name *</Label>
            <Input
              id="name-edit"
              placeholder="e.g., 3 Installments"
              value={editingPlan.name}
              onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description-edit">Description</Label>
            <Textarea
              id="description-edit"
              placeholder="e.g., Pay in 3 installments for student accommodation"
              value={editingPlan.description || ''}
              onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="number_of_installments-edit">Number of Installments *</Label>
              <Input
                id="number_of_installments-edit"
                type="number"
                placeholder="e.g., 3"
                value={editingPlan.number_of_installments}
                onChange={(e) => setEditingPlan({ ...editingPlan, number_of_installments: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="deposit_amount-edit">Deposit Amount (£)</Label>
              <Input
                id="deposit_amount-edit"
                type="number"
                step="0.01"
                placeholder="e.g., 500"
                value={editingPlan.deposit_amount}
                onChange={(e) => setEditingPlan({ ...editingPlan, deposit_amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="discount_percentage-edit">Discount (%)</Label>
              <Input
                id="discount_percentage-edit"
                type="number"
                step="0.01"
                placeholder="e.g., 5"
                value={editingPlan.discount_percentage}
                onChange={(e) => setEditingPlan({ ...editingPlan, discount_percentage: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="late_fee_percentage-edit">Late Fee (%)</Label>
              <Input
                id="late_fee_percentage-edit"
                type="number"
                step="0.01"
                placeholder="e.g., 5"
                value={editingPlan.late_fee_percentage}
                onChange={(e) => setEditingPlan({ ...editingPlan, late_fee_percentage: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="late_fee_flat-edit">Late Fee Flat (£)</Label>
              <Input
                id="late_fee_flat-edit"
                type="number"
                step="0.01"
                placeholder="e.g., 25"
                value={editingPlan.late_fee_flat}
                onChange={(e) => setEditingPlan({ ...editingPlan, late_fee_flat: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          {renderDueDatesSection(plan)}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={editingPlan.is_active}
              onChange={(e) => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Installment Plans Management</h1>
          <p className="text-muted-foreground">Configure payment installment options</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Installment Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Installment Plan</DialogTitle>
              <DialogDescription>
                Create a new installment plan with due dates and payment terms.
              </DialogDescription>
            </DialogHeader>
            {renderPlanForm('new')}
            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={handleAddPlan} 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Add Plan
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetNewPlan();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Installment Plans List */}
      <Card>
        <CardHeader>
          <CardTitle>Installment Plans</CardTitle>
          <CardDescription>Manage all payment installment options</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Loading installment plans...</p>
            </div>
          ) : installmentPlans.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No installment plans</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new installment plan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {installmentPlans.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{plan.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {plan.description}
                        </p>
                        {plan.due_dates && plan.due_dates.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <p>{plan.due_dates.length} due dates • £{plan.deposit_amount} deposit</p>
                            <p className="mt-1">
                              Due dates: {plan.due_dates.map((date: string, index: number) => {
                                const formattedDate = new Date(date).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                });
                                return index === plan.due_dates.length - 1 ? formattedDate : `${formattedDate}, `;
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline">{plan.number_of_installments} installments</Badge>
                    {plan.discount_percentage > 0 && (
                      <Badge variant="secondary">{plan.discount_percentage}% discount</Badge>
                    )}
                    <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                      {plan.is_active ? (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Active
                        </>
                      ) : (
                        'Inactive'
                      )}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(plan.id)}
                    >
                      {plan.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openEditDialog(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Installment Plan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{plan.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePlan(plan.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Installment Plan</DialogTitle>
            <DialogDescription>
              Update the installment plan details and due dates.
            </DialogDescription>
          </DialogHeader>
          {renderPlanForm('edit')}
          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={handleEditPlan} 
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Plan
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingPlan(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstallmentPlansManagement;
