import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { ApiService, AcademicYear } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  CheckCircle,
  Loader2,
  Star,
  StarOff,
  Clock
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AcademicYearsManagement = () => {
  const { toast } = useToast();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [newAcademicYear, setNewAcademicYear] = useState({
    name: '',
    start_date: '',
    end_date: '',
    description: '',
    is_active: true,
    is_current: false
  });

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getAcademicYears();
      setAcademicYears(data || []);
    } catch (error) {
      console.error('Error fetching academic years:', error);
      toast({
        title: "Error",
        description: "Failed to fetch academic years. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAcademicYear = async () => {
    if (!newAcademicYear.name || !newAcademicYear.start_date || !newAcademicYear.end_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await ApiService.createAcademicYear(newAcademicYear);
      await fetchAcademicYears();
      setNewAcademicYear({
        name: '',
        start_date: '',
        end_date: '',
        description: '',
        is_active: true,
        is_current: false
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Academic year added successfully.",
      });
    } catch (error) {
      console.error('Error adding academic year:', error);
      toast({
        title: "Error",
        description: "Failed to add academic year. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditAcademicYear = async () => {
    if (!editingYear) return;

    try {
      await ApiService.updateAcademicYear(editingYear.id, editingYear);
      await fetchAcademicYears();
      setEditingYear(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Academic year updated successfully.",
      });
    } catch (error) {
      console.error('Error updating academic year:', error);
      toast({
        title: "Error",
        description: "Failed to update academic year. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAcademicYear = async (id: string) => {
    if (!confirm('Are you sure you want to delete this academic year? This action cannot be undone.')) {
      return;
    }

    try {
      await ApiService.deleteAcademicYear(id);
      await fetchAcademicYears();
      toast({
        title: "Success",
        description: "Academic year deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting academic year:', error);
      toast({
        title: "Error",
        description: "Failed to delete academic year. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetCurrent = async (id: string) => {
    try {
      await ApiService.setCurrentAcademicYear(id);
      await fetchAcademicYears();
      toast({
        title: "Success",
        description: "Current academic year updated successfully.",
      });
    } catch (error) {
      console.error('Error setting current academic year:', error);
      toast({
        title: "Error",
        description: "Failed to set current academic year. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      await ApiService.updateAcademicYear(id, { is_active: !isActive });
      await fetchAcademicYears();
      toast({
        title: "Success",
        description: `Academic year ${!isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      console.error('Error toggling academic year status:', error);
      toast({
        title: "Error",
        description: "Failed to update academic year status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (academicYear: AcademicYear) => {
    setEditingYear({ ...academicYear });
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-80 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Academic Years Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-16" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Years Management</h1>
          <p className="text-gray-600 mt-2">
            Manage academic year definitions for your institution
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Academic Year</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Academic Year</DialogTitle>
              <DialogDescription>
                Create a new academic year definition for your institution.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Academic Year Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., 2024/2025, Fall 2024, etc."
                  value={newAcademicYear.name}
                  onChange={(e) => setNewAcademicYear({ ...newAcademicYear, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={newAcademicYear.start_date}
                    onChange={(e) => setNewAcademicYear({ ...newAcademicYear, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={newAcademicYear.end_date}
                    onChange={(e) => setNewAcademicYear({ ...newAcademicYear, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional description for this academic year"
                  value={newAcademicYear.description}
                  onChange={(e) => setNewAcademicYear({ ...newAcademicYear, description: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={newAcademicYear.is_active}
                    onCheckedChange={(checked) => setNewAcademicYear({ ...newAcademicYear, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_current"
                    checked={newAcademicYear.is_current}
                    onCheckedChange={(checked) => setNewAcademicYear({ ...newAcademicYear, is_current: checked })}
                  />
                  <Label htmlFor="is_current">Current Year</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAcademicYear}>
                  Add Academic Year
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Academic Years List */}
      <div className="grid gap-4">
        {academicYears.map((academicYear) => (
          <Card key={academicYear.id} className={`${!academicYear.is_active ? 'opacity-60' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {academicYear.name}
                    </h3>
                    {academicYear.is_current && (
                      <Badge variant="default" className="bg-yellow-500">
                        <Star className="h-3 w-3 mr-1" />
                        Current
                      </Badge>
                    )}
                    {!academicYear.is_active && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(academicYear.start_date)} - {formatDate(academicYear.end_date)}</span>
                    </div>
                    {academicYear.description && (
                      <span className="text-gray-500">{academicYear.description}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!academicYear.is_current && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetCurrent(academicYear.id)}
                      className="flex items-center space-x-1"
                    >
                      <Star className="h-4 w-4" />
                      <span>Set Current</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(academicYear)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(academicYear.id, academicYear.is_active)}
                  >
                    {academicYear.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAcademicYear(academicYear.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Academic Year</DialogTitle>
            <DialogDescription>
              Update the academic year definition.
            </DialogDescription>
          </DialogHeader>
          {editingYear && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_name">Academic Year Name *</Label>
                <Input
                  id="edit_name"
                  value={editingYear.name}
                  onChange={(e) => setEditingYear({ ...editingYear, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_start_date">Start Date *</Label>
                  <Input
                    id="edit_start_date"
                    type="date"
                    value={editingYear.start_date}
                    onChange={(e) => setEditingYear({ ...editingYear, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_end_date">End Date *</Label>
                  <Input
                    id="edit_end_date"
                    type="date"
                    value={editingYear.end_date}
                    onChange={(e) => setEditingYear({ ...editingYear, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_description">Description</Label>
                <Textarea
                  id="edit_description"
                  value={editingYear.description || ''}
                  onChange={(e) => setEditingYear({ ...editingYear, description: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit_is_active"
                    checked={editingYear.is_active}
                    onCheckedChange={(checked) => setEditingYear({ ...editingYear, is_active: checked })}
                  />
                  <Label htmlFor="edit_is_active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit_is_current"
                    checked={editingYear.is_current}
                    onCheckedChange={(checked) => setEditingYear({ ...editingYear, is_current: checked })}
                  />
                  <Label htmlFor="edit_is_current">Current Year</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditAcademicYear}>
                  Update Academic Year
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AcademicYearsManagement;
