import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { useBranding } from "@/contexts/BrandingContext";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header = ({ searchQuery, setSearchQuery }: HeaderProps) => {
  const { branding, isLoading: brandingLoading } = useBranding();
  
  return (
    <header className="border-b border-border/40 bg-background">
      <div className="container mx-auto px-8 py-5 max-w-[1600px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {branding?.logo_url ? (
              <img 
                src={branding.logo_url} 
                alt={`${branding.company_name} logo`}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {brandingLoading ? '...' : (branding?.company_name?.charAt(0) || 'H')}
                </span>
              </div>
            )}
            <h1 className="text-xl font-semibold text-foreground">
              {brandingLoading ? 'Loading...' : (branding?.company_name || 'Dashboard Title')}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-[200px] bg-secondary/50 border border-secondary rounded-md px-3 py-2 flex items-center justify-between cursor-not-allowed opacity-60">
              <span className="text-sm text-muted-foreground">Academic Year Toggle</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search Module" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-primary/10 border-primary/20 focus-visible:ring-primary rounded-full"
              />
            </div>
            
            <Avatar className="h-10 w-10 bg-secondary">
              <AvatarFallback className="bg-secondary text-foreground font-medium">
                H
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};
