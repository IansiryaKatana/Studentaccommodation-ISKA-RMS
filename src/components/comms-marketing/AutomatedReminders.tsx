import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Settings,
  Clock,
  Calendar,
  Mail,
  AlertCircle,
  CheckCircle,
  Bell,
  Zap,
  Users,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';

interface AutomatedRule {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_conditions: {
    days_before?: number;
    days_after?: number;
    conditions?: any;
  };
  template_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  email_templates?: {
    id: string;
    name: string;
    category: string;
    subject: string;
  };
}

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
}

const AutomatedReminders = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<AutomatedRule[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomatedRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger_type: '',
    trigger_conditions: {
      days_before: 0,
      days_after: 0,
      conditions: {}
    },
    template_id: '',
    is_active: true
  });

  const triggerTypes = [
    { value: 'payment_reminder', label: 'Payment Reminder', icon: Calendar },
    { value: 'overdue_notice', label: 'Overdue Notice', icon: AlertCircle },
    { value: 'welcome', label: 'Welcome Email', icon: CheckCircle },
    { value: 'maintenance_notification', label: 'Maintenance Notification', icon: Settings },
    { value: 'custom', label: 'Custom Trigger', icon: Zap }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rulesData, templatesData] = await Promise.all([
        ApiService.getAutomatedEmailRules(),
        ApiService.getEmailTemplates()
      ]);
      
      setRules(rulesData);
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch automated rules",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = () => {
    setEditingRule(null);
    setFormData({
      name: '',
      description: '',
      trigger_type: '',
      trigger_conditions: {
        days_before: 0,
        days_after: 0,
        conditions: {}
      },
      template_id: '',
      is_active: true
    });
    setShowCreateDialog(true);
  };

  const handleEditRule = (rule: AutomatedRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description || '',
      trigger_type: rule.trigger_type,
      trigger_conditions: rule.trigger_conditions,
      template_id: rule.template_id,
      is_active: rule.is_active
    });
    setShowCreateDialog(true);
  };

  const handleSaveRule = async () => {
    try {
      if (editingRule) {
        await ApiService.updateAutomatedEmailRule(editingRule.id, formData);
        toast({
          title: "Success",
          description: "Automated rule updated successfully"
        });
      } else {
        await ApiService.createAutomatedEmailRule(formData);
        toast({
          title: "Success",
          description: "Automated rule created successfully"
        });
      }
      setShowCreateDialog(false);
      fetchData();
    } catch (error) {
      console.error('Error saving rule:', error);
      toast({
        title: "Error",
        description: "Failed to save automated rule",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRule = async (rule: AutomatedRule) => {
    try {
      await ApiService.deleteAutomatedEmailRule(rule.id);
      toast({
        title: "Success",
        description: "Automated rule deleted successfully"
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast({
        title: "Error",
        description: "Failed to delete automated rule",
        variant: "destructive"
      });
    }
  };

  const handleToggleRule = async (rule: AutomatedRule) => {
    try {
      await ApiService.updateAutomatedEmailRule(rule.id, {
        is_active: !rule.is_active
      });
      toast({
        title: "Success",
        description: `Rule ${rule.is_active ? 'deactivated' : 'activated'} successfully`
      });
      fetchData();
    } catch (error) {
      console.error('Error toggling rule:', error);
      toast({
        title: "Error",
        description: "Failed to update rule status",
        variant: "destructive"
      });
    }
  };

  const getTriggerTypeInfo = (type: string) => {
    return triggerTypes.find(t => t.value === type) || triggerTypes[0];
  };

  const getTriggerDescription = (rule: AutomatedRule) => {
    const { trigger_type, trigger_conditions } = rule;
    
    if (trigger_type === 'payment_reminder') {
      if (trigger_conditions.days_before) {
        return `Sends ${trigger_conditions.days_before} days before due date`;
      }
    } else if (trigger_type === 'overdue_notice') {
      if (trigger_conditions.days_after) {
        return `Sends ${trigger_conditions.days_after} days after due date`;
      }
    } else if (trigger_type === 'welcome') {
      return 'Sends when student account is created';
    } else if (trigger_type === 'maintenance_notification') {
      return 'Sends when maintenance request is created';
    }
    
    return 'Custom trigger conditions';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle className="h-4 w-4" /> : <Pause className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading automated rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automated Reminders</h1>
          <p className="text-gray-600">Set up automated email reminders for payments and notifications</p>
        </div>
        <Button onClick={handleCreateRule} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Rule
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.length}</div>
            <p className="text-xs text-muted-foreground">
              Automated email rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.filter(r => r.is_active).length}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Reminders</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.filter(r => r.trigger_type === 'payment_reminder').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Payment reminder rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Notices</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.filter(r => r.trigger_type === 'overdue_notice').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Overdue notice rules
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rules.map((rule) => {
          const triggerInfo = getTriggerTypeInfo(rule.trigger_type);
          const TriggerIcon = triggerInfo.icon;
          
          return (
            <Card key={rule.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <TriggerIcon className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg font-semibold">{rule.name}</CardTitle>
                    </div>
                    {rule.description && (
                      <p className="text-sm text-gray-600">{rule.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(rule.is_active)} flex items-center gap-1`}>
                      {getStatusIcon(rule.is_active)}
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Trigger Info */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Trigger Type:</p>
                  <p className="text-sm font-medium">{triggerInfo.label}</p>
                </div>

                {/* Trigger Description */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">When:</p>
                  <p className="text-sm">{getTriggerDescription(rule)}</p>
                </div>

                {/* Template Info */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Template:</p>
                  <p className="text-sm font-medium">{rule.email_templates?.name || 'Unknown'}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {rule.email_templates?.category || 'Unknown'}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleRule(rule)}
                    >
                      {rule.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRule(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Rule</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{rule.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteRule(rule)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <span className="text-xs text-gray-500">
                    Updated {new Date(rule.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {rules.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No automated rules found</h3>
            <p className="text-gray-600 mb-4">Create your first automated reminder rule</p>
            <Button onClick={handleCreateRule}>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Rule Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'Edit Automated Rule' : 'Create Automated Rule'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter rule name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter rule description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="trigger_type">Trigger Type</Label>
              <Select
                value={formData.trigger_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, trigger_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent>
                  {triggerTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Trigger Conditions */}
            {formData.trigger_type === 'payment_reminder' && (
              <div>
                <Label htmlFor="days_before">Days Before Due Date</Label>
                <Input
                  id="days_before"
                  type="number"
                  min="0"
                  max="30"
                  value={formData.trigger_conditions.days_before}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    trigger_conditions: {
                      ...prev.trigger_conditions,
                      days_before: parseInt(e.target.value) || 0
                    }
                  }))}
                  placeholder="e.g., 7"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Send reminder this many days before the due date
                </p>
              </div>
            )}

            {formData.trigger_type === 'overdue_notice' && (
              <div>
                <Label htmlFor="days_after">Days After Due Date</Label>
                <Input
                  id="days_after"
                  type="number"
                  min="0"
                  max="30"
                  value={formData.trigger_conditions.days_after}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    trigger_conditions: {
                      ...prev.trigger_conditions,
                      days_after: parseInt(e.target.value) || 0
                    }
                  }))}
                  placeholder="e.g., 3"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Send notice this many days after the due date
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="template">Email Template</Label>
              <Select
                value={formData.template_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, template_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates
                    .filter(template => {
                      if (formData.trigger_type === 'payment_reminder') {
                        return template.category === 'payment_reminder';
                      } else if (formData.trigger_type === 'overdue_notice') {
                        return template.category === 'overdue_notice';
                      } else if (formData.trigger_type === 'welcome') {
                        return template.category === 'welcome';
                      } else if (formData.trigger_type === 'maintenance_notification') {
                        return template.category === 'maintenance_notification';
                      }
                      return true;
                    })
                    .map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.category})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active Rule</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRule}>
              {editingRule ? 'Update Rule' : 'Create Rule'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AutomatedReminders;
