import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { ApiService } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';

interface RoomGrade {
  id: string;
  name: string;
  weekly_rate: number;
  description?: string;
  is_active: boolean;
}

interface StudioFormData {
  studio_number: string;
  room_grade_id: string;
  floor: number | '';
  status: 'vacant' | 'occupied' | 'dirty' | 'cleaning' | 'maintenance';
  is_active: boolean;
}

const AddStudio = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [roomGrades, setRoomGrades] = useState<RoomGrade[]>([]);
  
  const [formData, setFormData] = useState<StudioFormData>({
    studio_number: '',
    room_grade_id: '',
    floor: '',
    status: 'vacant',
    is_active: true
  });

  useEffect(() => {
    const fetchRoomGrades = async () => {
      try {
        setIsDataLoading(true);
        const gradesData = await ApiService.getRoomGrades();
        setRoomGrades(gradesData || []);
      } catch (error) {
        console.error('Error fetching room grades:', error);
        toast({
          title: "Error",
          description: "Failed to load room grades. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchRoomGrades();
  }, [toast]);

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
    
    if (!validateForm()) {
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

      await ApiService.createStudio(studioData);

      toast({
        title: "Success",
        description: "Studio created successfully!",
      });

      // Navigate back to studios list
      navigate('/studios/list');
    } catch (error: any) {
      console.error('Error creating studio:', error);
      
      let errorMessage = "Failed to create studio. Please try again.";
      
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

  const handleCancel = () => {
    navigate('/studios/list');
  };

  if (isDataLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Studio</h1>
        <p className="text-muted-foreground mt-2">
          Create a new studio unit with its specifications and room grade.
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* First Row - Studio Number and Room Grade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-sm text-muted-foreground">
                  Enter a unique studio number (letters and numbers only)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room_grade">Room Grade *</Label>
                <Select
                  value={formData.room_grade_id}
                  onValueChange={(value) => updateFormData('room_grade_id', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomGrades
                      .filter(grade => grade.is_active)
                      .map(grade => (
                        <SelectItem key={grade.id} value={grade.id}>
                          {grade.name} - £{grade.weekly_rate}/week
                          {grade.description && ` (${grade.description})`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose the room grade that determines pricing and amenities
                </p>
              </div>
            </div>

            {/* Second Row - Floor and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="floor">Floor Number</Label>
                <Input
                  id="floor"
                  type="number"
                  placeholder="e.g., 1, 2, 3"
                  value={formData.floor}
                  onChange={(e) => updateFormData('floor', e.target.value ? parseInt(e.target.value) : '')}
                  min="0"
                />
                <p className="text-sm text-muted-foreground">
                  Optional: Specify the floor number for this studio
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Initial Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: StudioFormData['status']) => updateFormData('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacant">Vacant</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="dirty">Dirty</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Set the initial status of the studio
                </p>
              </div>
            </div>

            {/* Third Row - Active Status (centered) */}
            <div className="flex justify-center">
              <div className="w-full max-w-md space-y-2">
                <Label htmlFor="is_active">Active Status</Label>
                <Select
                  value={formData.is_active ? 'true' : 'false'}
                  onValueChange={(value) => updateFormData('is_active', value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Inactive studios won't appear in booking options
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-8 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="min-w-[120px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Studio
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddStudio; 