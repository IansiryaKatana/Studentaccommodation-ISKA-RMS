import { ModuleCard } from "./ModuleCard";
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

const modules = [
  {
    icon: Users,
    title: "Leads",
    description: "Manage customer leads and prospects"
  },
  {
    icon: GraduationCap,
    title: "Students",
    description: "Manage student records and accommodations"
  },
  {
    icon: Plane,
    title: "OTA Bookings",
    description: "Handle online travel agency bookings"
  },
  {
    icon: Sparkles,
    title: "Cleaning",
    description: "Schedule and track cleaning tasks"
  },
  {
    icon: Database,
    title: "Data Management",
    description: "Configure system data and settings"
  },
  {
    icon: DollarSign,
    title: "Finance",
    description: "Manage payments and financial records"
  },
  {
    icon: Settings,
    title: "Settings",
    description: "System preferences and user management"
  },
  {
    icon: UserCircle,
    title: "Student Portal",
    description: "Student self-service and management"
  },
  {
    icon: Building2,
    title: "Studios",
    description: "Manage studio accommodations and availability"
  },
  {
    icon: Globe,
    title: "Web Access",
    description: "Manage web-based access and public pages"
  },
  {
    icon: Palette,
    title: "Branding",
    description: "Manage visual identity and module styling"
  },
  {
    icon: Megaphone,
    title: "Comms & Marketing",
    description: "Manage communications and marketing activities"
  }
];

interface ModuleListProps {
  searchQuery?: string;
}

export const ModuleList = ({ searchQuery = "" }: ModuleListProps) => {
  const filteredModules = modules.filter(module => 
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">All Modules</h3>
      </div>
      
      {/* Container height calculated to show exactly 6 modules at a time */}
      {/* Each module card is ~86px (p-4 + content), plus 12px gap between cards = 98px per module */}
      {/* 6 modules = 6 * 86px + 5 * 12px (gaps) = 516px + 60px = 576px */}
      <div className="overflow-y-auto space-y-3 pr-2 scrollbar-hide" style={{ height: '576px' }}>
        {filteredModules.map((module, index) => (
          <ModuleCard
            key={index}
            icon={module.icon}
            title={module.title}
            description={module.description}
          />
        ))}
      </div>
    </div>
  );
};
