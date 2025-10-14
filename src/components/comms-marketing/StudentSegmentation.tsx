import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Users, 
  Mail, 
  Calendar,
  MapPin,
  CreditCard,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import { useAcademicYear } from '@/contexts/AcademicYearContext';

interface Student {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  country?: string;
  academic_year?: string;
  year_of_study?: string;
  installment_plan_id?: string;
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };
}

interface SegmentationCriteria {
  paymentStatus?: string;
  country?: string;
  academicYear?: string;
  yearOfStudy?: string;
  installmentPlan?: string;
  hasEmail?: boolean;
  searchTerm?: string;
}

const StudentSegmentation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { selectedAcademicYear } = useAcademicYear();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [criteria, setCriteria] = useState<SegmentationCriteria>({});
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [countries, setCountries] = useState<string[]>([]);
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [installmentPlans, setInstallmentPlans] = useState<any[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, [selectedAcademicYear]);

  useEffect(() => {
    applyFilters();
  }, [students, criteria]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch students for selected academic year
      const studentsData = await ApiService.getStudents(selectedAcademicYear);
      setStudents(studentsData);
      setFilteredStudents(studentsData);

      // Extract unique values for filters
      const uniqueCountries = [...new Set(studentsData.map(s => s.country).filter(Boolean))];
      const uniqueAcademicYears = [...new Set(studentsData.map(s => s.academic_year).filter(Boolean))];
      
      setCountries(uniqueCountries);
      setAcademicYears(uniqueAcademicYears);

      // Fetch installment plans
      const plans = await ApiService.getInstallmentPlans();
      setInstallmentPlans(plans);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch student data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...students];

    // Apply search term
    if (criteria.searchTerm) {
      const searchLower = criteria.searchTerm.toLowerCase();
      filtered = filtered.filter(student => {
        const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
        const email = student.user?.email?.toLowerCase() || '';
        return fullName.includes(searchLower) || email.includes(searchLower);
      });
    }

    // Apply payment status filter
    if (criteria.paymentStatus && criteria.paymentStatus !== 'all') {
      // This would need to be implemented with actual payment data
      // For now, we'll show all students
    }

    // Apply country filter
    if (criteria.country && criteria.country !== 'all') {
      filtered = filtered.filter(student => student.country === criteria.country);
    }

    // Academic year filtering is now handled by the global context

    // Apply year of study filter
    if (criteria.yearOfStudy && criteria.yearOfStudy !== 'all') {
      filtered = filtered.filter(student => student.year_of_study === criteria.yearOfStudy);
    }

    // Apply installment plan filter
    if (criteria.installmentPlan && criteria.installmentPlan !== 'all') {
      filtered = filtered.filter(student => student.installment_plan_id === criteria.installmentPlan);
    }

    // Apply email filter
    if (criteria.hasEmail) {
      filtered = filtered.filter(student => student.user?.email);
    }

    setFilteredStudents(filtered);
  };

  const handleCriteriaChange = (key: keyof SegmentationCriteria, value: any) => {
    setCriteria(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setCriteria({});
    setSelectedStudents(new Set());
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    const newSelected = new Set(selectedStudents);
    if (checked) {
      newSelected.add(studentId);
    } else {
      newSelected.delete(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredStudents.map(s => s.id));
      setSelectedStudents(allIds);
    } else {
      setSelectedStudents(new Set());
    }
  };

  const handleCreateCampaign = () => {
    if (selectedStudents.size === 0) {
      toast({
        title: "No students selected",
        description: "Please select at least one student to create a campaign",
        variant: "destructive"
      });
      return;
    }

    // Store selected student IDs in sessionStorage to pass to BulkEmailSender
    sessionStorage.setItem('selectedStudentIds', JSON.stringify(Array.from(selectedStudents)));
    
    // Navigate to Bulk Email Sender
    navigate('/comms-marketing/bulk-email-sender');
    
    toast({
      title: "Students selected",
      description: `${selectedStudents.size} students have been selected for your campaign`,
    });
  };

  const getStudentDisplayName = (student: Student) => {
    if (student.user?.first_name && student.user?.last_name) {
      return `${student.user.first_name} ${student.user.last_name}`;
    }
    if (student.first_name && student.last_name) {
      return `${student.first_name} ${student.last_name}`;
    }
    return 'Unknown Student';
  };

  const getStudentEmail = (student: Student) => {
    return student.user?.email || student.email || 'No email';
  };

  const getPaymentStatusBadge = (student: Student) => {
    // This would need to be implemented with actual payment data
    // For now, return a placeholder
    return (
      <Badge variant="outline" className="text-xs">
        Current
      </Badge>
    );
  };

  const getActiveFiltersCount = () => {
    return Object.values(criteria).filter(value => 
      value !== undefined && value !== '' && value !== false
    ).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Segmentation</h1>
          <p className="text-gray-600">Filter and select students for email campaigns</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {filteredStudents.length} students
          </Badge>
          {selectedStudents.size > 0 && (
            <Badge className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {selectedStudents.size} selected
            </Badge>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary">{getActiveFiltersCount()} active</Badge>
              )}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <Label htmlFor="search">Search Students</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Name or email..."
                  value={criteria.searchTerm || ''}
                  onChange={(e) => handleCriteriaChange('searchTerm', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Payment Status */}
            <div>
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select
                value={criteria.paymentStatus || 'all'}
                onValueChange={(value) => handleCriteriaChange('paymentStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="upcoming">Upcoming payments</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Country */}
            <div>
              <Label htmlFor="country">Country</Label>
              <Select
                value={criteria.country || 'all'}
                onValueChange={(value) => handleCriteriaChange('country', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Academic Year */}
            <div>
              <Label htmlFor="academicYear">Academic Year</Label>
              <Select
                value={criteria.academicYear || 'all'}
                onValueChange={(value) => handleCriteriaChange('academicYear', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All years</SelectItem>
                  {academicYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year of Study */}
            <div>
              <Label htmlFor="yearOfStudy">Year of Study</Label>
              <Select
                value={criteria.yearOfStudy || 'all'}
                onValueChange={(value) => handleCriteriaChange('yearOfStudy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All years</SelectItem>
                  <SelectItem value="1st">1st Year</SelectItem>
                  <SelectItem value="2nd">2nd Year</SelectItem>
                  <SelectItem value="3rd">3rd Year</SelectItem>
                  <SelectItem value="4+">4th+ Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Installment Plan */}
            <div>
              <Label htmlFor="installmentPlan">Installment Plan</Label>
              <Select
                value={criteria.installmentPlan || 'all'}
                onValueChange={(value) => handleCriteriaChange('installmentPlan', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All plans" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All plans</SelectItem>
                  {installmentPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Has Email */}
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="hasEmail"
                checked={criteria.hasEmail || false}
                onCheckedChange={(checked) => handleCriteriaChange('hasEmail', checked)}
              />
              <Label htmlFor="hasEmail">Has email address</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectAll(selectedStudents.size !== filteredStudents.length)}
              >
                {selectedStudents.size === filteredStudents.length ? 'Deselect All' : 'Select All'}
              </Button>
              {selectedStudents.size > 0 && (
                <Button size="sm" className="flex items-center gap-2" onClick={handleCreateCampaign}>
                  <Mail className="h-4 w-4" />
                  Create Campaign ({selectedStudents.size})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-gray-600">Try adjusting your filters to find students</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                        onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                      />
                    </TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Year of Study</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Installment Plan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.has(student.id)}
                          onCheckedChange={(checked) => handleSelectStudent(student.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{getStudentDisplayName(student)}</div>
                          {student.phone && (
                            <div className="text-sm text-gray-500">{student.phone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStudentEmail(student)}
                          {student.user?.email && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {student.country || 'Not specified'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {student.academic_year || 'Not specified'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                          {student.year_of_study || 'Not specified'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(student)}
                      </TableCell>
                      <TableCell>
                        {student.installment_plan_id ? (
                          <Badge variant="outline" className="text-xs">
                            {installmentPlans.find(p => p.id === student.installment_plan_id)?.name || 'Unknown Plan'}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">No plan</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Students Summary */}
      {selectedStudents.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Selected Students ({selectedStudents.size})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">{selectedStudents.size}</div>
                <div className="text-sm text-blue-600">Students Selected</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Mail className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">
                  {filteredStudents.filter(s => selectedStudents.has(s.id) && s.user?.email).length}
                </div>
                <div className="text-sm text-green-600">With Email Addresses</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold text-orange-600">
                  {filteredStudents.filter(s => selectedStudents.has(s.id) && !s.user?.email).length}
                </div>
                <div className="text-sm text-orange-600">Without Email Addresses</div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-center">
              <Button size="lg" className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Create Email Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentSegmentation;
