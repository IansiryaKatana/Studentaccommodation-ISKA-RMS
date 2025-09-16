
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LeadsList from '@/components/leads/LeadsList';
import LeadDetail from '@/components/leads/LeadDetail';
import AddLead from '@/components/leads/AddLead';
import LeadSources from '@/components/leads/LeadSources';
import LeadStatuses from '@/components/leads/LeadStatuses';
import FollowUps from '@/components/leads/FollowUps';

const LeadsModule = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route index element={<LeadsList />} />
        <Route path="new" element={<AddLead />} />
        <Route path="sources" element={<LeadSources />} />
        <Route path="statuses" element={<LeadStatuses />} />
        <Route path="follow-ups" element={<FollowUps />} />
        <Route path=":id" element={<LeadDetail />} />
      </Routes>
    </div>
  );
};

export default LeadsModule;
