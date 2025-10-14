
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SettingsOverview from '@/components/settings/SettingsOverview';
import UserManagement from '@/components/settings/UserManagement';
import UserDetail from '@/components/settings/UserDetail';
import AddUser from '@/components/settings/AddUser';
import EditUser from '@/components/settings/EditUser';
import SystemPreferences from '@/components/settings/SystemPreferences';
import ConfigManagement from '@/components/settings/ConfigManagement';
import StudentAccounts from '@/components/settings/StudentAccounts';
import ModuleAccessConfig from '@/components/settings/ModuleAccessConfig';
import BulkUploadStudents from '@/components/settings/BulkUploadStudents';
import LeadsSettings from '@/components/settings/LeadsSettings';
import WebhookManagement from '@/components/settings/WebhookManagement';

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
      <Route path="/config" element={<ConfigManagement />} />
      <Route path="/module-access" element={<ModuleAccessConfig />} />
      <Route path="/bulk-upload-students" element={<BulkUploadStudents />} />
      <Route path="/leads" element={<LeadsSettings />} />
      <Route path="/webhooks" element={<WebhookManagement />} />
    </Routes>
  );
};

export default SettingsModule;
