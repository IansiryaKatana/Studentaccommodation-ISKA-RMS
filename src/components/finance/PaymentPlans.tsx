import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Users, CreditCard, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiService } from '@/services/api';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
import { useToast } from '@/hooks/use-toast';

interface InstallmentPlan {
  id: string;
  name: string;
  description: string;
  number_of_installments: number;
  discount_percentage: number;
  late_fee_percentage: number;
  late_fee_flat: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface StudentWithPlan {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  nationality: string;
  passport_number: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_email: string;
  medical_conditions: string;
  dietary_restrictions: string;
  special_requirements: string;
  status: string;
  created_at: string;
  updated_at: string;
  installment_plan_id: string;
  installment_plan?: InstallmentPlan;
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

const PaymentPlans = () => {
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>([]);
  const [allStudents, setAllStudents] = useState<StudentWithPlan[]>([]);
  const [students, setStudents] = useState<StudentWithPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<InstallmentPlan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const { toast } = useToast();

  const { selectedAcademicYear } = useAcademicYear();

  useEffect(() => {
    fetchPaymentPlans();
    fetchAllStudents();
  }, [selectedAcademicYear]);

  const fetchPaymentPlans = async () => {
    try {
      const plansData = await ApiService.getInstallmentPlans();
      // Filter only active plans
      const activePlans = plansData.filter((plan: InstallmentPlan) => plan.is_active);
      setInstallmentPlans(activePlans);
    } catch (error) {
      console.error('Error fetching payment plans:', error);
      toast({
        title: "Error",
        description: "Failed to load payment plans",
        variant: "destructive"
      });
    }
  };

  const fetchAllStudents = async () => {
    try {
      const studentsData = await ApiService.getStudents(selectedAcademicYear);
      setAllStudents(studentsData || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (plan: InstallmentPlan) => {
    setSelectedPlan(plan);
    // Filter students by this payment plan
    const filteredStudents = allStudents.filter(student => 
      student.installment_plan_id === plan.id
    );
    setStudents(filteredStudents);
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('semester')) return Calendar;
    if (name.includes('monthly')) return TrendingUp;
    if (name.includes('quarterly')) return DollarSign;
    return CreditCard;
  };

  const getPlanColor = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('semester')) return 'from-blue-400 to-purple-500';
    if (name.includes('monthly')) return 'from-green-400 to-blue-500';
    if (name.includes('quarterly')) return 'from-orange-400 to-red-500';
    return 'from-gray-400 to-gray-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const studentDate = new Date(student.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - studentDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (dateFilter) {
        case 'today':
          matchesDate = diffDays <= 1;
          break;
        case 'week':
          matchesDate = diffDays <= 7;
          break;
        case 'month':
          matchesDate = diffDays <= 30;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Plans</h1>
            <p className="text-gray-600">Manage student payment plans and view enrollments</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Plans</h1>
          <p className="text-gray-600">Manage student payment plans and view enrollments</p>
        </div>
      </div>

      {/* Payment Plans Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {installmentPlans.map((plan) => {
          const IconComponent = getPlanIcon(plan.name);
          const gradientClass = getPlanColor(plan.name);
          const studentCount = allStudents.filter(student => 
            student.installment_plan_id === plan.id
          ).length;

          return (
            <Card 
              key={plan.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                selectedPlan?.id === plan.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleCardClick(plan)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`flex aspect-square size-12 items-center justify-center rounded-lg bg-gradient-to-r ${gradientClass}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-600">{plan.number_of_installments} installments</p>
                    <div className="flex items-center mt-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {studentCount} students
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium">{plan.discount_percentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Late Fee:</span>
                    <span className="font-medium">{plan.late_fee_percentage}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Students Table - Only show if a plan is selected */}
      {selectedPlan && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Students in {selectedPlan.name} Plan
              </h2>
              <p className="text-gray-600">
                {students.length} student{students.length !== 1 ? 's' : ''} enrolled
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedPlan(null);
                setStudents([]);
              }}
            >
              Clear Selection
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Enrolled Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No students found in this payment plan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {student.first_name} {student.last_name}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.phone}</TableCell>
                        <TableCell>{student.nationality}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              student.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : student.status === 'inactive'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(student.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPlans; 