import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LucideIcon } from 'lucide-react';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'destructive';
  isLoading?: boolean;
  iconGradient?: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon: Icon,
  variant = 'default',
  isLoading = false,
  iconGradient,
}) => {
  const isDestructive = variant === 'destructive';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          {Icon && (
            <div 
              className={`flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                isDestructive ? 'bg-destructive/10' : 'bg-primary/10'
              }`}
              style={iconGradient ? { background: iconGradient } : undefined}
            >
              <Icon 
                className={`h-6 w-6 ${
                  isDestructive ? 'text-destructive' : iconGradient ? 'text-white' : 'text-primary'
                }`} 
              />
            </div>
          )}
          <AlertDialogTitle className="text-xl font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel disabled={isLoading} className="flex-1 sm:flex-1">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 sm:flex-1 ${
              isDestructive 
                ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};


