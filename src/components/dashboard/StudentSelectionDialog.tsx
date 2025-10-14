import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, User, Mail, Phone, Building } from 'lucide-react';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAcademicYear } from '@/contexts/AcademicYearContext';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  studio_id?: string;
  student_id?: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  } | null;
}

interface StudentSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentSelectionDialog({ isOpen, onClose }: StudentSelectionDialogProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedAcademicYear } = useAcademicYear();

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen, selectedAcademicYear]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => {
        const fullName = `${student.user?.first_name || student.first_name || ''} ${student.user?.last_name || student.last_name || ''}`.toLowerCase();
        const email = (student.user?.email || student.email || '').toLowerCase();
        const studentId = (student.student_id || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        
        return fullName.includes(search) || email.includes(search) || studentId.includes(search);
      });
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const studentsData = await ApiService.getStudentsWithDetails({ academicYear: selectedAcademicYear });
      setStudents(studentsData);
      setFilteredStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    navigate(`/student-portal/${student.id}`);
    onClose();
  };

  const getStudentDisplayName = (student: Student) => {
    if (student.user) {
      return `${student.user.first_name} ${student.user.last_name}`;
    }
    return `${student.first_name || 'Unknown'} ${student.last_name || 'Student'}`;
  };

  const getStudentEmail = (student: Student) => {
    return student.user?.email || student.email || 'N/A';
  };

  const getStudentPhone = (student: Student) => {
    return student.user?.phone || student.phone_number || 'N/A';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Select Student</DialogTitle>
          <DialogDescription>
            Choose a student to view their portal and manage their data.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, email, or student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Students List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading students...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No students available.'}
                </p>
              </div>
            ) : (
              filteredStudents.map((student) => (
                <Card 
                  key={student.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleStudentSelect(student)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {getStudentDisplayName(student)}
                          </h3>
                          {student.student_id && (
                            <Badge variant="secondary" className="text-xs">
                              ID: {student.student_id}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{getStudentEmail(student)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{getStudentPhone(student)}</span>
                          </div>
                          {student.studio?.studio_number && (
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              <span>Studio {student.studio.studio_number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Portal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
