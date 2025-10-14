import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Branding, ApiService } from '@/services/api';
import { FaviconService } from '@/services/faviconService';
import { PageTitleService } from '@/services/pageTitleService';
import { CurrencyService } from '@/services/currencyService';
import { ThemeService } from '@/services/themeService';

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

  // Helper method to get locale from currency
  const getLocaleFromCurrency = (currency: string): string => {
    const currencyLocaleMap: Record<string, string> = {
      'USD': 'en-US',
      'GBP': 'en-GB', 
      'EUR': 'en-EU',
      'CAD': 'en-CA',
      'AUD': 'en-AU',
      'JPY': 'ja-JP',
      'CHF': 'de-CH',
      'SEK': 'sv-SE',
      'NOK': 'nb-NO',
      'DKK': 'da-DK'
    };
    return currencyLocaleMap[currency] || 'en-GB';
  };

  const fetchBranding = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getBranding();
      setBranding(data);
      
      // Update favicon when branding is loaded
      if (data?.favicon_url) {
        FaviconService.updateFavicon(data.favicon_url);
      }

      // Update page title and meta tags when branding is loaded
      PageTitleService.updatePageMeta(data);

      // Initialize currency service with branding preferences
      const currency = data?.currency || 'GBP';
      const locale = getLocaleFromCurrency(currency);
      CurrencyService.initialize(currency, locale);

      // Apply branding colors to CSS variables (theme)
      if (data?.primary_color) {
        ThemeService.applyBrandingColors(
          data.primary_color,
          data.secondary_color,
          data.accent_color
        );
      }
    } catch (error) {
      console.error('Error fetching branding:', error);
      // Set default branding if none exists
      setBranding({
        id: 'default',
        company_name: 'Property Management System',
        dashboard_title: 'Property Management System',
        dashboard_subtitle: 'Professional Property Management',
        primary_color: '#3B82F6',
        secondary_color: '#1F2937',
        accent_color: '#10B981',
        font_family: 'Inter',
        currency: 'GBP',
        timezone: 'Europe/London',
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
      
      // Update favicon if favicon_url was changed
      if (updates.favicon_url !== undefined) {
        FaviconService.updateFavicon(updates.favicon_url);
      }

      // Update page title and meta tags if relevant branding fields were changed
      if (updates.company_name !== undefined || 
          updates.dashboard_title !== undefined || 
          updates.dashboard_subtitle !== undefined ||
          updates.company_website !== undefined ||
          updates.logo_url !== undefined) {
        PageTitleService.updatePageMeta(updatedBranding);
      }

      // Update currency service if currency was changed
      if (updates.currency !== undefined) {
        const currency = updates.currency || 'GBP';
        const locale = getLocaleFromCurrency(currency);
        CurrencyService.initialize(currency, locale);
      }

      // Update theme colors if any color was changed
      if (updates.primary_color !== undefined || 
          updates.secondary_color !== undefined || 
          updates.accent_color !== undefined) {
        ThemeService.applyBrandingColors(
          updatedBranding.primary_color,
          updatedBranding.secondary_color,
          updatedBranding.accent_color
        );
      }
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
