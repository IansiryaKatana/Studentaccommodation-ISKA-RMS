
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { FileStorageService } from '@/services/fileStorage';
import { FileText, Download, Upload, Eye, CheckCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

interface StudentAgreementsProps {
  studentId: string;
}

const StudentAgreements = ({ studentId }: StudentAgreementsProps) => {
  const { toast } = useToast();
  const [staffAgreements, setStaffAgreements] = useState<any[]>([]);
  const [studentAgreements, setStudentAgreements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

  useEffect(() => {
    fetchAgreements();
  }, [studentId]);

  const fetchAgreements = async () => {
    try {
      setIsLoading(true);
      
      // Fetch both staff agreements and student agreements
      const [staffData, studentData] = await Promise.all([
        ApiService.getStaffAgreements(),
        ApiService.getStudentAgreements(studentId)
      ]);
      
      setStaffAgreements(staffData);
      setStudentAgreements(studentData);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return Clock;
      default: return Clock;
    }
  };

  const handleViewDocument = (documentUrl: string, title: string) => {
    // In a real app, this would open the document in a new tab or modal
    toast({
      title: "Opening Document",
      description: `Opening ${title} for viewing`,
    });
    console.log('Opening document:', documentUrl);
  };

  const handleDownloadDocument = (documentUrl: string, title: string) => {
    // In a real app, this would trigger a download
    toast({
      title: "Download Started",
      description: `Downloading ${title}`,
    });
    console.log('Downloading document:', documentUrl);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, staffAgreementId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingDocId(staffAgreementId);
    
    try {
      // Upload file to storage
      const fileRecord = await FileStorageService.uploadFile(file, {
        category: 'contract',
        description: `Signed copy of agreement ${staffAgreementId}`,
        related_entity_type: 'student_agreement',
        related_entity_id: studentId
      });

      // Create or update student agreement record
      const existingAgreement = studentAgreements.find(sa => sa.staff_agreement_id === staffAgreementId);
      
      if (existingAgreement) {
        // Update existing agreement
        await ApiService.updateStudentAgreement(existingAgreement.id, {
          signed_document_url: fileRecord.file_path,
          status: 'signed',
          updated_at: new Date().toISOString()
        });
      } else {
        // Create new student agreement record
        const staffAgreement = staffAgreements.find(sa => sa.id === staffAgreementId);
        await ApiService.createStudentAgreement({
          student_id: studentId,
          staff_agreement_id: staffAgreementId,
          title: staffAgreement?.title || 'Agreement',
          description: staffAgreement?.description,
          document_url: staffAgreement?.document_url,
          signed_document_url: fileRecord.file_path,
          status: 'signed',
          due_date: staffAgreement?.due_date
        });
      }

      toast({
        title: "Upload Successful",
        description: "Signed document uploaded successfully",
      });

      // Refresh agreements
      fetchAgreements();

    } catch (error) {
      console.error('Error uploading signed document:', error);
      toast({
        title: "Error",
        description: "Failed to upload signed document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingDocId(null);
    }
  };

  const handleViewSignedDocument = (signedDocumentUrl: string, title: string) => {
    toast({
      title: "Opening Signed Document",
      description: `Opening signed ${title} for viewing`,
    });
    console.log('Opening signed document:', signedDocumentUrl);
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agreements</h1>
        <p className="text-gray-600">View, download, and upload signed copies of your accommodation agreements</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffAgreements.length}</div>
            <p className="text-xs text-muted-foreground">Agreements to sign</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {studentAgreements.filter(a => a.status === 'signed').length}
            </div>
            <p className="text-xs text-muted-foreground">Completed agreements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {staffAgreements.length - studentAgreements.filter(a => a.status === 'signed').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting signature</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {staffAgreements.filter(a => a.due_date && new Date(a.due_date) < new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Agreements List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            All Agreements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staffAgreements.map((staffAgreement) => {
              const studentAgreement = studentAgreements.find(sa => sa.staff_agreement_id === staffAgreement.id);
              const isExpired = staffAgreement.due_date && new Date(staffAgreement.due_date) < new Date();
              const isSigned = studentAgreement?.status === 'signed';
              const StatusIcon = getStatusIcon(isSigned ? 'signed' : (isExpired ? 'overdue' : 'pending'));
              
              return (
                <div key={staffAgreement.id} className="border rounded-lg p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{staffAgreement.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{staffAgreement.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Uploaded: {format(new Date(staffAgreement.created_at), 'MMM dd, yyyy')}</span>
                          {staffAgreement.due_date && (
                            <span className={isExpired ? 'text-red-600 font-medium' : ''}>
                              Due: {format(new Date(staffAgreement.due_date), 'MMM dd, yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(isSigned ? 'signed' : (isExpired ? 'overdue' : 'pending'))}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {isSigned ? 'signed' : (isExpired ? 'overdue' : 'pending')}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    {/* Original Document Actions */}
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">Original Document:</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(staffAgreement.document_url, staffAgreement.title)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadDocument(staffAgreement.document_url, staffAgreement.title)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>

                    {/* Upload Section */}
                    {!isSigned && (
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">Upload Signed Copy:</span>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileUpload(e, staffAgreement.id)}
                            className="w-auto"
                            disabled={uploadingDocId === staffAgreement.id}
                          />
                          {uploadingDocId === staffAgreement.id && (
                            <span className="text-sm text-blue-600">Uploading...</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Signed Document Actions */}
                    {studentAgreement?.signed_document_url && (
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-green-700">Signed Document:</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewSignedDocument(studentAgreement.signed_document_url!, staffAgreement.title)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Signed
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(studentAgreement.signed_document_url!, staffAgreement.title)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Signed
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAgreements;
