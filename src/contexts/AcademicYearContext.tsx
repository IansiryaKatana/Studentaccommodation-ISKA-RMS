import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiService } from '@/services/api';

interface AcademicYearContextType {
  selectedAcademicYear: string | 'all';
  setSelectedAcademicYear: (year: string | 'all') => void;
  availableAcademicYears: string[];
  isLoading: boolean;
  refreshAcademicYears: () => Promise<void>;
}

const AcademicYearContext = createContext<AcademicYearContextType | undefined>(undefined);

interface AcademicYearProviderProps {
  children: ReactNode;
}

export const AcademicYearProvider: React.FC<AcademicYearProviderProps> = ({ children }) => {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string | 'all'>('all');
  const [availableAcademicYears, setAvailableAcademicYears] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch available academic years from database
  const fetchAvailableAcademicYears = async () => {
    try {
      setIsLoading(true);
      
      // Get academic years from database
      const academicYears = await ApiService.getAcademicYears();
      
      // Filter only active academic years and extract names
      const activeYears = academicYears
        .filter(ay => ay.is_active)
        .map(ay => ay.name);
      
      // Sort academic years (newest first based on start date)
      const sortedYears = activeYears.sort((a, b) => {
        // Try to extract year from name for sorting
        const yearA = parseInt(a.split('/')[0]) || 0;
        const yearB = parseInt(b.split('/')[0]) || 0;
        return yearB - yearA;
      });
      
      setAvailableAcademicYears(sortedYears);
      
      // Set default to current academic year if none selected
      if (selectedAcademicYear === 'all') {
        const currentYear = academicYears.find(ay => ay.is_current && ay.is_active);
        if (currentYear) {
          setSelectedAcademicYear(currentYear.name);
        } else if (sortedYears.length > 0) {
          setSelectedAcademicYear(sortedYears[0]);
        }
      }
      
    } catch (error) {
      console.error('Error fetching academic years:', error);
      // Fallback to default years if API fails
      setAvailableAcademicYears(['2025/2026', '2026/2027']);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh academic years (useful when new students/durations are added)
  const refreshAcademicYears = async () => {
    await fetchAvailableAcademicYears();
  };

  // Load academic years on mount
  useEffect(() => {
    fetchAvailableAcademicYears();
  }, []);

  // Persist selected academic year in localStorage
  useEffect(() => {
    if (selectedAcademicYear !== 'all') {
      localStorage.setItem('selectedAcademicYear', selectedAcademicYear);
    }
  }, [selectedAcademicYear]);

  // Load persisted academic year on mount
  useEffect(() => {
    const persisted = localStorage.getItem('selectedAcademicYear');
    if (persisted && availableAcademicYears.includes(persisted)) {
      setSelectedAcademicYear(persisted);
    }
  }, [availableAcademicYears]);

  const value: AcademicYearContextType = {
    selectedAcademicYear,
    setSelectedAcademicYear,
    availableAcademicYears,
    isLoading,
    refreshAcademicYears
  };

  return (
    <AcademicYearContext.Provider value={value}>
      {children}
    </AcademicYearContext.Provider>
  );
};

export const useAcademicYear = (): AcademicYearContextType => {
  const context = useContext(AcademicYearContext);
  if (context === undefined) {
    throw new Error('useAcademicYear must be used within an AcademicYearProvider');
  }
  return context;
};

// Helper function to get academic year display name
export const getAcademicYearDisplayName = (year: string | 'all'): string => {
  if (year === 'all') return 'All Years';
  return year;
};

// Helper function to check if academic year is current
export const isCurrentAcademicYear = (year: string): boolean => {
  const currentYear = new Date().getFullYear();
  const yearStart = parseInt(year.split('/')[0]);
  return yearStart === currentYear;
};
