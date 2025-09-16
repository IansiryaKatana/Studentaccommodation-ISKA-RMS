import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CommsMarketingOverview from './CommsMarketingOverview';
import MaintenanceRequests from './MaintenanceRequests';
import StudentAnalytics from './StudentAnalytics';

const CommsMarketingModule = () => {
  return (
    <Routes>
      <Route path="/" element={<CommsMarketingOverview />} />
      <Route path="/maintenance-requests" element={<MaintenanceRequests />} />
      <Route path="/analytics" element={<StudentAnalytics />} />
      <Route path="/marketing" element={<Navigate to="/comms-marketing/analytics" replace />} />
    </Routes>
  );
};

export default CommsMarketingModule;
