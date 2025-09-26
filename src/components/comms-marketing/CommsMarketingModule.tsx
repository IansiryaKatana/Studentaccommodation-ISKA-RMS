import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CommsMarketingOverview from './CommsMarketingOverview';
import MaintenanceRequests from './MaintenanceRequests';
import StudentAnalytics from './StudentAnalytics';
import EmailTemplateManager from './EmailTemplateManager';
import StudentSegmentation from './StudentSegmentation';
import BulkEmailSender from './BulkEmailSender';
import EmailAnalytics from './EmailAnalytics';
import AutomatedReminders from './AutomatedReminders';

const CommsMarketingModule = () => {
  return (
    <Routes>
      <Route path="/" element={<CommsMarketingOverview />} />
      <Route path="/maintenance-requests" element={<MaintenanceRequests />} />
      <Route path="/analytics" element={<StudentAnalytics />} />
      <Route path="/email-templates" element={<EmailTemplateManager />} />
      <Route path="/student-segmentation" element={<StudentSegmentation />} />
      <Route path="/bulk-email-sender" element={<BulkEmailSender />} />
      <Route path="/email-analytics" element={<EmailAnalytics />} />
      <Route path="/automated-reminders" element={<AutomatedReminders />} />
      <Route path="/marketing" element={<Navigate to="/comms-marketing/analytics" replace />} />
    </Routes>
  );
};

export default CommsMarketingModule;
