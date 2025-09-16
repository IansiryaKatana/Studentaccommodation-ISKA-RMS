
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentsOverview from '@/components/students/StudentsOverview';
import StudentsList from '@/components/students/StudentsList';
import StudentDetail from '@/components/students/StudentDetail';
import AddStudentBooking from '@/components/students/AddStudentBooking';

import StudentCalendar from '@/components/students/StudentCalendar';
import StudentCheckInOut from '@/components/students/StudentCheckInOut';

const StudentsModule = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route index element={<StudentsOverview />} />
        <Route path="list" element={<StudentsList />} />
        <Route path="add-booking" element={<AddStudentBooking />} />

        <Route path="calendar" element={<StudentCalendar />} />
        <Route path="checkin-checkout" element={<StudentCheckInOut />} />
        <Route path=":id" element={<StudentDetail />} />
      </Routes>
    </div>
  );
};

export default StudentsModule;
