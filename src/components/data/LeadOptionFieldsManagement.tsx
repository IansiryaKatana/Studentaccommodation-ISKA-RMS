
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Edit, Trash2, Save, Loader2, X, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';

interface OptionField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  options: string[];
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const LeadOptionFieldsManagement = () => {
  const [fields, setFields] = useState<OptionField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingField, setEditingField] = useState<OptionField | null>(null);
  const [newField, setNewField] = useState<Partial<OptionField>>({
    field_name: '',
    field_label: '',
    field_type: 'response_category',
    options: [],
    is_required: false,
    is_active: true
  });
  const [newOption, setNewOption] = useState('');
  const { toast } = useToast();

  const fieldTypes = [
    { value: 'response_category', label: 'Response Category' },
    { value: 'follow_up_stage', label: 'Follow-up Stage' }
  ];

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      setIsLoading(true);
      const fieldsData = await ApiService.getLeadOptionFields();
      
      // Ensure each field has proper structure
      const fieldsWithOptions = fieldsData.map(field => ({
        ...field,
        options: field.options || [],
        is_required: field.is_required !== undefined ? field.is_required : false,
        is_active: field.is_active !== undefined ? field.is_active : true,
        created_at: field.created_at || new Date().toISOString(),
        updated_at: field.updated_at || new Date().toISOString()
      }));
      
      setFields(fieldsWithOptions);
    } catch (error) {
      console.error('Error fetching lead option fields:', error);
      toast({
        title: "Error",
        description: "Failed to load lead option fields. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddField = async () => {
    if (!newField.field_name || !newField.field_label || !newField.field_type) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      const fieldData = {
        field_name: newField.field_name,
        field_label: newField.field_label,
        field_type: newField.field_type,
        options: newField.options || [],
        is_required: newField.is_required || false,
        is_active: newField.is_active !== undefined ? newField.is_active : true
      };

      await ApiService.createLeadOptionField(fieldData);
      
      // Reset form and refresh data
      setNewField({
        field_name: '',
        field_label: '',
        field_type: 'response_category',
        options: [],
        is_required: false,
        is_active: true
      });
      setShowAddDialog(false);
      
      // Refresh the data to show the new field
      await fetchFields();
      
      toast({
        title: "Success",
        description: "Lead option field added successfully.",
      });
    } catch (error) {
      console.error('Error adding lead option field:', error);
      toast({
        title: "Error",
        description: "Failed to add lead option field. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateField = async () => {
    if (!editingField) return;

    try {
      setIsSaving(true);
      
      const updates = {
        field_name: editingField.field_name,
        field_label: editingField.field_label,
        field_type: editingField.field_type,
        options: editingField.options,
        is_required: editingField.is_required,
        is_active: editingField.is_active
      };

      await ApiService.updateLeadOptionField(editingField.id, updates);
      
      // Reset editing state and refresh data
      setEditingField(null);
      
      // Refresh the data to show the updated field
      await fetchFields();
      
      toast({
        title: "Success",
        description: "Lead option field updated successfully.",
      });
    } catch (error) {
      console.error('Error updating lead option field:', error);
      toast({
        title: "Error",
        description: "Failed to update lead option field. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteField = async (id: string) => {
    if (!confirm('Are you sure you want to delete this field? This action cannot be undone.')) {
      return;
    }

    try {
      setIsSaving(true);
      await ApiService.deleteLeadOptionField(id);
      
      // Refresh the data to show the updated list
      await fetchFields();
      
      toast({
        title: "Success",
        description: "Lead option field deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting lead option field:', error);
      toast({
        title: "Error",
        description: "Failed to delete lead option field. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddOption = (fieldId: string, options: string[]) => {
    if (!newOption.trim()) return;
    
    const updatedOptions = [...options, newOption.trim()];
    
    if (editingField && editingField.id === fieldId) {
      setEditingField({ ...editingField, options: updatedOptions });
    } else {
      setNewField({ ...newField, options: updatedOptions });
    }
    
    setNewOption('');
  };

  const handleRemoveOption = (fieldId: string, options: string[], optionToRemove: string) => {
    const updatedOptions = options.filter(option => option !== optionToRemove);
    
    if (editingField && editingField.id === fieldId) {
      setEditingField({ ...editingField, options: updatedOptions });
    } else {
      setNewField({ ...newField, options: updatedOptions });
    }
  };

  const getFieldTypeLabel = (type: string) => {
    const fieldType = fieldTypes.find(ft => ft.value === type);
    return fieldType?.label || type;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Link to="/data">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Data
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lead Option Fields Management</h1>
            <p className="text-muted-foreground">Configure lead management option fields</p>
          </div>
        </div>
        {/* Summary Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fields List Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-16" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Option Fields Management</h1>
          <p className="text-muted-foreground">Configure lead management option fields</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Fields</p>
                <p className="text-2xl font-bold">{fields.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Fields</p>
                <p className="text-2xl font-bold">{fields.filter(f => f.is_active).length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Options</p>
                <p className="text-2xl font-bold">{fields.reduce((sum, field) => sum + (field.options?.length || 0), 0)}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fields List */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Option Fields</CardTitle>
          <CardDescription>Manage all lead form option fields and their available choices</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Loading lead option fields...</p>
            </div>
          ) : fields.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No lead option fields</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new field.</p>
              <div className="mt-6">
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-lg">{field.field_name}</h4>
                        <Badge variant="outline">{getFieldTypeLabel(field.field_type)}</Badge>
                        {field.is_required && (
                          <Badge variant="destructive">Required</Badge>
                        )}
                        <Badge variant={field.is_active ? "default" : "secondary"}>
                          {field.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{field.field_label}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {field.options?.slice(0, 5).map((option, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {option}
                          </Badge>
                        ))}
                        {field.options && field.options.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{field.options.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingField(field)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteField(field.id)}
                      disabled={isSaving}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Field Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Lead Option Field</DialogTitle>
            <DialogDescription>
              Create a new option field for lead management
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fieldName">Field Name (Database Column)</Label>
              <Input
                id="fieldName"
                value={newField.field_name}
                onChange={(e) => setNewField({ ...newField, field_name: e.target.value })}
                placeholder="e.g., response_category"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fieldLabel">Display Label</Label>
              <Input
                id="fieldLabel"
                value={newField.field_label}
                onChange={(e) => setNewField({ ...newField, field_label: e.target.value })}
                placeholder="e.g., Response Category"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fieldType">Field Type</Label>
              <Select value={newField.field_type} onValueChange={(value) => setNewField({ ...newField, field_type: value as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add new option"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddOption('new', newField.options || []);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddOption('new', newField.options || [])}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {newField.options?.map((option, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {option}
                      <button
                        type="button"
                        onClick={() => handleRemoveOption('new', newField.options || [], option)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRequired"
                checked={newField.is_required}
                onChange={(e) => setNewField({ ...newField, is_required: e.target.checked })}
              />
              <Label htmlFor="isRequired">Required field</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={newField.is_active}
                onChange={(e) => setNewField({ ...newField, is_active: e.target.checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddField} disabled={isSaving} className="flex-1">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Add Field
              </Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Field Dialog */}
      <Dialog open={!!editingField} onOpenChange={() => setEditingField(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Lead Option Field</DialogTitle>
            <DialogDescription>
              Modify the field: {editingField?.field_name}
            </DialogDescription>
          </DialogHeader>
          {editingField && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editFieldName">Field Name (Database Column)</Label>
                <Input
                  id="editFieldName"
                  value={editingField.field_name}
                  onChange={(e) => setEditingField({ ...editingField, field_name: e.target.value })}
                  placeholder="e.g., response_category"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editFieldLabel">Display Label</Label>
                <Input
                  id="editFieldLabel"
                  value={editingField.field_label}
                  onChange={(e) => setEditingField({ ...editingField, field_label: e.target.value })}
                  placeholder="e.g., Response Category"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editFieldType">Field Type</Label>
                <Select value={editingField.field_type} onValueChange={(value) => setEditingField({ ...editingField, field_type: value as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Add new option"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddOption(editingField.id, editingField.options || []);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddOption(editingField.id, editingField.options || [])}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {editingField.options?.map((option, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {option}
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(editingField.id, editingField.options || [], option)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="editIsRequired"
                  checked={editingField.is_required}
                  onChange={(e) => setEditingField({ ...editingField, is_required: e.target.checked })}
                />
                <Label htmlFor="editIsRequired">Required field</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingField.is_active}
                  onChange={(e) => setEditingField({ ...editingField, is_active: e.target.checked })}
                />
                <Label htmlFor="editIsActive">Active</Label>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleUpdateField} disabled={isSaving} className="flex-1">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Update Field
                </Button>
                <Button variant="outline" onClick={() => setEditingField(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadOptionFieldsManagement;
