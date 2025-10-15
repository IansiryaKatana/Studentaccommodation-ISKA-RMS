import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Palette, Plus, Edit, Trash2, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import { useModuleStyles } from '@/contexts/ModuleStylesContext';

interface ModuleStyle {
  id: string;
  module_name: string;
  gradient_start: string;
  gradient_end: string;
  is_active: boolean;
  created_at: string;
}

const ModuleStylesManagement = () => {
  const [styles, setStyles] = useState<ModuleStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingStyle, setEditingStyle] = useState<ModuleStyle | null>(null);
  const [newStyle, setNewStyle] = useState<Partial<ModuleStyle>>({
    module_name: '',
    gradient_start: '#3b82f6',
    gradient_end: '#1d4ed8',
    is_active: true
  });
  const { toast } = useToast();
  const { refreshModuleStyles } = useModuleStyles();

  // Available modules that can have styles
  const availableModules = [
    { name: 'leads', displayName: 'Leads' },
    { name: 'students', displayName: 'Students' },
    { name: 'ota-bookings', displayName: 'OTA Bookings' },
    { name: 'reports', displayName: 'Reports & Forecasting' },
    { name: 'data', displayName: 'Data Management' },
    { name: 'finance', displayName: 'Finance' },
    { name: 'settings', displayName: 'Settings' },
    { name: 'student-portal', displayName: 'Student Portal' },
    { name: 'studios', displayName: 'Studios' },
    { name: 'web-access', displayName: 'Web Access' },
    { name: 'branding', displayName: 'Branding' },
    { name: 'comms-marketing', displayName: 'Comms & Marketing' }
  ];

  // Get modules that don't have styles yet
  const getAvailableModulesForSelection = () => {
    const existingModuleNames = styles.map(style => style.module_name);
    return availableModules.filter(module => !existingModuleNames.includes(module.name));
  };

  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    try {
      setIsLoading(true);
      const stylesData = await ApiService.getModuleStyles();
      setStyles(stylesData);
    } catch (error) {
      console.error('Error fetching module styles:', error);
      toast({
        title: "Error",
        description: "Failed to load module styles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStyle = async () => {
    if (!newStyle.module_name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      const savedStyle = await ApiService.createModuleStyle({
        module_name: newStyle.module_name,
        gradient_start: newStyle.gradient_start || '#3b82f6',
        gradient_end: newStyle.gradient_end || '#1d4ed8',
        is_active: newStyle.is_active || true
      });
      
      setStyles([...styles, savedStyle]);
      setShowAddDialog(false);
      setNewStyle({
        module_name: '',
        gradient_start: '#3b82f6',
        gradient_end: '#1d4ed8',
        is_active: true
      });
      
      // Refresh the module styles context
      await refreshModuleStyles();
      
      toast({
        title: "Success",
        description: "Module style created successfully.",
      });
    } catch (error) {
      console.error('Error creating style:', error);
      toast({
        title: "Error",
        description: "Failed to create module style. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStyle = async () => {
    if (!editingStyle || !editingStyle.module_name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      const updatedStyle = await ApiService.updateModuleStyle(editingStyle.id, {
        module_name: editingStyle.module_name,
        gradient_start: editingStyle.gradient_start,
        gradient_end: editingStyle.gradient_end,
        is_active: editingStyle.is_active
      });
      
      setStyles(styles.map(style => 
        style.id === editingStyle.id ? updatedStyle : style
      ));
      setEditingStyle(null);
      
      // Refresh the module styles context
      await refreshModuleStyles();
      
      toast({
        title: "Success",
        description: "Module style updated successfully.",
      });
    } catch (error) {
      console.error('Error updating style:', error);
      toast({
        title: "Error",
        description: "Failed to update module style. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStyle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this style?')) {
      try {
        setIsSaving(true);
        
        await ApiService.deleteModuleStyle(id);
        
        setStyles(styles.filter(style => style.id !== id));
        
        // Refresh the module styles context
        await refreshModuleStyles();
        
        toast({
          title: "Success",
          description: "Module style deleted successfully.",
        });
      } catch (error) {
        console.error('Error deleting style:', error);
        toast({
          title: "Error",
          description: "Failed to delete module style. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const ColorPreview = ({ color }: { color: string }) => (
    <div 
      className="w-6 h-6 rounded border border-gray-300"
      style={{ backgroundColor: color }}
    />
  );

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Link to="/branding">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Branding
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Module Styles Management</h1>
            <p className="text-muted-foreground">Customize module colors and fonts with live preview</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Module Styles Management</h1>
          <p className="text-muted-foreground">Customize module colors and fonts with live preview</p>
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)}
          disabled={getAvailableModulesForSelection().length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Style
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {styles.map((style) => (
          <Card key={style.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{style.module_name}</CardTitle>
                    <CardDescription>Module Style Configuration</CardDescription>
                  </div>
                </div>
                <Badge variant={style.is_active ? "default" : "secondary"}>
                  {style.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Module */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Module:</p>
                  <Badge variant="outline">{style.module_name}</Badge>
                </div>

                {/* Colors */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Gradient Colors:</p>
                  <div className="flex space-x-2">
                    <div className="flex items-center space-x-1">
                      <ColorPreview color={style.gradient_start} />
                      <span className="text-xs text-muted-foreground">Start</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ColorPreview color={style.gradient_end} />
                      <span className="text-xs text-muted-foreground">End</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingStyle(style)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteStyle(style.id)}
                    disabled={isSaving}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Style Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) {
          // Reset form when dialog is closed
          setNewStyle({
            module_name: '',
            gradient_start: '#3b82f6',
            gradient_end: '#1d4ed8',
            is_active: true
          });
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Module Style</DialogTitle>
            <DialogDescription>
              Create a new style configuration for a module
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="styleName">Module Name</Label>
              <Select
                value={newStyle.module_name}
                onValueChange={(value) => setNewStyle({ ...newStyle, module_name: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a module to style" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableModulesForSelection().map((module) => (
                    <SelectItem key={module.name} value={module.name}>
                      {module.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getAvailableModulesForSelection().length === 0 && (
                <p className="text-sm text-muted-foreground">
                  All modules already have styles configured.
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gradientStart">Gradient Start Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="gradientStart"
                    type="color"
                    value={newStyle.gradient_start}
                    onChange={(e) => setNewStyle({ ...newStyle, gradient_start: e.target.value })}
                    className="w-12 h-10"
                  />
                  <Input
                    value={newStyle.gradient_start}
                    onChange={(e) => setNewStyle({ ...newStyle, gradient_start: e.target.value })}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradientEnd">Gradient End Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="gradientEnd"
                    type="color"
                    value={newStyle.gradient_end}
                    onChange={(e) => setNewStyle({ ...newStyle, gradient_end: e.target.value })}
                    className="w-12 h-10"
                  />
                  <Input
                    value={newStyle.gradient_end}
                    onChange={(e) => setNewStyle({ ...newStyle, gradient_end: e.target.value })}
                    placeholder="#1d4ed8"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddStyle} 
                disabled={isSaving || !newStyle.module_name}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create Style
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Style Dialog */}
      <Dialog open={!!editingStyle} onOpenChange={() => setEditingStyle(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Module Style</DialogTitle>
            <DialogDescription>
              Update style configuration and colors
            </DialogDescription>
          </DialogHeader>
          {editingStyle && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editStyleName">Module Name</Label>
                <Input
                  id="editStyleName"
                  value={editingStyle.module_name}
                  onChange={(e) => setEditingStyle({ ...editingStyle, module_name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editGradientStart">Gradient Start Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="editGradientStart"
                      type="color"
                      value={editingStyle.gradient_start}
                      onChange={(e) => setEditingStyle({ ...editingStyle, gradient_start: e.target.value })}
                      className="w-12 h-10"
                    />
                    <Input
                      value={editingStyle.gradient_start}
                      onChange={(e) => setEditingStyle({ ...editingStyle, gradient_start: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editGradientEnd">Gradient End Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="editGradientEnd"
                      type="color"
                      value={editingStyle.gradient_end}
                      onChange={(e) => setEditingStyle({ ...editingStyle, gradient_end: e.target.value })}
                      className="w-12 h-10"
                    />
                    <Input
                      value={editingStyle.gradient_end}
                      onChange={(e) => setEditingStyle({ ...editingStyle, gradient_end: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditingStyle(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateStyle} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Update Style
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleStylesManagement;

