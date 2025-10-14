import { useBranding } from "@/contexts/BrandingContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface WelcomeSectionProps {
  onLogoutClick: () => void;
}

export const WelcomeSection = ({ onLogoutClick }: WelcomeSectionProps) => {
  const { branding, isLoading: brandingLoading } = useBranding();
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getUserFirstName = () => {
    if (!user) return "User";
    return user.first_name || user.email?.split('@')[0] || "User";
  };

  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-3xl">
      <p className="text-muted-foreground text-sm mb-4 tracking-wide">
        {getGreeting()}, {getUserFirstName()}
      </p>
    
      <h2 className="text-6xl lg:text-7xl font-bold text-foreground mb-4 leading-tight tracking-tight">
        Manage any
        <br />
        Student Accommodation
        <br />
        <span className="relative inline-block">
          <span className="relative z-10">All in one place</span>
          <span className="absolute bottom-2 left-0 w-full h-4 bg-primary/30 -z-0"></span>
        </span>
      </h2>
    
      <p className="text-muted-foreground text-lg mb-10 max-w-2xl leading-relaxed">
        Manage everything from one easy-to-use interface. Access all your modules in one place, select what you need, and dive straight into your work.
      </p>

      <div className="flex gap-4">
        <Button 
          size="lg" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-full px-8"
          onClick={onLogoutClick}
        >
          Logout
        </Button>
        
        <Button 
          size="lg" 
          variant="secondary"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-full px-8"
          asChild
        >
          <a href="https://studentstaysolutions.com/#contact" target="_blank" rel="noopener noreferrer">
            Contact Support
          </a>
        </Button>
      </div>
    </div>
  );
};

