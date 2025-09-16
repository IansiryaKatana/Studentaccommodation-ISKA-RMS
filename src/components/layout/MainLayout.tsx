
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Users,
  Calendar,
  UserCheck,
  Sparkles,
  DollarSign,
  Database,
  Settings,
  Home,
  Plus,
  Search,
  FileText,
  CreditCard,
  Building,
  User,
  Shield,
  Bell,
  Zap,
  BarChart,
  Download,
  HardDrive,
  UserPlus,
  MapPin,
  Clock,
  Palette,
  Wrench,
  ChevronDown,
  ChevronRight,
  Upload,
  Globe,
  Mail,
  MessageSquare,
  Receipt,
  BarChart3
} from 'lucide-react';
import { useModuleStyles } from '@/contexts/ModuleStylesContext';
import { useAuth, useModuleAccess } from '@/contexts/AuthContext';

// Define TypeScript interfaces
interface PageItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  hasSubmenu?: boolean;
  submenu?: SubmenuItem[];
  external?: boolean;
}

interface SubmenuItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ModuleRoute {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  basePath: string;
  gradient: string;
  pages: PageItem[];
}

interface MainLayoutProps {
  children: React.ReactNode;
}

interface SubmenuItemProps {
  page: PageItem;
  module: ModuleRoute;
  isActive: (path: string) => boolean;
  navigate: (path: string) => void;
  fullPath: string;
}

interface AppSidebarProps {
  // Props will be handled by auth context
}

