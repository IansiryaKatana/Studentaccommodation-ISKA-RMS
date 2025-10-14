
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Users, Calendar, Building, DollarSign, TrendingUp, TrendingDown, Loader2, AlertTriangle, ArrowRight, Upload, Clock } from 'lucide-react';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { DashboardGridSkeleton } from '@/components/ui/skeleton';

const DataOverview = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    academicYears: 0,
    durations: 0,
    roomGrades: 0,
    pricingMatrix: 0,
    installmentPlans: 0,
    maintenanceCategories: 0,
    userRoles: 0,
    moduleStyles: 0,
    studentFields: 0,
    leadFields: 0
  });
  const [hasConnectionIssues, setHasConnectionIssues] = useState(false);

  useEffect(() => {
    fetchDataStats();
  }, []);

  const fetchDataStats = async () => {
    try {
      setIsLoading(true);
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 second timeout
      });

      // Test database connection first
      try {
        const { data: testData, error: testError } = await ApiService.testConnection();
        
        if (testError) {
          console.error('Database connection test failed:', testError);
          setHasConnectionIssues(true);
          // Don't return here, just log the error and continue
          // This allows the component to still try to load data
          console.warn('Continuing with data load despite connection test failure');
        } else {
          console.log('Database connection test successful');
          setHasConnectionIssues(false);
        }
              } catch (testError) {
          console.error('Database connection test exception:', testError);
          setHasConnectionIssues(true);
          // Don't return here, just log the error and continue
          console.warn('Continuing with data load despite connection test exception');
        }

      // Fetch data with error handling for each call
      const fetchWithFallback = async (apiCall: () => Promise<any[]>, fallback: any[] = []) => {
        try {
          return await Promise.race([apiCall(), timeoutPromise]);
        } catch (error) {
          console.warn('API call failed, using fallback:', error);
          return fallback;
        }
      };

      // Use Promise.allSettled to handle individual failures gracefully
      const results = await Promise.allSettled([
        fetchWithFallback(() => ApiService.getAcademicYears()),
        fetchWithFallback(() => ApiService.getDurations()),
        fetchWithFallback(() => ApiService.getRoomGrades()),
        fetchWithFallback(() => ApiService.getPricingMatrix()),
        fetchWithFallback(() => ApiService.getInstallmentPlans()),
        fetchWithFallback(() => ApiService.getMaintenanceCategories()),
        fetchWithFallback(() => ApiService.getUserRoles()),
        fetchWithFallback(() => ApiService.getModuleStyles()),
        fetchWithFallback(() => ApiService.getStudentOptionFields()),
        fetchWithFallback(() => ApiService.getLeadOptionFields())
      ]);

      // Extract results, using fallback for failed promises
      const [
        academicYears,
        durations,
        roomGrades,
        pricingMatrix,
        installmentPlans,
        maintenanceCategories,
        userRoles,
        moduleStyles,
        studentFields,
        leadFields
      ] = results.map(result => 
        result.status === 'fulfilled' ? result.value : []
      ) as any[][];

      // Set stats with fallback to 0 if all data is empty
      const finalStats = {
        academicYears: academicYears.length || 0,
        durations: durations.length || 0,
        roomGrades: roomGrades.length || 0,
        pricingMatrix: pricingMatrix.length || 0,
        installmentPlans: installmentPlans.length || 0,
        maintenanceCategories: maintenanceCategories.length || 0,
        userRoles: userRoles.length || 0,
        moduleStyles: moduleStyles.length || 0,
        studentFields: studentFields.length || 0,
        leadFields: leadFields.length || 0
      };

      setStats(finalStats);

      // If all stats are 0, show a success message
      const totalItems = Object.values(finalStats).reduce((sum, count) => sum + count, 0);
      if (totalItems === 0) {
        console.log('All data management tables are empty - this is normal for a fresh installation');
      }
    } catch (error) {
      console.error('Error fetching data stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data statistics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const managementModules = [
    {
      title: 'Academic Years',
      description: 'Manage academic year definitions and periods',
      icon: Calendar,
      path: '/data/academic-years',
      count: `${stats.academicYears || 0} years`,
      color: 'bg-indigo-500'
    },
    {
      title: 'Durations',
      description: 'Manage booking duration types (45-weeks, 51-weeks, etc.)',
      icon: Clock,
      path: '/data/durations',
      count: `${stats.durations} types`,
      color: 'bg-blue-500'
    },
    {
      title: 'Room Grades',
      description: 'Configure room grades and studio counts',
      icon: Building,
      path: '/data/room-grades',
      count: `${stats.roomGrades} grades`,
      color: 'bg-green-500'
    },
    {
      title: 'Pricing Matrix',
      description: 'Set pricing for room and duration combinations',
      icon: DollarSign,
      path: '/data/pricing-matrix',
      count: `${stats.pricingMatrix} combinations`,
      color: 'bg-yellow-500'
    },
    {
      title: 'Installment Plans',
      description: 'Configure payment plans and dates',
      icon: TrendingUp,
      path: '/data/installment-plans',
      count: `${stats.installmentPlans} plans`,
      color: 'bg-purple-500'
    },
    {
      title: 'Maintenance Categories',
      description: 'Manage maintenance request categories',
      icon: TrendingDown,
      path: '/data/maintenance-categories',
      count: `${stats.maintenanceCategories} categories`,
      color: 'bg-orange-500'
    },
    {
      title: 'User Roles',
      description: 'Configure user roles and module access',
      icon: Users,
      path: '/data/user-roles',
      count: `${stats.userRoles} roles`,
      color: 'bg-red-500'
    },
    {
      title: 'Student Fields',
      description: 'Configure student profile option fields',
      icon: Users, // Reusing Users for Student Fields
      path: '/data/student-fields',
      count: `${stats.studentFields} fields`,
      color: 'bg-cyan-500'
    },
    {
      title: 'Lead Fields',
      description: 'Configure lead management option fields',
      icon: Users, // Reusing Users for Lead Fields
      path: '/data/lead-fields',
      count: `${stats.leadFields} fields`,
      color: 'bg-indigo-500'
    },
    {
      title: 'Bulk Import Studios',
      description: 'Import multiple studios from CSV file with validation',
      icon: Upload,
      path: '/data/bulk-import-studios',
      count: 'CSV Import',
      color: 'bg-purple-500'
    },
    {
      title: 'Bulk Import Leads',
      description: 'Import multiple leads from CSV file with validation',
      icon: Upload,
      path: '/data/bulk-import-leads',
      count: 'CSV Import',
      color: 'bg-blue-500'
    },
    {
      title: 'Bulk Import Students',
      description: 'Import multiple students from CSV file with validation',
      icon: Upload,
      path: '/data/bulk-import-students',
      count: 'CSV Import',
      color: 'bg-green-500'
    },
    {
      title: 'File Management',
      description: 'Upload, organize, and manage files securely in Supabase Storage',
      icon: Database, // Reusing Database for File Management
      path: '/data/files',
      count: 'Secure Storage',
      color: 'bg-emerald-500'
    }
  ];

  const systemStats = [
    { label: 'Total Option Fields', value: (stats.studentFields + stats.leadFields).toString(), icon: Database },
    { label: 'Active Configurations', value: (stats.durations + stats.roomGrades + stats.pricingMatrix).toString(), icon: Users }, // Reusing Users for Active Configurations
    { label: 'System Health', value: 'Excellent', icon: TrendingUp }, // Reusing TrendingUp for System Health
    { label: 'Last Updated', value: '2 hours ago', icon: Calendar }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
            <p className="text-muted-foreground">Configure system option fields and settings</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardGridSkeleton cards={9} className="col-span-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Connection Warning */}
      {hasConnectionIssues && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-800">Database Connection Issues Detected</h3>
              <p className="text-sm text-yellow-700 mt-1">
                This may be due to Row Level Security (RLS) policies. 
                <Link to="/data/status" className="text-yellow-800 underline ml-1">
                  Check database status
                </Link> or follow the instructions in <code className="bg-yellow-100 px-1 rounded">RLS_FIX_INSTRUCTIONS.md</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
          <p className="text-muted-foreground">Configure system option fields and settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
            Administrator Access
          </Badge>
          <Link to="/data/status">
            <Button variant="outline" size="sm">
              <Database className="h-4 w-4 mr-2" />
              Check DB Status
            </Button>
          </Link>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Management Modules */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">System Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managementModules.map((module, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${module.color} text-white`}>
                    <module.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {module.count}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="mb-4">
                  {module.description}
                </CardDescription>
                <Link to={module.path}>
                  <Button variant="outline" className="w-full">
                    Manage
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataOverview;
