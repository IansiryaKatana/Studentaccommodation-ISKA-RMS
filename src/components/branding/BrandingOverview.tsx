import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Palette, Settings, TrendingUp, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';

interface BrandingStats {
  moduleStyles: number;
  brandingConfigured: boolean;
  activeModules: number;
  totalModules: number;
}

const BrandingOverview = () => {
  const [stats, setStats] = useState<BrandingStats>({
    moduleStyles: 0,
    brandingConfigured: false,
    activeModules: 0,
    totalModules: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBrandingStats();
  }, []);

  const fetchBrandingStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch module styles
      const moduleStyles = await ApiService.getModuleStyles();
      
      // Fetch branding configuration
      const branding = await ApiService.getBranding();
      
      // Calculate stats
      const activeModules = moduleStyles.filter(style => style.is_active).length;
      const totalModules = moduleStyles.length;
      
      setStats({
        moduleStyles: totalModules,
        brandingConfigured: !!branding,
        activeModules,
        totalModules
      });
    } catch (error) {
      console.error('Error fetching branding stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch branding statistics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const managementModules = [
    {
      title: 'Module Styles',
      description: 'Configure colors and gradients for each module',
      icon: Palette,
      path: '/branding/module-styles',
      count: `${stats.moduleStyles} styles`,
      color: 'bg-purple-500'
    },
    {
      title: 'Branding',
      description: 'Manage company branding and visual identity',
      icon: Settings,
      path: '/branding/branding',
      count: stats.brandingConfigured ? 'Configured' : 'Not configured',
      color: 'bg-blue-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Branding Management</h1>
            <p className="text-muted-foreground">Manage visual identity and module styling</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branding Management</h1>
          <p className="text-muted-foreground">Manage visual identity and module styling</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Module Styles</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.moduleStyles}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeModules} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Branding Status</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.brandingConfigured ? 'Configured' : 'Not Set'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.brandingConfigured ? 'Branding is active' : 'Setup required'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeModules}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.totalModules} total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalModules > 0 ? Math.round((stats.activeModules / stats.totalModules) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              modules styled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Modules */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {managementModules.map((module) => (
          <Card key={module.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${module.color}`}>
                  <module.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{module.count}</span>
                <Button asChild size="sm">
                  <Link to={module.path}>
                    Manage
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BrandingOverview;

