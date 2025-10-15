
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  Shield, 
  Database,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Palette,
  Globe,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CardSkeleton, DashboardGridSkeleton } from '@/components/ui/skeleton';

const SettingsOverview = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const settingsCards = [
    {
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions',
      icon: Users,
      path: '/settings/users',
      color: 'bg-blue-500',
      stats: { total: 45, active: 42, pending: 3 }
    },
    {
      title: 'System Preferences',
      description: 'Configure general system settings and preferences',
      icon: Settings,
      path: '/settings/system',
      color: 'bg-green-500',
      stats: { configured: 18, total: 24 }
    },
    {
      title: 'Webhook Management',
      description: 'Create and manage WPForms webhooks for automated data processing',
      icon: Globe,
      path: '/settings/webhooks',
      color: 'bg-teal-500',
      stats: { active: 2, total: 3, working: 2 }
    },
    {
      title: 'Branding Management',
      description: 'Customize company branding, logo, and visual identity',
      icon: Palette,
      path: '/settings/branding',
      color: 'bg-pink-500',
      stats: { configured: 8, total: 10 }
    },
    {
      title: 'System Status',
      description: 'Monitor system health and performance metrics',
      icon: Database,
      path: '/data/system-settings',
      color: 'bg-indigo-500',
      stats: { uptime: '99.9%', healthy: true }
    },
    {
      title: 'Academic Year Setup',
      description: 'Set up new academic years with room grades, pricing, and installment plans',
      icon: Calendar,
      path: '/settings/academic-year-setup',
      color: 'bg-purple-500',
      stats: { setup: 'Wizard', new: true }
    }
  ];

  const systemAlerts = [
    {
      type: 'warning',
      message: 'SSL certificate expires in 30 days',
      action: 'Renew Certificate',
      priority: 'medium'
    },
    {
      type: 'info',
      message: 'System backup completed successfully',
      action: 'View Details',
      priority: 'low'
    },
    {
      type: 'success',
      message: 'Security scan completed - no issues found',
      action: 'View Report',
      priority: 'low'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAlertBadge = (priority: string) => {
    const variants = {
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    };
    return variants[priority as keyof typeof variants] || 'outline';
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage system configuration, users, and integrations
        </p>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <DashboardGridSkeleton cards={6} className="col-span-full" />
        ) : (
          settingsCards.map((setting) => {
          const Icon = setting.icon;
          return (
            <Card 
              key={setting.path} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(setting.path)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${setting.color} bg-opacity-10`}>
                    <Icon className={`h-6 w-6 text-white`} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">{setting.title}</CardTitle>
                <CardDescription>{setting.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {setting.title === 'User Management' && (
                    <>
                      <Badge variant="secondary">{setting.stats.active} Active</Badge>
                      <Badge variant="outline">{setting.stats.pending} Pending</Badge>
                    </>
                  )}
                  {setting.title === 'System Preferences' && (
                    <Badge variant="secondary">
                      {setting.stats.configured}/{setting.stats.total} Configured
                    </Badge>
                  )}
                  {setting.title === 'Security Settings' && (
                    <Badge variant="secondary">
                      {setting.stats.active}/{setting.stats.policies} Active
                    </Badge>
                  )}
                  {setting.title === 'Notifications' && (
                    <Badge variant="secondary">
                      {setting.stats.enabled}/{setting.stats.channels} Enabled
                    </Badge>
                  )}
                  {setting.title === 'Integrations' && (
                    <Badge variant="secondary">
                      {setting.stats.connected} Connected
                    </Badge>
                  )}
                  {setting.title === 'Webhook Management' && (
                    <>
                      <Badge variant="secondary">
                        {setting.stats.active}/{setting.stats.total} Active
                      </Badge>
                      <Badge variant="default" className="bg-green-500 text-white">
                        {setting.stats.working} Working
                      </Badge>
                    </>
                  )}
                  {setting.title === 'System Status' && (
                    <Badge variant={setting.stats.healthy ? 'default' : 'destructive'}>
                      {setting.stats.uptime} Uptime
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
        )}
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>Recent system notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </>
            ) : (
              systemAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <Badge variant={getAlertBadge(alert.priority) as any} className="mt-1">
                      {alert.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {alert.action}
                </Button>
              </div>
            ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used settings and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading ? (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-16 bg-gray-200 rounded animate-pulse" />
                ))}
              </>
            ) : (
              <>
                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <Users className="h-5 w-5" />
                  <span>Add New User</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <Database className="h-5 w-5" />
                  <span>Backup System</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Scan</span>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsOverview;
