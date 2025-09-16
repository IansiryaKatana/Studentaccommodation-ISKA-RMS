import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import { 
  Palette, 
  Layout, 
  Image, 
  Save, 
  Eye,
  MoveUp,
  MoveDown,
  Trash2,
  Plus,
  Loader2
} from 'lucide-react';

interface BookingPageLayout {
  id?: string;
  module_name: string;
  section_name: string;
  settings: {
    // Background colors
    page_background: string;
    tabs_background: string;
    gallery_background: string;
    content_background: string;
    form_background: string;
    
    // Gallery settings
    gallery_height: string;
    thumbnail_height: string;
    thumbnail_border_radius: string;
    thumbnail_gap: string;
    main_image_border_radius: string;
    
    // Section visibility and order
    sections: {
      id: string;
      name: string;
      visible: boolean;
      order: number;
      background_color: string;
      padding: string;
      margin: string;
    }[];
    
    // Form styling
    form_spacing: string;
    input_border_radius: string;
    button_background: string;
    button_text_color: string;
  };
  created_at?: string;
  updated_at?: string;
}

const WebAccessGradePages = () => {
  const { toast } = useToast();
  const [layout, setLayout] = useState<BookingPageLayout>({
    module_name: 'web-access',
    section_name: 'booking-page-layout',
    settings: {
      page_background: '#ffffff',
      tabs_background: '#f8fafc',
      gallery_background: '#ffffff',
      content_background: '#ffffff',
      form_background: '#ffffff',
      
      gallery_height: '400px',
      thumbnail_height: '132px',
      thumbnail_border_radius: '8px',
      thumbnail_gap: '8px',
      main_image_border_radius: '12px',
      
      sections: [
        { id: 'summary', name: 'Summary Card', visible: true, order: 1, background_color: '#ffffff', padding: '24px', margin: '0' },
        { id: 'amenities', name: 'Room Amenities', visible: true, order: 2, background_color: '#ffffff', padding: '24px', margin: '0' },
        { id: 'overview', name: 'Overview/Description', visible: true, order: 3, background_color: '#ffffff', padding: '24px', margin: '0' },
        { id: 'features', name: 'Accommodation Features', visible: true, order: 4, background_color: '#ffffff', padding: '24px', margin: '0' },
        { id: 'location', name: 'Location/Map', visible: true, order: 5, background_color: '#ffffff', padding: '24px', margin: '0' }
      ],
      
      form_spacing: '12px',
      input_border_radius: '6px',
      button_background: '#3b82f6',
      button_text_color: '#ffffff'
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadLayout();
  }, []);

  const loadLayout = async () => {
    try {
      setIsLoading(true);
      const existingLayout = await ApiService.getModuleStyle('web-access', 'booking-page-layout');
      if (existingLayout) {
        setLayout({
          ...existingLayout,
          settings: {
            ...layout.settings,
            ...existingLayout.settings
          }
        });
      }
    } catch (error) {
      console.error('Error loading layout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLayout = async () => {
    try {
      setIsSaving(true);
      await ApiService.updateModuleStyle(layout.module_name, layout.section_name, layout.settings);
      toast({ title: 'Layout saved', description: 'Booking page layout has been updated successfully.' });
    } catch (error: any) {
      console.error('Error saving layout:', error);
      if (error.message && error.message.includes('Database structure not ready')) {
        toast({ 
          title: 'Database Not Ready', 
          description: 'Please run the database fixes first. Check the console for instructions.', 
          variant: 'destructive' 
        });
      } else {
        toast({ title: 'Error', description: 'Failed to save layout.', variant: 'destructive' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const updateSectionOrder = (sectionId: string, direction: 'up' | 'down') => {
    setLayout(prev => {
      const sections = [...prev.settings.sections];
      const currentIndex = sections.findIndex(s => s.id === sectionId);
      if (currentIndex === -1) return prev;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= sections.length) return prev;

      [sections[currentIndex], sections[newIndex]] = [sections[newIndex], sections[currentIndex]];
      sections.forEach((section, index) => {
        section.order = index + 1;
      });

      return {
        ...prev,
        settings: {
          ...prev.settings,
          sections
        }
      };
    });
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setLayout(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        sections: prev.settings.sections.map(section =>
          section.id === sectionId ? { ...section, visible: !section.visible } : section
        )
      }
    }));
  };

  const updateSectionStyle = (sectionId: string, field: string, value: string) => {
    setLayout(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        sections: prev.settings.sections.map(section =>
          section.id === sectionId ? { ...section, [field]: value } : section
        )
      }
    }));
  };

  const updateGlobalSetting = (field: string, value: string) => {
    setLayout(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Page Layout Editor</h1>
          <p className="text-muted-foreground">Customize the appearance and layout of the public booking page</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button onClick={saveLayout} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Layout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="form">Form</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Background Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Page Background</Label>
                      <Input
                        type="color"
                        value={layout.settings.page_background}
                        onChange={(e) => updateGlobalSetting('page_background', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Tabs Background</Label>
                      <Input
                        type="color"
                        value={layout.settings.tabs_background}
                        onChange={(e) => updateGlobalSetting('tabs_background', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Gallery Background</Label>
                      <Input
                        type="color"
                        value={layout.settings.gallery_background}
                        onChange={(e) => updateGlobalSetting('gallery_background', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Content Background</Label>
                      <Input
                        type="color"
                        value={layout.settings.content_background}
                        onChange={(e) => updateGlobalSetting('content_background', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Form Background</Label>
                      <Input
                        type="color"
                        value={layout.settings.form_background}
                        onChange={(e) => updateGlobalSetting('form_background', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Gallery Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Gallery Height</Label>
                      <Input
                        value={layout.settings.gallery_height}
                        onChange={(e) => updateGlobalSetting('gallery_height', e.target.value)}
                        placeholder="400px"
                      />
                    </div>
                    <div>
                      <Label>Thumbnail Height</Label>
                      <Input
                        value={layout.settings.thumbnail_height}
                        onChange={(e) => updateGlobalSetting('thumbnail_height', e.target.value)}
                        placeholder="132px"
                      />
                    </div>
                    <div>
                      <Label>Thumbnail Border Radius</Label>
                      <Input
                        value={layout.settings.thumbnail_border_radius}
                        onChange={(e) => updateGlobalSetting('thumbnail_border_radius', e.target.value)}
                        placeholder="8px"
                      />
                    </div>
                    <div>
                      <Label>Thumbnail Gap</Label>
                      <Input
                        value={layout.settings.thumbnail_gap}
                        onChange={(e) => updateGlobalSetting('thumbnail_gap', e.target.value)}
                        placeholder="8px"
                      />
                    </div>
                    <div>
                      <Label>Main Image Border Radius</Label>
                      <Input
                        value={layout.settings.main_image_border_radius}
                        onChange={(e) => updateGlobalSetting('main_image_border_radius', e.target.value)}
                        placeholder="12px"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sections" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    Section Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {layout.settings.sections
                      .sort((a, b) => a.order - b.order)
                      .map((section) => (
                        <div key={section.id} className="flex items-center gap-3 p-3 border rounded">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={section.visible}
                                onCheckedChange={() => toggleSectionVisibility(section.id)}
                              />
                              <span className="font-medium">{section.name}</span>
                            </div>
                            <div className="mt-2 grid grid-cols-3 gap-2">
                              <div>
                                <Label className="text-xs">Background</Label>
                                <Input
                                  type="color"
                                  value={section.background_color}
                                  onChange={(e) => updateSectionStyle(section.id, 'background_color', e.target.value)}
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Padding</Label>
                                <Input
                                  value={section.padding}
                                  onChange={(e) => updateSectionStyle(section.id, 'padding', e.target.value)}
                                  placeholder="24px"
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Margin</Label>
                                <Input
                                  value={section.margin}
                                  onChange={(e) => updateSectionStyle(section.id, 'margin', e.target.value)}
                                  placeholder="0"
                                  className="h-8 text-xs"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateSectionOrder(section.id, 'up')}
                              disabled={section.order === 1}
                            >
                              <MoveUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateSectionOrder(section.id, 'down')}
                              disabled={section.order === layout.settings.sections.length}
                            >
                              <MoveDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="form" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Form Styling</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Form Spacing</Label>
                      <Input
                        value={layout.settings.form_spacing}
                        onChange={(e) => updateGlobalSetting('form_spacing', e.target.value)}
                        placeholder="12px"
                      />
                    </div>
                    <div>
                      <Label>Input Border Radius</Label>
                      <Input
                        value={layout.settings.input_border_radius}
                        onChange={(e) => updateGlobalSetting('input_border_radius', e.target.value)}
                        placeholder="6px"
                      />
                    </div>
                    <div>
                      <Label>Button Background</Label>
                      <Input
                        type="color"
                        value={layout.settings.button_background}
                        onChange={(e) => updateGlobalSetting('button_background', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Button Text Color</Label>
                      <Input
                        type="color"
                        value={layout.settings.button_text_color}
                        onChange={(e) => updateGlobalSetting('button_text_color', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        {previewMode && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="border rounded-lg p-4 space-y-4"
                  style={{ backgroundColor: layout.settings.page_background }}
                >
                  {/* Tabs Preview */}
                  <div 
                    className="flex gap-2 p-2 rounded"
                    style={{ backgroundColor: layout.settings.tabs_background }}
                  >
                    <div className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Silver</div>
                    <div className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">Gold</div>
                    <div className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">Platinum</div>
                  </div>

                  {/* Gallery Preview */}
                  <div 
                    className="grid grid-cols-4 gap-3"
                    style={{ backgroundColor: layout.settings.gallery_background }}
                  >
                    <div 
                      className="col-span-3 bg-gray-200 rounded"
                      style={{ 
                        height: layout.settings.gallery_height,
                        borderRadius: layout.settings.main_image_border_radius
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        Main Image
                      </div>
                    </div>
                    <div className="col-span-1 space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-gray-200 rounded"
                          style={{
                            height: layout.settings.thumbnail_height,
                            borderRadius: layout.settings.thumbnail_border_radius,
                            marginBottom: layout.settings.thumbnail_gap
                          }}
                        >
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                            Thumb {i}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div 
                    className="grid grid-cols-3 gap-6"
                    style={{ backgroundColor: layout.settings.content_background }}
                  >
                    <div className="col-span-2 space-y-4">
                      {layout.settings.sections
                        .filter(s => s.visible)
                        .sort((a, b) => a.order - b.order)
                        .map((section) => (
                          <div
                            key={section.id}
                            className="border rounded p-3"
                            style={{
                              backgroundColor: section.background_color,
                              padding: section.padding,
                              margin: section.margin
                            }}
                          >
                            <h3 className="font-semibold mb-2">{section.name}</h3>
                            <p className="text-sm text-gray-600">Preview content for {section.name}</p>
                          </div>
                        ))}
                    </div>
                    
                    {/* Form Preview */}
                    <div 
                      className="col-span-1 space-y-3 p-4 rounded"
                      style={{ backgroundColor: layout.settings.form_background }}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div 
                          className="h-10 bg-gray-100 rounded"
                          style={{ borderRadius: layout.settings.input_border_radius }}
                        ></div>
                        <div 
                          className="h-10 bg-gray-100 rounded"
                          style={{ borderRadius: layout.settings.input_border_radius }}
                        ></div>
                      </div>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-10 bg-gray-100 rounded"
                          style={{ borderRadius: layout.settings.input_border_radius }}
                        ></div>
                      ))}
                      <div
                        className="h-12 rounded text-center flex items-center justify-center text-white font-medium"
                        style={{
                          backgroundColor: layout.settings.button_background,
                          color: layout.settings.button_text_color
                        }}
                      >
                        Submit Button
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebAccessGradePages;
