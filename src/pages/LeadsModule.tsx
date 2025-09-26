
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LeadsList from '@/components/leads/LeadsList';
import LeadDetail from '@/components/leads/LeadDetail';
import AddLead from '@/components/leads/AddLead';
import LeadSources from '@/components/leads/LeadSources';
import LeadStatuses from '@/components/leads/LeadStatuses';
import FollowUps from '@/components/leads/FollowUps';
import LeadsCSVImport from '@/components/data/LeadsCSVImport';
import GetCallbackLeads from '@/components/leads/GetCallbackLeads';
import BookedViewingLeads from '@/components/leads/BookedViewingLeads';

const LeadsModule = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route index element={<LeadsList />} />
        <Route path="new" element={<AddLead />} />
        <Route path="import" element={<LeadsCSVImport />} />
        <Route path="website/callback" element={<GetCallbackLeads />} />
        <Route path="website/viewing" element={<BookedViewingLeads />} />
        <Route path="sources" element={<LeadSources />} />
        <Route path="statuses" element={<LeadStatuses />} />
        <Route path="follow-ups" element={<FollowUps />} />
        <Route path=":id" element={<LeadDetail />} />
      </Routes>
    </div>
  );
};

export default LeadsModule;