const moduleRoutes: Record<string, ModuleRoute> = {
  leads: {
    icon: Users,
    title: 'Leads',
    basePath: '/leads',
    gradient: 'leads',
    pages: [
      { title: 'All Leads', path: '/leads', icon: Users },
      { title: 'Add Lead', path: '/leads/new', icon: Plus },
      { title: 'Lead Sources', path: '/leads/sources', icon: Search },
      { title: 'Lead Statuses', path: '/leads/statuses', icon: BarChart },
      { title: 'Follow-ups', path: '/leads/follow-ups', icon: FileText }
    ]
  },
  'ota-bookings': {
    icon: Calendar,
    title: 'OTA Bookings',
    basePath: '/ota-bookings',
    gradient: 'ota-bookings',
    pages: [
      { title: 'Overview', path: '/ota-bookings', icon: Calendar },
      { title: 'Tourists', path: '/ota-bookings/tourists', icon: MapPin },
      { title: 'Add Tourist Booking', path: '/ota-bookings/tourists/new', icon: Plus },
      { title: 'Calendar View', path: '/ota-bookings/calendar', icon: Calendar },
      { title: 'Check-in/out', path: '/ota-bookings/checkin', icon: UserCheck }
    ]
  },
  students: {
    icon: Users,
    title: 'Students',
    basePath: '/students',
    gradient: 'students',
    pages: [
      { title: 'Overview', path: '/students', icon: Users },
      { title: 'Students List', path: '/students/list', icon: Users },
      { title: 'Add Student Booking', path: '/students/add-booking', icon: Plus },
      { title: 'Calendar View', path: '/students/calendar', icon: Calendar },
      { title: 'Check-in/Check-out', path: '/students/checkin-checkout', icon: UserCheck }
    ]
  },
  studios: {
    icon: Building,
    title: 'Studios',
    basePath: '/studios',
    gradient: 'studios',
    pages: [
      { title: 'Overview', path: '/studios', icon: Building },
      { title: 'Studios List', path: '/studios/list', icon: Building },
      { title: 'Add Studio', path: '/studios/add', icon: Plus }
    ]
  },
  cleaning: {
    icon: Sparkles,
    title: 'Cleaning',
    basePath: '/cleaning',
    gradient: 'cleaning',
    pages: [
      { title: 'Overview', path: '/cleaning', icon: Sparkles },
      { title: 'Daily Schedule', path: '/cleaning/daily-schedule', icon: Calendar },
      { title: 'Cleaner Management', path: '/cleaning/cleaners', icon: Users },
      { title: 'Calendar View', path: '/cleaning/calendar-view', icon: Calendar }
    ]
  },
  finance: {
    icon: DollarSign,
    title: 'Finance',
    basePath: '/finance',
    gradient: 'finance',
    pages: [
      { title: 'Overview', path: '/finance', icon: DollarSign },
      { title: 'Tourist Invoices', path: '/finance/tourist-invoices', icon: FileText },
      { title: 'Student Invoices', path: '/finance/student-invoices', icon: Users },
      { title: 'Payments', path: '/finance/payments', icon: CreditCard },
      { title: 'Pending Payments', path: '/finance/pending-payments', icon: Clock },
      { title: 'Payment Plans', path: '/finance/payment-plans', icon: Calendar },
      { title: 'Expenses', path: '/finance/expenses', icon: Receipt },
      { title: 'Create Invoice', path: '/finance/create-invoice', icon: Plus }
    ]
  },
  data: {
    icon: Database,
    title: 'Data',
    basePath: '/data',
    gradient: 'data',
    pages: [
      { title: 'Overview', path: '/data', icon: Database },
      { title: 'Room Grades', path: '/data/room-grades', icon: Building },
      { title: 'Pricing Matrix', path: '/data/pricing-matrix', icon: DollarSign },
      { title: 'Durations', path: '/data/durations', icon: Clock },
      { title: 'Installment Plans', path: '/data/installment-plans', icon: Calendar },
      { title: 'Maintenance Categories', path: '/data/maintenance-categories', icon: Wrench },
      { title: 'Lead Fields', path: '/data/lead-fields', icon: Search },
      { title: 'Student Fields', path: '/data/student-fields', icon: User },
      { title: 'Bulk Import Studios', path: '/data/bulk-import-studios', icon: Upload },
      { title: 'Bulk Import Leads', path: '/data/bulk-import-leads', icon: Upload },
      { title: 'Bulk Import Students', path: '/data/bulk-import-students', icon: Upload }
    ]
  },
  'web-access': {
    icon: Globe,
    title: 'Web Access',
    basePath: '/web-access',
    gradient: 'web-access',
    pages: [
      { title: 'Overview', path: '/web-access', icon: Globe },
      { title: 'Reservations', path: '/web-access/reservations', icon: Calendar },
      { title: 'Grade Pages', path: '/web-access/grade-pages', icon: FileText },
      { title: 'Agreements', path: '/web-access/agreements', icon: FileText },
      { title: 'Subscribers', path: '/web-access/subscribers', icon: Mail },
      { title: 'Book Page', path: '/book', icon: Calendar, external: true }
    ]
  },
  branding: {
    icon: Palette,
    title: 'Branding',
    basePath: '/branding',
    gradient: 'branding',
    pages: [
      { title: 'Overview', path: '/branding', icon: Palette },
      { title: 'Module Styles', path: '/branding/module-styles', icon: Palette },
      { title: 'Branding', path: '/branding/branding', icon: Settings }
    ]
  },
  'comms-marketing': {
    icon: MessageSquare,
    title: 'Comms & Marketing',
    basePath: '/comms-marketing',
    gradient: 'comms-marketing',
    pages: [
      { title: 'Overview', path: '/comms-marketing', icon: MessageSquare },
      { title: 'Maintenance Requests', path: '/comms-marketing/maintenance-requests', icon: Wrench },
      { title: 'Analytics', path: '/comms-marketing/analytics', icon: BarChart3 }
    ]
  },
  settings: {
    icon: Settings,
    title: 'Settings',
    basePath: '/settings',
    gradient: 'settings',
    pages: [
      { title: 'Overview', path: '/settings', icon: Settings },
      { title: 'Users', path: '/settings/users', icon: Users },
      { title: 'Student Accounts', path: '/settings/student-accounts', icon: User },
      { title: 'System Preferences', path: '/settings/system', icon: Wrench },
      { title: 'Security', path: '/settings/security', icon: Shield },
      { title: 'Integrations', path: '/settings/integrations', icon: Zap },
      { title: 'Notifications', path: '/settings/notifications', icon: Bell },
      { title: 'Configuration', path: '/settings/config', icon: Database },
      { title: 'Module Access Config', path: '/settings/module-access', icon: Shield, hasSubmenu: false },
      { title: 'Bulk Upload Students', path: '/settings/bulk-upload-students', icon: Upload }
    ]
  },
  'student-portal': {
    icon: User,
    title: 'Student Portal',
    basePath: '/student-portal',
    gradient: 'student-portal',
    pages: [
      { title: 'Overview', path: '/student-portal', icon: Home },
      { title: 'Payments', path: '/student-portal/payments', icon: CreditCard },
      { title: 'Profile', path: '/student-portal/profile', icon: User },
      { title: 'Documents', path: '/student-portal/documents', icon: FileText },
      { title: 'Maintenance', path: '/student-portal/maintenance', icon: Wrench },
      { title: 'Agreements', path: '/student-portal/agreements', icon: FileText }
    ]
  }
};

