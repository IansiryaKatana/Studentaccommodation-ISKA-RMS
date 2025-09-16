
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CleaningOverview from '@/components/cleaning/CleaningOverview';
import DailySchedule from '@/components/cleaning/DailySchedule';
import CleanerManagement from '@/components/cleaning/CleanerManagement';
import CalendarView from '@/components/cleaning/CalendarView';

const CleaningModule = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={
          <div>
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/')}
                    className="mr-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <h1 className="text-xl font-semibold text-gray-900">Cleaning Module</h1>
                </div>
              </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <CleaningOverview />
            </main>
          </div>
        } />
        <Route path="/daily-schedule" element={<DailySchedule />} />
        <Route path="/cleaners" element={<CleanerManagement />} />
        <Route path="/calendar-view" element={<CalendarView />} />
      </Routes>
    </div>
  );
};

export default CleaningModule;
