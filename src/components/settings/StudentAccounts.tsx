import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Search, 
  MoreVertical,
  UserPlus,
  UserX,
  User,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';

interface StudentWithAccountInfo {
  id: string;
  user_id?: string;
  total_amount?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  studio?: {
    studio_number: string;
  };
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    last_login?: string;
  };
}

const StudentAccounts = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentWithAccountInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getStudents();
      
      // Fetch additional details for each student
      const studentsWithDetails = await Promise.all(
        data.map(async (student) => {
          let user = undefined;
          let studio = undefined;

          // Get user details if user_id exists
          if (student.user_id) {
            try {
              user = await ApiService.getUserById(student.user_id);
            } catch (error) {
              console.error('Error fetching user:', error);
            }
          }

          // Get studio details if studio_id exists
          if (student.studio_id) {
            try {
              studio = await ApiService.getStudioById(student.studio_id);
            } catch (error) {
              console.error('Error fetching studio:', error);
            }
          }

          return {
            ...student,
            user,
            studio
          };
        })
      );

      setStudents(studentsWithDetails);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load student accounts.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (student: StudentWithAccountInfo) => {
    try {
      // Create user account for the student
      const userData = {
        email: `${student.user?.email || `student.${student.id}@iska-rms.com`}`,
        password_hash: 'temp_password_hash', // This should be properly hashed
        first_name: student.user?.first_name || 'Student',
        last_name: student.user?.last_name || 'User',
        role: 'student' as const,
        phone: '',
        is_active: true
      };

      const user = await ApiService.createUser(userData);

      // Update student record with user_id
      await ApiService.updateStudent(student.id, {
        user_id: user.id
      });

      toast({
        title: "Success",
        description: "Student account created successfully!",
      });

      // Refresh the list
      fetchStudents();
    } catch (error) {
      console.error('Error creating student account:', error);
      toast({
        title: "Error",
        description: "Failed to create student account.",
        variant: "destructive",
      });
    }
  };

  const handleDeactivateAccount = async (student: StudentWithAccountInfo) => {
    if (!student.user_id) return;

    try {
      // Deactivate the user account
      await ApiService.updateUser(student.user_id, {
        is_active: false
      });

      toast({
        title: "Success",
        description: "Student account deactivated successfully!",
      });

      // Refresh the list
      fetchStudents();
    } catch (error) {
      console.error('Error deactivating student account:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate student account.",
        variant: "destructive",
      });
    }
  };

  const getAccountStatusBadge = (student: StudentWithAccountInfo) => {
    if (!student.user_id) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Not Created</Badge>;
    }
    return <Badge variant="default" className="bg-green-100 text-green-700">Created</Badge>;
  };

  const getActiveStatusBadge = (student: StudentWithAccountInfo) => {
    if (!student.user_id) {
      return <Badge variant="outline" className="text-gray-500">N/A</Badge>;
    }
    
    if (student.user?.is_active) {
      return <Badge variant="default" className="bg-green-100 text-green-700">Active</Badge>;
    } else {
      return <Badge variant="destructive" className="bg-red-100 text-red-700">Inactive</Badge>;
    }
  };

  const getLastLoginText = (student: StudentWithAccountInfo) => {
    if (!student.user_id || !student.user?.last_login) {
      return 'Never';
    }
            return new Date(student.user?.last_login || new Date()).toLocaleDateString() + ' ' +
          new Date(student.user?.last_login || new Date()).toLocaleTimeString();
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    const firstName = student.user?.first_name || student.first_name || '';
    const lastName = student.user?.last_name || student.last_name || '';
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    const email = student.user?.email || student.email || '';
    const studio = student.studio?.studio_number?.toLowerCase() || '';
    
    return fullName.includes(searchLower) || 
           email.includes(searchLower) || 
           studio.includes(searchLower);
  });

  const stats = [
    {
      title: 'Total Students',
      value: students.length.toString(),
      icon: Users,
      description: 'All student records'
    },
    {
      title: 'Accounts Created',
      value: students.filter(s => s.user_id).length.toString(),
      icon: UserPlus,
      description: 'With user accounts'
    },
    {
      title: 'Active Accounts',
      value: students.filter(s => s.user?.is_active).length.toString(),
      icon: CheckCircle,
      description: 'Recently logged in'
    },
    {
      title: 'Pending Creation',
      value: students.filter(s => !s.user_id).length.toString(),
      icon: Clock,
      description: 'Need user accounts'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Accounts</h1>
          <p className="text-gray-600 mt-1">Manage student user accounts and access</p>
        </div>
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

      {/* Student Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
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
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Studio</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead>Active Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Loading students...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-gray-500">No students found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">
                              {student.user?.first_name || student.first_name 
                                ? `${student.user?.first_name || student.first_name} ${student.user?.last_name || student.last_name}`
                                : 'Student Name Not Set'
                              }
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.user?.email || student.email || 'No email set'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span>{student.studio?.studio_number || 'Not assigned'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getAccountStatusBadge(student)}
                      </TableCell>
                      <TableCell>
                        {getActiveStatusBadge(student)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{getLastLoginText(student)}</span>
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
                            {!student.user_id && (
                              <DropdownMenuItem onClick={() => handleCreateAccount(student)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Create Account
                              </DropdownMenuItem>
                            )}
                            {student.user_id && student.user?.is_active && (
                              <DropdownMenuItem onClick={() => handleDeactivateAccount(student)}>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate Account
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <User className="mr-2 h-4 w-4" />
                              View Details
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

export default StudentAccounts;
