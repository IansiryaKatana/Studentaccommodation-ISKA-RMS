import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ApiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Save, Users, Settings, Globe, CheckCircle, AlertCircle } from 'lucide-react';

interface LeadSettings {
  default_website_lead_user_id: string | null;
  default_website_lead_user_name: string | null;
  auto_assign_website_leads: boolean;
  lead_notification_email: string | null;
  lead_follow_up_days: number;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export default function LeadsSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<LeadSettings>({
    default_website_lead_user_id: null,
    default_website_lead_user_name: null,
    auto_assign_website_leads: true,
    lead_notification_email: null,
    lead_follow_up_days: 7
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadSettings();
    loadUsers();
  }, []);

  const loadSettings = async () => {
    try {
      // For now, we'll use localStorage to store settings
      // In a real app, this would be stored in the database
      const savedSettings = localStorage.getItem('leadSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await ApiService.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Save to localStorage (in a real app, this would be saved to database)
      localStorage.setItem('leadSettings', JSON.stringify(settings));
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUserChange = (userId: string) => {
    const selectedUser = users.find(u => u.id === userId);
    setSettings(prev => ({
      ...prev,
      default_website_lead_user_id: userId,
      default_website_lead_user_name: selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : null
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads Settings</h1>
          <p className="text-gray-600 mt-2">Configure default settings for lead management</p>
        </div>
        <div className="flex items-center gap-2">
          {saveStatus === 'success' && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Settings saved
            </Badge>
          )}
          {saveStatus === 'error' && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <AlertCircle className="h-3 w-3 mr-1" />
              Save failed
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Website Lead Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Website Lead Assignment
            </CardTitle>
            <CardDescription>
              Configure how leads from your website are automatically assigned
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auto_assign">Auto-assign website leads</Label>
              <Select 
                value={settings.auto_assign_website_leads ? 'true' : 'false'}
                onValueChange={(value) => setSettings(prev => ({ 
                  ...prev, 
                  auto_assign_website_leads: value === 'true' 
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes - Auto-assign to default user</SelectItem>
                  <SelectItem value="false">No - Leave unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.auto_assign_website_leads && (
              <div className="space-y-2">
                <Label htmlFor="default_user">Default user for website leads</Label>
                <Select 
                  value={settings.default_website_lead_user_id || ''}
                  onValueChange={handleUserChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {settings.default_website_lead_user_name && (
                  <p className="text-sm text-gray-600">
                    Website leads will be assigned to: <strong>{settings.default_website_lead_user_name}</strong>
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lead Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Lead Notifications
            </CardTitle>
            <CardDescription>
              Configure email notifications for new leads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notification_email">Notification email</Label>
              <Input
                id="notification_email"
                type="email"
                value={settings.lead_notification_email || ''}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  lead_notification_email: e.target.value 
                }))}
                placeholder="admin@yourcompany.com"
              />
              <p className="text-sm text-gray-600">
                Email address to receive notifications when new leads are created
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="follow_up_days">Follow-up reminder days</Label>
              <Input
                id="follow_up_days"
                type="number"
                min="1"
                max="30"
                value={settings.lead_follow_up_days}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  lead_follow_up_days: parseInt(e.target.value) || 7 
                }))}
              />
              <p className="text-sm text-gray-600">
                Number of days after which to remind about follow-up
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Current Settings Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Auto-assign website leads:</span>
              <Badge variant={settings.auto_assign_website_leads ? "default" : "secondary"}>
                {settings.auto_assign_website_leads ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            
            {settings.auto_assign_website_leads && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Default user:</span>
                <span className="text-sm text-gray-600">
                  {settings.default_website_lead_user_name || "Not selected"}
                </span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Notification email:</span>
              <span className="text-sm text-gray-600">
                {settings.lead_notification_email || "Not configured"}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Follow-up reminder:</span>
              <span className="text-sm text-gray-600">
                {settings.lead_follow_up_days} days
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
