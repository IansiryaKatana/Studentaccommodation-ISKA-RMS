import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Mail, 
  FileText, 
  Settings,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  html_content: string;
  text_content: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const EmailTemplateManager = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subject: '',
    html_content: '',
    text_content: '',
    variables: [] as string[],
    is_active: true
  });
  const [newVariable, setNewVariable] = useState('');

  const templateCategories = [
    { value: 'payment_reminder', label: 'Payment Reminder' },
    { value: 'overdue_notice', label: 'Overdue Notice' },
    { value: 'general_announcement', label: 'General Announcement' },
    { value: 'welcome', label: 'Welcome Email' },
    { value: 'maintenance_notification', label: 'Maintenance Notification' },
    { value: 'payment_confirmation', label: 'Payment Confirmation' },
    { value: 'custom', label: 'Custom Template' }
  ];

  const commonVariables = [
    'student_name',
    'student_email',
    'invoice_number',
    'amount_due',
    'due_date',
    'days_overdue',
    'payment_link',
    'company_name',
    'announcement_title',
    'announcement_content'
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getEmailTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch email templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setFormData({
      name: '',
      category: '',
      subject: '',
      html_content: '',
      text_content: '',
      variables: [],
      is_active: true
    });
    setShowDialog(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      subject: template.subject,
      html_content: template.html_content,
      text_content: template.text_content,
      variables: template.variables,
      is_active: template.is_active
    });
    setShowDialog(true);
  };

  const handleSaveTemplate = async () => {
    try {
      if (editingTemplate) {
        await ApiService.updateEmailTemplate(editingTemplate.id, formData);
        toast({
          title: "Success",
          description: "Email template updated successfully"
        });
      } else {
        await ApiService.createEmailTemplate(formData);
        toast({
          title: "Success",
          description: "Email template created successfully"
        });
      }
      setShowDialog(false);
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save email template",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTemplate = async (template: EmailTemplate) => {
    try {
      await ApiService.deleteEmailTemplate(template.id);
      toast({
        title: "Success",
        description: "Email template deleted successfully"
      });
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete email template",
        variant: "destructive"
      });
    }
  };

  const handleDuplicateTemplate = (template: EmailTemplate) => {
    setEditingTemplate(null);
    setFormData({
      name: `${template.name} (Copy)`,
      category: template.category,
      subject: template.subject,
      html_content: template.html_content,
      text_content: template.text_content,
      variables: template.variables,
      is_active: true
    });
    setShowDialog(true);
  };

  const addVariable = () => {
    if (newVariable && !formData.variables.includes(newVariable)) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, newVariable]
      }));
      setNewVariable('');
    }
  };

  const removeVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variable)
    }));
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      payment_reminder: 'bg-blue-100 text-blue-800',
      overdue_notice: 'bg-red-100 text-red-800',
      general_announcement: 'bg-green-100 text-green-800',
      welcome: 'bg-purple-100 text-purple-800',
      maintenance_notification: 'bg-orange-100 text-orange-800',
      payment_confirmation: 'bg-emerald-100 text-emerald-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const categoryObj = templateCategories.find(cat => cat.value === category);
    return categoryObj?.label || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading email templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Template Manager</h1>
          <p className="text-gray-600">Create and manage email templates for your campaigns</p>
        </div>
        <Button onClick={handleCreateTemplate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
                  <Badge className={`mt-2 ${getCategoryColor(template.category)}`}>
                    {getCategoryLabel(template.category)}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {template.is_active ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Subject:</p>
                <p className="text-sm font-medium line-clamp-2">{template.subject}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Variables:</p>
                <div className="flex flex-wrap gap-1">
                  {template.variables.slice(0, 3).map((variable) => (
                    <Badge key={variable} variant="outline" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                  {template.variables.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.variables.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-gray-500">
                  Updated {new Date(template.updated_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowPreview(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTemplate(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicateTemplate(template)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Template</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{template.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTemplate(template)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No email templates found</h3>
            <p className="text-gray-600 mb-4">Create your first email template to get started</p>
            <Button onClick={handleCreateTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Template Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Email Template' : 'Create Email Template'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {templateCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Enter email subject (use {{variable_name}} for dynamic content)"
              />
            </div>

            <div>
              <Label>Template Variables</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newVariable}
                    onChange={(e) => setNewVariable(e.target.value)}
                    placeholder="Add variable (e.g., student_name)"
                    onKeyPress={(e) => e.key === 'Enter' && addVariable()}
                  />
                  <Button onClick={addVariable} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.variables.map((variable) => (
                    <Badge key={variable} variant="secondary" className="flex items-center gap-1">
                      {variable}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeVariable(variable)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Common variables:</p>
                  <div className="flex flex-wrap gap-1">
                    {commonVariables.map((variable) => (
                      <Badge
                        key={variable}
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          if (!formData.variables.includes(variable)) {
                            setFormData(prev => ({
                              ...prev,
                              variables: [...prev.variables, variable]
                            }));
                          }
                        }}
                      >
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="html" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="html">HTML Content</TabsTrigger>
                <TabsTrigger value="text">Text Content</TabsTrigger>
              </TabsList>
              <TabsContent value="html" className="space-y-2">
                <Label htmlFor="html_content">HTML Content</Label>
                <Textarea
                  id="html_content"
                  value={formData.html_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, html_content: e.target.value }))}
                  placeholder="Enter HTML content for the email"
                  className="min-h-[300px] font-mono text-sm"
                />
              </TabsContent>
              <TabsContent value="text" className="space-y-2">
                <Label htmlFor="text_content">Text Content</Label>
                <Textarea
                  id="text_content"
                  value={formData.text_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, text_content: e.target.value }))}
                  placeholder="Enter plain text content for the email"
                  className="min-h-[300px]"
                />
              </TabsContent>
            </Tabs>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="is_active">Active Template</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {editingTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Template Preview: {selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Subject:</Label>
                <p className="text-sm bg-gray-50 p-2 rounded">{selectedTemplate.subject}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Variables:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedTemplate.variables.map((variable) => (
                    <Badge key={variable} variant="outline" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>

              <Tabs defaultValue="html" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="html">HTML Preview</TabsTrigger>
                  <TabsTrigger value="text">Text Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="html">
                  <div className="border rounded p-4 bg-gray-50 max-h-96 overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: selectedTemplate.html_content }} />
                  </div>
                </TabsContent>
                <TabsContent value="text">
                  <div className="border rounded p-4 bg-gray-50 max-h-96 overflow-y-auto whitespace-pre-wrap">
                    {selectedTemplate.text_content}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailTemplateManager;
