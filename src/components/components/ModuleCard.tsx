import { LucideIcon } from "lucide-react";

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const ModuleCard = ({ icon: Icon, title, description }: ModuleCardProps) => {
  return (
    <div className="bg-card rounded-xl p-4 border border-transparent hover:border-primary/50 transition-colors cursor-pointer group">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/20 transition-colors">
          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};
