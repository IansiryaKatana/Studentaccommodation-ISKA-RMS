import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, LogOut, User, Settings } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBranding } from "@/contexts/BrandingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAcademicYear } from "@/contexts/AcademicYearContext";

interface DashboardHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogoutClick: () => void;
}

export const DashboardHeader = ({ searchQuery, setSearchQuery, onLogoutClick }: DashboardHeaderProps) => {
  const { branding, isLoading: brandingLoading } = useBranding();
  const { user } = useAuth();
  const { selectedAcademicYear, setSelectedAcademicYear, availableAcademicYears, isLoading: yearsLoading } = useAcademicYear();

  // Get user initials
  const getUserInitials = () => {
    if (!user) return "U";
    
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    
    if (user.first_name) {
      return user.first_name.substring(0, 2).toUpperCase();
    }
    
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return "U";
  };

  const getUserFullName = () => {
    if (!user) return "User";
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    
    if (user.first_name) {
      return user.first_name;
    }
    
    return user.email;
  };

  return (
    <header className="border-b border-border/40 bg-background">
      <div className="container mx-auto px-8 py-5 max-w-[1600px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {branding?.logo_url ? (
              <img 
                src={branding.logo_url} 
                alt={`${branding.company_name} logo`}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {brandingLoading ? '...' : (branding?.company_name?.charAt(0) || 'D')}
                </span>
              </div>
            )}
            <h1 className="text-xl font-semibold text-foreground">
              {brandingLoading ? 'Loading...' : (branding?.company_name || 'Dashboard')}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Academic Year Selector */}
            <Select 
              value={selectedAcademicYear} 
              onValueChange={setSelectedAcademicYear}
              disabled={yearsLoading}
            >
              <SelectTrigger className="w-[160px] bg-secondary border-secondary">
                <SelectValue placeholder="Academic Year" />
              </SelectTrigger>
              <SelectContent>
                {availableAcademicYears && availableAcademicYears.length > 0 ? (
                  availableAcademicYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="loading" disabled>
                    Loading years...
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            
            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search Module" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-primary/10 border-primary/20 focus-visible:ring-primary rounded-full"
              />
            </div>
            
            {/* User Avatar with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none focus:outline-none">
                  <Avatar className="h-10 w-10 bg-gradient-to-br from-primary to-primary/80 cursor-pointer hover:opacity-90 transition-opacity">
                    <AvatarFallback className="bg-transparent text-white font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{getUserFullName()}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground capitalize mt-1">
                      {user?.role?.replace(/_/g, ' ')}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer"
                  asChild
                >
                  <a href="https://studentstaysolutions.com/#contact" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Contact Support</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={onLogoutClick}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

