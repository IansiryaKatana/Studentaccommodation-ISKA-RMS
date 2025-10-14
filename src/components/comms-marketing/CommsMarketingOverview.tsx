import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Mail, 
  Users, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Send,
  Bell
} from 'lucide-react';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
import { DashboardGridSkeleton } from '@/components/ui/skeleton';

interface CommsMarketingStats {
  totalMaintenanceRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  totalStudents: number;
  activeStudents: number;
  newRequestsCount: number;
}

const CommsMarketingOverview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedAcademicYear } = useAcademicYear();
  const [stats, setStats] = useState<CommsMarketingStats>({
    totalMaintenanceRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    totalStudents: 0,
    activeStudents: 0,
    newRequestsCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mark maintenance requests as seen when component mounts
  useEffect(() => {
    const markAsSeen = async () => {
      try {
        await ApiService.markMaintenanceRequestsAsSeen();
        // Dispatch a custom event to update the dashboard counter
        window.dispatchEvent(new CustomEvent('maintenanceRequestsSeen'));
      } catch (error) {
        console.error('Error marking maintenance requests as seen:', error);
      }
    };

    markAsSeen();
  }, []);

  useEffect(() => {
    fetchStats();
  }, [selectedAcademicYear]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch maintenance requests, student data, and new requests count
      const [students, maintenanceRequests, newRequestsCount] = await Promise.all([
        ApiService.getStudentsWithDetails({ academicYear: selectedAcademicYear }),
        ApiService.getAllMaintenanceRequests(selectedAcademicYear),
        ApiService.getNewMaintenanceRequestsCount(selectedAcademicYear)
      ]);

      // Calculate maintenance request stats
      const totalMaintenanceRequests = maintenanceRequests.length;
      const pendingRequests = maintenanceRequests.filter(r => r.status === 'Pending').length;
      const inProgressRequests = maintenanceRequests.filter(r => r.status === 'In Progress').length;
      const completedRequests = maintenanceRequests.filter(r => r.status === 'Completed').length;

      setStats({
        totalMaintenanceRequests,
        pendingRequests,
        inProgressRequests,
        completedRequests,
        totalStudents: students.length,
        activeStudents: students.filter(s => s.user?.is_active).length,
        newRequestsCount
      });
    } catch (error) {
      console.error('Error fetching comms marketing stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch communication and marketing data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comms & Marketing</h1>
            <p className="text-gray-600">Manage communications and marketing activities</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardGridSkeleton cards={4} className="col-span-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comms & Marketing</h1>
          <p className="text-gray-600">Manage communications and marketing activities</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeStudents} active students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Requests</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMaintenanceRequests}</div>
            <p className="text-xs text-muted-foreground">
              Total requests submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedRequests}</div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/comms-marketing/email-templates')}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Templates
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/comms-marketing/student-segmentation')}
            >
              <Users className="h-4 w-4 mr-2" />
              Student Segmentation
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/comms-marketing/bulk-email-sender')}
            >
              <Send className="h-4 w-4 mr-2" />
              Bulk Email Sender
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/comms-marketing/automated-reminders')}
            >
              <Bell className="h-4 w-4 mr-2" />
              Automated Reminders
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/comms-marketing/email-analytics')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Email Analytics
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/comms-marketing/maintenance-requests')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Maintenance Requests
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/comms-marketing/analytics')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Student Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">No recent activity</p>
                  <p className="text-xs text-gray-500">Activity will appear here</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommsMarketingOverview;
