
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ReservationsOverview from '@/components/reservations/ReservationsOverview';

import TouristsBookings from '@/components/reservations/TouristsBookings';
import AddTouristBooking from '@/components/reservations/AddTouristBooking';
import CalendarView from '@/components/reservations/CalendarView';
import CheckInOut from '@/components/reservations/CheckInOut';

import TouristDetail from '@/components/reservations/TouristDetail';
import TouristCheckInOut from '@/components/reservations/TouristCheckInOut';

const ReservationsModule = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route index element={<ReservationsOverview />} />

        <Route path="tourists" element={<TouristsBookings />} />
        <Route path="tourists/new" element={<AddTouristBooking />} />

        <Route path="tourists/:id" element={<TouristDetail />} />
        <Route path="tourists/:id/checkinout" element={<TouristCheckInOut />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="checkin" element={<CheckInOut />} />
      </Routes>
    </div>
  );
};

export default ReservationsModule;
