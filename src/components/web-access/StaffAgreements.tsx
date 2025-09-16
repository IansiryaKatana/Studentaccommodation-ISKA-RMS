import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import { FileStorageService } from '@/services/fileStorage';
import { 
  FileText, 
  Upload, 
  Plus, 
  Download, 
  Eye, 
  Trash2, 
  Edit,
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

const StaffAgreements = () => {
  const { toast } = useToast();
  const [agreements, setAgreements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    agreement_type: 'general',
    due_date: ''
  });

  useEffect(() => {
    fetchAgreements();
  }, []);

  const fetchAgreements = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getStaffAgreements();
      setAgreements(data);
    } catch (error) {
      console.error('Error fetching agreements:', error);
      toast({
        title: "Error",
        description: "Failed to fetch agreements. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please select a file and enter a title.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Upload file to storage
      const fileRecord = await FileStorageService.uploadFile(selectedFile, {
        category: 'contract',
        description: formData.description,
        related_entity_type: 'staff_agreement'
      });

      // Create agreement record
      await ApiService.createStaffAgreement({
        title: formData.title,
        description: formData.description,
        document_url: fileRecord.file_path,
        agreement_type: formData.agreement_type,
        due_date: formData.due_date || undefined
      });

      toast({
        title: "Success",
        description: "Agreement uploaded successfully.",
      });

      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        agreement_type: 'general',
        due_date: ''
      });
      setSelectedFile(null);
      setIsDialogOpen(false);

      // Refresh agreements list
      fetchAgreements();

    } catch (error) {
      console.error('Error uploading agreement:', error);
      toast({
        title: "Error",
        description: "Failed to upload agreement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agreement?')) {
      return;
    }

    try {
      await ApiService.deleteStaffAgreement(id);
      toast({
        title: "Success",
        description: "Agreement deleted successfully.",
      });
      fetchAgreements();
    } catch (error) {
      console.error('Error deleting agreement:', error);
      toast({
        title: "Error",
        description: "Failed to delete agreement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDocument = (url: string, title: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadDocument = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAgreementTypeLabel = (type: string) => {
    switch (type) {
      case 'accommodation':
        return 'Accommodation';
      case 'house_rules':
        return 'House Rules';
      case 'payment':
        return 'Payment';
      case 'general':
        return 'General';
      default:
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Loading agreements...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Agreements</h1>
          <p className="text-gray-600 mt-1">Upload and manage agreements for students to sign</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Upload Agreement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Agreement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Agreement Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter agreement title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter agreement description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="agreement_type">Agreement Type</Label>
                <Select
                  value={formData.agreement_type}
                  onValueChange={(value) => setFormData({ ...formData, agreement_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="house_rules">House Rules</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="due_date">Due Date (Optional)</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="file">Agreement File *</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isUploading || !selectedFile || !formData.title.trim()}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Agreement
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{agreements.length}</div>
                <p className="text-xs text-muted-foreground">Total Agreements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {agreements.filter(a => a.due_date && new Date(a.due_date) > new Date()).length}
                </div>
                <p className="text-xs text-muted-foreground">Active Agreements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">
                  {agreements.filter(a => a.due_date && new Date(a.due_date) < new Date()).length}
                </div>
                <p className="text-xs text-muted-foreground">Expired Agreements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agreements List */}
      <Card>
        <CardHeader>
          <CardTitle>All Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          {agreements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No agreements uploaded yet</p>
              <p className="text-sm mt-2">Click "Upload Agreement" to add the first agreement</p>
            </div>
          ) : (
            <div className="space-y-4">
              {agreements.map((agreement) => {
                const isExpired = agreement.due_date && new Date(agreement.due_date) < new Date();
                
                return (
                  <div key={agreement.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{agreement.title}</h3>
                            <Badge variant={isExpired ? "destructive" : "secondary"}>
                              {getAgreementTypeLabel(agreement.agreement_type)}
                            </Badge>
                            {isExpired && (
                              <Badge variant="destructive">Expired</Badge>
                            )}
                          </div>
                          {agreement.description && (
                            <p className="text-sm text-gray-600 mt-1">{agreement.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>Uploaded: {format(new Date(agreement.created_at), 'MMM dd, yyyy')}</span>
                            {agreement.due_date && (
                              <>
                                <span>•</span>
                                <span>Due: {format(new Date(agreement.due_date), 'MMM dd, yyyy')}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(agreement.document_url, agreement.title)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(agreement.document_url, agreement.title)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(agreement.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffAgreements;
