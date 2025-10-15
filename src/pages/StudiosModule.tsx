import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudiosOverview from '@/components/studios/StudiosOverview';
import StudiosList from '@/components/studios/StudiosList';
import AddStudio from '@/components/studios/AddStudio';
import StudioDetail from '@/components/studios/StudioDetail';
import EditStudio from '@/components/studios/EditStudio';
import CleaningOverview from '@/components/studios/cleaning/CleaningOverview';
import NotFound from './NotFound';

const StudiosModule = () => {
  return (
    <Routes>
      <Route path="/" element={<StudiosOverview />} />
      <Route path="/list" element={<StudiosList />} />
      <Route path="/add" element={<AddStudio />} />
      <Route path="/cleaning" element={<CleaningOverview />} />
      <Route path="/:id" element={<StudioDetail />} />
      <Route path="/:id/edit" element={<EditStudio />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default StudiosModule;
