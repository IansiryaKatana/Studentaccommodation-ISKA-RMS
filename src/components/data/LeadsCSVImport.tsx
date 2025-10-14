import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  Trash2,
  Users,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
import { Skeleton } from '@/components/ui/skeleton';

interface CSVLeadData {
  'Date of Inquiry': string;
  'Customer Name': string;
  'Phone Number': string;
  'Email Address': string;
  'Lead Source': string;
  'Room Grade Choice': string;
  'Stay Duration': string;
  'Lead Status': string;
  'Assigned To': string;
  'Estimated Revenue': string;
  'Latest Comment': string;
  Notes: string;
}

interface ProcessedLeadData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  source_id?: string;
  room_grade_preference_id?: string;
  duration_type_preference_id?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiating' | 'won' | 'lost' | 'converted';
  estimated_revenue?: number;
  notes?: string;
  assigned_to?: string;
  created_by: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface MappingData {
  leadSources: Array<{ id: string; name: string }>;
  leadRoomGrades: Array<{ id: string; name: string }>;
  leadDurationTypes: Array<{ id: string; name: string }>;
  users: Array<{ id: string; first_name: string; last_name: string }>;
}

const LeadsCSVImport = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CSVLeadData[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedLeadData[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [mappingData, setMappingData] = useState<MappingData>({
    leadSources: [],
    leadRoomGrades: [],
    leadDurationTypes: [],
    users: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMappingData();
  }, []);

  const fetchMappingData = async () => {
    try {
      setIsLoading(true);
      const [sources, users] = await Promise.all([
        ApiService.getLeadSources(),
        ApiService.getUsers()
      ]);
      
      // Mock data for lead room grades and duration types (replace with actual API calls)
      const leadRoomGrades = [
        { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Silver Studio' },
        { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Gold Studio' },
        { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Platinum Studio' },
        { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Not Specified' }
      ];
      
      const leadDurationTypes = [
        { id: '660e8400-e29b-41d4-a716-446655440001', name: 'Short Stay' },
        { id: '660e8400-e29b-41d4-a716-446655440002', name: 'Long-Term Stay' },
        { id: '660e8400-e29b-41d4-a716-446655440003', name: 'Not Specified' }
      ];

      setMappingData({
        leadSources: sources,
        leadRoomGrades,
        leadDurationTypes,
        users
      });
      
      // Debug: Log mapping data
      console.log('Mapping data loaded:', {
        sources: sources.length,
        roomGrades: leadRoomGrades.length,
        durationTypes: leadDurationTypes.length,
        users: users.length
      });
    } catch (error) {
      console.error('Error fetching mapping data:', error);
      toast({
        title: "Error",
        description: "Failed to load mapping data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateTemplate = () => {
    const template: CSVLeadData[] = [
      {
        'Date of Inquiry': '2025-01-15',
        'Customer Name': 'John Doe',
        'Phone Number': '+44 20 1234 5678',
        'Email Address': 'john.doe@example.com',
        'Lead Source': 'Google Ads',
        'Room Grade Choice': 'Silver Studio',
        'Stay Duration': 'Long-Term Stay',
        'Lead Status': 'new',
        'Assigned To': 'May',
        'Estimated Revenue': '7200',
        'Latest Comment': 'Interested in studio accommodation',
        Notes: 'Follow up next week'
      }
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'leads_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    setFile(uploadedFile);
    parseCSV(uploadedFile);
  };

  const parseCSV = (csvFile: File) => {
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as CSVLeadData[];
        setParsedData(data);
        processData(data);
      },
      error: (error) => {
        toast({
          title: "CSV parsing error",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const processData = (data: CSVLeadData[]) => {
    const errors: ValidationError[] = [];
    const processed: ProcessedLeadData[] = [];
    
    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because of 0-based index and header row
      
      // Split customer name
      const nameParts = row['Customer Name']?.trim().split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Required fields validation
      if (!firstName) {
        errors.push({ row: rowNumber, field: 'Customer Name', message: 'Customer name is required' });
      }
      
      // Email validation
      if (row['Email Address'] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row['Email Address'])) {
        errors.push({ row: rowNumber, field: 'Email Address', message: 'Invalid email format' });
      }
      
      // Phone validation (basic)
      if (row['Phone Number'] && !/^[+]?[0-9\s\-()]{10,}$/.test(row['Phone Number'])) {
        errors.push({ row: rowNumber, field: 'Phone Number', message: 'Invalid phone format' });
      }
      
      // Status validation
      const validStatuses = ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiating', 'won', 'lost', 'converted'];
      if (!validStatuses.includes(row['Lead Status']?.toLowerCase())) {
        errors.push({ row: rowNumber, field: 'Lead Status', message: 'Invalid status value' });
      }
      
      // Revenue validation
      const revenue = parseFloat(row['Estimated Revenue']?.replace(/[£,]/g, '') || '0');
      if (row['Estimated Revenue'] && (isNaN(revenue) || revenue < 0)) {
        errors.push({ row: rowNumber, field: 'Estimated Revenue', message: 'Revenue must be a positive number' });
      }
      
      // Map source
      const sourceName = row['Lead Source']?.toLowerCase();
      const source = mappingData.leadSources.find(s => 
        s.name.toLowerCase() === sourceName
      );
      
      // Debug: Log source mapping
      if (index < 3) { // Only log first 3 rows
        console.log(`Row ${index + 1} source mapping:`, {
          csvSource: row['Lead Source'],
          sourceName,
          foundSource: source?.name,
          allSources: mappingData.leadSources.map(s => s.name)
        });
      }
      
      // Map room grade
      const roomGradeName = row['Room Grade Choice']?.toLowerCase();
      const roomGrade = mappingData.leadRoomGrades.find(rg => 
        rg.name.toLowerCase() === roomGradeName
      );
      
      // Map duration type
      const durationTypeName = row['Stay Duration']?.toLowerCase();
      const durationType = mappingData.leadDurationTypes.find(dt => 
        dt.name.toLowerCase() === durationTypeName
      );
      
      // Debug: Log room grade and duration mapping
      if (index < 3) { // Only log first 3 rows
        console.log(`Row ${index + 1} room/duration mapping:`, {
          csvRoomGrade: row['Room Grade Choice'],
          roomGradeName,
          foundRoomGrade: roomGrade?.name,
          csvDuration: row['Stay Duration'],
          durationTypeName,
          foundDuration: durationType?.name
        });
      }
      
      // Map assigned user (handle partial name matches)
      const assignedToName = row['Assigned To']?.toLowerCase();
      let assignedUser = mappingData.users.find(u => {
        const firstName = u.first_name.toLowerCase();
        const lastName = u.last_name.toLowerCase();
        const fullName = `${firstName} ${lastName}`;
        return firstName === assignedToName || 
               fullName.includes(assignedToName) || 
               assignedToName?.includes(firstName);
      });
      
      // Handle special cases for names not in database
      if (!assignedUser && assignedToName === 'jamie') {
        // Map Jamie to May zin as fallback
        assignedUser = mappingData.users.find(u => u.first_name.toLowerCase() === 'may');
      }
      
      // Debug: Log user mapping
      if (index < 3) { // Only log first 3 rows
        console.log(`Row ${index + 1} user mapping:`, {
          csvAssignedTo: row['Assigned To'],
          assignedToName,
          foundUser: assignedUser ? `${assignedUser.first_name} ${assignedUser.last_name}` : 'Not found',
          allUsers: mappingData.users.map(u => `${u.first_name} ${u.last_name}`)
        });
      }
      
      if (errors.length === 0) {
        const leadData = {
          first_name: firstName,
          last_name: lastName,
          email: row['Email Address']?.trim() || undefined,
          phone: row['Phone Number']?.trim() || undefined,
          source_id: source?.id || undefined,
          room_grade_preference_id: roomGrade?.id || undefined,
          duration_type_preference_id: durationType?.id || undefined,
          status: row['Lead Status']?.toLowerCase() as any,
          estimated_revenue: revenue || undefined,
          notes: row['Latest Comment']?.trim() || row.Notes?.trim() || undefined,
          assigned_to: assignedUser?.id || undefined,
          created_by: assignedUser?.id || '423b2f89-ed35-4537-866e-d4fe702e577c' // Use assigned user or fallback to existing admin
        };
        
        // Remove undefined values to avoid database issues
        Object.keys(leadData).forEach(key => {
          if (leadData[key] === undefined) {
            delete leadData[key];
          }
        });
        
        processed.push(leadData);
      }
    });
    
    setValidationErrors(errors);
    setProcessedData(processed);
    
    // Debug: Log processed data
    console.log('Processed data sample:', processed.slice(0, 3));
    console.log('Total processed leads:', processed.length);
    console.log('Validation errors:', errors.length);
  };

  const handleImport = async () => {
    if (validationErrors.length > 0) {
      toast({
        title: "Validation errors found",
        description: "Please fix the validation errors before importing.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadedCount(0);
    setFailedCount(0);

    const totalRows = processedData.length;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < totalRows; i++) {
      try {
        const leadData = processedData[i];
        console.log(`Importing row ${i + 1}:`, leadData);
        
        // Test direct Supabase call instead of API service
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY
        );
        
        const { data, error } = await supabase
          .from('leads')
          .insert(leadData)
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        successCount++;
      } catch (error) {
        console.error(`Error importing row ${i + 1}:`, error);
        console.error('Lead data that failed:', processedData[i]);
        console.error('Full error details:', JSON.stringify(error, null, 2));
        errorCount++;
      }

      // Update progress
      const progress = ((i + 1) / totalRows) * 100;
      setUploadProgress(progress);
      setUploadedCount(successCount);
      setFailedCount(errorCount);

      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsUploading(false);

    if (errorCount === 0) {
      toast({
        title: "Import successful",
        description: `Successfully imported ${successCount} leads.`,
      });
      // Reset form
      setFile(null);
      setParsedData([]);
      setProcessedData([]);
      setValidationErrors([]);
    } else {
      toast({
        title: "Import completed with errors",
        description: `Imported ${successCount} leads, ${errorCount} failed.`,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      proposal_sent: 'bg-purple-100 text-purple-800',
      negotiating: 'bg-orange-100 text-orange-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
      converted: 'bg-emerald-100 text-emerald-800'
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import Leads from CSV</h1>
          <p className="text-muted-foreground">Import leads from your leads report CSV file</p>
        </div>
        <Link to="/leads">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Download */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Template
            </CardTitle>
            <CardDescription>
              Download the CSV template with the correct column structure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">CSV Format:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Date of Inquiry</strong> - Lead inquiry date</li>
                <li>• <strong>Customer Name</strong> - Full customer name</li>
                <li>• <strong>Phone Number</strong> - Contact phone number</li>
                <li>• <strong>Email Address</strong> - Contact email</li>
                <li>• <strong>Lead Source</strong> - Source of the lead</li>
                <li>• <strong>Room Grade Choice</strong> - Preferred room grade</li>
                <li>• <strong>Stay Duration</strong> - Preferred stay duration</li>
                <li>• <strong>Lead Status</strong> - Current lead status</li>
                <li>• <strong>Assigned To</strong> - Assigned staff member</li>
                <li>• <strong>Estimated Revenue</strong> - Expected revenue</li>
                <li>• <strong>Latest Comment</strong> - Latest notes</li>
              </ul>
            </div>
            <Button onClick={generateTemplate} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload CSV File
            </CardTitle>
            <CardDescription>
              Select your leads report CSV file to import
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </div>
            
            {file && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{file.name}</span>
                <Badge variant="secondary">{parsedData.length} rows</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setParsedData([]);
                    setProcessedData([]);
                    setValidationErrors([]);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {validationErrors.length} validation error(s) found. Please fix them before importing.
                </AlertDescription>
              </Alert>
            )}

            {processedData.length > 0 && validationErrors.length === 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  File processed successfully! {processedData.length} leads ready for import.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Validation Errors ({validationErrors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {validationErrors.map((error, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded text-sm">
                  <span className="font-medium">Row {error.row}:</span>
                  <span className="text-red-700">{error.field} - {error.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Preview */}
      {processedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Data Preview
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
            </CardTitle>
          </CardHeader>
          {showPreview && (
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {processedData.slice(0, 10).map((lead, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">
                        {lead.first_name} {lead.last_name}
                      </h4>
                      {getStatusBadge(lead.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Email:</span> {lead.email || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {lead.phone || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Revenue:</span> {lead.estimated_revenue ? `£${lead.estimated_revenue}` : 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Source:</span> {mappingData.leadSources.find(s => s.id === lead.source_id)?.name || 'N/A'}
                      </div>
                    </div>
                    {lead.notes && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Notes:</span> {lead.notes}
                      </div>
                    )}
                  </div>
                ))}
                {processedData.length > 10 && (
                  <div className="text-center text-sm text-muted-foreground">
                    Showing first 10 of {processedData.length} leads
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Import Progress */}
      {isUploading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Importing Leads...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={uploadProgress} className="w-full" />
            <div className="flex justify-between text-sm">
              <span>Progress: {Math.round(uploadProgress)}%</span>
              <span>Uploaded: {uploadedCount}</span>
              <span>Failed: {failedCount}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Button */}
      {processedData.length > 0 && validationErrors.length === 0 && !isUploading && (
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={handleImport} 
              className="w-full" 
              size="lg"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import {processedData.length} Leads
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadsCSVImport;
