
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiService, Studio, RoomGrade } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Bed, Wifi, Car, Coffee, Plus, Edit, Loader2 } from 'lucide-react';

const RoomManagement = () => {
  const { toast } = useToast();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [roomGrades, setRoomGrades] = useState<RoomGrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudios();

    // Listen for studio status updates to refresh the studios list
    const handleStudioStatusUpdate = async (event: CustomEvent) => {
      console.log('RoomManagement: Received studio status update event:', event.detail);
      await fetchStudios(); // Refresh studios when status changes
    };

    window.addEventListener('studioStatusUpdated', handleStudioStatusUpdate as EventListener);
    
    return () => {
      window.removeEventListener('studioStatusUpdated', handleStudioStatusUpdate as EventListener);
    };
  }, []);

  const fetchStudios = async () => {
    try {
      setIsLoading(true);
      const [studiosData, roomGradesData] = await Promise.all([
        ApiService.getStudios(),
        ApiService.getRoomGrades()
      ]);
      setStudios(studiosData);
      setRoomGrades(roomGradesData);
    } catch (error) {
      console.error('Error fetching studios:', error);
      toast({
        title: "Error",
        description: "Failed to fetch studios. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Occupied': return 'bg-red-100 text-red-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const amenityIcons: { [key: string]: any } = {
    'Wifi': Wifi,
    'Parking': Car,
    'Kitchen': Coffee
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600">Manage room inventory and availability</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Loading studios...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio) => {
            const roomGrade = roomGrades.find(rg => rg.id === studio.room_grade_id);
            return (
              <Card key={studio.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{studio.studio_number}</CardTitle>
                      <p className="text-sm text-gray-600">{roomGrade?.name || 'Unknown Grade'}</p>
                    </div>
                    <Badge className={getStatusColor(studio.status)}>
                      {studio.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Floor:</span>
                      <span>{studio.floor || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Grade:</span>
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {roomGrade?.name || 'Unknown'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Weekly Rate:</span>
                      <span className="font-semibold">£{roomGrade?.weekly_rate || 0}/week</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Studio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
