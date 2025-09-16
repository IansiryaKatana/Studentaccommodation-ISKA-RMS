
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SettingsOverview from '@/components/settings/SettingsOverview';
import UserManagement from '@/components/settings/UserManagement';
import UserDetail from '@/components/settings/UserDetail';
import AddUser from '@/components/settings/AddUser';
import EditUser from '@/components/settings/EditUser';
import SystemPreferences from '@/components/settings/SystemPreferences';
import SecuritySettings from '@/components/settings/SecuritySettings';
import IntegrationSettings from '@/components/settings/IntegrationSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import ConfigManagement from '@/components/settings/ConfigManagement';
import StudentAccounts from '@/components/settings/StudentAccounts';
import ModuleAccessConfig from '@/components/settings/ModuleAccessConfig';
import BulkUploadStudents from '@/components/settings/BulkUploadStudents';

const SettingsModule = () => {
  return (
    <Routes>
      <Route path="/" element={<SettingsOverview />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/users/new" element={<AddUser />} />
      <Route path="/users/:id" element={<UserDetail />} />
      <Route path="/users/:id/edit" element={<EditUser />} />
      <Route path="/student-accounts" element={<StudentAccounts />} />
      <Route path="/system" element={<SystemPreferences />} />
      <Route path="/security" element={<SecuritySettings />} />
      <Route path="/integrations" element={<IntegrationSettings />} />
      <Route path="/notifications" element={<NotificationSettings />} />
      <Route path="/config" element={<ConfigManagement />} />
      <Route path="/module-access" element={<ModuleAccessConfig />} />
      <Route path="/bulk-upload-students" element={<BulkUploadStudents />} />
    </Routes>
  );
};

export default SettingsModule;
