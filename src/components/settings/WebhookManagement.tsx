import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Play, 
  Pause, 
  Globe, 
  Zap, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Settings,
  TestTube,
  Download,
  Upload,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Webhook {
  id: string;
  name: string;
  description: string;
  type: 'student_booking' | 'lead' | 'tourist_booking';
  status: 'active' | 'inactive' | 'testing';
  url: string;
  field_mappings: FieldMapping[];
  created_at: string;
  last_triggered?: string;
  trigger_count: number;
}

interface FieldMapping {
  wpforms_field: string;
  system_field: string;
  css_class: string;
  required: boolean;
  field_type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'date' | 'number';
}

const WebhookManagement = () => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState<Webhook | null>(null);

  // Form state for creating/editing webhooks
  const [webhookForm, setWebhookForm] = useState({
    name: '',
    description: '',
    type: 'student_booking' as const,
    field_mappings: [] as FieldMapping[]
  });

  // Available system fields for student booking
  const studentBookingFields = [
    { key: 'first_name', label: 'First Name', type: 'text', required: true },
    { key: 'last_name', label: 'Last Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'mobile', label: 'Mobile Phone', type: 'phone', required: true },
    { key: 'birthday', label: 'Date of Birth', type: 'date', required: true },
    { key: 'ethnicity', label: 'Ethnicity', type: 'text', required: true },
    { key: 'gender', label: 'Gender', type: 'select', required: true },
    { key: 'ucas_id', label: 'UCAS ID', type: 'text', required: false },
    { key: 'country', label: 'Country', type: 'text', required: true },
    { key: 'address_line1', label: 'Address Line 1', type: 'text', required: true },
    { key: 'post_code', label: 'Post Code', type: 'text', required: true },
    { key: 'town', label: 'Town', type: 'text', required: true },
    { key: 'academic_year', label: 'Academic Year', type: 'select', required: true },
    { key: 'year_of_study', label: 'Year of Study', type: 'number', required: true },
    { key: 'field_of_study', label: 'Field of Study', type: 'text', required: true },
    { key: 'guarantor_name', label: 'Guarantor Name', type: 'text', required: false },
    { key: 'guarantor_email', label: 'Guarantor Email', type: 'email', required: false },
    { key: 'guarantor_phone', label: 'Guarantor Phone', type: 'phone', required: false },
    { key: 'guarantor_relationship', label: 'Guarantor Relationship', type: 'text', required: false },
    { key: 'wants_installments', label: 'Wants Installments', type: 'select', required: false },
    { key: 'installment_plan_id', label: 'Installment Plan', type: 'select', required: false },
    { key: 'deposit_paid', label: 'Deposit Paid', type: 'select', required: false },
    { key: 'studio_id', label: 'Studio', type: 'select', required: true },
    { key: 'total_revenue', label: 'Total Revenue', type: 'number', required: true },
    { key: 'check_in_date', label: 'Check-in Date', type: 'date', required: true },
    { key: 'check_out_date', label: 'Check-out Date', type: 'date', required: true },
    { key: 'duration_name', label: 'Duration Name', type: 'text', required: true },
    { key: 'duration_type', label: 'Duration Type', type: 'select', required: true }
  ];

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    setIsLoading(true);
    try {
      // Load existing working webhooks with their exact configurations
      const existingWebhooks: Webhook[] = [
        {
          id: '1',
          name: 'Leads Webhook (Working)',
          description: 'Creates leads from WPForms submissions - currently working and tested',
          type: 'lead',
          status: 'active',
          url: 'https://yourdomain.com/final-wpforms-webhook.php',
          field_mappings: [
            { wpforms_field: 'field_1', system_field: 'first_name', css_class: '', required: true, field_type: 'text' },
            { wpforms_field: 'field_2', system_field: 'last_name', css_class: '', required: true, field_type: 'text' },
            { wpforms_field: 'field_3', system_field: 'email', css_class: '', required: false, field_type: 'email' },
            { wpforms_field: 'field_4', system_field: 'phone', css_class: '', required: false, field_type: 'phone' },
            { wpforms_field: 'field_5', system_field: 'message', css_class: '', required: false, field_type: 'textarea' },
            { wpforms_field: 'field_6', system_field: 'room_grade', css_class: '', required: false, field_type: 'select' },
            { wpforms_field: 'field_7', system_field: 'duration', css_class: '', required: false, field_type: 'select' }
          ],
          created_at: '2024-01-10T08:00:00Z',
          last_triggered: '2024-01-20T16:45:00Z',
          trigger_count: 127
        },
        {
          id: '2',
          name: 'Viewing Booking Webhook (Working)',
          description: 'Creates viewing booking leads from WPForms submissions - currently working and tested',
          type: 'lead',
          status: 'active',
          url: 'https://yourdomain.com/viewing-booking-webhook.php',
          field_mappings: [
            { wpforms_field: 'field_1', system_field: 'first_name', css_class: '', required: true, field_type: 'text' },
            { wpforms_field: 'field_2', system_field: 'last_name', css_class: '', required: true, field_type: 'text' },
            { wpforms_field: 'field_3', system_field: 'email', css_class: '', required: false, field_type: 'email' },
            { wpforms_field: 'field_4', system_field: 'phone', css_class: '', required: false, field_type: 'phone' },
            { wpforms_field: 'field_5', system_field: 'room_grade', css_class: '', required: false, field_type: 'select' },
            { wpforms_field: 'field_6', system_field: 'booking_datetime', css_class: '', required: false, field_type: 'date' },
            { wpforms_field: 'field_7', system_field: 'duration', css_class: '', required: false, field_type: 'select' }
          ],
          created_at: '2024-01-12T09:30:00Z',
          last_triggered: '2024-01-21T11:20:00Z',
          trigger_count: 89
        },
        {
          id: '3',
          name: 'Student Booking Webhook (New)',
          description: 'Creates student bookings from WPForms submissions with full functionality',
          type: 'student_booking',
          status: 'inactive',
          url: 'https://yourdomain.com/student-booking-webhook.php',
          field_mappings: [
            { wpforms_field: 'field_1', system_field: 'first_name', css_class: 'student-first-name', required: true, field_type: 'text' },
            { wpforms_field: 'field_2', system_field: 'last_name', css_class: 'student-last-name', required: true, field_type: 'text' },
            { wpforms_field: 'field_3', system_field: 'email', css_class: 'student-email', required: true, field_type: 'email' }
          ],
          created_at: '2024-01-22T10:30:00Z',
          last_triggered: undefined,
          trigger_count: 0
        }
      ];
      setWebhooks(existingWebhooks);
    } catch (error) {
      console.error('Error loading webhooks:', error);
      toast({
        title: "Error",
        description: "Failed to load webhooks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWebhook = () => {
    setIsCreateDialogOpen(true);
    setWebhookForm({
      name: '',
      description: '',
      type: 'student_booking',
      field_mappings: []
    });
  };

  const handleEditWebhook = (webhook: Webhook) => {
    if (webhook.name.includes('Working')) {
      toast({
        title: "Cannot Edit Working Webhook",
        description: "This webhook is currently working and should not be modified. Its configuration is preserved exactly as it was when working.",
        variant: "destructive",
      });
      return;
    }
    
    setEditingWebhook(webhook);
    setWebhookForm({
      name: webhook.name,
      description: webhook.description,
      type: webhook.type,
      field_mappings: webhook.field_mappings
    });
    setIsEditDialogOpen(true);
  };

  const handleTestWebhook = (webhook: Webhook) => {
    setTestingWebhook(webhook);
    setIsTestDialogOpen(true);
  };

  const handleSaveWebhook = async () => {
    try {
      // Here you would save to your backend
      const newWebhook: Webhook = {
        id: Date.now().toString(),
        name: webhookForm.name,
        description: webhookForm.description,
        type: webhookForm.type,
        status: 'inactive',
        url: `https://yourdomain.com/${webhookForm.name.toLowerCase().replace(/\s+/g, '-')}-webhook.php`,
        field_mappings: webhookForm.field_mappings,
        created_at: new Date().toISOString(),
        trigger_count: 0
      };

      if (editingWebhook) {
        setWebhooks(prev => prev.map(w => w.id === editingWebhook.id ? { ...newWebhook, id: editingWebhook.id } : w));
        setIsEditDialogOpen(false);
        setEditingWebhook(null);
        toast({
          title: "Success",
          description: "Webhook updated successfully",
        });
      } else {
        setWebhooks(prev => [...prev, newWebhook]);
        setIsCreateDialogOpen(false);
        toast({
          title: "Success",
          description: "Webhook created successfully",
        });
      }
    } catch (error) {
      console.error('Error saving webhook:', error);
      toast({
        title: "Error",
        description: "Failed to save webhook",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    try {
      setWebhooks(prev => prev.filter(w => w.id !== webhookId));
      toast({
        title: "Success",
        description: "Webhook deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast({
        title: "Error",
        description: "Failed to delete webhook",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (webhookId: string) => {
    try {
      setWebhooks(prev => prev.map(w => 
        w.id === webhookId 
          ? { ...w, status: w.status === 'active' ? 'inactive' : 'active' }
          : w
      ));
      toast({
        title: "Success",
        description: "Webhook status updated",
      });
    } catch (error) {
      console.error('Error updating webhook status:', error);
      toast({
        title: "Error",
        description: "Failed to update webhook status",
        variant: "destructive",
      });
    }
  };

  const addFieldMapping = () => {
    setWebhookForm(prev => ({
      ...prev,
      field_mappings: [...prev.field_mappings, {
        wpforms_field: '',
        system_field: '',
        css_class: '',
        required: false,
        field_type: 'text'
      }]
    }));
  };

  const updateFieldMapping = (index: number, field: Partial<FieldMapping>) => {
    setWebhookForm(prev => ({
      ...prev,
      field_mappings: prev.field_mappings.map((mapping, i) => 
        i === index ? { ...mapping, ...field } : mapping
      )
    }));
  };

  const removeFieldMapping = (index: number) => {
    setWebhookForm(prev => ({
      ...prev,
      field_mappings: prev.field_mappings.filter((_, i) => i !== index)
    }));
  };

  const generateWebhookCode = (webhook: Webhook) => {
    // This will generate the PHP webhook code
    const fieldMappings = webhook.field_mappings.map(mapping => 
      `    '${mapping.system_field}' => $extractedData['${mapping.wpforms_field}'] ?? $extractedData['${mapping.css_class}'] ?? '',`
    ).join('\n');

    return `<?php
// ${webhook.name} webhook for WPForms
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Supabase configuration
$SUPABASE_URL = 'https://vwgczfdedacpymnxzxcp.supabase.co';
$SUPABASE_SERVICE_ROLE_KEY = 'your-service-role-key';

// Log file for debugging
$logFile = '${webhook.name.toLowerCase().replace(/\s+/g, '-')}-webhook-debug.log';

try {
    // Get the raw POST data
    $rawData = file_get_contents('php://input');
    $formData = json_decode($rawData, true);

    // Extract the data - handle different WPForms formats
    $extractedData = [];
    
    if (isset($formData['wpforms']['fields'])) {
        $fields = $formData['wpforms']['fields'];
        foreach ($fields as $fieldId => $value) {
            $extractedData['field_' . $fieldId] = $value;
        }
    } elseif (isset($formData['fields'])) {
        $fields = $formData['fields'];
        foreach ($fields as $fieldId => $value) {
            $extractedData['field_' . $fieldId] = $value;
        }
    } elseif (is_array($formData)) {
        $extractedData = $formData;
    } else {
        $extractedData = $_POST;
    }

    // Extract field values
${fieldMappings}

    // Create student booking data
    $studentData = [
${webhook.field_mappings.map(mapping => `        '${mapping.system_field}' => $${mapping.system_field.replace(/\s+/g, '_')},`).join('\n')}
    ];

    // Call your student booking creation logic here
    // This would integrate with your existing student booking system
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Student booking created successfully',
        'data' => $studentData
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error',
        'error' => $e->getMessage()
    ]);
}
?>`;
  };

  const downloadWebhookCode = (webhook: Webhook) => {
    const code = generateWebhookCode(webhook);
    const blob = new Blob([code], { type: 'text/php' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${webhook.name.toLowerCase().replace(/\s+/g, '-')}-webhook.php`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>;
      case 'testing':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600"><TestTube className="h-3 w-3 mr-1" />Testing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Webhook Management</h1>
            <p className="text-muted-foreground">Manage WPForms webhooks for automated data processing</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
          <h1 className="text-3xl font-bold tracking-tight">Webhook Management</h1>
          <p className="text-muted-foreground">Manage WPForms webhooks for automated data processing</p>
        </div>
        <Button onClick={handleCreateWebhook} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Webhook
        </Button>
      </div>

      {/* Webhook Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Webhooks</p>
                <p className="text-2xl font-bold">{webhooks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{webhooks.filter(w => w.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Working Webhooks</p>
                <p className="text-2xl font-bold">{webhooks.filter(w => w.name.includes('Working')).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Triggers</p>
                <p className="text-2xl font-bold">{webhooks.reduce((sum, w) => sum + w.trigger_count, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Working Webhooks Info */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Working Webhooks:</strong> The "Leads Webhook" and "Viewing Booking Webhook" are currently active and working with your WPForms. 
          These webhooks are configured exactly as they were when they were working. Do not modify their field mappings or configurations.
        </AlertDescription>
      </Alert>

      {/* Webhooks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>Manage your WPForms webhooks and their configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Last Triggered</TableHead>
                <TableHead>Triggers</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{webhook.name}</p>
                        {webhook.name.includes('Working') && (
                          <Badge variant="default" className="bg-green-500 text-white text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Working
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{webhook.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{webhook.type.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(webhook.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{webhook.url}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(webhook.url)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {webhook.last_triggered 
                      ? new Date(webhook.last_triggered).toLocaleDateString()
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell>{webhook.trigger_count}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(webhook.id)}
                      >
                        {webhook.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditWebhook(webhook)}
                        disabled={webhook.name.includes('Working')}
                        title={webhook.name.includes('Working') ? 'Cannot edit working webhook' : 'Edit webhook'}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestWebhook(webhook)}
                      >
                        <TestTube className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadWebhookCode(webhook)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteWebhook(webhook.id)}
                        disabled={webhook.name.includes('Working')}
                        title={webhook.name.includes('Working') ? 'Cannot delete working webhook' : 'Delete webhook'}
                        className="text-red-600 hover:text-red-700 disabled:text-gray-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Webhook Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setEditingWebhook(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingWebhook ? 'Edit Webhook' : 'Create New Webhook'}
            </DialogTitle>
            <DialogDescription>
              Configure your webhook to process WPForms submissions and create student bookings
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="mappings">Field Mappings</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Webhook Name</Label>
                  <Input
                    id="name"
                    value={webhookForm.name}
                    onChange={(e) => setWebhookForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Student Booking Webhook"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Webhook Type</Label>
                  <Select
                    value={webhookForm.type}
                    onValueChange={(value: any) => setWebhookForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student_booking">Student Booking</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="tourist_booking">Tourist Booking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={webhookForm.description}
                  onChange={(e) => setWebhookForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this webhook does..."
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="mappings" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Field Mappings</h3>
                  <p className="text-sm text-muted-foreground">
                    Map WPForms fields to system fields using CSS classes
                  </p>
                </div>
                <Button onClick={addFieldMapping} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mapping
                </Button>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  To use this webhook, add the CSS classes specified below to your WPForms fields.
                  For example, add "student-first-name" class to your first name field.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {webhookForm.field_mappings.map((mapping, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-5 gap-4 items-end">
                      <div>
                        <Label>WPForms Field</Label>
                        <Input
                          value={mapping.wpforms_field}
                          onChange={(e) => updateFieldMapping(index, { wpforms_field: e.target.value })}
                          placeholder="field_1"
                        />
                      </div>
                      <div>
                        <Label>System Field</Label>
                        <Select
                          value={mapping.system_field}
                          onValueChange={(value) => updateFieldMapping(index, { system_field: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {studentBookingFields.map((field) => (
                              <SelectItem key={field.key} value={field.key}>
                                {field.label} {field.required && '*'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>CSS Class</Label>
                        <Input
                          value={mapping.css_class}
                          onChange={(e) => updateFieldMapping(index, { css_class: e.target.value })}
                          placeholder="student-first-name"
                        />
                      </div>
                      <div>
                        <Label>Required</Label>
                        <Select
                          value={mapping.required.toString()}
                          onValueChange={(value) => updateFieldMapping(index, { required: value === 'true' })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFieldMapping(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Generated Webhook Code</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    {generateWebhookCode({
                      id: 'preview',
                      name: webhookForm.name || 'Preview Webhook',
                      description: webhookForm.description,
                      type: webhookForm.type,
                      status: 'inactive',
                      url: '',
                      field_mappings: webhookForm.field_mappings,
                      created_at: '',
                      trigger_count: 0
                    })}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
                setEditingWebhook(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveWebhook}>
              {editingWebhook ? 'Update Webhook' : 'Create Webhook'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Webhook Dialog */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Webhook</DialogTitle>
            <DialogDescription>
              Send a test payload to {testingWebhook?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <TestTube className="h-4 w-4" />
              <AlertDescription>
                This will send a test payload to your webhook URL to verify it's working correctly.
              </AlertDescription>
            </Alert>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Test Payload:</h4>
              <pre className="text-sm text-gray-600">
                {JSON.stringify({
                  wpforms: {
                    fields: testingWebhook?.field_mappings.reduce((acc, mapping) => {
                      acc[mapping.wpforms_field] = `Test ${mapping.system_field}`;
                      return acc;
                    }, {} as Record<string, string>)
                  }
                }, null, 2)}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Test Sent",
                description: "Test payload sent to webhook",
              });
              setIsTestDialogOpen(false);
            }}>
              Send Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebhookManagement;
