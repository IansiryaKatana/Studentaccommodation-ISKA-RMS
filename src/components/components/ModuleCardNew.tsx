import { LucideIcon } from "lucide-react";
import { useModuleStyles } from "@/contexts/ModuleStylesContext";

interface ModuleCardNewProps {
  icon: LucideIcon;
  title: string;
  description: string;
  moduleName: string;
  onClick: () => void;
  notificationCount?: number;
}

export const ModuleCardNew = ({ 
  icon: Icon, 
  title, 
  description, 
  moduleName,
  onClick,
  notificationCount
}: ModuleCardNewProps) => {
  const { getModuleGradient } = useModuleStyles();
  const gradient = getModuleGradient(moduleName);

  return (
    <div 
      onClick={onClick}
      className="relative bg-card rounded-xl p-4 border-2 transition-all duration-300 cursor-pointer group overflow-hidden"
      style={{
        // Default gradient border
        background: `linear-gradient(white, white) padding-box, ${gradient} border-box`,
        border: '2px solid transparent',
      }}
    >
      {/* Full card gradient overlay on hover */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
        style={{ background: gradient }}
      />
      
      <div className="relative flex items-start gap-3 z-10">
        <div 
          className="p-2 rounded-lg bg-secondary group-hover:bg-white/20 transition-all duration-300 relative"
        >
          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-white transition-colors relative z-10" />
          
          {/* Notification badge */}
          {notificationCount !== undefined && notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
              {notificationCount > 99 ? '99+' : notificationCount}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1 group-hover:text-white transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground group-hover:text-white/90 transition-colors">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

