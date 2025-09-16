
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Shield, Lock, Key, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SecuritySettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    sessionTimeout: 60,
    passwordExpiry: 90,
    minPasswordLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    enableTwoFactor: false,
    lockoutAttempts: 5,
    lockoutDuration: 30,
    enableAuditLog: true,
    enableLoginNotifications: true,
    allowRememberMe: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Saving security settings:', settings);
    toast({
      title: "Success",
      description: "Security settings saved successfully",
    });
  };

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
            <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
            <p className="text-muted-foreground">Configure authentication and security policies</p>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Authentication
            </CardTitle>
            <CardDescription>Login and session management settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lockoutAttempts">Failed Login Attempts Before Lockout</Label>
              <Input
                id="lockoutAttempts"
                type="number"
                value={settings.lockoutAttempts}
                onChange={(e) => handleSettingChange('lockoutAttempts', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lockoutDuration">Account Lockout Duration (minutes)</Label>
              <Input
                id="lockoutDuration"
                type="number"
                value={settings.lockoutDuration}
                onChange={(e) => handleSettingChange('lockoutDuration', parseInt(e.target.value))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="allowRememberMe"
                checked={settings.allowRememberMe}
                onCheckedChange={(checked) => handleSettingChange('allowRememberMe', checked)}
              />
              <Label htmlFor="allowRememberMe">Allow "Remember Me" option</Label>
            </div>
          </CardContent>
        </Card>

        {/* Password Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5" />
              Password Policy
            </CardTitle>
            <CardDescription>Password requirements and expiration settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minPasswordLength">Minimum Password Length</Label>
              <Input
                id="minPasswordLength"
                type="number"
                value={settings.minPasswordLength}
                onChange={(e) => handleSettingChange('minPasswordLength', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
              <Input
                id="passwordExpiry"
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-3">
              <Label>Password Requirements</Label>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="requireUppercase"
                  checked={settings.requireUppercase}
                  onCheckedChange={(checked) => handleSettingChange('requireUppercase', checked)}
                />
                <Label htmlFor="requireUppercase">Require uppercase letters</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="requireNumbers"
                  checked={settings.requireNumbers}
                  onCheckedChange={(checked) => handleSettingChange('requireNumbers', checked)}
                />
                <Label htmlFor="requireNumbers">Require numbers</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="requireSpecialChars"
                  checked={settings.requireSpecialChars}
                  onCheckedChange={(checked) => handleSettingChange('requireSpecialChars', checked)}
                />
                <Label htmlFor="requireSpecialChars">Require special characters</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>Enhanced security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableTwoFactor"
                checked={settings.enableTwoFactor}
                onCheckedChange={(checked) => handleSettingChange('enableTwoFactor', checked)}
              />
              <Label htmlFor="enableTwoFactor">Require Two-Factor Authentication</Label>
            </div>

            {settings.enableTwoFactor && (
              <div className="p-4 border rounded-lg space-y-3">
                <p className="text-sm font-medium">2FA Configuration</p>
                <p className="text-sm text-muted-foreground">
                  Two-factor authentication will be required for all users.
                  Users can set up 2FA using authenticator apps or SMS.
                </p>
                <Button variant="outline" size="sm">
                  Configure 2FA Settings
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit & Logging */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              Audit & Logging
            </CardTitle>
            <CardDescription>Activity monitoring and logging settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableAuditLog"
                checked={settings.enableAuditLog}
                onCheckedChange={(checked) => handleSettingChange('enableAuditLog', checked)}
              />
              <Label htmlFor="enableAuditLog">Enable Audit Logging</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enableLoginNotifications"
                checked={settings.enableLoginNotifications}
                onCheckedChange={(checked) => handleSettingChange('enableLoginNotifications', checked)}
              />
              <Label htmlFor="enableLoginNotifications">Email Login Notifications</Label>
            </div>

            {settings.enableAuditLog && (
              <div className="p-4 border rounded-lg space-y-3">
                <p className="text-sm font-medium">Audit Log Settings</p>
                <p className="text-sm text-muted-foreground">
                  All user actions will be logged for security and compliance purposes.
                  Logs are retained for 90 days by default.
                </p>
                <Button variant="outline" size="sm">
                  View Audit Logs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecuritySettings;
