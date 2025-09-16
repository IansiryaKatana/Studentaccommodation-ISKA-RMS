
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Zap, ExternalLink, Settings, Loader2, Save, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'connected' | 'disconnected' | 'error';
  enabled: boolean;
  icon: string;
  config: Record<string, any>;
  api_key?: string;
  webhook_url?: string;
  created_at: string;
  updated_at: string;
}

const IntegrationSettings = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setIsLoading(true);
      // For now, we'll use a static list since the integrations table might not exist
      // In a real implementation, you would fetch from the database
      const defaultIntegrations: Integration[] = [
        {
          id: 'stripe',
          name: 'Stripe',
          description: 'Payment processing and subscription management',
          category: 'Payment',
          status: 'disconnected',
          enabled: false,
          icon: '💳',
          config: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sendgrid',
          name: 'SendGrid',
          description: 'Email delivery and marketing automation',
          category: 'Communication',
          status: 'disconnected',
          enabled: false,
          icon: '📧',
          config: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'twilio',
          name: 'Twilio',
          description: 'SMS notifications and phone verification',
          category: 'Communication',
          status: 'disconnected',
          enabled: false,
          icon: '📱',
          config: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'google-calendar',
          name: 'Google Calendar',
          description: 'Sync appointments and maintenance schedules',
          category: 'Productivity',
          status: 'disconnected',
          enabled: false,
          icon: '📅',
          config: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'slack',
          name: 'Slack',
          description: 'Team notifications and alerts',
          category: 'Communication',
          status: 'disconnected',
          enabled: false,
          icon: '💬',
          config: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'docusign',
          name: 'DocuSign',
          description: 'Digital document signing and contracts',
          category: 'Documents',
          status: 'disconnected',
          enabled: false,
          icon: '📄',
          config: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setIntegrations(defaultIntegrations);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast({
        title: "Error",
        description: "Failed to load integrations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleIntegration = async (id: string) => {
    try {
      setIsSaving(true);
      const updatedIntegrations = integrations.map(integration => 
        integration.id === id 
          ? { ...integration, enabled: !integration.enabled }
          : integration
      );
      
      setIntegrations(updatedIntegrations);
      
      // In a real implementation, you would save to the database
      // await ApiService.updateIntegration(id, { enabled: !integration.enabled });
      
      toast({
        title: "Integration Updated",
        description: "Integration settings have been updated successfully",
      });
    } catch (error) {
      console.error('Error updating integration:', error);
      toast({
        title: "Error",
        description: "Failed to update integration settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnectIntegration = async (id: string) => {
    try {
      setIsSaving(true);
      const integration = integrations.find(i => i.id === id);
      if (!integration) return;

      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedIntegrations = integrations.map(i => 
        i.id === id 
          ? { ...i, status: 'connected' as const, enabled: true }
          : i
      );
      
      setIntegrations(updatedIntegrations);
      
      toast({
        title: "Integration Connected",
        description: `${integration.name} has been successfully connected.`,
      });
    } catch (error) {
      console.error('Error connecting integration:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect integration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnectIntegration = async (id: string) => {
    try {
      setIsSaving(true);
      const integration = integrations.find(i => i.id === id);
      if (!integration) return;

      const updatedIntegrations = integrations.map(i => 
        i.id === id 
          ? { ...i, status: 'disconnected' as const, enabled: false }
          : i
      );
      
      setIntegrations(updatedIntegrations);
      
      toast({
        title: "Integration Disconnected",
        description: `${integration.name} has been disconnected.`,
      });
    } catch (error) {
      console.error('Error disconnecting integration:', error);
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect integration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!editingIntegration) return;
    
    try {
      setIsSaving(true);
      
      // In a real implementation, you would save to the database
      // await ApiService.updateIntegration(editingIntegration.id, editingIntegration);
      
      const updatedIntegrations = integrations.map(i => 
        i.id === editingIntegration.id ? editingIntegration : i
      );
      
      setIntegrations(updatedIntegrations);
      setShowConfigDialog(false);
      setEditingIntegration(null);
      
      toast({
        title: "Configuration Saved",
        description: "Integration configuration has been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600">Disconnected</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Payment': 'bg-blue-100 text-blue-800',
      'Communication': 'bg-green-100 text-green-800',
      'Productivity': 'bg-purple-100 text-purple-800',
      'Documents': 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading integrations...</span>
        </div>
      </div>
    );
  }

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const enabledCount = integrations.filter(i => i.enabled).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/settings">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integration Settings</h1>
          <p className="text-muted-foreground">Manage third-party integrations and API connections</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">{integrations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ExternalLink className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Connected</p>
                <p className="text-2xl font-bold text-green-600">{connectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Enabled</p>
                <p className="text-2xl font-bold text-blue-600">{enabledCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getStatusBadge(integration.status)}
                  <Badge className={getCategoryColor(integration.category)}>
                    {integration.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Configuration Details */}
                {integration.status === 'connected' && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Configuration:</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {integration.api_key && <p>• API key configured</p>}
                      {integration.webhook_url && <p>• Webhook URL configured</p>}
                      {Object.keys(integration.config).length === 0 && (
                        <p>• Basic configuration active</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={integration.enabled}
                      onCheckedChange={() => handleToggleIntegration(integration.id)}
                      disabled={isSaving || integration.status === 'disconnected'}
                    />
                    <Label className="text-sm">
                      {integration.enabled ? 'Enabled' : 'Disabled'}
                    </Label>
                  </div>
                  
                  <div className="flex space-x-2">
                    {integration.status === 'connected' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingIntegration(integration);
                            setShowConfigDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnectIntegration(integration.id)}
                          disabled={isSaving}
                        >
                          Disconnect
                        </Button>
                      </>
                    )}
                    
                    {integration.status === 'disconnected' && (
                      <Button
                        size="sm"
                        onClick={() => handleConnectIntegration(integration.id)}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <ExternalLink className="h-4 w-4 mr-1" />
                        )}
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Configuration Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure {editingIntegration?.name}</DialogTitle>
            <DialogDescription>
              Update the configuration settings for this integration.
            </DialogDescription>
          </DialogHeader>
          
          {editingIntegration && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter API key"
                  value={editingIntegration.api_key || ''}
                  onChange={(e) => setEditingIntegration({
                    ...editingIntegration,
                    api_key: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  placeholder="Enter webhook URL"
                  value={editingIntegration.webhook_url || ''}
                  onChange={(e) => setEditingIntegration({
                    ...editingIntegration,
                    webhook_url: e.target.value
                  })}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfigDialog(false);
                    setEditingIntegration(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveConfiguration}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-1" />
                  )}
                  Save Configuration
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegrationSettings;
