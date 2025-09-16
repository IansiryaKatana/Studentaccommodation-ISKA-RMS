import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus
} from 'lucide-react';
import { ApiService } from '@/services/api';

const StudentsOverview = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    assignedStudios: 0,
    pendingCheckIns: 0,
    totalRevenue: 0,
    completedPayments: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      // Use optimized query that includes studio details
      const students = await ApiService.getStudentsWithDetails();
      
      // Calculate basic stats
      const totalStudents = students.length;
      const activeStudents = students.filter(s => s.user?.is_active).length;
      const assignedStudios = students.filter(s => s.studio_id).length;
      const pendingCheckIns = students.filter(s => !s.checked_in).length;
      
      // Calculate revenue from invoices and reservations
      let totalRevenue = 0;
      let completedPayments = 0;
      
      try {
        // Get all invoices to calculate total revenue
        const allInvoices = await ApiService.getInvoices();
        
        // Get all student reservations to calculate revenue
        const allReservations = await ApiService.getReservations();
        const studentReservations = allReservations.filter(r => r.type === 'student');
        
        // Calculate total revenue from student reservations
        totalRevenue = studentReservations.reduce((sum, reservation) => {
          return sum + (reservation.total_amount || 0);
        }, 0);
        
        // Calculate completed payments from student-related invoices
        const studentInvoices = allInvoices.filter(invoice => {
          // Check if this invoice is for a student (either through reservation or direct student invoice)
          return studentReservations.some(res => res.id === invoice.reservation_id) || 
                 invoice.reservation_id === null; // Direct student invoices have null reservation_id
        });
        
        completedPayments = studentInvoices.filter(invoice => 
          invoice.status === 'completed'
        ).length;
        
        console.log('Revenue calculation:', {
          studentReservations: studentReservations.length,
          totalRevenue,
          studentInvoices: studentInvoices.length,
          completedPayments
        });
        
      } catch (error) {
        console.error('Error calculating revenue:', error);
        // Continue with basic stats even if revenue calculation fails
      }
      
             setStats({
         totalStudents,
         activeStudents,
         assignedStudios,
         pendingCheckIns,
         totalRevenue,
         completedPayments
       });

       // Get recent students for the table
       const sortedStudents = students
         .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
         .slice(0, 6);
       setRecentStudents(sortedStudents);
     } catch (error) {
       console.error('Error fetching student stats:', error);
     } finally {
       setIsLoading(false);
     }
   };



  const statsCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Students',
      value: stats.activeStudents,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Assigned Studios',
      value: stats.assignedStudios,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Revenue',
      value: `£${stats.totalRevenue.toLocaleString()}`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Completed Payments',
      value: stats.completedPayments,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending Check-ins',
      value: stats.pendingCheckIns,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students Overview</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className={`${stat.bgColor} border-0`}>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color} break-words`}>
                  {isLoading ? '...' : stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>



      {/* Recent Students Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Students</CardTitle>
            <Link to="/students/list">
              <Button variant="outline" size="sm">
                View All Students
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <p>Loading students...</p>
            </div>
          ) : recentStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No students found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Studio</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">
                        {student.user?.first_name || student.first_name 
                          ? `${student.user?.first_name || student.first_name} ${student.user?.last_name || student.last_name}`
                          : 'Student Name Not Set'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.user?.email || student.email || 'No email'}
                    </TableCell>
                    <TableCell>
                      {student.studio?.studio_number 
                        ? `Studio ${student.studio.studio_number}` 
                        : student.studio_id 
                          ? `Studio ${student.studio_id}` 
                          : 'Not assigned'
                      }
                    </TableCell>
                    <TableCell>
                      {new Date(student.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsOverview;