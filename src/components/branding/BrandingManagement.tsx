import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ApiService, Branding } from '@/services/api';
import { useBranding } from '@/contexts/BrandingContext';
import { UploadService } from '@/services/uploadService';
import {
  Palette,
  Building,
  Phone,
  Mail,
  Globe,
  Image,
  Save,
  Upload,
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Trash2
} from 'lucide-react';

const BrandingManagement = () => {
  const { toast } = useToast();
  const { branding, updateBranding, refreshBranding } = useBranding();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localBranding, setLocalBranding] = useState<Branding | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (branding) {
      setLocalBranding(branding);
    }
  }, [branding]);

  const handleSave = async () => {
    if (!localBranding) return;
    
    try {
      setIsSaving(true);
      await updateBranding(localBranding);
      toast({
        title: "Success",
        description: "Branding information updated successfully.",
      });
    } catch (error) {
      console.error('Error updating branding:', error);
      toast({
        title: "Error",
        description: "Failed to update branding information.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof Branding, value: string) => {
    if (!localBranding) return;
    setLocalBranding({
      ...localBranding,
      [field]: value
    });
  };

  const handleFileUpload = async (field: 'logo_url' | 'favicon_url', file: File) => {
    if (!localBranding) return;

    const isLogo = field === 'logo_url';
    const setUploading = isLogo ? setUploadingLogo : setUploadingFavicon;
    
    try {
      setUploading(true);
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a valid image file (JPEG, PNG, GIF, or SVG)');
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      // Upload file using simplified service
      const uploadResult = await UploadService.uploadFile(file, 'branding');
      
      console.log('Upload result:', uploadResult);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }
      
      // Update local branding with the new URL
      const updatedBranding = {
        ...localBranding,
        [field]: uploadResult.public_url
      };
      setLocalBranding(updatedBranding);

      // Auto-save the branding data after successful upload
      try {
        console.log('Auto-saving branding:', updatedBranding);
        await updateBranding(updatedBranding);
        console.log('Branding saved successfully');
        toast({
          title: "Upload Successful",
          description: `${isLogo ? 'Logo' : 'Favicon'} uploaded and saved successfully.`,
        });
      } catch (saveError) {
        console.error('Error auto-saving branding:', saveError);
        toast({
          title: "Upload Successful",
          description: `${isLogo ? 'Logo' : 'Favicon'} uploaded but failed to save. Please click 'Save Changes'.`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error(`Error uploading ${field}:`, error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : `Failed to upload ${isLogo ? 'logo' : 'favicon'}.`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (field: 'logo_url' | 'favicon_url', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(field, file);
    }
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  const handleRemoveFile = (field: 'logo_url' | 'favicon_url') => {
    if (!localBranding) return;
    
    setLocalBranding({
      ...localBranding,
      [field]: null
    });

    toast({
      title: "File Removed",
      description: `${field === 'logo_url' ? 'Logo' : 'Favicon'} removed successfully.`,
    });
  };

  const triggerFileInput = (field: 'logo_url' | 'favicon_url') => {
    const inputRef = field === 'logo_url' ? logoInputRef : faviconInputRef;
    inputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading branding information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branding Management</h1>
          <p className="text-muted-foreground">Customize your company's visual identity and branding</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Company Information</span>
            </CardTitle>
            <CardDescription>
              Basic company details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={localBranding?.company_name || ''}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Textarea
                id="companyAddress"
                value={localBranding?.company_address || ''}
                onChange={(e) => handleInputChange('company_address', e.target.value)}
                placeholder="Enter company address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Phone Number</Label>
                <Input
                  id="companyPhone"
                  value={localBranding?.company_phone || ''}
                  onChange={(e) => handleInputChange('company_phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email Address</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={localBranding?.company_email || ''}
                  onChange={(e) => handleInputChange('company_email', e.target.value)}
                  placeholder="contact@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Website</Label>
              <Input
                id="companyWebsite"
                value={localBranding?.company_website || ''}
                onChange={(e) => handleInputChange('company_website', e.target.value)}
                placeholder="https://www.company.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Visual Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Visual Identity</span>
            </CardTitle>
            <CardDescription>
              Colors, logos, and visual branding elements. Primary color controls login page buttons and input focus rings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={localBranding?.primary_color || '#3b82f6'}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="w-12 h-10"
                  />
                  <Input
                    value={localBranding?.primary_color || '#3b82f6'}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    placeholder="#3b82f6"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Used for login buttons, links, and input focus rings
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={localBranding?.secondary_color || '#64748b'}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="w-12 h-10"
                  />
                  <Input
                    value={localBranding?.secondary_color || '#64748b'}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    placeholder="#64748b"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Reserved for future use (doesn't affect sidebar)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={localBranding?.accent_color || '#f59e0b'}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    className="w-12 h-10"
                  />
                  <Input
                    value={localBranding?.accent_color || '#f59e0b'}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    placeholder="#f59e0b"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Reserved for future use (doesn't affect sidebar)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font Family</Label>
              <Input
                id="fontFamily"
                value={localBranding?.font_family || 'Inter'}
                onChange={(e) => handleInputChange('font_family', e.target.value)}
                placeholder="Inter, sans-serif"
              />
            </div>

            <Separator />

            <div className="space-y-6">
              {/* Company Logo Section */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Company Logo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {localBranding?.logo_url ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={localBranding.logo_url}
                            alt="Company Logo"
                            className="h-16 w-auto object-contain max-w-full"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Current Logo</p>
                            <p className="text-xs text-gray-500">Click to replace or remove</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => triggerFileInput('logo_url')}
                            disabled={uploadingLogo}
                          >
                            {uploadingLogo ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            Replace
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFile('logo_url')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Image className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-3">No logo uploaded</p>
                      <Button
                        variant="outline"
                        onClick={() => triggerFileInput('logo_url')}
                        disabled={uploadingLogo}
                      >
                        {uploadingLogo ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Upload Logo
                      </Button>
                    </div>
                  )}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileInputChange('logo_url', e)}
                  className="hidden"
                />
              </div>

              {/* Favicon Section */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Favicon</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {localBranding?.favicon_url ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={localBranding.favicon_url}
                            alt="Favicon"
                            className="h-12 w-12 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Current Favicon</p>
                            <p className="text-xs text-gray-500">Click to replace or remove</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => triggerFileInput('favicon_url')}
                            disabled={uploadingFavicon}
                          >
                            {uploadingFavicon ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            Replace
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFile('favicon_url')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Image className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-3">No favicon uploaded</p>
                      <Button
                        variant="outline"
                        onClick={() => triggerFileInput('favicon_url')}
                        disabled={uploadingFavicon}
                      >
                        {uploadingFavicon ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Upload Favicon
                      </Button>
                    </div>
                  )}
                </div>
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileInputChange('favicon_url', e)}
                  className="hidden"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Configuration</CardTitle>
          <CardDescription>
            Customize the main dashboard appearance and messaging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dashboardTitle">Dashboard Title</Label>
              <Input
                id="dashboardTitle"
                value={localBranding?.dashboard_title || ''}
                onChange={(e) => handleInputChange('dashboard_title', e.target.value)}
                placeholder="Welcome to Your Dashboard"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dashboardSubtitle">Dashboard Subtitle</Label>
              <Input
                id="dashboardSubtitle"
                value={localBranding?.dashboard_subtitle || ''}
                onChange={(e) => handleInputChange('dashboard_subtitle', e.target.value)}
                placeholder="Manage your business efficiently"
              />
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Preview Section */}
      {previewMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Preview</span>
            </CardTitle>
            <CardDescription>
              See how your branding will appear to users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-4">
                {localBranding?.logo_url && (
                  <img
                    src={localBranding.logo_url}
                    alt="Company Logo"
                    className="h-8 w-auto object-contain"
                  />
                )}
                <div>
                  <h2 className="text-xl font-bold" style={{ color: localBranding?.primary_color }}>
                    {localBranding?.company_name || 'Company Name'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {localBranding?.dashboard_title || 'Dashboard Title'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div 
                  className="p-4 rounded-lg text-white text-center"
                  style={{ backgroundColor: localBranding?.primary_color }}
                >
                  Primary Color
                </div>
                <div 
                  className="p-4 rounded-lg text-white text-center"
                  style={{ backgroundColor: localBranding?.secondary_color }}
                >
                  Secondary Color
                </div>
                <div 
                  className="p-4 rounded-lg text-white text-center"
                  style={{ backgroundColor: localBranding?.accent_color }}
                >
                  Accent Color
                </div>
              </div>

              <div className="text-sm space-y-2">
                <p><strong>Address:</strong> {localBranding?.company_address || 'Not set'}</p>
                <p><strong>Phone:</strong> {localBranding?.company_phone || 'Not set'}</p>
                <p><strong>Email:</strong> {localBranding?.company_email || 'Not set'}</p>
                <p><strong>Website:</strong> {localBranding?.company_website || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BrandingManagement;

