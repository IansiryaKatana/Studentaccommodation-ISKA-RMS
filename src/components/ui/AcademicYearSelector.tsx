import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYear, getAcademicYearDisplayName } from '@/contexts/AcademicYearContext';
import { Calendar, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AcademicYearSelectorProps {
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showIcon?: boolean;
  placeholder?: string;
}

export const AcademicYearSelector: React.FC<AcademicYearSelectorProps> = ({
  className,
  variant = 'default',
  showIcon = true,
  placeholder = 'Select Academic Year'
}) => {
  const {
    selectedAcademicYear,
    setSelectedAcademicYear,
    availableAcademicYears,
    isLoading
  } = useAcademicYear();

  const handleValueChange = (value: string) => {
    setSelectedAcademicYear(value);
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {showIcon && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <Select value={selectedAcademicYear} onValueChange={handleValueChange}>
        <SelectTrigger className={cn("w-auto border-0 bg-transparent shadow-none", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Years</SelectItem>
          {availableAcademicYears.map((year) => (
            <SelectItem key={year} value={year}>
              {getAcademicYearDisplayName(year)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {showIcon && <Calendar className="h-4 w-4 text-gray-500" />}
        <Select value={selectedAcademicYear} onValueChange={handleValueChange}>
          <SelectTrigger className="w-auto border-0 bg-transparent shadow-none">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {availableAcademicYears.map((year) => (
              <SelectItem key={year} value={year}>
                {getAcademicYearDisplayName(year)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {showIcon && <Calendar className="h-4 w-4 text-gray-500" />}
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">Academic Year</label>
        <Select value={selectedAcademicYear} onValueChange={handleValueChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {availableAcademicYears.map((year) => (
              <SelectItem key={year} value={year}>
                {getAcademicYearDisplayName(year)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
