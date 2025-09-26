import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { FileStorageService, FileRecord, UploadOptions } from '@/services/fileStorage';
import { Upload, Download, Trash2, Eye, Share2, Search, Filter, Plus, FileText, Image, Archive } from 'lucide-react';

const FileManagement: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({ total_files: 0, total_size: 0, files_by_category: {} });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    description: '',
    tags: '',
    category: 'general' as FileRecord['category'],
    isPublic: false
  });

  useEffect(() => {
    loadFiles();
    loadStats();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (searchTerm) filters.search = searchTerm;
      if (categoryFilter && categoryFilter !== 'all') filters.category = categoryFilter;
      
      const fileList = await FileStorageService.listFiles(filters);
      setFiles(fileList);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const fileStats = await FileStorageService.getFileStats();
      setStats(fileStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    const uploadPromises = Array.from(selectedFiles).map(async (file) => {
      try {
        const options: UploadOptions = {
          category: uploadForm.category,
          description: uploadForm.description || undefined,
          tags: uploadForm.tags ? uploadForm.tags.split(',').map(tag => tag.trim()) : undefined,
          is_public: uploadForm.isPublic
        };

        await FileStorageService.uploadFile(file, options);
        return { success: true, filename: file.name };
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        return { success: false, filename: file.name, error };
      }
    });

    const results = await Promise.all(uploadPromises);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    if (successful.length > 0) {
      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${successful.length} file(s)`,
      });
    }

    if (failed.length > 0) {
      toast({
        title: "Upload Failed",
        description: `Failed to upload ${failed.length} file(s)`,
        variant: "destructive"
      });
    }

    setUploading(false);
    setShowUploadDialog(false);
    setUploadForm({ description: '', tags: '', category: 'general', isPublic: false });
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    // Reload files and stats
    await loadFiles();
    await loadStats();
  };

  const handleDownload = async (file: FileRecord) => {
    try {
      const { data, filename } = await FileStorageService.downloadFile(file.id);
      
      // Create download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: `Downloading ${filename}`,
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download file",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (file: FileRecord) => {
    if (!confirm(`Are you sure you want to delete "${file.original_filename}"?`)) return;

    try {
      await FileStorageService.deleteFile(file.id);
      toast({
        title: "File Deleted",
        description: `Successfully deleted ${file.original_filename}`,
      });
      await loadFiles();
      await loadStats();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  const handleShare = async (file: FileRecord) => {
    try {
      const shareToken = await FileStorageService.createShareLink(file.id, {
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        max_downloads: 10
      });

      const shareUrl = `${window.location.origin}/files/share/${shareToken}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Share Link Created",
        description: "Share link copied to clipboard",
      });
    } catch (error) {
      console.error('Error creating share link:', error);
      toast({
        title: "Share Failed",
        description: "Failed to create share link",
        variant: "destructive"
      });
    }
  };

  const handleViewFile = (file: FileRecord) => {
    setSelectedFile(file);
    setShowFileDialog(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'invoice': return <FileText className="h-4 w-4" />;
      case 'contract': return <FileText className="h-4 w-4" />;
      case 'id_document': return <FileText className="h-4 w-4" />;
      case 'payment_proof': return <Image className="h-4 w-4" />;
      case 'maintenance_photo': return <Image className="h-4 w-4" />;
      case 'cleaning_report': return <FileText className="h-4 w-4" />;
      case 'lead_attachment': return <FileText className="h-4 w-4" />;
      case 'student_document': return <FileText className="h-4 w-4" />;
      case 'tourist_document': return <FileText className="h-4 w-4" />;
      case 'system_backup': return <Archive className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'invoice': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-green-100 text-green-800';
      case 'id_document': return 'bg-purple-100 text-purple-800';
      case 'payment_proof': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance_photo': return 'bg-orange-100 text-orange-800';
      case 'cleaning_report': return 'bg-cyan-100 text-cyan-800';
      case 'lead_attachment': return 'bg-pink-100 text-pink-800';
      case 'student_document': return 'bg-indigo-100 text-indigo-800';
      case 'tourist_document': return 'bg-teal-100 text-teal-800';
      case 'system_backup': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">File Management</h1>
          <p className="text-muted-foreground">
            Upload, organize, and manage files securely in Supabase Storage
          </p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_files}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{FileStorageService.formatFileSize(stats.total_size)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats.files_by_category).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Files</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by filename or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="id_document">ID Document</SelectItem>
                  <SelectItem value="payment_proof">Payment Proof</SelectItem>
                  <SelectItem value="maintenance_photo">Maintenance Photo</SelectItem>
                  <SelectItem value="cleaning_report">Cleaning Report</SelectItem>
                  <SelectItem value="lead_attachment">Lead Attachment</SelectItem>
                  <SelectItem value="student_document">Student Document</SelectItem>
                  <SelectItem value="tourist_document">Tourist Document</SelectItem>
                  <SelectItem value="system_backup">System Backup</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={loadFiles} variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card>
        <CardHeader>
          <CardTitle>Files</CardTitle>
          <CardDescription>
            {files.length} file(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading files...</p>
              </div>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No files found</p>
              <Button onClick={() => setShowUploadDialog(true)} className="mt-4">
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First File
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{FileStorageService.getFileIcon(file.mime_type)}</span>
                        <div>
                          <div className="font-medium">{file.original_filename}</div>
                          {file.description && (
                            <div className="text-sm text-muted-foreground">{file.description}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(file.category)}>
                        {getCategoryIcon(file.category)}
                        <span className="ml-1">{file.category.replace('_', ' ')}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{FileStorageService.formatFileSize(file.file_size)}</TableCell>
                    <TableCell>
                      {new Date(file.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewFile(file)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(file)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(file)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(file)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Select files to upload to Supabase Storage. Maximum file size is 50MB.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="files">Select Files</Label>
              <Input
                id="files"
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileUpload}
                disabled={uploading}
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={uploadForm.category}
                onValueChange={(value: FileRecord['category']) =>
                  setUploadForm(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="id_document">ID Document</SelectItem>
                  <SelectItem value="payment_proof">Payment Proof</SelectItem>
                  <SelectItem value="maintenance_photo">Maintenance Photo</SelectItem>
                  <SelectItem value="cleaning_report">Cleaning Report</SelectItem>
                  <SelectItem value="lead_attachment">Lead Attachment</SelectItem>
                  <SelectItem value="student_document">Student Document</SelectItem>
                  <SelectItem value="tourist_document">Tourist Document</SelectItem>
                  <SelectItem value="system_backup">System Backup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the file"
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (Optional)</Label>
              <Input
                id="tags"
                value={uploadForm.tags}
                onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Comma-separated tags"
              />
            </div>
            {uploading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Uploading files...</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* File Details Dialog */}
      <Dialog open={showFileDialog} onOpenChange={setShowFileDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
            <DialogDescription>
              View detailed information about the selected file.
            </DialogDescription>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4">
              <div>
                <Label>Filename</Label>
                <p className="text-sm font-medium">{selectedFile.original_filename}</p>
              </div>
              <div>
                <Label>Category</Label>
                <Badge className={getCategoryColor(selectedFile.category)}>
                  {selectedFile.category.replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <Label>Size</Label>
                <p className="text-sm">{FileStorageService.formatFileSize(selectedFile.file_size)}</p>
              </div>
              <div>
                <Label>Type</Label>
                <p className="text-sm">{selectedFile.mime_type}</p>
              </div>
              {selectedFile.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm">{selectedFile.description}</p>
                </div>
              )}
              {selectedFile.tags && selectedFile.tags.length > 0 && (
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-1">
                    {selectedFile.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Label>Uploaded</Label>
                <p className="text-sm">{new Date(selectedFile.created_at).toLocaleString()}</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleDownload(selectedFile)} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={() => handleShare(selectedFile)} variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileManagement; 