import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import { ApiService, Studio, RoomGrade } from '@/services/api';

interface StudioFormData {
  studio_number: string;
  room_grade_id: string;
  floor: number | '';
  status: 'vacant' | 'occupied' | 'dirty' | 'cleaning' | 'maintenance';
  is_active: boolean;
}

const EditStudio = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [roomGrades, setRoomGrades] = useState<RoomGrade[]>([]);
  const [studio, setStudio] = useState<Studio | null>(null);
  
  const [formData, setFormData] = useState<StudioFormData>({
    studio_number: '',
    room_grade_id: '',
    floor: '',
    status: 'vacant',
    is_active: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoading(true);
        
        // Fetch room grades
        const gradesData = await ApiService.getRoomGrades();
        setRoomGrades(gradesData || []);
        
        // Fetch studio data
        if (id) {
          const studioData = await ApiService.getStudioById(id);
          if (studioData) {
            setStudio(studioData);
            setFormData({
              studio_number: studioData.studio_number,
              room_grade_id: studioData.room_grade_id,
              floor: studioData.floor || '',
              status: studioData.status,
              is_active: studioData.is_active
            });
          } else {
            toast({
              title: "Error",
              description: "Studio not found.",
              variant: "destructive",
            });
            navigate('/studios/list');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load studio data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, toast]);

  const updateFormData = (field: keyof StudioFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.studio_number.trim()) {
      toast({
        title: "Validation Error",
        description: "Studio number is required.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.room_grade_id) {
      toast({
        title: "Validation Error",
        description: "Room grade is required.",
        variant: "destructive",
      });
      return false;
    }

    // Validate studio number format (should be unique and follow a pattern)
    const studioNumberPattern = /^[A-Z0-9]+$/;
    if (!studioNumberPattern.test(formData.studio_number.trim())) {
      toast({
        title: "Validation Error",
        description: "Studio number should contain only uppercase letters and numbers.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) {
      return;
    }

    try {
      setIsLoading(true);

      const studioData = {
        studio_number: formData.studio_number.trim().toUpperCase(),
        room_grade_id: formData.room_grade_id,
        floor: formData.floor || null,
        status: formData.status,
        is_active: formData.is_active
      };

      await ApiService.updateStudio(id, studioData);

      toast({
        title: "Success",
        description: "Studio updated successfully!",
      });

      // Navigate back to studios list
      navigate('/studios/list');
    } catch (error: any) {
      console.error('Error updating studio:', error);
      
      let errorMessage = "Failed to update studio. Please try again.";
      
      // Handle specific database errors
      if (error.code === '23505') {
        errorMessage = "Studio number already exists. Please choose a different number.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setIsDeleting(true);
      await ApiService.deleteStudio(id);

      toast({
        title: "Success",
        description: "Studio deleted successfully!",
      });

      navigate('/ota-bookings/studios');
    } catch (error: any) {
      console.error('Error deleting studio:', error);
      
      let errorMessage = "Failed to delete studio. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate('/studios/list');
  };

  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading studio data...</span>
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Studio not found</h2>
          <Button onClick={handleCancel} className="mt-4">
            Back to Studios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Studios</span>
          </Button>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Studio
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Studio</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete studio {studio.studio_number}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground" disabled={isDeleting}>
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Studio</CardTitle>
          <CardDescription>
            Update studio {studio.studio_number} information and specifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Studio Number */}
            <div className="space-y-2">
              <Label htmlFor="studio_number">Studio Number *</Label>
              <Input
                id="studio_number"
                placeholder="e.g., S101, A201, B305"
                value={formData.studio_number}
                onChange={(e) => updateFormData('studio_number', e.target.value)}
                className="uppercase"
                required
              />
            </div>

            {/* Room Grade */}
            <div className="space-y-2">
              <Label htmlFor="room_grade">Room Grade *</Label>
              <Select value={formData.room_grade_id} onValueChange={(value) => updateFormData('room_grade_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a room grade" />
                </SelectTrigger>
                <SelectContent>
                  {roomGrades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.name} - £{grade.weekly_rate}/week
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Floor */}
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="number"
                placeholder="e.g., 1, 2, 3"
                value={formData.floor}
                onChange={(e) => updateFormData('floor', e.target.value ? parseInt(e.target.value) : '')}
                min="0"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: any) => updateFormData('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacant">Vacant</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="dirty">Dirty</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => updateFormData('is_active', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Update Studio
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditStudio;
