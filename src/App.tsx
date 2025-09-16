
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

import { MainLayout } from '@/components/layout/MainLayout';
import Dashboard from '@/components/dashboard/Dashboard';
import LeadsModule from '@/pages/LeadsModule';
import ReservationsModule from '@/pages/ReservationsModule';
import StudentsModule from '@/pages/StudentsModule';
import StudiosModule from '@/pages/StudiosModule';
import CleaningModule from '@/pages/CleaningModule';
import FinanceModule from '@/pages/FinanceModule';
import DataModule from '@/pages/DataModule';
import SettingsModule from '@/pages/SettingsModule';
import StudentPortal from '@/pages/StudentPortal';
import WebAccessModule from '@/pages/WebAccessModule';
import BrandingModule from '@/pages/BrandingModule';
import CommsMarketingModule from '@/components/comms-marketing/CommsMarketingModule';
import NotFound from '@/pages/NotFound';
import BookingPage from '@/components/public/BookingPage';

import { BrandingProvider } from '@/contexts/BrandingContext';
import { ModuleStylesProvider } from '@/contexts/ModuleStylesContext';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';

// Create a client with optimized caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      cacheTime: 10 * 60 * 1000, // 10 minutes - cache retention
      retry: 1, // Only retry once on failure
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false, // Don't refetch if data exists
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrandingProvider>
          <ModuleStylesProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/book" element={<BookingPage />} />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/leads/*" element={
                  <ProtectedRoute requiredModule="leads">
                    <MainLayout>
                      <LeadsModule />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/ota-bookings/*" element={
                  <ProtectedRoute requiredModule="ota-bookings">
                    <MainLayout>
                      <ReservationsModule />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/students/*" element={
                  <ProtectedRoute requiredModule="students">
                    <MainLayout>
                      <StudentsModule />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/studios/*" element={
                  <ProtectedRoute requiredModule="studios">
                    <MainLayout>
                      <StudiosModule />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/cleaning/*" element={
                  <ProtectedRoute requiredModule="cleaning">
                    <MainLayout>
                      <CleaningModule />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/finance/*" element={
                  <ProtectedRoute requiredModule="finance">
                    <MainLayout>
                      <FinanceModule />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/data/*" element={
                  <ProtectedRoute requiredModule="data">
                    <MainLayout>
                      <DataModule />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/*" element={
                  <ProtectedRoute requiredModule="settings">
                    <MainLayout>
                      <SettingsModule />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/web-access/*" element={
                  <ProtectedRoute requiredModule="web-access">
                    <MainLayout>
                      <WebAccessModule />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/branding/*" element={
                  <ProtectedRoute requiredModule="branding">
                    <MainLayout>
                      <BrandingModule />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/comms-marketing/*" element={
                  <ProtectedRoute requiredModule="comms-marketing">
                    <MainLayout>
                      <CommsMarketingModule />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/student-portal/:studentId/*" element={
                  <ProtectedRoute requiredRoles={['student', 'admin', 'super_admin', 'salesperson', 'reservationist', 'accountant', 'operations_manager']}>
                    <MainLayout>
                      <StudentPortal />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/student-portal" element={
                  <ProtectedRoute requiredRole="student">
                    <MainLayout>
                      <StudentPortal />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </Router>
          </ModuleStylesProvider>
        </BrandingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
