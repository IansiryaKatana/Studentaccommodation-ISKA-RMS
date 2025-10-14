import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HeroSectionProps {
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
}

export const HeroSection = ({ isLoginOpen, setIsLoginOpen }: HeroSectionProps) => {
  return (
    <>
      <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-3xl">
        <p className="text-muted-foreground text-sm mb-4 tracking-wide">
          All in One Solution
        </p>
      
      <h2 className="text-6xl lg:text-7xl font-bold text-foreground mb-4 leading-tight tracking-tight">
        Manage student
        <br />
        accommodations,
        <br />
        <span className="relative inline-block">
          <span className="relative z-10">— in one place</span>
          <span className="absolute bottom-2 left-0 w-full h-4 bg-primary/30 -z-0"></span>
        </span>
      </h2>
      
      <p className="text-muted-foreground text-lg mb-10 max-w-2xl leading-relaxed">
        Access all your system modules from a single, unified dashboard. When you are logged in Choose a module to start managing operations, reviewing data, or performing key actions efficiently.
      </p>
      
        <div className="flex gap-4">
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-full px-8"
            onClick={() => setIsLoginOpen(true)}
          >
            Login or System Access
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
    </>
  );
};
