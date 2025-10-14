import { ModuleCardNew } from "./ModuleCardNew";
import { 
  Users, 
  GraduationCap, 
  Plane, 
  Sparkles, 
  Database, 
  DollarSign, 
  Settings, 
  UserCircle, 
  Building2, 
  Globe, 
  Palette, 
  Megaphone
} from "lucide-react";

interface Module {
  icon: any;
  title: string;
  description: string;
  moduleName: string;
  path: string;
  notificationCount?: number;
}

interface DashboardModuleListProps {
  searchQuery?: string;
  onModuleClick: (moduleName: string, path: string) => void;
  newMaintenanceRequestsCount?: number;
}

export const DashboardModuleList = ({ 
  searchQuery = "", 
  onModuleClick,
  newMaintenanceRequestsCount = 0
}: DashboardModuleListProps) => {
  
  const modules: Module[] = [
    {
      icon: Users,
      title: "Leads",
      description: "Manage customer leads and prospects",
      moduleName: "leads",
      path: "/leads"
    },
    {
      icon: GraduationCap,
      title: "Students",
      description: "Manage student records and accommodations",
      moduleName: "students",
      path: "/students"
    },
    {
      icon: Plane,
      title: "OTA Bookings",
      description: "Handle online travel agency bookings",
      moduleName: "ota-bookings",
      path: "/ota-bookings"
    },
    {
      icon: Sparkles,
      title: "Cleaning",
      description: "Schedule and track cleaning tasks",
      moduleName: "cleaning",
      path: "/cleaning"
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Configure system data and settings",
      moduleName: "data",
      path: "/data"
    },
    {
      icon: DollarSign,
      title: "Finance",
      description: "Manage payments and financial records",
      moduleName: "finance",
      path: "/finance"
    },
    {
      icon: Settings,
      title: "Settings",
      description: "System preferences and user management",
      moduleName: "settings",
      path: "/settings"
    },
    {
      icon: UserCircle,
      title: "Student Portal",
      description: "Student self-service and management",
      moduleName: "student-portal",
      path: "/student-portal"
    },
    {
      icon: Building2,
      title: "Studios",
      description: "Manage studio accommodations and availability",
      moduleName: "studios",
      path: "/studios"
    },
    {
      icon: Globe,
      title: "Web Access",
      description: "Manage web-based access and public pages",
      moduleName: "web-access",
      path: "/web-access"
    },
    {
      icon: Palette,
      title: "Branding",
      description: "Manage visual identity and module styling",
      moduleName: "branding",
      path: "/branding"
    },
    {
      icon: Megaphone,
      title: "Comms & Marketing",
      description: "Manage communications and marketing activities",
      moduleName: "comms-marketing",
      path: "/comms-marketing",
      notificationCount: newMaintenanceRequestsCount
    }
  ];

  const filteredModules = modules.filter(module => 
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">All Modules</h3>
        <span className="text-sm text-muted-foreground">
          {filteredModules.length} {filteredModules.length === 1 ? 'module' : 'modules'}
        </span>
      </div>
      
      {/* Container height calculated to show exactly 6 modules at a time */}
      {/* Each module card is ~86px (p-4 + content), plus 12px gap between cards = 98px per module */}
      {/* 6 modules = 6 * 86px + 5 * 12px (gaps) = 516px + 60px = 576px */}
      <div className="overflow-y-auto space-y-3 pr-2 scrollbar-hide" style={{ height: '576px' }}>
        {filteredModules.length > 0 ? (
          filteredModules.map((module, index) => (
            <ModuleCardNew
              key={index}
              icon={module.icon}
              title={module.title}
              description={module.description}
              moduleName={module.moduleName}
              onClick={() => onModuleClick(module.moduleName, module.path)}
              notificationCount={module.notificationCount}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
              No modules found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


