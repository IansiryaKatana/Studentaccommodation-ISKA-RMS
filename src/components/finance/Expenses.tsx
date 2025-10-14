import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Calendar,
  Receipt,
  Wrench,
  Building,
  TrendingUp,
  PieChart,
  MoreVertical,
  Eye,
  FileText
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiService, Expense, MaintenanceRequest } from '@/services/api';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
import { useToast } from '@/hooks/use-toast';

interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  expensesByCategory: Record<string, number>;
  expensesByMonth: Record<string, number>;
}

const Expenses = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [newExpense, setNewExpense] = useState({
    maintenance_request_id: 'none',
    description: '',
    amount: '',
    category: 'other',
    vendor_name: '',
    expense_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const expenseCategories = [
    { value: 'labor', label: 'Labor' },
    { value: 'materials', label: 'Materials' },
    { value: 'contractor', label: 'Contractor' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'other', label: 'Other' }
  ];

  const { selectedAcademicYear } = useAcademicYear();

  useEffect(() => {
    fetchData();
  }, [selectedAcademicYear]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [expensesData, maintenanceData, statsData] = await Promise.all([
        ApiService.getExpenses(selectedAcademicYear),
        ApiService.getAllMaintenanceRequests(),
        ApiService.getExpenseStats().catch(() => null)
      ]);

      setExpenses(expensesData);
      setMaintenanceRequests(maintenanceData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching expenses data:', error);
      toast({
        title: "Error",
        description: "Failed to load expenses data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.description || !newExpense.amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Prepare the expense data
      const expenseData = {
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        vendor_name: newExpense.vendor_name || undefined,
        expense_date: newExpense.expense_date,
        notes: newExpense.notes || undefined,
        maintenance_request_id: newExpense.maintenance_request_id === 'none' ? undefined : newExpense.maintenance_request_id
      };
      
      await ApiService.createExpense({ ...expenseData, academic_year: selectedAcademicYear });

      toast({
        title: "Success",
        description: "Expense created successfully.",
      });

      // Reset form and close dialog
      setShowAddDialog(false);
      setNewExpense({
        maintenance_request_id: 'none',
        description: '',
        amount: '',
        category: 'other',
        vendor_name: '',
        expense_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      await fetchData();
    } catch (error) {
      console.error('Error creating expense:', error);
      toast({
        title: "Error",
        description: "Failed to create expense.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await ApiService.deleteExpense(id);
      toast({
        title: "Success",
        description: "Expense deleted successfully.",
      });
      await fetchData();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "Failed to delete expense.",
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      labor: 'bg-blue-100 text-blue-800',
      materials: 'bg-green-100 text-green-800',
      contractor: 'bg-purple-100 text-purple-800',
      transportation: 'bg-yellow-100 text-yellow-800',
      equipment: 'bg-red-100 text-red-800',
      utilities: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.maintenance_request?.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">Track maintenance and operational expenses</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExpenses}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{stats.totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                £{Object.values(stats.expensesByMonth).reduce((sum, amount) => sum + amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Current month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. per Expense</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                £{stats.totalExpenses > 0 ? (stats.totalAmount / stats.totalExpenses).toFixed(0) : '0'}
              </div>
              <p className="text-xs text-muted-foreground">Average cost</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
          <CardDescription>Manage and track maintenance expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {expenseCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expenses Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Maintenance Request</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Receipt className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">No expenses found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{expense.description}</div>
                          {expense.notes && (
                            <div className="text-sm text-gray-500">{expense.notes}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {expense.maintenance_request ? (
                          <div>
                            <div className="font-medium">{expense.maintenance_request.title}</div>
                            {expense.maintenance_request.studio && (
                              <div className="text-sm text-gray-500">
                                Studio {expense.maintenance_request.studio.studio_number}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">No maintenance request</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(expense.category)}>
                          {expenseCategories.find(c => c.value === expense.category)?.label || expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {expense.vendor_name || '-'}
                      </TableCell>
                      <TableCell className="font-medium">
                        £{expense.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(expense.expense_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteExpense(expense.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) {
          // Reset form when dialog is closed
          setNewExpense({
            maintenance_request_id: 'none',
            description: '',
            amount: '',
            category: 'other',
            vendor_name: '',
            expense_date: new Date().toISOString().split('T')[0],
            notes: ''
          });
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Create a new expense record, optionally linked to a maintenance request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maintenanceRequest">Maintenance Request (Optional)</Label>
              <Select 
                key={showAddDialog ? 'add-expense-select' : 'closed'}
                value={newExpense.maintenance_request_id} 
                onValueChange={(value) => {
                  setNewExpense({ ...newExpense, maintenance_request_id: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select maintenance request" />
                </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No maintenance request</SelectItem>
                {maintenanceRequests.map((request) => (
                  <SelectItem key={request.id} value={request.id}>
                    {request.title} - {request.studio?.studio_number || 'No Studio'}
                  </SelectItem>
                ))}
              </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                placeholder="Enter expense description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (£) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newExpense.category} 
                  onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor Name</Label>
                <Input
                  id="vendor"
                  value={newExpense.vendor_name}
                  onChange={(e) => setNewExpense({ ...newExpense, vendor_name: e.target.value })}
                  placeholder="Enter vendor name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expenseDate">Expense Date</Label>
                <Input
                  id="expenseDate"
                  type="date"
                  value={newExpense.expense_date}
                  onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newExpense.notes}
                onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                placeholder="Additional notes or details"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddExpense} disabled={isSaving}>
                {isSaving ? 'Creating...' : 'Create Expense'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;
