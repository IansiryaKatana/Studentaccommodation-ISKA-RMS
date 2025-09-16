
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, Edit, Trash2, Plus, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';

interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: {
    leads: boolean;
    reservations: boolean;
    students: boolean;
    cleaning: boolean;
    finance: boolean;
    data: boolean;
    settings: boolean;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const UserRolesManagement = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [newRole, setNewRole] = useState<Partial<UserRole>>({
    name: '',
    description: '',
    permissions: {
      leads: false,
      reservations: false,
      students: false,
      cleaning: false,
      finance: false,
      data: false,
      settings: false,
    },
    is_active: true
  });
  const { toast } = useToast();

  // Note: This component displays predefined user roles that are hardcoded in the system.
  // The roles are defined in the User interface as a union type and cannot be modified
  // through this interface. This is a read-only view for reference purposes.

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const rolesData = await ApiService.getUserRoles();
      
      // Ensure each role has the proper permissions structure
      const rolesWithPermissions = rolesData.map(role => ({
        ...role,
        permissions: role.permissions || {
          leads: false,
          reservations: false,
          students: false,
          cleaning: false,
          finance: false,
          data: false,
          settings: false,
        },
        is_active: role.is_active !== undefined ? role.is_active : true,
        created_at: role.created_at || new Date().toISOString(),
        updated_at: role.updated_at || new Date().toISOString()
      }));
      
      setRoles(rolesWithPermissions);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: "Error",
        description: "Failed to load user roles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRole = async () => {
    if (!newRole.name || !newRole.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Create role with proper structure
      const createdRole: UserRole = {
        id: Date.now().toString(),
        name: newRole.name!,
        description: newRole.description!,
        permissions: newRole.permissions!,
        is_active: newRole.is_active!,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // In a real implementation, you would save to the database
      // const savedRole = await ApiService.createUserRole(createdRole);
      
      setRoles([...roles, createdRole]);
      setShowAddDialog(false);
      setNewRole({
        name: '',
        description: '',
        permissions: {
          leads: false,
          reservations: false,
          students: false,
          cleaning: false,
          finance: false,
          data: false,
          settings: false,
        },
        is_active: true
      });
      
      toast({
        title: "Success",
        description: "User role created successfully.",
      });
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: "Error",
        description: "Failed to create user role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

    try {
      setIsSaving(true);
      
      // In a real implementation, you would update in the database
      // await ApiService.updateUserRole(editingRole.id, editingRole);
      
      const updatedRoles = roles.map(role => 
        role.id === editingRole.id ? { ...editingRole, updated_at: new Date().toISOString() } : role
      );
      
      setRoles(updatedRoles);
      setEditingRole(null);
      
      toast({
        title: "Success",
        description: "User role updated successfully.",
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      setIsSaving(true);
      
      // In a real implementation, you would delete from the database
      // await ApiService.deleteUserRole(id);
      
      setRoles(roles.filter(role => role.id !== id));
      
      toast({
        title: "Success",
        description: "User role deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: "Error",
        description: "Failed to delete user role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePermission = (roleId: string, permission: keyof UserRole['permissions']) => {
    if (!editingRole) return;
    
    setEditingRole({
      ...editingRole,
      permissions: {
        ...editingRole.permissions,
        [permission]: !editingRole.permissions[permission]
      }
    });
  };

  const getPermissionLabel = (permission: string) => {
    const labels: Record<string, string> = {
      leads: 'Leads Management',
      reservations: 'Reservations',
      students: 'Students',
      cleaning: 'Cleaning',
      finance: 'Finance',
      data: 'Data Management',
      settings: 'Settings'
    };
    return labels[permission] || permission;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Link to="/data">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Data
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Roles Management</h1>
            <p className="text-muted-foreground">Manage user roles and permissions</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Roles Management</h1>
          <p className="text-muted-foreground">View predefined user roles and permissions (read-only)</p>
        </div>
        <Button disabled variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Role (Disabled)
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={role.is_active ? "default" : "secondary"}>
                    {role.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Permissions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Permissions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {role.permissions && Object.entries(role.permissions).map(([permission, hasAccess]) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${hasAccess ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-xs text-muted-foreground">
                          {getPermissionLabel(permission)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    title="Roles are predefined and cannot be edited"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit (Disabled)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    title="Roles are predefined and cannot be deleted"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete (Disabled)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Role Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New User Role</DialogTitle>
            <DialogDescription>
              Create a new user role with specific permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                placeholder="Enter role name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleDescription">Description</Label>
              <Textarea
                id="roleDescription"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                placeholder="Enter role description"
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-4">
                {newRole.permissions && Object.entries(newRole.permissions).map(([permission, hasAccess]) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Switch
                      checked={hasAccess}
                      onCheckedChange={() => setNewRole({
                        ...newRole,
                        permissions: {
                          ...newRole.permissions!,
                          [permission]: !hasAccess
                        }
                      })}
                    />
                    <Label className="text-sm">{getPermissionLabel(permission)}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRole} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Update role permissions and settings
            </DialogDescription>
          </DialogHeader>
          {editingRole && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editRoleName">Role Name</Label>
                <Input
                  id="editRoleName"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRoleDescription">Description</Label>
                <Textarea
                  id="editRoleDescription"
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-4">
                  {editingRole.permissions && Object.entries(editingRole.permissions).map(([permission, hasAccess]) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Switch
                        checked={hasAccess}
                        onCheckedChange={() => handleTogglePermission(editingRole.id, permission as keyof UserRole['permissions'])}
                      />
                      <Label className="text-sm">{getPermissionLabel(permission)}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditingRole(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateRole} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Update Role
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserRolesManagement;
