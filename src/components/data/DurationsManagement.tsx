
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ApiService, Duration } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Helper functions for calculating academic year dates
const calculateCheckInDate = (academicYear: string | 'all'): string => {
  if (academicYear === 'all') return '2025-09-01';
  const year = parseInt(academicYear.split('/')[0]);
  return `${year}-09-01`;
};

const calculateCheckOutDate = (academicYear: string | 'all'): string => {
  if (academicYear === 'all') return '2026-07-01';
  const year = parseInt(academicYear.split('/')[1]);
  return `${year}-07-01`;
};

const DurationsManagement = () => {
  const { toast } = useToast();
  const { selectedAcademicYear } = useAcademicYear();
  const [durations, setDurations] = useState<Duration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDuration, setNewDuration] = useState({ 
    name: '', 
    weeks_count: '', 
    description: ''
  });

  useEffect(() => {
    fetchDurations();
  }, [selectedAcademicYear]);

  const fetchDurations = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getDurations('student', selectedAcademicYear);
      setDurations(data || []);
    } catch (error) {
      console.error('Error fetching durations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch durations. Please try again.",
        variant: "destructive",
      });
      setDurations([]); // Set empty array on error to prevent infinite loading
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDuration = async () => {
    if (newDuration.name && newDuration.weeks_count) {
      try {
        const durationData = {
          name: newDuration.name,
          weeks_count: parseInt(newDuration.weeks_count),
          description: newDuration.description,
          is_active: true,
          duration_type: 'student' as const,
          academic_year: selectedAcademicYear !== 'all' ? selectedAcademicYear : '2025/2026',
          check_in_date: calculateCheckInDate(selectedAcademicYear),
          check_out_date: calculateCheckOutDate(selectedAcademicYear)
        };
        
        await ApiService.createDuration(durationData);
        await fetchDurations();
        setNewDuration({ 
          name: '', 
          weeks_count: '', 
          description: ''
        });
        setIsAddDialogOpen(false);
        toast({
          title: "Success",
          description: "Duration added successfully.",
        });
      } catch (error) {
        console.error('Error adding duration:', error);
        toast({
          title: "Error",
          description: "Failed to add duration. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteDuration = async (id: string) => {
    try {
      await ApiService.deleteDuration(id);
      await fetchDurations();
      toast({
        title: "Success",
        description: "Duration deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting duration:', error);
      toast({
        title: "Error",
        description: "Failed to delete duration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const duration = durations.find(d => d.id === id);
      if (duration) {
        await ApiService.updateDuration(id, { is_active: !duration.is_active });
        await fetchDurations();
        toast({
          title: "Success",
          description: "Duration status updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating duration:', error);
      toast({
        title: "Error",
        description: "Failed to update duration. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Durations Grid Skeleton */}
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
          <h1 className="text-3xl font-bold tracking-tight">Duration Management</h1>
          <p className="text-muted-foreground">Configure booking duration types</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Duration
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Duration</DialogTitle>
              <DialogDescription>
                Create a new duration type for bookings
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Duration Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., 45-weeks"
                  value={newDuration.name}
                  onChange={(e) => setNewDuration({ ...newDuration, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weeks">Number of Weeks</Label>
                <Input
                  id="weeks"
                  type="number"
                  placeholder="e.g., 45"
                  value={newDuration.weeks_count}
                  onChange={(e) => setNewDuration({ ...newDuration, weeks_count: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="e.g., Standard academic year"
                  value={newDuration.description}
                  onChange={(e) => setNewDuration({ ...newDuration, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit_amount">Deposit Amount (£)</Label>
                <Input
                  id="deposit_amount"
                  type="number"
                  placeholder="e.g., 500"
                  value={newDuration.deposit_amount}
                  onChange={(e) => setNewDuration({ ...newDuration, deposit_amount: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_dates">Due Dates (JSON array)</Label>
                <Input
                  id="due_dates"
                  placeholder='["2025-10-01", "2026-01-01", "2026-04-01"]'
                  value={JSON.stringify(newDuration.due_dates)}
                  onChange={(e) => {
                    try {
                      const dates = JSON.parse(e.target.value);
                      setNewDuration({ ...newDuration, due_dates: dates });
                    } catch (error) {
                      // Invalid JSON, keep current value
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Enter as JSON array of dates: ["2025-10-01", "2026-01-01", "2026-04-01"]
                </p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddDuration} className="flex-1">Add Duration</Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Durations List */}
      <Card>
        <CardHeader>
          <CardTitle>Duration Types</CardTitle>
          <CardDescription>Manage all booking duration options</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Loading durations...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {durations.map((duration) => (
                <div key={duration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{duration.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {duration.duration_type} • {duration.academic_year}
                        </p>

                      </div>
                    </div>
                    <Badge variant="outline">{duration.weeks_count} weeks</Badge>
                    <Badge variant={duration.is_active ? 'default' : 'secondary'}>
                      {duration.is_active ? (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Active
                        </>
                      ) : (
                        'Inactive'
                      )}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(duration.id)}
                    >
                      {duration.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteDuration(duration.id)}
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
    </div>
  );
};

export default DurationsManagement;
