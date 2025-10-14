import React from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { LogOut } from 'lucide-react';

interface LogoutConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const LogoutConfirmationDialog: React.FC<LogoutConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  return (
    <ConfirmationDialog
      open={isOpen}
      onOpenChange={onClose}
      onConfirm={onConfirm}
      title="Confirm Logout"
      description="Are you sure you want to logout? You will need to sign in again to access your account."
      confirmText={isLoading ? 'Logging out...' : 'Logout'}
      cancelText="Cancel"
      icon={LogOut}
      variant="destructive"
      isLoading={isLoading}
    />
  );
};
