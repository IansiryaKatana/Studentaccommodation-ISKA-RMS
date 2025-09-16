import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiService } from '@/services/api';

interface ModuleStyle {
  id: string;
  module_name: string;
  gradient_start: string;
  gradient_end: string;
  is_active: boolean;
  created_at: string;
}

interface ModuleStylesContextType {
  moduleStyles: ModuleStyle[];
  getModuleStyle: (moduleName: string) => ModuleStyle | null;
  getModuleGradient: (moduleName: string) => string;
  refreshModuleStyles: () => Promise<void>;
  isLoading: boolean;
}

const ModuleStylesContext = createContext<ModuleStylesContextType | undefined>(undefined);

export const useModuleStyles = () => {
  const context = useContext(ModuleStylesContext);
  if (context === undefined) {
    throw new Error('useModuleStyles must be used within a ModuleStylesProvider');
  }
  return context;
};

interface ModuleStylesProviderProps {
  children: ReactNode;
}

export const ModuleStylesProvider: React.FC<ModuleStylesProviderProps> = ({ children }) => {
  const [moduleStyles, setModuleStyles] = useState<ModuleStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchModuleStyles = async () => {
    try {
      setIsLoading(true);
      const styles = await ApiService.getModuleStyles();
      setModuleStyles(styles);
    } catch (error) {
      console.error('Error fetching module styles:', error);
      // Set default styles to prevent context error
      setModuleStyles([
        {
          id: 'default',
          module_name: 'default',
          gradient_start: '#3b82f6',
          gradient_end: '#1d4ed8',
          is_active: true,
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getModuleStyle = (moduleName: string): ModuleStyle | null => {
    return moduleStyles.find(style => 
      style.module_name === moduleName && style.is_active
    ) || null;
  };

  const getModuleGradient = (moduleName: string): string => {
    const style = getModuleStyle(moduleName);
    if (style) {
      return `linear-gradient(135deg, ${style.gradient_start} 0%, ${style.gradient_end} 100%)`;
    }
    // Default gradient if no style is found
    return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
  };

  const refreshModuleStyles = async () => {
    await fetchModuleStyles();
  };

  useEffect(() => {
    fetchModuleStyles();
  }, []);

  const value: ModuleStylesContextType = {
    moduleStyles,
    getModuleStyle,
    getModuleGradient,
    refreshModuleStyles,
    isLoading
  };

  return (
    <ModuleStylesContext.Provider value={value}>
      {children}
    </ModuleStylesContext.Provider>
  );
};
