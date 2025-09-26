import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Mail, 
  Send, 
  Users, 
  Eye, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { TableSkeleton, DashboardGridSkeleton } from '@/components/ui/skeleton';

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  html_content: string;
  text_content: string;
  variables: string[];
}

interface EmailCampaign {
  id: string;
  name: string;
  description?: string;
  template_id: string;
  target_criteria: any;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduled_at?: string;
  sent_at?: string;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  bounced_count: number;
  email_templates?: EmailTemplate;
}

interface Student {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  user?: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

const BulkEmailSender = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  
  // Two-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [targetType, setTargetType] = useState<'criteria' | 'students'>('criteria');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template_id: '',
    target_criteria: {
      paymentStatus: 'all',
      country: 'all',
      academicYear: 'all',
      hasEmail: true
    },
    scheduled_at: '',
    sendNow: false
  });

  useEffect(() => {
    fetchData();
    
    // Check for selected students from Student Segmentation
    const selectedStudentIds = sessionStorage.getItem('selectedStudentIds');
    if (selectedStudentIds) {
      try {
        const studentIds = JSON.parse(selectedStudentIds);
        if (studentIds && studentIds.length > 0) {
          // Set target type to students and pre-select them
          setTargetType('students');
          setSelectedStudents(new Set(studentIds));
          
          // Clear the sessionStorage after using it
          sessionStorage.removeItem('selectedStudentIds');
          
          // Show success message
          toast({
            title: "Students loaded",
            description: `${studentIds.length} students have been pre-selected for your campaign`,
          });
        }
      } catch (error) {
        console.error('Error parsing selected student IDs:', error);
      }
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [campaignsData, templatesData, studentsData] = await Promise.all([
        ApiService.getEmailCampaigns(),
        ApiService.getEmailTemplates(),
        ApiService.getStudents()
      ]);
      
      setCampaigns(campaignsData);
      setTemplates(templatesData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = () => {
    setFormData({
      name: '',
      description: '',
      template_id: '',
      target_criteria: {
        paymentStatus: '',
        country: '',
        academicYear: '',
        hasEmail: true
      },
      scheduled_at: ''
    });
    setShowCreateDialog(true);
  };

  // Two-step form handlers
  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (targetType === 'criteria') {
        // Criteria is always valid
        setCurrentStep(2);
      } else if (targetType === 'students') {
        if (selectedStudents.size === 0) {
          toast({
            title: "No students selected",
            description: "Please select at least one student to continue",
            variant: "destructive"
          });
          return;
        }
        setCurrentStep(2);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleStudentSelect = (studentId: string, checked: boolean) => {
    const newSelected = new Set(selectedStudents);
    if (checked) {
      newSelected.add(studentId);
    } else {
      newSelected.delete(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleSelectAllStudents = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredStudents.map(s => s.id));
      setSelectedStudents(allIds);
    } else {
      setSelectedStudents(new Set());
    }
  };

  const filteredStudents = students.filter(student => {
    if (!studentSearchTerm) return true;
    const fullName = `${student.user?.first_name || ''} ${student.user?.last_name || ''}`.toLowerCase();
    const email = student.user?.email?.toLowerCase() || '';
    const searchLower = studentSearchTerm.toLowerCase();
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  const handleSaveCampaign = async () => {
    try {
      // Prepare target criteria based on selection type
      let finalTargetCriteria = { ...formData.target_criteria };
      
      if (targetType === 'students') {
        // Add selected student IDs to criteria
        finalTargetCriteria.selectedStudentIds = Array.from(selectedStudents);
      }

      const campaignData = {
        name: formData.name,
        description: formData.description,
        template_id: formData.template_id,
        target_criteria: finalTargetCriteria,
        scheduled_at: formData.sendNow ? null : formData.scheduled_at,
        created_by: user?.id,
        status: formData.sendNow ? 'sending' : (formData.scheduled_at ? 'scheduled' : 'draft')
      };

      const campaign = await ApiService.createEmailCampaign(campaignData);
      
      // If sendNow is true, automatically send the campaign
      if (formData.sendNow) {
        try {
          // Get students based on campaign criteria
          const targetStudents = await ApiService.getStudentsForEmailCampaign(campaignData.target_criteria);
          const studentIds = targetStudents.map(s => s.id);
          
          // Send bulk email
          await ApiService.sendBulkEmail(campaign.id, studentIds);
          
          toast({
            title: "Success",
            description: `Campaign "${campaign.name}" sent to ${studentIds.length} students`
          });
        } catch (sendError) {
          console.error('Error sending campaign:', sendError);
          toast({
            title: "Campaign Created",
            description: "Campaign created but failed to send. You can try sending it manually.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Email campaign created successfully"
        });
      }
      
      setShowCreateDialog(false);
      
      // Reset form
      setCurrentStep(1);
      setTargetType('criteria');
      setSelectedStudents(new Set());
      setStudentSearchTerm('');
      setFormData({
        name: '',
        description: '',
        template_id: '',
        target_criteria: {
          paymentStatus: 'all',
          country: 'all',
          academicYear: 'all',
          hasEmail: true
        },
        scheduled_at: '',
        sendNow: false
      });
      
      fetchData();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create email campaign",
        variant: "destructive"
      });
    }
  };

  const handleSendCampaign = async (campaign: EmailCampaign) => {
    try {
      setSending(true);
      
      // Get students based on campaign criteria
      const targetStudents = await ApiService.getStudentsForEmailCampaign(campaign.target_criteria);
      const studentIds = targetStudents.map(s => s.id);

      // Send bulk email
      await ApiService.sendBulkEmail(campaign.id, studentIds);
      
      toast({
        title: "Success",
        description: `Campaign "${campaign.name}" sent to ${studentIds.length} students`
      });
      
      fetchData();
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast({
        title: "Error",
        description: "Failed to send email campaign",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteCampaign = async (campaign: EmailCampaign) => {
    try {
      await ApiService.deleteEmailCampaign(campaign.id);
      toast({
        title: "Success",
        description: "Email campaign deleted successfully"
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete email campaign",
        variant: "destructive"
      });
    }
  };

  const handlePreviewCampaign = async (campaign: EmailCampaign) => {
    try {
      const template = templates.find(t => t.id === campaign.template_id);
      if (!template) return;

      // Get a sample student for preview
      const targetStudents = await ApiService.getStudentsForEmailCampaign(campaign.target_criteria);
      const sampleStudent = targetStudents[0];

      if (sampleStudent) {
        // Replace template variables with sample data
        let previewSubject = template.subject;
        let previewHtml = template.html_content;
        let previewText = template.text_content;

        const variables = {
          student_name: `${sampleStudent.first_name || ''} ${sampleStudent.last_name || ''}`.trim() || 'John Doe',
          student_email: sampleStudent.user?.email || sampleStudent.email || 'john.doe@example.com',
          invoice_number: 'INV-2025-0001',
          amount_due: '£500.00',
          due_date: new Date().toLocaleDateString('en-GB'),
          days_overdue: '3',
          payment_link: 'https://student-portal.example.com/payments',
          company_name: 'ISKA RMS',
          announcement_title: 'Important Announcement',
          announcement_content: 'This is a sample announcement content.'
        };

        // Replace variables in content
        Object.entries(variables).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          previewSubject = previewSubject.replace(regex, value);
          previewHtml = previewHtml.replace(regex, value);
          previewText = previewText.replace(regex, value);
        });

        setPreviewData({
          subject: previewSubject,
          html: previewHtml,
          text: previewText,
          student: sampleStudent
        });
        setSelectedCampaign(campaign);
        setShowPreviewDialog(true);
      }
    } catch (error) {
      console.error('Error previewing campaign:', error);
      toast({
        title: "Error",
        description: "Failed to preview campaign",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: any } = {
      draft: Edit,
      scheduled: Calendar,
      sending: Clock,
      sent: CheckCircle,
      failed: AlertCircle
    };
    const Icon = icons[status] || Edit;
    return <Icon className="h-4 w-4" />;
  };

  const getDeliveryRate = (campaign: EmailCampaign) => {
    if (campaign.sent_count === 0) return 0;
    return Math.round((campaign.delivered_count / campaign.sent_count) * 100);
  };

  const getOpenRate = (campaign: EmailCampaign) => {
    if (campaign.delivered_count === 0) return 0;
    return Math.round((campaign.opened_count / campaign.delivered_count) * 100);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Bulk Email Sender</h2>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
        
        {/* Campaigns Table Skeleton */}
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-semibold text-sm text-gray-700">
              <div className="col-span-4">Campaign Name</div>
              <div className="col-span-2">Template</div>
              <div className="col-span-1">Recipients</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Actions</div>
            </div>
            <div className="divide-y">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 p-4">
                  <div className="col-span-4">
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="col-span-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="col-span-1">
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="col-span-1">
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                  <div className="col-span-2">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="col-span-2 flex gap-1">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Email Sender</h1>
          <p className="text-gray-600">Create and manage email campaigns</p>
        </div>
        <Button onClick={handleCreateCampaign} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Campaigns List */}
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-semibold text-sm text-gray-700">
              <div className="col-span-4">Campaign Name</div>
              <div className="col-span-2">Template</div>
              <div className="col-span-1">Recipients</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Actions</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y">
              {campaigns.map((campaign) => (
                <div 
                  key={campaign.id} 
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <div className="col-span-4">
                    <div className="font-medium">{campaign.name}</div>
                    {campaign.description && (
                      <div className="text-sm text-gray-600 mt-1 truncate">{campaign.description}</div>
                    )}
                  </div>
                  <div className="col-span-2 text-sm">
                    {campaign.email_templates?.name || 'Unknown'}
                  </div>
                  <div className="col-span-1 flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4 text-gray-400" />
                    {campaign.total_recipients}
                  </div>
                  <div className="col-span-1">
                    <Badge className={`${getStatusColor(campaign.status)} flex items-center gap-1 text-xs`}>
                      {getStatusIcon(campaign.status)}
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">
                    {campaign.sent_at 
                      ? new Date(campaign.sent_at).toLocaleDateString()
                      : new Date(campaign.created_at).toLocaleDateString()
                    }
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewCampaign(campaign);
                      }}
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {campaign.status === 'draft' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendCampaign(campaign);
                        }}
                        disabled={sending}
                        title="Send Campaign"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Delete Campaign"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCampaign(campaign)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Grid View */}
      <div className="md:hidden grid grid-cols-1 gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">{campaign.name}</CardTitle>
                  {campaign.description && (
                    <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                  )}
                </div>
                <Badge className={`${getStatusColor(campaign.status)} flex items-center gap-1`}>
                  {getStatusIcon(campaign.status)}
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Info */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Template:</p>
                <p className="text-sm font-medium">{campaign.email_templates?.name || 'Unknown'}</p>
              </div>

              {/* Recipients */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Recipients:</p>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{campaign.total_recipients}</span>
                </div>
              </div>

              {/* Performance Metrics */}
              {campaign.status === 'sent' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Delivery Rate:</span>
                    <span className="font-medium">{getDeliveryRate(campaign)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Open Rate:</span>
                    <span className="font-medium">{getOpenRate(campaign)}%</span>
                  </div>
                  <Progress value={getDeliveryRate(campaign)} className="h-2" />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreviewCampaign(campaign)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {campaign.status === 'draft' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSendCampaign(campaign)}
                      disabled={sending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCampaign(campaign)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <span className="text-xs text-gray-500">
                  {campaign.sent_at 
                    ? `Sent ${new Date(campaign.sent_at).toLocaleDateString()}`
                    : `Created ${new Date(campaign.created_at).toLocaleDateString()}`
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No email campaigns found</h3>
            <p className="text-gray-600 mb-4">Create your first email campaign to get started</p>
            <Button onClick={handleCreateCampaign}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Email Campaign</DialogTitle>
          </DialogHeader>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>

          {/* Step 1: Target Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Step 1: Select Target Audience</h3>
                
                {/* Target Type Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      targetType === 'criteria' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setTargetType('criteria')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        targetType === 'criteria' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}></div>
                      <div>
                        <h4 className="font-medium">Target by Criteria</h4>
                        <p className="text-sm text-gray-600">Filter students by payment status, country, etc.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      targetType === 'students' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setTargetType('students')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        targetType === 'students' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}></div>
                      <div>
                        <h4 className="font-medium">Select Specific Students</h4>
                        <p className="text-sm text-gray-600">Choose individual students manually</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Criteria Selection */}
                {targetType === 'criteria' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-4">Target Criteria</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="paymentStatus">Payment Status</Label>
                        <Select
                          value={formData.target_criteria.paymentStatus}
                          onValueChange={(value) => setFormData(prev => ({
                            ...prev,
                            target_criteria: { ...prev.target_criteria, paymentStatus: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="current">Current</SelectItem>
                            <SelectItem value="upcoming">Upcoming payments</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={formData.target_criteria.country}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            target_criteria: { ...prev.target_criteria, country: e.target.value }
                          }))}
                          placeholder="Filter by country"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Student Selection */}
                {targetType === 'students' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="studentSearch">Search Students</Label>
                      <Input
                        id="studentSearch"
                        value={studentSearchTerm}
                        onChange={(e) => setStudentSearchTerm(e.target.value)}
                        placeholder="Search by name or email..."
                      />
                    </div>
                    
                    <div className="border rounded-lg max-h-64 overflow-y-auto">
                      <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {selectedStudents.size} of {filteredStudents.length} students selected
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectAllStudents(selectedStudents.size !== filteredStudents.length)}
                        >
                          {selectedStudents.size === filteredStudents.length ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>
                      <div className="divide-y">
                        {filteredStudents.map((student) => (
                          <div key={student.id} className="p-3 flex items-center space-x-3">
                            <Checkbox
                              checked={selectedStudents.has(student.id)}
                              onCheckedChange={(checked) => handleStudentSelect(student.id, Boolean(checked))}
                            />
                            <div className="flex-1">
                              <div className="font-medium">
                                {student.user?.first_name} {student.user?.last_name}
                              </div>
                              <div className="text-sm text-gray-600">{student.user?.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Campaign Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Step 2: Campaign Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter campaign name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter campaign description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="template">Email Template</Label>
                    <Select
                      value={formData.template_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, template_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name} ({template.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sendNow"
                        checked={formData.sendNow}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendNow: Boolean(checked), scheduled_at: checked ? '' : prev.scheduled_at }))}
                      />
                      <Label htmlFor="sendNow">Send Now</Label>
                    </div>
                    
                    {!formData.sendNow && (
                      <div>
                        <Label htmlFor="scheduled_at">Schedule</Label>
                        <Input
                          id="scheduled_at"
                          type="datetime-local"
                          value={formData.scheduled_at}
                          onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dialog Footer */}
          <div className="flex justify-between pt-4 border-t">
            <div>
              {currentStep === 2 && (
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              {currentStep === 1 ? (
                <Button onClick={handleNextStep}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSaveCampaign}>
                  Create Campaign
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Campaign Preview: {selectedCampaign?.name}</DialogTitle>
          </DialogHeader>
          
          {previewData && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Subject:</Label>
                <p className="text-sm bg-gray-50 p-2 rounded">{previewData.subject}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Recipient:</Label>
                <p className="text-sm bg-gray-50 p-2 rounded">
                  {previewData.student.first_name} {previewData.student.last_name} ({previewData.student.user?.email || previewData.student.email})
                </p>
              </div>

              <Tabs defaultValue="html" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="html">HTML Preview</TabsTrigger>
                  <TabsTrigger value="text">Text Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="html">
                  <div className="border rounded p-4 bg-gray-50 max-h-96 overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: previewData.html }} />
                  </div>
                </TabsContent>
                <TabsContent value="text">
                  <div className="border rounded p-4 bg-gray-50 max-h-96 overflow-y-auto whitespace-pre-wrap">
                    {previewData.text}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Campaign Details Dialog */}
      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Campaign Details: {selectedCampaign?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCampaign && (
            <div className="space-y-6">
              {/* Campaign Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Campaign Name</Label>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedCampaign.name}</p>
                  </div>
                  
                  {selectedCampaign.description && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Description</Label>
                      <p className="text-sm bg-gray-50 p-3 rounded">{selectedCampaign.description}</p>
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                    <div className="mt-1">
                      <Badge className={`${getStatusColor(selectedCampaign.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(selectedCampaign.status)}
                        {selectedCampaign.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Template</Label>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedCampaign.email_templates?.name || 'Unknown'}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Total Recipients</Label>
                    <div className="flex items-center gap-2 text-sm bg-gray-50 p-3 rounded">
                      <Users className="h-4 w-4 text-gray-400" />
                      {selectedCampaign.total_recipients} recipients
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Date</Label>
                    <p className="text-sm bg-gray-50 p-3 rounded">
                      {selectedCampaign.sent_at 
                        ? `Sent on ${new Date(selectedCampaign.sent_at).toLocaleDateString()} at ${new Date(selectedCampaign.sent_at).toLocaleTimeString()}`
                        : `Created on ${new Date(selectedCampaign.created_at).toLocaleDateString()} at ${new Date(selectedCampaign.created_at).toLocaleTimeString()}`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              {selectedCampaign.status === 'sent' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Performance Metrics
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Delivery Rate</Label>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1">
                            <Progress value={getDeliveryRate(selectedCampaign)} className="h-3" />
                          </div>
                          <span className="text-sm font-medium min-w-[3rem] text-right">
                            {getDeliveryRate(selectedCampaign)}%
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Open Rate</Label>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1">
                            <Progress value={getOpenRate(selectedCampaign)} className="h-3" />
                          </div>
                          <span className="text-sm font-medium min-w-[3rem] text-right">
                            {getOpenRate(selectedCampaign)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-700">Delivered</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                          {Math.round((selectedCampaign.total_recipients * getDeliveryRate(selectedCampaign)) / 100)}
                        </p>
                        <p className="text-xs text-blue-600">emails delivered</p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-green-700">Opened</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                          {Math.round((selectedCampaign.total_recipients * getOpenRate(selectedCampaign)) / 100)}
                        </p>
                        <p className="text-xs text-green-600">emails opened</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Target Criteria */}
              {selectedCampaign.target_criteria && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Target Criteria
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(selectedCampaign.target_criteria, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handlePreviewCampaign(selectedCampaign)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Campaign
                </Button>
                
                {selectedCampaign.status === 'draft' && (
                  <Button
                    onClick={() => handleSendCampaign(selectedCampaign)}
                    disabled={sending}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {sending ? 'Sending...' : 'Send Campaign'}
                  </Button>
                )}
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Campaign
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{selectedCampaign.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteCampaign(selectedCampaign)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkEmailSender;
