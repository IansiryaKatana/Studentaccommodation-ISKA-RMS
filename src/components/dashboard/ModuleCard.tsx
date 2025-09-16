
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useModuleStyles } from '@/contexts/ModuleStylesContext';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  moduleName: string; // Changed from gradient to moduleName
  onClick: () => void;
  accessGranted: boolean;
  notificationCount?: number; // Optional notification counter
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon: Icon,
  moduleName,
  onClick,
  accessGranted,
  notificationCount
}) => {
  // Add safety check for ModuleStyles context
  let gradient = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'; // Default gradient
  try {
    const { getModuleGradient } = useModuleStyles();
    gradient = getModuleGradient(moduleName);
  } catch (error) {
    console.warn('ModuleStyles context not available, using default gradient:', error);
  }

  return (
    <Card
      className={`module-card cursor-pointer overflow-hidden border-0 ${
        !accessGranted ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={accessGranted ? onClick : undefined}
    >
      <div className="h-2" style={{ background: gradient }} />
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative p-3 rounded-xl bg-opacity-10" style={{ background: gradient }}>
            <Icon className="h-6 w-6 text-white" />
            {notificationCount !== undefined && (
              <div className={`absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ${
                notificationCount > 0 ? 'bg-red-500' : 'bg-green-500'
              }`}>
                {notificationCount > 99 ? '99+' : notificationCount}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {description}
            </p>
            {!accessGranted && (
              <p className="text-xs text-red-500 mt-2">
                Access restricted
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
