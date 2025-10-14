import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginDialog = ({ isOpen, onOpenChange }: LoginDialogProps) => {
  return (
    <div className={`absolute inset-0 z-50 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
      <div className="bg-card/95 backdrop-blur-lg rounded-2xl p-8 h-full flex flex-col justify-center">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Login to Dashboard</h2>
            <p className="text-muted-foreground">
              Enter your credentials to access the system
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Enter your username" className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" className="h-12" />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium">
              Login
            </Button>
            <Button variant="secondary" className="flex-1 h-12 text-base font-medium" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
