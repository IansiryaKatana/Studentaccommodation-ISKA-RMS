
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Shield, 
  Activity,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'super_admin' | 'admin' | 'salesperson' | 'reservationist' | 'accountant' | 'operations_manager' | 'cleaner' | 'student';
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const userData = await ApiService.getUserById(id);
      if (userData) {
        setUser(userData);
      } else {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        navigate('/settings/users');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
      navigate('/settings/users');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'super_admin': 'bg-red-100 text-red-800',
      'admin': 'bg-orange-100 text-orange-800',
      'salesperson': 'bg-blue-100 text-blue-800',
      'reservationist': 'bg-green-100 text-green-800',
      'accountant': 'bg-purple-100 text-purple-800',
      'operations_manager': 'bg-indigo-100 text-indigo-800',
      'cleaner': 'bg-gray-100 text-gray-800',
      'student': 'bg-yellow-100 text-yellow-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleDisplayName = (role: string) => {
    const displayNames = {
      'super_admin': 'Super Administrator',
      'admin': 'Administrator',
      'salesperson': 'Salesperson',
      'reservationist': 'Reservationist',
      'accountant': 'Accountant',
      'operations_manager': 'Operations Manager',
      'cleaner': 'Cleaner',
      'student': 'Student'
    };
    return displayNames[role as keyof typeof displayNames] || role;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading user data...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center py-12">
          <span className="text-gray-500">User not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/settings/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{`${user.first_name} ${user.last_name}`}</h1>
            <p className="text-muted-foreground">User Details and Management</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/settings/users/${user.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </Button>
      </div>

      {/* User Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">
                {`${user.first_name} ${user.last_name}`.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <Badge className={`mt-1 ${getRoleColor(user.role)}`}>
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={user.is_active ? "default" : "secondary"} className={`mt-1 ${user.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                  <p className="text-sm">{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm">{user.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Personal and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 md:col-span-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Login</p>
                    <p className="text-sm text-muted-foreground">{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                User Role & Access
              </CardTitle>
              <CardDescription>Current role and access levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Role</p>
                    <p className="text-sm text-muted-foreground">{getRoleDisplayName(user.role)}</p>
                  </div>
                  <Badge className={getRoleColor(user.role)}>
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-muted-foreground">Account status</p>
                  </div>
                  <Badge variant={user.is_active ? "default" : "secondary"} className={user.is_active ? 'text-green-600' : 'text-gray-600'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">Account creation date</p>
                  </div>
                  <span className="text-sm">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Account Activity
              </CardTitle>
              <CardDescription>User's account information and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Account Created</p>
                    <p className="text-sm text-muted-foreground">User account was created</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {user.last_login && (
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Activity className="h-5 w-5 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Last Login</p>
                      <p className="text-sm text-muted-foreground">User last logged into the system</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(user.last_login).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <User className="h-5 w-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Account Status</p>
                    <p className="text-sm text-muted-foreground">Current account status</p>
                    <Badge variant={user.is_active ? "default" : "secondary"} className={`mt-1 ${user.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Password and security configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Password Last Changed</p>
                    <p className="text-sm text-muted-foreground">Last updated 30 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">Reset</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Session Management</p>
                    <p className="text-sm text-muted-foreground">Active sessions: 2</p>
                  </div>
                  <Button variant="outline" size="sm">View Sessions</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetail;
