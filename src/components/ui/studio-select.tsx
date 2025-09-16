import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { ApiService } from '@/services/api';
import { Studio } from '@/services/api';

interface StudioSelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  error?: boolean;
  showOccupied?: boolean; // New prop to control whether to show occupied studios
}

interface StudioWithOccupancy extends Studio {
  currentReservation?: {
    student?: { 
      first_name?: string; 
      last_name?: string; 
      email?: string; 
      user?: { first_name: string; last_name: string; email: string } 
    };
    tourist?: { first_name: string; last_name: string; email: string };
  };
}

interface StudioOption {
  value: string;
  label: string;
  studio: StudioWithOccupancy;
  isOccupied: boolean;
}

const StudioSelect: React.FC<StudioSelectProps> = ({
  value,
  onChange,
  placeholder = "Select a studio",
  isDisabled = false,
  className = "",
  error = false,
  showOccupied = false
}) => {
  const [studios, setStudios] = useState<StudioWithOccupancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setLoading(true);
        setErrorState(null);
        
        if (showOccupied) {
          // Get all studios with occupancy information
          const allStudios = await ApiService.getAllStudiosWithOccupancy();
          setStudios(allStudios);
        } else {
          // Get only available studios
          const availableStudios = await ApiService.getAvailableStudios();
          setStudios(availableStudios);
        }
      } catch (err) {
        console.error('Error fetching studios:', err);
        setErrorState('Failed to load studios');
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();

    // Listen for studio status updates to refresh the list
    const handleStudioStatusUpdate = async (event: CustomEvent) => {
      console.log('StudioSelect: Received studio status update event:', event.detail);
      await fetchStudios(); // Refresh studios when status changes
    };

    window.addEventListener('studioStatusUpdated', handleStudioStatusUpdate as EventListener);
    
    return () => {
      window.removeEventListener('studioStatusUpdated', handleStudioStatusUpdate as EventListener);
    };
  }, [showOccupied]);

  const options: StudioOption[] = studios.map(studio => ({
    value: studio.id,
    label: `${studio.studio_number} - ${studio.floor !== null && studio.floor !== undefined 
      ? (studio.floor === 0 ? 'Ground floor' : `Floor ${studio.floor}`)
      : 'Ground floor'} (${studio.status === 'occupied' ? 'Occupied' : 'Available'})`,
    studio,
    isOccupied: studio.status === 'occupied'
  }));

  const selectedOption = options.find(option => option.value === value);

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: error ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: error ? '#ef4444' : '#3b82f6'
      },
      minHeight: '40px'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#3b82f6' 
        : state.isFocused 
        ? '#f3f4f6' 
        : 'white',
      color: state.isSelected ? 'white' : '#374151',
      cursor: 'pointer',
      padding: '12px 16px'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#374151'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af'
    }),
    input: (provided: any) => ({
      ...provided,
      color: '#374151'
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999
    })
  };

  const formatOptionLabel = (option: StudioOption) => {
    const isOccupied = option.isOccupied;
    const currentGuest = option.studio.currentReservation;
    
    let guestName = '';
    if (currentGuest) {
      if (currentGuest.student) {
        guestName = currentGuest.student.user 
          ? `${currentGuest.student.user.first_name} ${currentGuest.student.user.last_name}`
          : `${currentGuest.student.first_name} ${currentGuest.student.last_name}`;
      } else if (currentGuest.tourist) {
        guestName = `${currentGuest.tourist.first_name} ${currentGuest.tourist.last_name}`;
      }
    }

    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <span className="font-medium text-sm">{option.studio.studio_number}</span>
          <span className="text-xs text-gray-500">
            {option.studio.floor !== null && option.studio.floor !== undefined 
              ? (option.studio.floor === 0 ? 'Ground floor' : `Floor ${option.studio.floor}`)
              : 'Ground floor'}
          </span>
          {isOccupied && guestName && (
            <span className="text-xs text-gray-400">Occupied by: {guestName}</span>
          )}
        </div>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${isOccupied ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <span className={`text-xs font-medium ${isOccupied ? 'text-red-600' : 'text-green-600'}`}>
            {isOccupied ? 'Occupied' : 'Available'}
          </span>
        </div>
      </div>
    );
  };

  const formatGroupLabel = (data: any) => (
    <div className="flex items-center justify-between">
      <span className="font-medium text-sm">{data.label}</span>
      <span className="text-xs text-gray-500">{data.options.length} studios</span>
    </div>
  );

  if (loading) {
    return (
      <div className={`w-full h-10 bg-gray-100 animate-pulse rounded-md ${className}`} />
    );
  }

  if (errorState) {
    return (
      <div className={`w-full p-3 text-red-600 bg-red-50 border border-red-200 rounded-md ${className}`}>
        {errorState}
      </div>
    );
  }

  return (
    <Select
      value={selectedOption}
      onChange={(option) => onChange(option?.value || '')}
      options={options}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isLoading={loading}
      styles={customStyles}
      formatOptionLabel={formatOptionLabel}
      className={className}
      classNamePrefix="studio-select"
      isClearable={false}
      isSearchable={true}
      noOptionsMessage={() => "No available studios found"}
      filterOption={(option, inputValue) => {
        const studio = option.data.studio;
        const searchTerm = inputValue.toLowerCase();
        return (
          studio.studio_number.toLowerCase().includes(searchTerm) ||
          `floor ${studio.floor || 'g'}`.includes(searchTerm) ||
          (studio.status === 'occupied' ? 'occupied' : 'available').includes(searchTerm)
        );
      }}
      components={{
        IndicatorSeparator: () => null,
        DropdownIndicator: ({ children, ...props }) => {
          // Filter out React Select internal props to avoid DOM warnings
          const { 
            clearValue, getStyles, getClassNames, getValue, hasValue, 
            isMulti, isRtl, selectOption, selectProps, setValue, 
            innerProps, isDisabled, isFocused, cx, ...safeProps 
          } = props;
          
          return (
            <div {...safeProps} className="text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          );
        }
      }}
    />
  );
};

export default StudioSelect;
