
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Plus, Edit, Trash2, Loader2, Save, List } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';

interface OptionField {
  id: string;
  name: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'date' | 'checkbox';
  options?: string[];
  required: boolean;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const StudentOptionFieldsManagement = () => {
  const { toast } = useToast();
  const [fields, setFields] = useState<OptionField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingField, setEditingField] = useState<OptionField | null>(null);
  const [newField, setNewField] = useState<Partial<OptionField>>({
    name: '',
    label: '',
    type: 'text',
    options: [],
    required: false,
    order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      setIsLoading(true);
      const fieldsData = await ApiService.getStudentOptionFields();
      setFields(fieldsData);
    } catch (error) {
      console.error('Error fetching fields:', error);
      toast({
        title: "Error",
        description: "Failed to load option fields. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddField = async () => {
    if (!newField.name || !newField.label) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // In a real implementation, you would save to the database
      // const createdField = await ApiService.createStudentOptionField(newField);
      
      const createdField: OptionField = {
        id: Date.now().toString(),
        name: newField.name!,
        label: newField.label!,
        type: newField.type!,
        options: newField.options || [],
        required: newField.required!,
        order: newField.order!,
        is_active: newField.is_active!,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setFields([...fields, createdField]);
      setShowAddDialog(false);
      setNewField({
        name: '',
        label: '',
        type: 'text',
        options: [],
        required: false,
        order: 0,
        is_active: true
      });
      
      toast({
        title: "Success",
        description: "Option field created successfully.",
      });
    } catch (error) {
      console.error('Error creating field:', error);
      toast({
        title: "Error",
        description: "Failed to create option field. Please try again.",
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
      
      // In a real implementation, you would update in the database
      // await ApiService.updateStudentOptionField(editingField.id, editingField);
      
      const updatedFields = fields.map(field => 
        field.id === editingField.id ? editingField : field
      );
      
      setFields(updatedFields);
      setEditingField(null);
      
      toast({
        title: "Success",
        description: "Option field updated successfully.",
      });
    } catch (error) {
      console.error('Error updating field:', error);
      toast({
        title: "Error",
        description: "Failed to update option field. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteField = async (id: string) => {
    try {
      setIsSaving(true);
      
      // In a real implementation, you would delete from the database
      // await ApiService.deleteStudentOptionField(id);
      
      const updatedFields = fields.filter(field => field.id !== id);
      setFields(updatedFields);
      
      toast({
        title: "Success",
        description: "Option field deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting field:', error);
      toast({
        title: "Error",
        description: "Failed to delete option field. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddOption = (fieldId: string, option: string) => {
    if (!option.trim()) return;
    
    const updatedFields = fields.map(field => 
      field.id === fieldId 
        ? { ...field, options: [...(field.options || []), option.trim()] }
        : field
    );
    setFields(updatedFields);
    
    if (editingField && editingField.id === fieldId) {
      setEditingField({
        ...editingField,
        options: [...(editingField.options || []), option.trim()]
      });
    }
  };

  const handleRemoveOption = (fieldId: string, optionIndex: number) => {
    const updatedFields = fields.map(field => 
      field.id === fieldId 
        ? { ...field, options: field.options?.filter((_, index) => index !== optionIndex) }
        : field
    );
    setFields(updatedFields);
    
    if (editingField && editingField.id === fieldId) {
      setEditingField({
        ...editingField,
        options: editingField.options?.filter((_, index) => index !== optionIndex)
      });
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      select: 'Dropdown',
      text: 'Text Input',
      number: 'Number Input',
      date: 'Date Picker',
      checkbox: 'Checkbox'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-80 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
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
          <h1 className="text-3xl font-bold tracking-tight">Student Option Fields Management</h1>
          <p className="text-muted-foreground">Configure student profile option fields</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Option Field</DialogTitle>
              <DialogDescription>
                Create a new option field for student profiles
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fieldName">Field Name *</Label>
                  <Input
                    id="fieldName"
                    placeholder="e.g., ethnicity"
                    value={newField.name}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fieldLabel">Display Label *</Label>
                  <Input
                    id="fieldLabel"
                    placeholder="e.g., Ethnicity"
                    value={newField.label}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fieldType">Field Type</Label>
                  <Select value={newField.type} onValueChange={(value) => setNewField({ ...newField, type: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Input</SelectItem>
                      <SelectItem value="select">Dropdown</SelectItem>
                      <SelectItem value="number">Number Input</SelectItem>
                      <SelectItem value="date">Date Picker</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fieldOrder">Display Order</Label>
                  <Input
                    id="fieldOrder"
                    type="number"
                    placeholder="0"
                    value={newField.order}
                    onChange={(e) => setNewField({ ...newField, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              {newField.type === 'select' && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {newField.options?.map((option, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const updatedOptions = [...(newField.options || [])];
                            updatedOptions[index] = e.target.value;
                            setNewField({ ...newField, options: updatedOptions });
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updatedOptions = newField.options?.filter((_, i) => i !== index);
                            setNewField({ ...newField, options: updatedOptions });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewField({ ...newField, options: [...(newField.options || []), ''] })}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddField} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Create Field
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => (
          <Card key={field.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{field.label}</CardTitle>
                    <CardDescription>{field.name}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={field.is_active ? "default" : "secondary"}>
                    {field.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="outline">
                    {getTypeLabel(field.type)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Field Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Required:</span>
                    <span>{field.required ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order:</span>
                    <span>{field.order}</span>
                  </div>
                  {field.type === 'select' && field.options && field.options.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Options:</span>
                      <div className="flex flex-wrap gap-1">
                        {field.options.slice(0, 3).map((option, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {option}
                          </Badge>
                        ))}
                        {field.options.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{field.options.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t">
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Field Dialog */}
      <Dialog open={!!editingField} onOpenChange={() => setEditingField(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Option Field</DialogTitle>
            <DialogDescription>
              Update field configuration and options
            </DialogDescription>
          </DialogHeader>
          {editingField && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFieldName">Field Name</Label>
                  <Input
                    id="editFieldName"
                    value={editingField.name}
                    onChange={(e) => setEditingField({ ...editingField, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editFieldLabel">Display Label</Label>
                  <Input
                    id="editFieldLabel"
                    value={editingField.label}
                    onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFieldType">Field Type</Label>
                  <Select value={editingField.type} onValueChange={(value) => setEditingField({ ...editingField, type: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Input</SelectItem>
                      <SelectItem value="select">Dropdown</SelectItem>
                      <SelectItem value="number">Number Input</SelectItem>
                      <SelectItem value="date">Date Picker</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editFieldOrder">Display Order</Label>
                  <Input
                    id="editFieldOrder"
                    type="number"
                    value={editingField.order}
                    onChange={(e) => setEditingField({ ...editingField, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              {editingField.type === 'select' && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {editingField.options?.map((option, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const updatedOptions = [...(editingField.options || [])];
                            updatedOptions[index] = e.target.value;
                            setEditingField({ ...editingField, options: updatedOptions });
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveOption(editingField.id, index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingField({ ...editingField, options: [...(editingField.options || []), ''] })}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditingField(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateField} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Update Field
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentOptionFieldsManagement;
