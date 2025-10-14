import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ApiService } from '@/services/api';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
import { DashboardHeader } from '@/components/components/DashboardHeader';
import { WelcomeSection } from '@/components/components/WelcomeSection';
import { DashboardModuleList } from '@/components/components/DashboardModuleList';
import { LogoutConfirmationDialog } from '@/components/auth/LogoutConfirmationDialog';
import StudentSelectionDialog from '@/components/dashboard/StudentSelectionDialog';

export default function NewDashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { selectedAcademicYear } = useAcademicYear();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [newMaintenanceRequestsCount, setNewMaintenanceRequestsCount] = useState(0);

  // Apply light theme on mount and clean up on unmount
  useEffect(() => {
    document.body.classList.add('new-dashboard-theme');
    
    return () => {
      document.body.classList.remove('new-dashboard-theme');
    };
  }, []);

  // Fetch maintenance requests count
  useEffect(() => {
    const fetchNewRequestsCount = async () => {
      try {
        const count = await ApiService.getNewMaintenanceRequestsCount(selectedAcademicYear);
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
  }, [selectedAcademicYear]);

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="new-dashboard-theme min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <DashboardHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        onLogoutClick={() => setShowLogoutDialog(true)}
      />
      
      <div className="container mx-auto px-8 max-w-[1600px] py-[100px]">
        <div className="flex gap-8 items-center">
          <div className="flex-1 flex items-center">
            <WelcomeSection onLogoutClick={() => setShowLogoutDialog(true)} />
          </div>
          
          <div className="w-[520px] flex-shrink-0">
            <DashboardModuleList 
              searchQuery={searchQuery}
              onModuleClick={handleModuleClick}
              newMaintenanceRequestsCount={newMaintenanceRequestsCount}
            />
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmationDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
      />

      {/* Student Selection Dialog */}
      <StudentSelectionDialog
        isOpen={showStudentDialog}
        onClose={() => setShowStudentDialog(false)}
      />
    </div>
  );
}


