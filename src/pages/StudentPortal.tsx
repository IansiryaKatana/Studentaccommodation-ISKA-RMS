
import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import StudentOverview from '@/components/student-portal/StudentOverview';
import StudentPayments from '@/components/student-portal/StudentPayments';
import StudentProfile from '@/components/student-portal/StudentProfile';
import StudentDocuments from '@/components/student-portal/StudentDocuments';
import StudentMaintenance from '@/components/student-portal/StudentMaintenance';
import StudentAgreements from '@/components/student-portal/StudentAgreements';
import StudentRebooking from '@/components/student-portal/StudentRebooking';
import { initializeStripe } from '@/integrations/stripe/client';

const stripePromise = initializeStripe();

const StudentPortal = () => {
  const { studentId } = useParams();

  // Use the provided student ID - no fallback to demo ID
  const actualStudentId = studentId;

  // If no student ID is provided, show an error
  if (!studentId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Student Portal Access Error</h1>
          <p className="text-gray-600 mb-4">No student ID provided. Please access the Student Portal through the Students module.</p>
          <p className="text-sm text-gray-500">Expected URL format: /student-portal/[student-id]/payments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route index element={<StudentOverview studentId={actualStudentId} />} />
        <Route path="payments" element={
          <Elements stripe={stripePromise}>
            <StudentPayments studentId={actualStudentId} />
          </Elements>
        } />
        <Route path="profile" element={<StudentProfile studentId={actualStudentId} />} />
        <Route path="documents" element={<StudentDocuments studentId={actualStudentId} />} />
        <Route path="maintenance" element={<StudentMaintenance studentId={actualStudentId} />} />
        <Route path="agreements" element={<StudentAgreements studentId={actualStudentId} />} />
        <Route path="rebooking" element={
          <Elements stripe={stripePromise}>
            <StudentRebooking studentId={actualStudentId} />
          </Elements>
        } />
      </Routes>
    </div>
  );
};

export default StudentPortal;
