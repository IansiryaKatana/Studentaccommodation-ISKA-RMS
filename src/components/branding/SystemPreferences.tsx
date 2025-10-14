import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useBranding } from '@/contexts/BrandingContext';
import { Branding } from '@/services/api';
import { Input } from '@/components/ui/input';
import {
  Settings,
  DollarSign,
  Clock,
  Globe,
  Calendar,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const SystemPreferences = () => {
  const { toast } = useToast();
  const { branding, updateBranding } = useBranding();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<Partial<Branding>>({});

  useEffect(() => {
    if (branding) {
      setLocalPreferences({
        currency: branding.currency || 'GBP',
        timezone: branding.timezone || 'Europe/London',
        academic_year_start_month: branding.academic_year_start_month || 9,
        academic_year_start_day: branding.academic_year_start_day || 1,
        academic_year_end_month: branding.academic_year_end_month || 7,
        academic_year_end_day: branding.academic_year_end_day || 1
      });
    }
  }, [branding]);

  const handleInputChange = (field: keyof Branding, value: string) => {
    setLocalPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!branding) return;
    
    setIsSaving(true);
    try {
      await updateBranding(localPreferences);
      toast({
        title: "Preferences Updated",
        description: "System preferences have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save system preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    if (!branding) return false;
    return (
      localPreferences.currency !== (branding.currency || 'GBP') ||
      localPreferences.timezone !== (branding.timezone || 'Europe/London') ||
      localPreferences.academic_year_start_month !== (branding.academic_year_start_month || 9) ||
      localPreferences.academic_year_start_day !== (branding.academic_year_start_day || 1) ||
      localPreferences.academic_year_end_month !== (branding.academic_year_end_month || 7) ||
      localPreferences.academic_year_end_day !== (branding.academic_year_end_day || 1)
    );
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Preferences</h1>
          <p className="text-gray-600 mt-2">
            Configure system-wide technical settings including currency and timezone
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges() || isSaving}
          className="flex items-center space-x-2"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Save Changes</span>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-1 max-w-2xl">
        {/* Currency & Timezone */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Regional Settings</span>
            </CardTitle>
            <CardDescription>
              Configure currency and timezone for your system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Currency</span>
              </Label>
              <select
                id="currency"
                value={localPreferences.currency || 'GBP'}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="GBP">British Pound (£)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="CAD">Canadian Dollar (C$)</option>
                <option value="AUD">Australian Dollar (A$)</option>
                <option value="JPY">Japanese Yen (¥)</option>
                <option value="CHF">Swiss Franc (CHF)</option>
                <option value="SEK">Swedish Krona (kr)</option>
                <option value="NOK">Norwegian Krone (kr)</option>
                <option value="DKK">Danish Krone (kr)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Timezone</span>
              </Label>
              <select
                id="timezone"
                value={localPreferences.timezone || 'Europe/London'}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Europe/London">London (GMT/BST)</option>
                <option value="America/New_York">New York (EST/EDT)</option>
                <option value="America/Los_Angeles">Los Angeles (PST/PDT)</option>
                <option value="Europe/Paris">Paris (CET/CEST)</option>
                <option value="Europe/Berlin">Berlin (CET/CEST)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
                <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
                <option value="America/Toronto">Toronto (EST/EDT)</option>
                <option value="Europe/Dublin">Dublin (GMT/IST)</option>
              </select>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Currency changes will affect how amounts are displayed throughout the system.
                Timezone settings will be used for date/time formatting and scheduling.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Academic Year Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Academic Year Settings</span>
            </CardTitle>
            <CardDescription>
              Configure when academic years start and end for your institution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="academic_year_start_month" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Start Month</span>
                </Label>
                <select
                  id="academic_year_start_month"
                  value={localPreferences.academic_year_start_month || 9}
                  onChange={(e) => handleInputChange('academic_year_start_month', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value={1}>January</option>
                  <option value={2}>February</option>
                  <option value={3}>March</option>
                  <option value={4}>April</option>
                  <option value={5}>May</option>
                  <option value={6}>June</option>
                  <option value={7}>July</option>
                  <option value={8}>August</option>
                  <option value={9}>September</option>
                  <option value={10}>October</option>
                  <option value={11}>November</option>
                  <option value={12}>December</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="academic_year_start_day" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Start Day</span>
                </Label>
                <Input
                  id="academic_year_start_day"
                  type="number"
                  min="1"
                  max="31"
                  value={localPreferences.academic_year_start_day || 1}
                  onChange={(e) => handleInputChange('academic_year_start_day', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="academic_year_end_month" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>End Month</span>
                </Label>
                <select
                  id="academic_year_end_month"
                  value={localPreferences.academic_year_end_month || 7}
                  onChange={(e) => handleInputChange('academic_year_end_month', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value={1}>January</option>
                  <option value={2}>February</option>
                  <option value={3}>March</option>
                  <option value={4}>April</option>
                  <option value={5}>May</option>
                  <option value={6}>June</option>
                  <option value={7}>July</option>
                  <option value={8}>August</option>
                  <option value={9}>September</option>
                  <option value={10}>October</option>
                  <option value={11}>November</option>
                  <option value={12}>December</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="academic_year_end_day" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>End Day</span>
                </Label>
                <Input
                  id="academic_year_end_day"
                  type="number"
                  min="1"
                  max="31"
                  value={localPreferences.academic_year_end_day || 1}
                  onChange={(e) => handleInputChange('academic_year_end_day', e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Note:</strong> These settings will be used to automatically calculate check-in and check-out dates for new durations.
                Default: September 1st to July 1st (UK academic year).
              </p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Status Indicator */}
      {hasChanges() && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-orange-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">You have unsaved changes</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasChanges() && branding && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">All preferences are up to date</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemPreferences;
