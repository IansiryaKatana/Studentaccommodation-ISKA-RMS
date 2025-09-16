import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Eye, 
  User, 
  Shield, 
  Loader2,
  Calendar,
  File
} from 'lucide-react';
import { format } from 'date-fns';

interface StudentDocumentsProps {
  studentId: string;
}

const StudentDocuments = ({ studentId }: StudentDocumentsProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<{
    studentDocuments: any[];
    guarantorDocuments: any[];
  }>({ studentDocuments: [], guarantorDocuments: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, [studentId]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getStudentDocumentCategories(studentId);
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDocument = (url: string, filename: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadDocument = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDocumentIcon = (category: string) => {
    switch (category) {
      case 'passport':
        return <User className="h-4 w-4" />;
      case 'visa':
        return <FileText className="h-4 w-4" />;
      case 'guarantor_id':
        return <Shield className="h-4 w-4" />;
      case 'utility_bill':
      case 'bank_statement':
      case 'proof_of_income':
        return <File className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDocumentTypeLabel = (category: string) => {
    switch (category) {
      case 'passport':
        return 'Passport';
      case 'visa':
        return 'Visa';
      case 'guarantor_id':
        return 'Guarantor ID';
      case 'utility_bill':
        return 'Utility Bill';
      case 'bank_statement':
        return 'Bank Statement';
      case 'proof_of_income':
        return 'Proof of Income';
      default:
        return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-600">View and download your uploaded documents</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{documents.studentDocuments.length}</div>
                <p className="text-xs text-muted-foreground">Student Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{documents.guarantorDocuments.length}</div>
                <p className="text-xs text-muted-foreground">Guarantor Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">
                  {documents.studentDocuments.length + documents.guarantorDocuments.length}
                </div>
                <p className="text-xs text-muted-foreground">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Tabs */}
      <Tabs defaultValue="student" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Student Documents
          </TabsTrigger>
          <TabsTrigger value="guarantor" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Guarantor Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.studentDocuments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No student documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.studentDocuments.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getDocumentIcon(doc.category)}
                          <div>
                            <h3 className="font-semibold">{getDocumentTypeLabel(doc.category)}</h3>
                            <p className="text-sm text-gray-600">{doc.original_filename}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <span>{formatFileSize(doc.file_size)}</span>
                              <span>•</span>
                              <span>{format(new Date(doc.created_at), 'MMM dd, yyyy')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDocument(doc.file_path, doc.original_filename)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadDocument(doc.file_path, doc.original_filename)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guarantor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Guarantor Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.guarantorDocuments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No guarantor documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.guarantorDocuments.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getDocumentIcon(doc.category)}
                          <div>
                            <h3 className="font-semibold">{getDocumentTypeLabel(doc.category)}</h3>
                            <p className="text-sm text-gray-600">{doc.original_filename}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <span>{formatFileSize(doc.file_size)}</span>
                              <span>•</span>
                              <span>{format(new Date(doc.created_at), 'MMM dd, yyyy')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDocument(doc.file_path, doc.original_filename)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadDocument(doc.file_path, doc.original_filename)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDocuments;
