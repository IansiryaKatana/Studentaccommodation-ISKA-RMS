
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  GraduationCap,
  CreditCard,
  Building,
  Loader2,
  UserPlus,
  Key,
  User
} from 'lucide-react';
import { TableSkeleton, ListSkeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ApiService, StudentWithUser } from '@/services/api';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
import { useModuleStyles } from '@/contexts/ModuleStylesContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface StudentWithDetails extends StudentWithUser {
  reservation?: {
    studio?: {
      studio_number: string;
      room_grade?: {
        name: string;
        weekly_rate: number;
      };
    };
    total_amount: number;
  };
  studio?: {
    studio_number: string;
    room_grade?: {
      name: string;
      weekly_rate: number;
    };
  };
  invoices?: Array<{
    amount: number;
    status: string;
  }>;
}

const StudentsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedAcademicYear } = useAcademicYear();
  const { getModuleGradient } = useModuleStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [students, setStudents] = useState<StudentWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, [selectedAcademicYear]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      // Use optimized single query instead of N+1 queries
      const data = await ApiService.getStudentsWithDetails({ academicYear: selectedAcademicYear });
      
      // Transform data to match expected interface
      const studentsWithDetails = data.map(student => ({
        ...student,
        reservation: undefined, // Student bookings don't use reservations
        studio: student.studio || undefined,
        invoices: student.invoices || []
      }));
      
      setStudents(studentsWithDetails);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const firstName = student.user?.first_name || student.first_name || 'Unknown';
    const lastName = student.user?.last_name || student.last_name || 'Student';
    const email = student.user?.email || student.email || '';
    const studioNumber = student.studio?.studio_number || student.reservation?.studio?.studio_number || '';
    
    return `${firstName} ${lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           studioNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const [studentToDelete, setStudentToDelete] = useState<StudentWithDetails | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteStudent = async (studentId: string) => {
    try {
      setIsDeleting(true);
      await ApiService.deleteStudent(studentId);
      setStudents(students.filter(s => s.id !== studentId));
      setStudentToDelete(null);
      toast({
        title: "Student Deleted",
        description: "Student record and all associated data have been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteStudent = (student: StudentWithDetails) => {
    setStudentToDelete(student);
  };

  const handleCreateUserAccount = async (student: StudentWithDetails) => {
    try {
      // Check if student already has a user account
      if (student.user) {
        toast({
          title: "User Account Exists",
          description: "This student already has a user account.",
          variant: "destructive",
        });
        return;
      }

      // Create user account with default password
      const userData = {
        email: student.user?.email || `${student.student_id?.toLowerCase()}@student.ac.uk`,
        first_name: student.user?.first_name || 'Student',
        last_name: student.user?.last_name || student.student_id || 'Unknown',
        role: 'student' as const,
        phone: student.user?.phone || '',
        is_active: true
      };

      const newUser = await ApiService.createUser(userData);
      
      // Update student record with user_id
      await ApiService.updateStudent(student.id, { user_id: newUser.id });
      
      // Refresh the students list
      await fetchStudents();
      
      toast({
        title: "User Account Created",
        description: `User account created for ${student.student_id} with default password: urbanportal123`,
      });
    } catch (error) {
      console.error('Error creating user account:', error);
      toast({
        title: "Error",
        description: "Failed to create user account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'graduated':
        return <Badge variant="outline">Graduated</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDepositBadge = (depositPaid: boolean) => {
    return depositPaid ? 
      <Badge className="bg-green-100 text-green-800">Paid</Badge> : 
      <Badge className="bg-red-100 text-red-800">Unpaid</Badge>;
  };

  const calculateRevenue = (student: StudentWithDetails) => {
    // Use the calculated total_amount from student record
    // This represents Weekly Rate × Number of Weeks
    return student.total_amount || 0;
  };

  const calculateProgress = (student: StudentWithDetails) => {
    // Calculate progress based on all student profile fields being filled
    const requiredFields = [
      // Personal Information
      student.user?.first_name || student.first_name,
      student.user?.last_name || student.last_name,
      student.birthday,
      student.ethnicity,
      student.gender,
      student.ucas_id,
      student.country,
      
      // Contact Information
      student.user?.email || student.email,
      student.user?.phone || student.phone,
      student.address_line1,
      student.post_code,
      student.town,
      
      // Academic Information
      student.academic_year,
      student.year_of_study,
      student.field_of_study,
      
      // Reservation Details
      student.studio?.studio_number || student.reservation?.studio?.studio_number,
      student.duration_type,
      student.duration_name,
      student.total_amount,
      
      // Payment Information
      student.deposit_paid !== undefined,
      
      // Guarantor Information
      student.guarantor_name,
      student.guarantor_email,
      student.guarantor_phone,
      student.guarantor_relationship
    ];
    
    const completedFields = requiredFields.filter(field => {
      if (typeof field === 'boolean') return field !== undefined;
      if (typeof field === 'number') return field !== null && field !== undefined;
      return field && field !== '';
    }).length;
    
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  const stats = [
    {
      title: 'Total Students',
      value: students.length.toString(),
      icon: Users,
      description: 'Currently enrolled'
    },
    {
      title: 'Active Students',
      value: students.filter(s => s.user?.is_active).length.toString(),
      icon: GraduationCap,
      description: 'In residence'
    },
    {
      title: 'Assigned Studios',
      value: students.filter(s => s.studio || s.reservation?.studio).length.toString(),
      icon: Building,
      description: 'With accommodation'
    },
    {
      title: 'Total Revenue',
      value: `£${students.reduce((sum, s) => sum + calculateRevenue(s), 0).toLocaleString()}`,
      icon: CreditCard,
      description: 'From all students'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage student records and accommodations</p>
        </div>
        <Link to="/students/add-booking">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Student Booking
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                </div>
                <stat.icon className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Student Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search students by name, email, or studio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Students Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Assigned Studio</TableHead>
                  <TableHead>Room Grade</TableHead>
                  <TableHead>Deposit Paid</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                            <div className="space-y-1">
                              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  filteredStudents.map((student) => {
                    const progress = calculateProgress(student);
                    const revenue = calculateRevenue(student);
                    
                    return (
                      <TableRow 
                        key={student.id} 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => navigate(`/student-portal/${student.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">{`${student.user?.first_name || student.first_name || 'Unknown'} ${student.user?.last_name || student.last_name || 'Student'}`}</div>
                              <div className="text-sm text-gray-500">{student.user?.email || student.email || 'No email'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.studio?.studio_number || student.reservation?.studio?.studio_number || 'Not assigned'}</div>
                            <div className="text-sm text-gray-500">
                              {student.studio?.room_grade?.weekly_rate || student.reservation?.studio?.room_grade?.weekly_rate ? 
                                `£${(student.studio?.room_grade?.weekly_rate || student.reservation?.studio?.room_grade?.weekly_rate)}/week` : 
                                'No rate set'
                              }
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {student.studio?.room_grade?.name || student.reservation?.studio?.room_grade?.name || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getDepositBadge(student.deposit_paid || false)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">£{revenue.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">
                              {student.invoices?.length || 0} invoices
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-full">
                            <div className="flex items-center space-x-2">
                              <Progress value={progress} className="flex-1" />
                              <span className="text-sm font-medium w-12">{progress}%</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {progress === 100 ? 'Complete' : 'Incomplete'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => navigate(`/student-portal/${student.id}/payments`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Student Portal
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/student-portal/${student.id}/profile`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Profile
                              </DropdownMenuItem>
                              {!student.user && (
                                <DropdownMenuItem onClick={() => handleCreateUserAccount(student)}>
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Create User Account
                                </DropdownMenuItem>
                              )}
                              {student.user && (
                                <DropdownMenuItem onClick={() => navigate(`/student-portal/${student.id}/payments`)}>
                                  <Key className="mr-2 h-4 w-4" />
                                  Access Portal
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => confirmDeleteStudent(student)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding a new student.'}
              </p>
              <div className="mt-6">
                <Link to="/students/add-booking">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student Booking
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!studentToDelete} onOpenChange={() => setStudentToDelete(null)}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <div 
              className="flex items-center justify-center w-12 h-12 rounded-full mb-4"
              style={{
                background: getModuleGradient('students-gradient')
              }}
            >
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold">
              Delete Student
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 text-base">
              <p>
                Are you sure you want to delete{' '}
                <strong className="text-foreground font-semibold">
                  {studentToDelete?.user?.first_name || studentToDelete?.first_name} {studentToDelete?.user?.last_name || studentToDelete?.last_name}
                </strong>?
              </p>
              
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm font-semibold text-destructive mb-2">⚠️ This action will permanently delete:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Student record and profile</li>
                  <li>All associated invoices ({studentToDelete?.invoices?.length || 0} invoices)</li>
                  <li>All reservation installments</li>
                  <li>All student documents</li>
                  <li>All student agreements</li>
                  <li>All payment records</li>
                  {studentToDelete?.studio_id && (
                    <li>Studio assignment (studio will be set to vacant if no other active reservations)</li>
                  )}
                </ul>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                  🚨 This action cannot be undone.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1 sm:flex-1" disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => studentToDelete && handleDeleteStudent(studentToDelete.id)}
              className="flex-1 sm:flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Student
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentsList;
