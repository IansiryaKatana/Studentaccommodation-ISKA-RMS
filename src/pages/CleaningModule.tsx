
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CleaningOverview from '@/components/cleaning/CleaningOverview';

const CleaningModule = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={
          <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <CleaningOverview />
          </main>
        } />
      </Routes>
    </div>
  );
};

export default CleaningModule;
