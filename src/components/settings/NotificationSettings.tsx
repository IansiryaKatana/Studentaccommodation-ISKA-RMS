
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    email: {
      enabled: true,
      newReservations: true,
      paymentReminders: true,
      maintenanceAlerts: true,
      systemUpdates: false,
      marketingEmails: false
    },
    sms: {
      enabled: false,
      urgentAlerts: false,
      paymentOverdue: false,
      emergencyMaintenance: false
    },
    push: {
      enabled: true,
      realTimeAlerts: true,
      dailyDigest: true,
      weeklyReports: false
    },
    inApp: {
      enabled: true,
      showToasts: true,
      soundEnabled: false,
      desktopNotifications: true
    }
  });

  const handleSettingChange = (category: string, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving notification settings:', settings);
    toast({
      title: "Success",
      description: "Notification settings saved successfully",
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
            <h1 className="text-3xl font-bold tracking-tight">Notification Settings</h1>
            <p className="text-muted-foreground">Configure how users receive notifications</p>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>Configure email notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-enabled" className="font-medium">Enable Email Notifications</Label>
              <Switch
                id="email-enabled"
                checked={settings.email.enabled}
                onCheckedChange={(checked) => handleSettingChange('email', 'enabled', checked)}
              />
            </div>

            {settings.email.enabled && (
              <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-reservations">New Reservations</Label>
                  <Switch
                    id="new-reservations"
                    checked={settings.email.newReservations}
                    onCheckedChange={(checked) => handleSettingChange('email', 'newReservations', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="payment-reminders">Payment Reminders</Label>
                  <Switch
                    id="payment-reminders"
                    checked={settings.email.paymentReminders}
                    onCheckedChange={(checked) => handleSettingChange('email', 'paymentReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance-alerts">Maintenance Alerts</Label>
                  <Switch
                    id="maintenance-alerts"
                    checked={settings.email.maintenanceAlerts}
                    onCheckedChange={(checked) => handleSettingChange('email', 'maintenanceAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="system-updates">System Updates</Label>
                  <Switch
                    id="system-updates"
                    checked={settings.email.systemUpdates}
                    onCheckedChange={(checked) => handleSettingChange('email', 'systemUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <Switch
                    id="marketing-emails"
                    checked={settings.email.marketingEmails}
                    onCheckedChange={(checked) => handleSettingChange('email', 'marketingEmails', checked)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SMS Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              SMS Notifications
            </CardTitle>
            <CardDescription>Configure SMS notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-enabled" className="font-medium">Enable SMS Notifications</Label>
              <Switch
                id="sms-enabled"
                checked={settings.sms.enabled}
                onCheckedChange={(checked) => handleSettingChange('sms', 'enabled', checked)}
              />
            </div>

            {settings.sms.enabled && (
              <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <Label htmlFor="urgent-alerts">Urgent Alerts</Label>
                  <Switch
                    id="urgent-alerts"
                    checked={settings.sms.urgentAlerts}
                    onCheckedChange={(checked) => handleSettingChange('sms', 'urgentAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="payment-overdue">Payment Overdue</Label>
                  <Switch
                    id="payment-overdue"
                    checked={settings.sms.paymentOverdue}
                    onCheckedChange={(checked) => handleSettingChange('sms', 'paymentOverdue', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="emergency-maintenance">Emergency Maintenance</Label>
                  <Switch
                    id="emergency-maintenance"
                    checked={settings.sms.emergencyMaintenance}
                    onCheckedChange={(checked) => handleSettingChange('sms', 'emergencyMaintenance', checked)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="mr-2 h-5 w-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>Configure browser and mobile push notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-enabled" className="font-medium">Enable Push Notifications</Label>
              <Switch
                id="push-enabled"
                checked={settings.push.enabled}
                onCheckedChange={(checked) => handleSettingChange('push', 'enabled', checked)}
              />
            </div>

            {settings.push.enabled && (
              <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <Label htmlFor="realtime-alerts">Real-time Alerts</Label>
                  <Switch
                    id="realtime-alerts"
                    checked={settings.push.realTimeAlerts}
                    onCheckedChange={(checked) => handleSettingChange('push', 'realTimeAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="daily-digest">Daily Digest</Label>
                  <Switch
                    id="daily-digest"
                    checked={settings.push.dailyDigest}
                    onCheckedChange={(checked) => handleSettingChange('push', 'dailyDigest', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <Switch
                    id="weekly-reports"
                    checked={settings.push.weeklyReports}
                    onCheckedChange={(checked) => handleSettingChange('push', 'weeklyReports', checked)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* In-App Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              In-App Notifications
            </CardTitle>
            <CardDescription>Configure in-application notification behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="inapp-enabled" className="font-medium">Enable In-App Notifications</Label>
              <Switch
                id="inapp-enabled"
                checked={settings.inApp.enabled}
                onCheckedChange={(checked) => handleSettingChange('inApp', 'enabled', checked)}
              />
            </div>

            {settings.inApp.enabled && (
              <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-toasts">Show Toast Messages</Label>
                  <Switch
                    id="show-toasts"
                    checked={settings.inApp.showToasts}
                    onCheckedChange={(checked) => handleSettingChange('inApp', 'showToasts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-enabled">Sound Notifications</Label>
                  <Switch
                    id="sound-enabled"
                    checked={settings.inApp.soundEnabled}
                    onCheckedChange={(checked) => handleSettingChange('inApp', 'soundEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                  <Switch
                    id="desktop-notifications"
                    checked={settings.inApp.desktopNotifications}
                    onCheckedChange={(checked) => handleSettingChange('inApp', 'desktopNotifications', checked)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationSettings;
