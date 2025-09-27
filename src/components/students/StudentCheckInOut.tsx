import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  LogIn, 
  LogOut, 
  User, 
  Key, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Building,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import { format } from 'date-fns';

interface Student {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  studio_id?: string;
  studio?: {
    studio_number: string;
    room_grade?: {
      name: string;
    };
  };
  check_in_date?: string;
  check_out_date?: string;
  status: 'pending' | 'checked_in' | 'checked_out';
}

const StudentCheckInOut = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('checkin');
  
  // Check-in/out form state
  const [formData, setFormData] = useState({
    keyNumber: '',
    damageNotes: '',
    cleaningNotes: '',
    hasDeposit: false,
    depositAmount: 0,
    roomCondition: 'good' // good, fair, poor
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const studentsData = await ApiService.getStudents();
      // Filter and transform data for check-in/out purposes
      const transformedStudents = studentsData.map(student => ({
        ...student,
        status: student.check_in_date ? 'checked_in' : 'pending'
      }));
      setStudents(transformedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    if (!student.user) return false;
    const fullName = `${student.user.first_name || ''} ${student.user.last_name || ''}`.toLowerCase();
    const email = (student.user.email || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  const pendingCheckIns = filteredStudents.filter(s => s.status === 'pending');
  const checkedInStudents = filteredStudents.filter(s => s.status === 'checked_in');

  const handleCheckIn = async () => {
    if (!selectedStudent) return;

    try {
      // TODO: Implement check-in API call
      await ApiService.updateStudent(selectedStudent.id, {
        check_in_date: new Date().toISOString(),
        status: 'checked_in',
        key_number: formData.keyNumber,
        check_in_notes: formData.cleaningNotes
      });

      toast({
        title: "Success",
        description: `${selectedStudent.user?.first_name || 'Student'} ${selectedStudent.user?.last_name || ''} checked in successfully`,
      });

      // Reset form and refresh data
      setFormData({
        keyNumber: '',
        damageNotes: '',
        cleaningNotes: '',
        hasDeposit: false,
        depositAmount: 0,
        roomCondition: 'good'
      });
      setSelectedStudent(null);
      fetchStudents();
    } catch (error) {
      console.error('Error during check-in:', error);
      toast({
        title: "Error",
        description: "Failed to check in student",
        variant: "destructive",
      });
    }
  };

  const handleCheckOut = async () => {
    if (!selectedStudent) return;

    try {
      // TODO: Implement check-out API call
      await ApiService.updateStudent(selectedStudent.id, {
        check_out_date: new Date().toISOString(),
        status: 'checked_out',
        check_out_notes: formData.damageNotes,
        room_condition: formData.roomCondition
      });

      // Update studio status to vacant
      if (selectedStudent.studio_id) {
        try {
          await ApiService.updateStudioToVacant(selectedStudent.studio_id);
          console.log('Studio status updated to vacant');
        } catch (studioError) {
          console.error('Error updating studio status:', studioError);
          // Don't fail the entire process if studio status update fails
        }
      }

      toast({
        title: "Success",
        description: `${selectedStudent.user?.first_name || 'Student'} ${selectedStudent.user?.last_name || ''} checked out successfully`,
      });

      // Reset form and refresh data
      setFormData({
        keyNumber: '',
        damageNotes: '',
        cleaningNotes: '',
        hasDeposit: false,
        depositAmount: 0,
        roomCondition: 'good'
      });
      setSelectedStudent(null);
      fetchStudents();
    } catch (error) {
      console.error('Error during check-out:', error);
      toast({
        title: "Error",
        description: "Failed to check out student",
        variant: "destructive",
      });
    }
  };

  const renderStudentCard = (student: Student, showCheckInButton: boolean = false) => (
    <Card 
      key={student.id} 
      className={`cursor-pointer transition-colors ${
        selectedStudent?.id === student.id ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => setSelectedStudent(student)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <div className="font-medium">
                {student.user?.first_name || 'Unknown'} {student.user?.last_name || 'Student'}
              </div>
              <div className="text-sm text-gray-500">{student.user?.email || 'No email'}</div>
              {student.studio && (
                <div className="text-sm text-blue-600">
                  Studio: {student.studio.studio_number}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <Badge 
              variant={student.status === 'checked_in' ? 'default' : 'secondary'}
            >
              {student.status === 'checked_in' ? 'Checked In' : 'Pending'}
            </Badge>
            {student.check_in_date && (
              <div className="text-xs text-gray-500 mt-1">
                Checked in: {format(new Date(student.check_in_date), 'MMM d, yyyy')}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Check-in/Check-out</h1>
        <p className="text-gray-600 mt-1">Process student arrivals and departures</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Selection */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="checkin">
                <LogIn className="h-4 w-4 mr-2" />
                Check-in ({pendingCheckIns.length})
              </TabsTrigger>
              <TabsTrigger value="checkout">
                <LogOut className="h-4 w-4 mr-2" />
                Check-out ({checkedInStudents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="checkin" className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8">Loading students...</div>
              ) : pendingCheckIns.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No students pending check-in
                </div>
              ) : (
                pendingCheckIns.map(student => renderStudentCard(student, true))
              )}
            </TabsContent>

            <TabsContent value="checkout" className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8">Loading students...</div>
              ) : checkedInStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No students available for check-out
                </div>
              ) : (
                checkedInStudents.map(student => renderStudentCard(student))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Check-in/out Form */}
        <div>
          {selectedStudent ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {activeTab === 'checkin' ? (
                    <LogIn className="h-5 w-5 text-green-600" />
                  ) : (
                    <LogOut className="h-5 w-5 text-red-600" />
                  )}
                  {activeTab === 'checkin' ? 'Check-in' : 'Check-out'}: {selectedStudent.user?.first_name || 'Unknown'} {selectedStudent.user?.last_name || 'Student'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Student Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Email:</span> {selectedStudent.user?.email || 'No email'}
                    </div>
                    <div>
                      <span className="font-medium">Studio:</span> {selectedStudent.studio?.studio_number || 'Not assigned'}
                    </div>
                  </div>
                </div>

                {activeTab === 'checkin' ? (
                  // Check-in form
                  <>
                    <div>
                      <Label htmlFor="keyNumber">Room Key Number *</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Key className="h-4 w-4 text-gray-400" />
                        <Input
                          id="keyNumber"
                          value={formData.keyNumber}
                          onChange={(e) => setFormData({...formData, keyNumber: e.target.value})}
                          placeholder="Enter key number"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cleaningNotes">Room Condition Notes</Label>
                      <Textarea
                        id="cleaningNotes"
                        value={formData.cleaningNotes}
                        onChange={(e) => setFormData({...formData, cleaningNotes: e.target.value})}
                        placeholder="Note any pre-existing conditions or issues..."
                        rows={3}
                      />
                    </div>

                    <Button 
                      onClick={handleCheckIn}
                      className="w-full"
                      disabled={!formData.keyNumber}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Check-in
                    </Button>
                  </>
                ) : (
                  // Check-out form
                  <>
                    <div>
                      <Label htmlFor="roomCondition">Room Condition *</Label>
                      <select
                        id="roomCondition"
                        value={formData.roomCondition}
                        onChange={(e) => setFormData({...formData, roomCondition: e.target.value})}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="good">Good - No issues</option>
                        <option value="fair">Fair - Minor issues</option>
                        <option value="poor">Poor - Significant damage</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="damageNotes">Damage/Issues Report</Label>
                      <Textarea
                        id="damageNotes"
                        value={formData.damageNotes}
                        onChange={(e) => setFormData({...formData, damageNotes: e.target.value})}
                        placeholder="Describe any damage or issues found..."
                        rows={4}
                      />
                    </div>

                    {formData.roomCondition === 'poor' && (
                      <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-red-800">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="font-medium">Damage Reported</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          Please ensure detailed damage notes are provided and notify maintenance.
                        </p>
                      </div>
                    )}

                    <Button 
                      onClick={handleCheckOut}
                      className="w-full"
                      variant={formData.roomCondition === 'poor' ? 'destructive' : 'default'}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Check-out
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a student to begin {activeTab === 'checkin' ? 'check-in' : 'check-out'}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCheckInOut;