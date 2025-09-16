
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Settings, Globe, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';

interface SystemPreference {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
  data_type: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface PreferencesState {
  company_name: string;
  timezone: string;
  date_format: string;
  currency: string;
  language: string;
  fiscal_year_start: string;
  default_rent_cycle: string;
  auto_backup: boolean;
  maintenance_mode: boolean;
  allow_registration: boolean;
  require_email_verification: boolean;
  max_file_upload_size: number;
  session_timeout_minutes: number;
  email_notifications_enabled: boolean;
  sms_notifications_enabled: boolean;
}

const SystemPreferences = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<PreferencesState>({
    company_name: 'Student Housing Manager',
    timezone: 'Europe/London',
    date_format: 'DD/MM/YYYY',
    currency: 'GBP',
    language: 'en',
    fiscal_year_start: 'january',
    default_rent_cycle: 'monthly',
    auto_backup: true,
    maintenance_mode: false,
    allow_registration: false,
    require_email_verification: true,
    max_file_upload_size: 10485760,
    session_timeout_minutes: 30,
    email_notifications_enabled: true,
    sms_notifications_enabled: false
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const preferencesData = await ApiService.getSystemPreferences();
      
      // Convert preferences array to object
      const preferencesObj: any = {};
      preferencesData.forEach((pref: SystemPreference) => {
        if (pref.data_type === 'boolean') {
          preferencesObj[pref.key] = pref.value === 'true';
        } else if (pref.data_type === 'number') {
          preferencesObj[pref.key] = parseInt(pref.value);
        } else {
          preferencesObj[pref.key] = pref.value;
        }
      });

      setPreferences(prev => ({ ...prev, ...preferencesObj }));
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load system preferences",
        variant: "destructive"
      });
      // Set loading to false even on error so the page shows
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Convert preferences object to format expected by API
      const preferencesToSave: Record<string, any> = {};
      Object.entries(preferences).forEach(([key, value]) => {
        preferencesToSave[key] = value;
      });

      await ApiService.updateSystemPreferences(preferencesToSave);
      
      toast({
        title: "Success",
        description: "System preferences saved successfully",
      });

      // Reload preferences to ensure we have the latest data
      await loadPreferences();
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save system preferences",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/settings">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Settings
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">System Preferences</h1>
              <p className="text-muted-foreground">Configure general system settings</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading system preferences...</span>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/settings">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Settings
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Preferences</h1>
            <p className="text-muted-foreground">Configure general system settings</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={preferences.company_name}
                onChange={(e) => handlePreferenceChange('company_name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select 
                value={preferences.language} 
                onValueChange={(value) => handlePreferenceChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="maintenance_mode"
                checked={preferences.maintenance_mode}
                onCheckedChange={(checked) => handlePreferenceChange('maintenance_mode', checked)}
              />
              <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="auto_backup"
                checked={preferences.auto_backup}
                onCheckedChange={(checked) => handlePreferenceChange('auto_backup', checked)}
              />
              <Label htmlFor="auto_backup">Enable Automatic Backup</Label>
            </div>
          </CardContent>
        </Card>

        {/* Localization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Localization
            </CardTitle>
            <CardDescription>Regional and format settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select 
                value={preferences.timezone} 
                onValueChange={(value) => handlePreferenceChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Europe/Paris (CET)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select 
                value={preferences.date_format} 
                onValueChange={(value) => handlePreferenceChange('date_format', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select 
                value={preferences.currency} 
                onValueChange={(value) => handlePreferenceChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Business Settings
            </CardTitle>
            <CardDescription>Financial and business configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Fiscal Year Start</Label>
              <Select 
                value={preferences.fiscal_year_start} 
                onValueChange={(value) => handlePreferenceChange('fiscal_year_start', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="april">April</SelectItem>
                  <SelectItem value="july">July</SelectItem>
                  <SelectItem value="october">October</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Rent Cycle</Label>
              <Select 
                value={preferences.default_rent_cycle} 
                onValueChange={(value) => handlePreferenceChange('default_rent_cycle', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* User Registration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              User Registration
            </CardTitle>
            <CardDescription>Control user registration settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="allow_registration"
                checked={preferences.allow_registration}
                onCheckedChange={(checked) => handlePreferenceChange('allow_registration', checked)}
              />
              <Label htmlFor="allow_registration">Allow New User Registration</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="require_email_verification"
                checked={preferences.require_email_verification}
                onCheckedChange={(checked) => handlePreferenceChange('require_email_verification', checked)}
              />
              <Label htmlFor="require_email_verification">Require Email Verification</Label>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>Advanced system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max_file_upload_size">Max File Upload Size (MB)</Label>
              <Input
                id="max_file_upload_size"
                type="number"
                value={Math.round(preferences.max_file_upload_size / 1024 / 1024)}
                onChange={(e) => handlePreferenceChange('max_file_upload_size', parseInt(e.target.value) * 1024 * 1024)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="session_timeout_minutes">Session Timeout (minutes)</Label>
              <Input
                id="session_timeout_minutes"
                type="number"
                value={preferences.session_timeout_minutes}
                onChange={(e) => handlePreferenceChange('session_timeout_minutes', parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="email_notifications_enabled"
                checked={preferences.email_notifications_enabled}
                onCheckedChange={(checked) => handlePreferenceChange('email_notifications_enabled', checked)}
              />
              <Label htmlFor="email_notifications_enabled">Enable Email Notifications</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="sms_notifications_enabled"
                checked={preferences.sms_notifications_enabled}
                onCheckedChange={(checked) => handlePreferenceChange('sms_notifications_enabled', checked)}
              />
              <Label htmlFor="sms_notifications_enabled">Enable SMS Notifications</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemPreferences;
