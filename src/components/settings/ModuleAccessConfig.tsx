// Module Access Configuration Page for ISKA RMS
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, RefreshCw, Shield, Users, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ModuleAccess {
  role_name: string;
  module_name: string;
  is_enabled: boolean;
}

interface RolePermission {
  role_name: string;
  module_name: string;
  page_path: string;
  can_access: boolean;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

const MODULES = [
  { name: 'leads', title: 'Leads', description: 'Lead management and tracking' },
  { name: 'ota-bookings', title: 'OTA Bookings', description: 'Tourist reservations' },
  { name: 'students', title: 'Students', description: 'Student management' },
  { name: 'studios', title: 'Studios', description: 'Studio management' },
  { name: 'cleaning', title: 'Cleaning', description: 'Cleaning operations' },
  { name: 'finance', title: 'Finance', description: 'Financial management' },
  { name: 'data', title: 'Data', description: 'Data management' },
  { name: 'settings', title: 'Settings', description: 'System settings' },
  { name: 'web-access', title: 'Web Access', description: 'Web features' },
  { name: 'branding', title: 'Branding', description: 'Branding management' },
  { name: 'comms-marketing', title: 'Comms & Marketing', description: 'Communications and marketing management' },
  { name: 'student-portal', title: 'Student Portal', description: 'Student interface' }
];

const ROLES = [
  { name: 'super_admin', title: 'Super Admin', color: 'bg-red-100 text-red-800' },
  { name: 'admin', title: 'Admin', color: 'bg-blue-100 text-blue-800' },
  { name: 'salesperson', title: 'Salesperson', color: 'bg-green-100 text-green-800' },
  { name: 'reservationist', title: 'Reservationist', color: 'bg-purple-100 text-purple-800' },
  { name: 'accountant', title: 'Accountant', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'operations_manager', title: 'Operations Manager', color: 'bg-indigo-100 text-indigo-800' },
  { name: 'cleaner', title: 'Cleaner', color: 'bg-pink-100 text-pink-800' },
  { name: 'student', title: 'Student', color: 'bg-gray-100 text-gray-800' }
];

export default function ModuleAccessConfig() {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  
  const [moduleAccess, setModuleAccess] = useState<ModuleAccess[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Check if user is Super Admin
  if (!hasRole('super_admin')) {
    return (
      <div className="p-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page. Only Super Admins can configure module access.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  useEffect(() => {
    loadModuleAccess();
  }, []);

  const loadModuleAccess = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Load module access configuration
      const { data: accessData, error: accessError } = await supabase
        .from('module_access_config')
        .select('*')
        .order('role_name, module_name');

      if (accessError) throw accessError;

      // Load role permissions
      const { data: permissionData, error: permissionError } = await supabase
        .from('role_permissions')
        .select('*')
        .order('role_name, module_name');

      if (permissionError) throw permissionError;

      setModuleAccess(accessData || []);
      setRolePermissions(permissionData || []);
    } catch (error) {
      console.error('Error loading module access:', error);
      setError('Failed to load module access configuration');
      toast({
        title: "Error",
        description: "Failed to load module access configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateModuleAccess = async (roleName: string, moduleName: string, isEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from('module_access_config')
        .upsert({
          role_name: roleName,
          module_name: moduleName,
          is_enabled: isEnabled
        });

      if (error) throw error;

      // Update local state
      setModuleAccess(prev => {
        const existing = prev.find(item => item.role_name === roleName && item.module_name === moduleName);
        if (existing) {
          return prev.map(item => 
            item.role_name === roleName && item.module_name === moduleName 
              ? { ...item, is_enabled: isEnabled }
              : item
          );
        } else {
          return [...prev, { role_name: roleName, module_name: moduleName, is_enabled: isEnabled }];
        }
      });

      // Update role permissions
      const { error: permissionError } = await supabase
        .from('role_permissions')
        .upsert({
          role_name: roleName,
          module_name: moduleName,
          page_path: '*',
          can_access: isEnabled,
          can_create: isEnabled,
          can_read: isEnabled,
          can_update: isEnabled,
          can_delete: isEnabled
        });

      if (permissionError) throw permissionError;

      toast({
        title: "Success",
        description: `Updated ${moduleName} access for ${roleName}`,
      });
    } catch (error) {
      console.error('Error updating module access:', error);
      toast({
        title: "Error",
        description: "Failed to update module access",
        variant: "destructive",
      });
    }
  };

  const saveAllChanges = async () => {
    setIsSaving(true);
    try {
      // Save module access configuration
      const { error: accessError } = await supabase
        .from('module_access_config')
        .upsert(moduleAccess);

      if (accessError) throw accessError;

      // Save role permissions
      const { error: permissionError } = await supabase
        .from('role_permissions')
        .upsert(rolePermissions);

      if (permissionError) throw permissionError;

      toast({
        title: "Success",
        description: "All changes saved successfully",
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getModuleAccess = (roleName: string, moduleName: string) => {
    return moduleAccess.find(item => item.role_name === roleName && item.module_name === moduleName)?.is_enabled || false;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Module Access Configuration</h1>
          <p className="text-gray-600 mt-2">
            Configure which roles have access to which modules and pages
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadModuleAccess}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={saveAllChanges}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save All Changes
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Module Access Overview
              </CardTitle>
              <CardDescription>
                Toggle module access for each role. Changes are saved automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Role</th>
                      {MODULES.map(module => (
                        <th key={module.name} className="text-center p-2 font-medium">
                          <div className="text-xs">
                            <div className="font-semibold">{module.title}</div>
                            <div className="text-gray-500">{module.description}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROLES.map(role => (
                      <tr key={role.name} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <Badge className={role.color}>
                            {role.title}
                          </Badge>
                        </td>
                        {MODULES.map(module => (
                          <td key={module.name} className="text-center p-2">
                            <Switch
                              checked={getModuleAccess(role.name, module.name)}
                              onCheckedChange={(checked) => 
                                updateModuleAccess(role.name, module.name, checked)
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Detailed Permissions
              </CardTitle>
              <CardDescription>
                View detailed permissions for each role and module combination.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ROLES.map(role => (
                  <div key={role.name} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">
                      <Badge className={role.color}>
                        {role.title}
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {MODULES.map(module => {
                        const permission = rolePermissions.find(
                          p => p.role_name === role.name && p.module_name === module.name
                        );
                        return (
                          <div key={module.name} className="border rounded p-3">
                            <h4 className="font-medium text-sm mb-2">{module.title}</h4>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span>Access:</span>
                                <span className={permission?.can_access ? 'text-green-600' : 'text-red-600'}>
                                  {permission?.can_access ? '✓' : '✗'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Create:</span>
                                <span className={permission?.can_create ? 'text-green-600' : 'text-red-600'}>
                                  {permission?.can_create ? '✓' : '✗'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Read:</span>
                                <span className={permission?.can_read ? 'text-green-600' : 'text-red-600'}>
                                  {permission?.can_read ? '✓' : '✗'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Update:</span>
                                <span className={permission?.can_update ? 'text-green-600' : 'text-red-600'}>
                                  {permission?.can_update ? '✓' : '✗'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Delete:</span>
                                <span className={permission?.can_delete ? 'text-green-600' : 'text-red-600'}>
                                  {permission?.can_delete ? '✓' : '✗'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
