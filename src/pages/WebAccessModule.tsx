import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WebAccessOverview from '@/components/web-access/WebAccessOverview';
import WebAccessReservations from '@/components/web-access/WebAccessReservations';
import WebAccessGradePages from '@/components/web-access/WebAccessGradePages';
import StaffAgreements from '@/components/web-access/StaffAgreements';
import Subscribers from '@/components/web-access/Subscribers';
import NotFound from './NotFound';

const WebAccessModule = () => {
  return (
    <Routes>
      <Route path="/" element={<WebAccessOverview />} />
      <Route path="/reservations" element={<WebAccessReservations />} />
      <Route path="/grade-pages" element={<WebAccessGradePages />} />
      <Route path="/agreements" element={<StaffAgreements />} />
      <Route path="/subscribers" element={<Subscribers />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default WebAccessModule;
