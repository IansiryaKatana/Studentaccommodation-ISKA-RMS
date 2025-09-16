import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Eye, Shield, RefreshCw, Save, AlertTriangle } from 'lucide-react';
import ConfigService from '@/services/configService';
import { StripeConfig } from '@/services/configService';

const ConfigManagement: React.FC = () => {
  const [stripeConfig, setStripeConfig] = useState<StripeConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [configExists, setConfigExists] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    testPublishableKey: '',
    testSecretKey: '',
    livePublishableKey: '',
    liveSecretKey: '',
    environment: 'test' as 'test' | 'live'
  });

  const configService = ConfigService.getInstance();

  useEffect(() => {
    checkConfigExists();
  }, []);

  const checkConfigExists = async () => {
    try {
      const exists = await configService.configExists('stripe-keys.json');
      setConfigExists(exists);
    } catch (error) {
      console.error('Error checking config existence:', error);
      // Don't show error to user for this check, just assume no config exists
      setConfigExists(false);
    }
  };

  const loadStripeConfig = async () => {
    setLoading(true);
    try {
      const config = await configService.loadStripeConfig();
      setStripeConfig(config);
      toast({
        title: "Configuration Loaded",
        description: "Stripe configuration loaded from secure storage successfully.",
      });
    } catch (error) {
      toast({
        title: "Error Loading Config",
        description: "Failed to load configuration from storage. Please upload a configuration file first.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadStripeConfig = async () => {
    setLoading(true);
    try {
      // Validate and clean the keys
      const cleanTestPublishableKey = formData.testPublishableKey.trim();
      const cleanTestSecretKey = formData.testSecretKey.trim();
      const cleanLivePublishableKey = formData.livePublishableKey.trim();
      const cleanLiveSecretKey = formData.liveSecretKey.trim();

      console.log('🔍 Form data validation:');
      console.log('Test publishable key length:', cleanTestPublishableKey.length);
      console.log('Test secret key length:', cleanTestSecretKey.length);
      console.log('Live publishable key length:', cleanLivePublishableKey.length);
      console.log('Live secret key length:', cleanLiveSecretKey.length);

      // Basic validation
      if (cleanTestPublishableKey && !cleanTestPublishableKey.startsWith('pk_test_')) {
        throw new Error('Test publishable key must start with "pk_test_"');
      }
      if (cleanTestSecretKey && !cleanTestSecretKey.startsWith('sk_test_')) {
        throw new Error('Test secret key must start with "sk_test_"');
      }
      if (cleanLivePublishableKey && !cleanLivePublishableKey.startsWith('pk_live_')) {
        throw new Error('Live publishable key must start with "pk_live_"');
      }
      if (cleanLiveSecretKey && !cleanLiveSecretKey.startsWith('sk_live_')) {
        throw new Error('Live secret key must start with "sk_live_"');
      }

      const config = {
        stripe: {
          test: {
            publishable_key: cleanTestPublishableKey,
            secret_key: cleanTestSecretKey
          },
          live: {
            publishable_key: cleanLivePublishableKey,
            secret_key: cleanLiveSecretKey
          },
          environment: formData.environment,
          last_updated: new Date().toISOString(),
          notes: "Stripe configuration for ISKA RMS - stored securely in Supabase Storage"
        }
      };

      console.log('📤 Starting config upload...');
      await configService.uploadConfig('stripe-keys.json', config);
      console.log('✅ Config upload completed');
      
      setConfigExists(true);
      setShowUploadDialog(false);
      
      toast({
        title: "Configuration Uploaded",
        description: "Stripe configuration uploaded to secure storage successfully.",
      });
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload configuration to storage.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentKeys = () => {
    if (!stripeConfig) return null;
    return stripeConfig[stripeConfig.environment || 'test'];
  };

  const maskKey = (key: string) => {
    if (!key) return '';
    return key.substring(0, 7) + '...' + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configuration Management</h2>
          <p className="text-muted-foreground">
            Securely manage sensitive configuration files in Supabase Storage
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
          <Shield className="h-4 w-4 mr-2" />
          Secure Storage
        </Badge>
      </div>

      {/* Stripe Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Stripe Configuration
          </CardTitle>
          <CardDescription>
            Manage your Stripe API keys securely. Keys are stored in Supabase Storage and never committed to version control.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={configExists ? "default" : "secondary"}>
                {configExists ? "Configured" : "Not Configured"}
              </Badge>
              {stripeConfig && (
                <Badge variant="outline">
                  Environment: {stripeConfig.environment || 'test'}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadStripeConfig}
                disabled={loading || !configExists}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Load Config
              </Button>
              
              <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!stripeConfig}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Keys
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Stripe Configuration</DialogTitle>
                    <DialogDescription>
                      Current Stripe configuration loaded from secure storage.
                    </DialogDescription>
                  </DialogHeader>
                  {stripeConfig && (
                    <div className="space-y-4">
                      <div>
                        <Label>Environment</Label>
                        <div className="text-sm font-mono bg-muted p-2 rounded">
                          {stripeConfig.environment || 'test'}
                        </div>
                      </div>
                      <div>
                        <Label>Test Publishable Key</Label>
                        <div className="text-sm font-mono bg-muted p-2 rounded">
                          {maskKey(stripeConfig.test.publishable_key)}
                        </div>
                      </div>
                      <div>
                        <Label>Test Secret Key</Label>
                        <div className="text-sm font-mono bg-muted p-2 rounded">
                          {maskKey(stripeConfig.test.secret_key)}
                        </div>
                      </div>
                      <div>
                        <Label>Live Publishable Key</Label>
                        <div className="text-sm font-mono bg-muted p-2 rounded">
                          {maskKey(stripeConfig.live.publishable_key)}
                        </div>
                      </div>
                      <div>
                        <Label>Live Secret Key</Label>
                        <div className="text-sm font-mono bg-muted p-2 rounded">
                          {maskKey(stripeConfig.live.secret_key)}
                        </div>
                      </div>
                      <div>
                        <Label>Last Updated</Label>
                        <div className="text-sm text-muted-foreground">
                          {new Date(stripeConfig.last_updated).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Config
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Stripe Configuration</DialogTitle>
                    <DialogDescription>
                      Enter your Stripe API keys. They will be stored securely in Supabase Storage.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="environment">Environment</Label>
                      <Select
                        value={formData.environment}
                        onValueChange={(value: 'test' | 'live') => 
                          setFormData(prev => ({ ...prev, environment: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="test">Test</SelectItem>
                          <SelectItem value="live">Live</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="testPublishableKey">Test Publishable Key</Label>
                      <Input
                        id="testPublishableKey"
                        placeholder="pk_test_..."
                        value={formData.testPublishableKey}
                        onChange={(e) => {
                          const value = e.target.value;
                          console.log('Test publishable key input:', value.length, 'characters');
                          setFormData(prev => ({ 
                            ...prev, testPublishableKey: value 
                          }));
                        }}
                        onPaste={(e) => {
                          const pastedText = e.clipboardData.getData('text');
                          console.log('Test publishable key pasted:', pastedText.length, 'characters');
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="testSecretKey">Test Secret Key</Label>
                      <Input
                        id="testSecretKey"
                        type="password"
                        placeholder="sk_test_..."
                        value={formData.testSecretKey}
                        onChange={(e) => {
                          const value = e.target.value;
                          console.log('Test secret key input:', value.length, 'characters');
                          setFormData(prev => ({ 
                            ...prev, testSecretKey: value 
                          }));
                        }}
                        onPaste={(e) => {
                          const pastedText = e.clipboardData.getData('text');
                          console.log('Test secret key pasted:', pastedText.length, 'characters');
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="livePublishableKey">Live Publishable Key</Label>
                      <Input
                        id="livePublishableKey"
                        placeholder="pk_live_..."
                        value={formData.livePublishableKey}
                        onChange={(e) => {
                          const value = e.target.value;
                          console.log('Live publishable key input:', value.length, 'characters');
                          setFormData(prev => ({ 
                            ...prev, livePublishableKey: value 
                          }));
                        }}
                        onPaste={(e) => {
                          const pastedText = e.clipboardData.getData('text');
                          console.log('Live publishable key pasted:', pastedText.length, 'characters');
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="liveSecretKey">Live Secret Key</Label>
                      <Input
                        id="liveSecretKey"
                        type="password"
                        placeholder="sk_live_..."
                        value={formData.liveSecretKey}
                        onChange={(e) => {
                          const value = e.target.value;
                          console.log('Live secret key input:', value.length, 'characters');
                          setFormData(prev => ({ 
                            ...prev, liveSecretKey: value 
                          }));
                        }}
                        onPaste={(e) => {
                          const pastedText = e.clipboardData.getData('text');
                          console.log('Live secret key pasted:', pastedText.length, 'characters');
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        Keys will be stored securely in Supabase Storage and are never committed to version control.
                      </p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowUploadDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={uploadStripeConfig}
                        disabled={loading}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Uploading...' : 'Upload Config'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {!configExists && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-800">Configuration Required</h4>
                  <p className="text-sm text-blue-700">
                    No Stripe configuration found. Please upload your configuration to enable payment processing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {stripeConfig && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">Configuration Active</h4>
                  <p className="text-sm text-green-700">
                    Stripe configuration is loaded and ready for use. Current environment: {stripeConfig.environment || 'test'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">1. Upload Configuration</h4>
            <p className="text-sm text-muted-foreground">
              Click "Upload Config" and enter your Stripe API keys. They will be stored securely in Supabase Storage.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">2. Secure Storage</h4>
            <p className="text-sm text-muted-foreground">
              Configuration files are stored in Supabase Storage with restricted access. They are never committed to your Git repository.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">3. Runtime Loading</h4>
            <p className="text-sm text-muted-foreground">
              The application loads configuration from storage at runtime, ensuring your keys are always secure and up-to-date.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">4. Environment Switching</h4>
            <p className="text-sm text-muted-foreground">
              Easily switch between test and live environments by updating the configuration in storage.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigManagement; 