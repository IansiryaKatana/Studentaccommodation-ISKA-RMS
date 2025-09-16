import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  Calendar,
  Wrench,
  DollarSign,
  Receipt
} from 'lucide-react';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  priority: number; // 1 = Low, 2 = Medium, 3 = High
  status: 'Pending' | 'In Progress' | 'Completed';
  studio_id?: string;
  created_at: string;
  updated_at: string;
  studio?: {
    id: string;
    studio_number: string;
    floor?: number;
    status?: string;
  };
  expenses?: {
    id: string;
    amount: number;
    description: string;
    category: string;
  }[];
  totalExpenseAmount?: number;
}

const MaintenanceRequests = () => {
  const { toast } = useToast();
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const fetchMaintenanceRequests = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all maintenance requests and expenses from the API
      const [maintenanceData, expensesData] = await Promise.all([
        ApiService.getAllMaintenanceRequests(),
        ApiService.getExpenses().catch(() => []) // Don't fail if expenses table doesn't exist yet
      ]);

      // Merge expense data with maintenance requests
      const requestsWithExpenses = maintenanceData.map(request => {
        const requestExpenses = expensesData.filter(expense => 
          expense.maintenance_request_id === request.id
        );
        const totalExpenseAmount = requestExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
        
        return {
          ...request,
          expenses: requestExpenses,
          totalExpenseAmount
        };
      });

      setMaintenanceRequests(requestsWithExpenses);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch maintenance requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || 
      (priorityFilter === 'High' && request.priority === 3) ||
      (priorityFilter === 'Medium' && request.priority === 2) ||
      (priorityFilter === 'Low' && request.priority === 1);

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 3: return 'bg-red-100 text-red-800'; // High
      case 2: return 'bg-yellow-100 text-yellow-800'; // Medium
      case 1: return 'bg-green-100 text-green-800'; // Low
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 3: return 'High';
      case 2: return 'Medium';
      case 1: return 'Low';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'In Progress': return <Clock className="h-4 w-4" />;
      case 'Pending': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      await ApiService.updateMaintenanceRequest(requestId, { status: newStatus as any });
      
      // Update local state
      setMaintenanceRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: newStatus as any, updated_at: new Date().toISOString() }
            : request
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Request status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update request status.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Loading maintenance requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-600">Manage student maintenance requests and track expenses</p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requests by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Maintenance Requests Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Studio</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expenses</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Wrench className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">No maintenance requests found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {request.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {request.studio ? (
                            <div className="flex flex-col">
                              <span className="font-medium">{request.studio.studio_number}</span>
                              {request.studio.floor !== undefined && (
                                <span className="text-xs text-gray-500">Floor {request.studio.floor}</span>
                              )}
                            </div>
                          ) : (
                            'No Studio'
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(request.priority)}>
                          {getPriorityText(request.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(request.status)}
                            <span>{request.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.totalExpenseAmount && request.totalExpenseAmount > 0 ? (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-600">
                              £{request.totalExpenseAmount.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({request.expenses?.length || 0} expenses)
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">No expenses</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(request.created_at).toLocaleDateString()}</div>
                          <div className="text-gray-500">
                            {new Date(request.created_at).toLocaleTimeString()}
                          </div>
                        </div>
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
                              <Receipt className="mr-2 h-4 w-4" />
                              View Expenses
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(request.id, 'In Progress')}
                              disabled={request.status === 'In Progress'}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Mark In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(request.id, 'Completed')}
                              disabled={request.status === 'Completed'}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Completed
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
    </div>
  );
};

export default MaintenanceRequests;
