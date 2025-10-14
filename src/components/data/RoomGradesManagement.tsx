
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ApiService, RoomGrade } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { FileStorageService } from '@/services/fileStorage';
import { supabase } from '@/integrations/supabase/client';
import { 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


const RoomGradesManagement = () => {
  const { toast } = useToast();
  const [roomGrades, setRoomGrades] = useState<RoomGrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGrade, setNewGrade] = useState({ name: '', studio_count: '', weekly_rate: '', description: '', is_active: true });

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editGrade, setEditGrade] = useState<RoomGrade | null>(null);
  const [amenitiesText, setAmenitiesText] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [localPhotos, setLocalPhotos] = useState<string[]>([]);
  const [newPhotoFiles, setNewPhotoFiles] = useState<File[]>([]);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    fetchRoomGrades();
  }, []);

  const fetchRoomGrades = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getRoomGrades();
      setRoomGrades(data);
    } catch (error) {
      console.error('Error fetching room grades:', error);
      toast({
        title: "Error",
        description: "Failed to fetch room grades. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGrade = async () => {
    if (newGrade.name && newGrade.studio_count && newGrade.weekly_rate) {
      try {
        const gradeData = {
          name: newGrade.name,
          studio_count: parseInt(newGrade.studio_count),
          weekly_rate: parseFloat(newGrade.weekly_rate),
          description: newGrade.description || null,
          is_active: newGrade.is_active
        };
        
        await ApiService.createRoomGrade(gradeData);
        await fetchRoomGrades();
        setNewGrade({ name: '', studio_count: '', weekly_rate: '', description: '', is_active: true });
        setIsAddDialogOpen(false);
        toast({
          title: "Success",
          description: "Room grade added successfully.",
        });
      } catch (error) {
        console.error('Error adding room grade:', error);
        toast({
          title: "Error",
          description: "Failed to add room grade. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const openEditDialog = (grade: RoomGrade) => {
    setEditGrade(grade);
    setAmenitiesText((grade.amenities || []).join(', '));
    setFeaturesText((grade.features || []).join(', '));
    setLocalPhotos(grade.photos || []);
    setNewPhotoFiles([]);
    setIsEditDialogOpen(true);
  };

  const handleNewPhotosSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setNewPhotoFiles(prev => [...prev, ...files]);
  };

  const handleRemoveExistingPhoto = (url: string) => {
    setLocalPhotos(prev => prev.filter(p => p !== url));
  };

  const handleRemoveNewPhoto = (idx: number) => {
    setNewPhotoFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const saveEdit = async () => {
    if (!editGrade) return;
    setIsSavingEdit(true);
    try {
      // Upload new photos and get public URLs
      const uploadedUrls: string[] = [];
      for (const file of newPhotoFiles) {
        const record = await FileStorageService.uploadFile(file, { category: 'general', description: 'Room grade photo', is_public: true });
        const { data: urlData } = supabase.storage
          .from('iska-rms-files')
          .getPublicUrl(record.file_path);
        if (urlData?.publicUrl) uploadedUrls.push(urlData.publicUrl);
      }

      const amenities = amenitiesText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const features = featuresText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const updates: Partial<RoomGrade> = {
        name: editGrade.name,
        weekly_rate: editGrade.weekly_rate,
        studio_count: editGrade.studio_count,
        description: editGrade.description || null,
        amenities,
        features,
        photos: [...localPhotos, ...uploadedUrls],
        is_active: (editGrade as any).is_active,
      } as any;

      await ApiService.updateRoomGrade(editGrade.id, updates);
      await fetchRoomGrades();
      setIsEditDialogOpen(false);
      toast({ title: 'Updated', description: 'Room grade updated successfully.' });
    } catch (error) {
      console.error('Error updating room grade:', error);
      toast({ title: 'Error', description: 'Failed to update room grade.', variant: 'destructive' });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteGrade = async (id: string) => {
    try {
      await ApiService.deleteRoomGrade(id);
      await fetchRoomGrades();
      toast({
        title: "Success",
        description: "Room grade deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting room grade:', error);
      toast({
        title: "Error",
        description: "Failed to delete room grade. Please try again.",
        variant: "destructive",
      });
    }
  };

  const totalStudios = roomGrades.reduce((sum, grade) => sum + (grade.studio_count || 0), 0);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-80 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>

        {/* Room Grades Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-20" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Grades Management</h1>
          <p className="text-muted-foreground">Configure room grades and studio counts</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Room Grade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room Grade</DialogTitle>
              <DialogDescription>
                Create a new room grade category
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Grade Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Premium"
                  value={newGrade.name}
                  onChange={(e) => setNewGrade({ ...newGrade, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studioCount">Studio Count</Label>
                <Input
                  id="studioCount"
                  type="number"
                  placeholder="e.g., 45"
                  value={newGrade.studio_count}
                  onChange={(e) => setNewGrade({ ...newGrade, studio_count: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weeklyRate">Weekly Rate (£)</Label>
                <Input
                  id="weeklyRate"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 160.00"
                  value={newGrade.weekly_rate}
                  onChange={(e) => setNewGrade({ ...newGrade, weekly_rate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" placeholder="Short description" value={newGrade.description} onChange={(e) => setNewGrade({ ...newGrade, description: e.target.value })} />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={newGrade.is_active} onCheckedChange={(v) => setNewGrade({ ...newGrade, is_active: v })} />
                <Label>Active</Label>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddGrade} className="flex-1">Add Grade</Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Room Grades</p>
                <p className="text-2xl font-bold">{roomGrades.length}</p>
              </div>
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Studios</p>
                <p className="text-2xl font-bold">{totalStudios}</p>
              </div>
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average per Grade</p>
                <p className="text-2xl font-bold">{roomGrades.length > 0 ? Math.round(totalStudios / roomGrades.length) : 0}</p>
              </div>
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Grades List */}
      <Card>
        <CardHeader>
          <CardTitle>Room Grades</CardTitle>
          <CardDescription>Manage all room grade categories and studio counts</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Loading room grades...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {roomGrades.map((grade) => (
                <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{grade.name}</h4>
                      <p className="text-sm text-muted-foreground">{grade.description}</p>
                    </div>
                    <Badge variant="outline">{grade.studio_count} studios • £{grade.weekly_rate}/week</Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(grade)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteGrade(grade.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Room Grade</DialogTitle>
            <DialogDescription>Update details, media and preferences for this grade</DialogDescription>
          </DialogHeader>
          {editGrade && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={editGrade.name} onChange={(e) => setEditGrade({ ...editGrade, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Weekly Rate (£)</Label>
                  <Input type="number" step="0.01" value={String(editGrade.weekly_rate || '')} onChange={(e) => setEditGrade({ ...editGrade, weekly_rate: parseFloat(e.target.value || '0') })} />
                </div>
                <div className="space-y-2">
                  <Label>Studio Count</Label>
                  <Input type="number" value={String(editGrade.studio_count || '')} onChange={(e) => setEditGrade({ ...editGrade, studio_count: parseInt(e.target.value || '0') })} />
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={(editGrade as any).is_active ?? true} onCheckedChange={(v) => setEditGrade({ ...(editGrade as any), is_active: v } as any)} />
                  <Label>Active</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={editGrade.description || ''} onChange={(e) => setEditGrade({ ...editGrade, description: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amenities (comma-separated)</Label>
                  <Input placeholder="Wifi, Parking, Kitchen" value={amenitiesText} onChange={(e) => setAmenitiesText(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Features (comma-separated)</Label>
                  <Input placeholder="Ensuite, Balcony" value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Photos</Label>
                {/* Existing photos */}
                <div className="flex flex-wrap gap-3">
                  {localPhotos.map((url, idx) => (
                    <div key={idx} className="w-28 h-20 rounded overflow-hidden relative border">
                      <img src={url} className="w-full h-full object-cover" />
                      <button type="button" className="absolute top-1 right-1 bg-white/80 rounded px-1 text-xs" onClick={() => handleRemoveExistingPhoto(url)}>Remove</button>
                    </div>
                  ))}
                  {localPhotos.length === 0 && (
                    <div className="text-sm text-muted-foreground">No photos yet</div>
                  )}
                </div>
                {/* New photos to upload */}
                {newPhotoFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newPhotoFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm border px-2 py-1 rounded">
                        <span className="truncate max-w-[140px]">{f.name}</span>
                        <button type="button" className="text-red-600" onClick={() => handleRemoveNewPhoto(i)}>Remove</button>
                      </div>
                    ))}
                  </div>
                )}
                <Input type="file" accept="image/*" multiple onChange={handleNewPhotosSelected} />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={saveEdit} disabled={isSavingEdit}>{isSavingEdit ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomGradesManagement;
