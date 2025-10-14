import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BrandingOverview from '@/components/branding/BrandingOverview';
import ModuleStylesManagement from '@/components/branding/ModuleStylesManagement';
import BrandingManagement from '@/components/branding/BrandingManagement';
import SystemPreferences from '@/components/branding/SystemPreferences';

const BrandingModule = () => {
  return (
    <Routes>
      <Route path="/" element={<BrandingOverview />} />
      <Route path="/module-styles" element={<ModuleStylesManagement />} />
      <Route path="/branding" element={<BrandingManagement />} />
      <Route path="/system-preferences" element={<SystemPreferences />} />
    </Routes>
  );
};

export default BrandingModule;