function SubmenuItem({ 
  page, 
  module, 
  isActive, 
  navigate, 
  fullPath 
}: SubmenuItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { state } = useSidebar();
  const { getModuleGradient } = useModuleStyles();
  
  const isAnySubmenuActive = page.submenu?.some((subItem) => isActive(subItem.path)) ?? false;
  
  // Auto-expand if any submenu item is active
  React.useEffect(() => {
    if (isAnySubmenuActive) {
      setIsExpanded(true);
    }
  }, [isAnySubmenuActive]);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setIsExpanded(!isExpanded)}
        isActive={isAnySubmenuActive}
        className={isAnySubmenuActive 
          ? 'text-white font-semibold !text-white data-[active=true]:!text-white sidebar-active-gradient' 
          : 'hover:bg-accent hover:text-accent-foreground'
        }
        style={isAnySubmenuActive ? { 
          '--custom-gradient': getModuleGradient(module.gradient)
        } as React.CSSProperties : {}}
      >
        <page.icon className="size-4" />
        <span>{page.title}</span>
        {state === "expanded" && (
          <div className="ml-auto">
            {isExpanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </div>
        )}
      </SidebarMenuButton>
      
      {isExpanded && state === "expanded" && page.submenu && (
        <div className="ml-4 mt-1 space-y-1">
          {page.submenu.map((subItem) => (
            <SidebarMenuButton
              key={subItem.path}
              onClick={() => navigate(subItem.path)}
              isActive={isActive(subItem.path)}
              className={`pl-8 ${isActive(subItem.path) 
                ? 'text-white font-semibold !text-white data-[active=true]:!text-white sidebar-active-gradient' 
                : 'hover:bg-accent hover:text-accent-foreground'
              }`}
              style={isActive(subItem.path) ? { 
                '--custom-gradient': getModuleGradient(module.gradient)
              } as React.CSSProperties : {}}
            >
              <subItem.icon className="size-4" />
              <span>{subItem.title}</span>
            </SidebarMenuButton>
          ))}
        </div>
      )}
    </SidebarMenuItem>
  );
}

