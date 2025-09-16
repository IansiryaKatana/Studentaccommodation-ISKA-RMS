import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, User, Calendar } from 'lucide-react';

interface StudioOccupancyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  studioNumber: string;
  occupantName: string;
  occupantEmail: string;
  reservationType: 'student' | 'tourist';
  checkInDate?: string;
  checkOutDate?: string;
}

const StudioOccupancyDialog: React.FC<StudioOccupancyDialogProps> = ({
  isOpen,
  onClose,
  studioNumber,
  occupantName,
  occupantEmail,
  reservationType,
  checkInDate,
  checkOutDate
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Studio Already Reserved
          </DialogTitle>
          <DialogDescription>
            This studio is currently occupied and cannot be booked.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-red-800">Studio {studioNumber}</span>
              <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                Occupied
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-red-700">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>
                  <strong>Current Occupant:</strong> {occupantName}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full bg-blue-500 flex-shrink-0" />
                <span>
                  <strong>Type:</strong> {reservationType === 'student' ? 'Student' : 'Tourist'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📧</span>
                <span>{occupantEmail}</span>
              </div>
              
              {checkInDate && checkOutDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    <strong>Period:</strong> {new Date(checkInDate).toLocaleDateString()} - {new Date(checkOutDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Please select a different studio or contact the current occupant if you need to make arrangements.</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudioOccupancyDialog;
