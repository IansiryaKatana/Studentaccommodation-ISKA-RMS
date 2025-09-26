
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleCard from './ModuleCard';
import StudentSelectionDialog from './StudentSelectionDialog';
import './Dashboard.css';
import { useBranding } from '@/contexts/BrandingContext';
import { ApiService } from '@/services/api';
import { 
  Users, 
  Calendar, 
  Sparkles, 
  DollarSign, 
  Database, 
  Settings,
  GraduationCap,
  Building,
  Globe,
  Palette,
  MessageSquare
} from 'lucide-react';
import { DashboardGridSkeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const navigate = useNavigate();
  const { branding, isLoading } = useBranding();
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [newMaintenanceRequestsCount, setNewMaintenanceRequestsCount] = useState(0);

  const handleModuleClick = async (moduleName: string, path: string) => {
    if (moduleName === 'student-portal') {
      setShowStudentDialog(true);
    } else {
      // Reset maintenance requests counter when opening Comms & Marketing module
      if (moduleName === 'comms-marketing') {
        setNewMaintenanceRequestsCount(0);
        try {
          await ApiService.markMaintenanceRequestsAsSeen();
        } catch (error) {
          console.error('Error marking maintenance requests as seen:', error);
        }
      }
      navigate(path);
    }
  };

  useEffect(() => {
    const fetchNewRequestsCount = async () => {
      try {
        const count = await ApiService.getNewMaintenanceRequestsCount();
        setNewMaintenanceRequestsCount(count);
      } catch (error) {
        console.error('Error fetching new maintenance requests count:', error);
      }
    };

    fetchNewRequestsCount();
    
    // Refresh the count every 30 seconds
    const interval = setInterval(fetchNewRequestsCount, 30000);
    
    // Listen for maintenance requests seen event
    const handleMaintenanceRequestsSeen = () => {
      setNewMaintenanceRequestsCount(0);
    };

    window.addEventListener('maintenanceRequestsSeen', handleMaintenanceRequestsSeen);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('maintenanceRequestsSeen', handleMaintenanceRequestsSeen);
    };
  }, []);

  const modules = [
    // Row 1: Leads, Students, OTA Bookings, Cleaning
    {
      title: 'Leads',
      description: 'Manage customer leads and prospects',
      icon: Users,
      path: '/leads',
      moduleName: 'leads',
      accessGranted: true
    },
    {
      title: 'Students',
      description: 'Manage student records and accommodations',
      icon: Users,
      path: '/students',
      moduleName: 'students',
      accessGranted: true
    },
    {
      title: 'OTA Bookings',
      description: 'Handle online travel agency bookings',
      icon: Calendar,
      path: '/ota-bookings',
      moduleName: 'ota-bookings',
      accessGranted: true
    },
    {
      title: 'Cleaning',
      description: 'Schedule and track cleaning tasks',
      icon: Sparkles,
      path: '/cleaning',
      moduleName: 'cleaning',
      accessGranted: true
    },
    // Row 2: Data Management, Finance, Settings, Student Portal
    {
      title: 'Data Management',
      description: 'Configure system data and settings',
      icon: Database,
      path: '/data',
      moduleName: 'data',
      accessGranted: true
    },
    {
      title: 'Finance',
      description: 'Manage payments and financial records',
      icon: DollarSign,
      path: '/finance',
      moduleName: 'finance',
      accessGranted: true
    },
    {
      title: 'Settings',
      description: 'System preferences and user management',
      icon: Settings,
      path: '/settings',
      moduleName: 'settings',
      accessGranted: true
    },
    {
      title: 'Student Portal',
      description: 'Student self-service and management',
      icon: GraduationCap,
      path: '/student-portal',
      moduleName: 'student-portal',
      accessGranted: true
    },
    // Row 3: Studios, Web Access, Branding
    {
      title: 'Studios',
      description: 'Manage studio accommodations and availability',
      icon: Building,
      path: '/studios',
      moduleName: 'studios',
      accessGranted: true
    },
    {
      title: 'Web Access',
      description: 'Manage web-based access and public pages',
      icon: Globe,
      path: '/web-access',
      moduleName: 'web-access',
      accessGranted: true
    },
    {
      title: 'Branding',
      description: 'Manage visual identity and module styling',
      icon: Palette,
      path: '/branding',
      moduleName: 'branding',
      accessGranted: true
    },
    {
      title: 'Comms & Marketing',
      description: 'Manage communications and marketing activities',
      icon: MessageSquare,
      path: '/comms-marketing',
      moduleName: 'comms-marketing',
      accessGranted: true,
      notificationCount: newMaintenanceRequestsCount
    }
  ];

  return (
    <div className="h-screen dashboard-radial-bg flex flex-col justify-center items-center overflow-hidden">
      <div className="w-full max-w-7xl px-6 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isLoading ? 'Loading...' : branding?.dashboard_title || 'ISKA - RMS'}
          </h1>
          <p className="text-xl text-gray-600">
            {isLoading ? 'Loading...' : branding?.dashboard_subtitle || 'Worldclass Student accommodation CRM'}
          </p>
        </div>

        {/* Module Grid - 3 rows, 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <DashboardGridSkeleton cards={12} className="col-span-full" />
          ) : (
            modules.map((module) => (
              <ModuleCard
                key={module.path}
                title={module.title}
                description={module.description}
                icon={module.icon}
                onClick={() => handleModuleClick(module.moduleName, module.path)}
                moduleName={module.moduleName}
                accessGranted={module.accessGranted}
                notificationCount={module.notificationCount}
              />
            ))
          )}
        </div>
      </div>

      {/* Student Selection Dialog */}
      <StudentSelectionDialog 
        isOpen={showStudentDialog} 
        onClose={() => setShowStudentDialog(false)} 
      />
    </div>
  );
};

export default Dashboard;