function AppSidebar() {
  const { user, logout, hasRole } = useAuth();
  const { accessibleModules, isLoading: modulesLoading } = useModuleAccess();
  const { state } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentModule = () => {
    const path = location.pathname;
    
    for (const [key, module] of Object.entries(moduleRoutes)) {
      if (path.startsWith(module.basePath)) {
        return { key, module };
      }
    }
    return null;
  };

  const currentModule = getCurrentModule();

  // If we're not in a module, don't show the sidebar
  if (!currentModule) return null;

  const isActive = (path: string) => {
    if (currentModule?.key === 'student-portal') {
      // For student portal, check relative paths
      // Extract the path after the student ID
      const pathParts = location.pathname.split('/');
      if (pathParts.length >= 3 && pathParts[1] === 'student-portal') {
        const studentId = pathParts[2];
        const currentPath = location.pathname.replace(`/student-portal/${studentId}`, '');
        // Handle the root case where currentPath would be empty
        if (currentPath === '' && path === '/student-portal') {
          return true;
        }
        return currentPath === path.replace('/student-portal', '');
      }
      return false;
    }
    return location.pathname === path;
  };

  const module = currentModule.module;
  
  // Add safety check for ModuleStyles context
  let moduleGradient = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'; // Default gradient
  try {
    const { getModuleGradient } = useModuleStyles();
    moduleGradient = getModuleGradient(module.gradient);
  } catch (error) {
    console.warn('ModuleStyles context not available, using default gradient:', error);
  }

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div 
              className="flex aspect-square size-8 items-center justify-center rounded-lg"
              style={{ background: moduleGradient }}
            >
              <module.icon className="size-4 text-white" />
            </div>
            {state === "expanded" && (
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-foreground">{module.title}</span>
                <span className="text-xs text-muted-foreground">Management</span>
              </div>
            )}
          </div>
          {state === "expanded" && (
            <SidebarMenuButton 
              onClick={() => navigate('/')}
              className="hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
            >
              <Home className="size-4" />
            </SidebarMenuButton>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent style={{ background: `linear-gradient(180deg, ${moduleGradient.replace('linear-gradient(135deg, ', '').replace(')', '')}10 0%, transparent 100%)` }}>
        {state === "collapsed" && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => navigate('/')}
                    className="hover:bg-accent hover:text-accent-foreground"
                  >
                    <Home className="size-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">{module.title} Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {module.pages.map((page) => {
                const fullPath = currentModule?.key === 'student-portal' 
                  ? `${module.basePath}/${location.pathname.split('/')[2]}${page.path.replace('/student-portal', '')}`
                  : page.path;
                
                // Check if this page has a submenu
                if (page.hasSubmenu && page.submenu) {
                  return (
                    <SubmenuItem 
                      key={page.path}
                      page={page}
                      module={module}
                      isActive={isActive}
                      navigate={navigate}
                      fullPath={fullPath}
                    />
                  );
                }
                
                return (
                  <SidebarMenuItem key={page.path}>
                    <SidebarMenuButton
                      onClick={() => {
                        if (page.external) {
                          window.open(fullPath, '_blank');
                        } else {
                          navigate(fullPath);
                        }
                      }}
                      isActive={page.external ? false : isActive(page.path)}
                      className={page.external 
                        ? 'hover:bg-accent hover:text-accent-foreground'
                        : isActive(page.path) 
                          ? 'text-white font-semibold !text-white data-[active=true]:!text-white sidebar-active-gradient' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }
                      style={page.external ? {} : (isActive(page.path) ? { 
                        '--custom-gradient': moduleGradient
                      } as React.CSSProperties : {})}
                    >
                      <page.icon className="size-4" />
                      <span>{page.title}</span>
                      {page.external && (
                        <svg className="size-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        {state === "expanded" && user && (
          <div className="px-2 py-2">
            <div className="text-xs text-muted-foreground">Welcome</div>
            <div className="text-sm font-medium text-foreground">{user.first_name} {user.last_name}</div>
            <div 
              className="text-xs text-white px-1 py-0.5 rounded mt-1 inline-block"
              style={{ background: moduleGradient }}
            >
              {user.role}
            </div>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} className="hover:bg-destructive hover:text-destructive-foreground">
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  
  // Don't show sidebar on dashboard
  if (location.pathname === '/' || location.pathname === '/dashboard') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
          </header>
          <div className="flex-1 overflow-auto p-6 lg:zoom-85 xl:zoom-90 2xl:zoom-100">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
