
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DataOverview from '@/components/data/DataOverview';
import AcademicYearsManagement from '@/components/data/AcademicYearsManagement';
import DurationsManagement from '@/components/data/DurationsManagement';
import RoomGradesManagement from '@/components/data/RoomGradesManagement';
import PricingMatrixManagement from '@/components/data/PricingMatrixManagement';
import InstallmentPlansManagement from '@/components/data/InstallmentPlansManagement';
import MaintenanceCategoriesManagement from '@/components/data/MaintenanceCategoriesManagement';
import StudentOptionFieldsManagement from '@/components/data/StudentOptionFieldsManagement';
import LeadOptionFieldsManagement from '@/components/data/LeadOptionFieldsManagement';
import BulkImportStudios from '@/components/data/BulkImportStudios';
import BulkImportLeads from '@/components/data/BulkImportLeads';
import BulkImportStudents from '@/components/data/BulkImportStudents';

const DataModule = () => {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<DataOverview />} />
        <Route path="/academic-years" element={<AcademicYearsManagement />} />
        <Route path="/durations" element={<DurationsManagement />} />
        <Route path="/room-grades" element={<RoomGradesManagement />} />
        <Route path="/pricing-matrix" element={<PricingMatrixManagement />} />
        <Route path="/installment-plans" element={<InstallmentPlansManagement />} />
        <Route path="/maintenance-categories" element={<MaintenanceCategoriesManagement />} />
        <Route path="/student-fields" element={<StudentOptionFieldsManagement />} />
        <Route path="/lead-fields" element={<LeadOptionFieldsManagement />} />
        <Route path="/bulk-import-studios" element={<BulkImportStudios />} />
        <Route path="/bulk-import-leads" element={<BulkImportLeads />} />
        <Route path="/bulk-import-students" element={<BulkImportStudents />} />
      </Routes>
    </div>
  );
};

export default DataModule;
