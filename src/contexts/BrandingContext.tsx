import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Branding, ApiService } from '@/services/api';

interface BrandingContextType {
  branding: Branding | null;
  isLoading: boolean;
  updateBranding: (updates: Partial<Branding>) => Promise<void>;
  refreshBranding: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

interface BrandingProviderProps {
  children: ReactNode;
}

export const BrandingProvider: React.FC<BrandingProviderProps> = ({ children }) => {
  const [branding, setBranding] = useState<Branding | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBranding = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getBranding();
      setBranding(data);
    } catch (error) {
      console.error('Error fetching branding:', error);
      // Set default branding if none exists
      setBranding({
        id: 'default',
        company_name: 'ISKA - RMS',
        dashboard_title: 'ISKA - RMS',
        dashboard_subtitle: 'Worldclass Student accommodation CRM',
        primary_color: '#3B82F6',
        secondary_color: '#1F2937',
        accent_color: '#10B981',
        font_family: 'Inter',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBranding = async (updates: Partial<Branding>) => {
    try {
      if (!branding) return;
      
      const updatedBranding = await ApiService.updateBranding(updates);
      setBranding(updatedBranding);
    } catch (error) {
      console.error('Error updating branding:', error);
      throw error;
    }
  };

  const refreshBranding = async () => {
    await fetchBranding();
  };

  useEffect(() => {
    fetchBranding();
  }, []);

  return (
    <BrandingContext.Provider value={{
      branding,
      isLoading,
      updateBranding,
      refreshBranding
    }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = (): BrandingContextType => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
