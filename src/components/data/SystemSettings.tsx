
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Database, 
  Shield, 
  Bell, 
  Mail, 
  Clock, 
  Save,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';


const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    appName: 'Student Housing Manager',
    timezone: 'Europe/London',
    dateFormat: 'DD/MM/YYYY',
    currency: 'EUR',
    language: 'en',
    
    // Database Settings
    backupFrequency: 'daily',
    retentionPeriod: '90',
    autoCleanup: true,
    
    // Security Settings
    sessionTimeout: '60',
    passwordExpiry: '90',
    twoFactorAuth: false,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    browserNotifications: true,
    
    // Email Settings
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587',
    emailUsername: '',
    
    // Performance Settings
    cacheEnabled: true,
    cacheTimeout: '3600',
    compressionEnabled: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1500);
  };

  const systemInfo = [
    { label: 'Version', value: '2.1.4', status: 'current' },
    { label: 'Database', value: 'PostgreSQL 15.0', status: 'healthy' },
    { label: 'Storage Used', value: '2.1 GB / 10 GB', status: 'good' },
    { label: 'Last Backup', value: '2 hours ago', status: 'recent' },
    { label: 'Uptime', value: '15 days, 3 hours', status: 'stable' }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      current: { variant: 'default' as const, text: 'Current' },
      healthy: { variant: 'default' as const, text: 'Healthy' },
      good: { variant: 'secondary' as const, text: 'Good' },
      recent: { variant: 'default' as const, text: 'Recent' },
      stable: { variant: 'default' as const, text: 'Stable' }
    };
    
    const config = variants[status as keyof typeof variants] || { variant: 'outline' as const, text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Configure system preferences and options</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Tabs */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Basic application configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="appName">Application Name</Label>
                    <Input
                      id="appName"
                      value={settings.appName}
                      onChange={(e) => handleSettingChange('appName', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select 
                        value={settings.timezone} 
                        onValueChange={(value) => handleSettingChange('timezone', value)}
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
                        value={settings.dateFormat} 
                        onValueChange={(value) => handleSettingChange('dateFormat', value)}
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select 
                        value={settings.currency} 
                        onValueChange={(value) => handleSettingChange('currency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select 
                        value={settings.language} 
                        onValueChange={(value) => handleSettingChange('language', value)}
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="database" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Database Settings</CardTitle>
                  <CardDescription>Database backup and maintenance configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Backup Frequency</Label>
                      <Select 
                        value={settings.backupFrequency} 
                        onValueChange={(value) => handleSettingChange('backupFrequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Every Hour</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="retention">Retention Period (days)</Label>
                      <Input
                        id="retention"
                        type="number"
                        value={settings.retentionPeriod}
                        onChange={(e) => handleSettingChange('retentionPeriod', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoCleanup"
                      checked={settings.autoCleanup}
                      onCheckedChange={(checked) => handleSettingChange('autoCleanup', checked)}
                    />
                    <Label htmlFor="autoCleanup">Enable automatic cleanup of old data</Label>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Database backups are stored securely and can be restored at any time.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Authentication and security configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                      <Input
                        id="passwordExpiry"
                        type="number"
                        value={settings.passwordExpiry}
                        onChange={(e) => handleSettingChange('passwordExpiry', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="twoFactorAuth"
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                    />
                    <Label htmlFor="twoFactorAuth">Require two-factor authentication</Label>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Two-factor authentication adds an extra layer of security to user accounts.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how users receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="emailNotifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                      />
                      <Label htmlFor="emailNotifications">Enable email notifications</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="smsNotifications"
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                      />
                      <Label htmlFor="smsNotifications">Enable SMS notifications</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="browserNotifications"
                        checked={settings.browserNotifications}
                        onCheckedChange={(checked) => handleSettingChange('browserNotifications', checked)}
                      />
                      <Label htmlFor="browserNotifications">Enable browser notifications</Label>
                    </div>
                  </div>

                  {settings.emailNotifications && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <h4 className="font-medium">Email Configuration</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smtpServer">SMTP Server</Label>
                          <Input
                            id="smtpServer"
                            value={settings.smtpServer}
                            onChange={(e) => handleSettingChange('smtpServer', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="smtpPort">SMTP Port</Label>
                          <Input
                            id="smtpPort"
                            value={settings.smtpPort}
                            onChange={(e) => handleSettingChange('smtpPort', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emailUsername">Email Username</Label>
                        <Input
                          id="emailUsername"
                          type="email"
                          value={settings.emailUsername}
                          onChange={(e) => handleSettingChange('emailUsername', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Settings</CardTitle>
                  <CardDescription>Optimize application performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="cacheEnabled"
                      checked={settings.cacheEnabled}
                      onCheckedChange={(checked) => handleSettingChange('cacheEnabled', checked)}
                    />
                    <Label htmlFor="cacheEnabled">Enable caching</Label>
                  </div>

                  {settings.cacheEnabled && (
                    <div className="space-y-2">
                      <Label htmlFor="cacheTimeout">Cache Timeout (seconds)</Label>
                      <Input
                        id="cacheTimeout"
                        type="number"
                        value={settings.cacheTimeout}
                        onChange={(e) => handleSettingChange('cacheTimeout', e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="compressionEnabled"
                      checked={settings.compressionEnabled}
                      onCheckedChange={(checked) => handleSettingChange('compressionEnabled', checked)}
                    />
                    <Label htmlFor="compressionEnabled">Enable response compression</Label>
                  </div>

                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Performance settings may require an application restart to take effect.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* System Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Current system status and details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemInfo.map((info, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{info.label}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">{info.value}</div>
                      {getStatusBadge(info.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Database className="mr-2 h-4 w-4" />
                Run Database Backup
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Clear Application Cache
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Test Email Configuration
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                View System Logs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
