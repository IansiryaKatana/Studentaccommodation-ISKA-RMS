import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ApiService, Lead } from '@/services/api';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Users,
  ArrowLeft,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';

interface LeadImportData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  source_id?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiating' | 'won' | 'lost' | 'converted';
  budget?: number;
  move_in_date?: string;
  duration_months?: number;
  notes?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const BulkImportLeads = () => {
  const { toast } = useToast();
  const { selectedAcademicYear } = useAcademicYear();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<LeadImportData[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [leadSources, setLeadSources] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLeadSources();
  }, []);

  const fetchLeadSources = async () => {
    try {
      const sources = await ApiService.getLeadSources();
      setLeadSources(sources);
    } catch (error) {
      console.error('Error fetching lead sources:', error);
    }
  };

  const generateTemplate = () => {
    const template: LeadImportData[] = [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '+44 20 1234 5678',
        source_id: '1',
        status: 'new',
        budget: 5000,
        move_in_date: '2024-09-01',
        duration_months: 45,
        notes: 'Interested in studio accommodation'
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+44 20 8765 4321',
        source_id: '2',
        status: 'contacted',
        budget: 6000,
        move_in_date: '2024-09-15',
        duration_months: 51,
        notes: 'Looking for premium accommodation'
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
        const data = results.data as LeadImportData[];
        setParsedData(data);
        validateData(data);
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

  const validateData = (data: LeadImportData[]) => {
    const errors: ValidationError[] = [];
    
    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because of 0-based index and header row
      
      // Required fields
      if (!row.first_name?.trim()) {
        errors.push({ row: rowNumber, field: 'first_name', message: 'First name is required' });
      }
      if (!row.last_name?.trim()) {
        errors.push({ row: rowNumber, field: 'last_name', message: 'Last name is required' });
      }
      
      // Email validation
      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        errors.push({ row: rowNumber, field: 'email', message: 'Invalid email format' });
      }
      
      // Phone validation (basic)
      if (row.phone && !/^[+]?[0-9\s\-()]{10,}$/.test(row.phone)) {
        errors.push({ row: rowNumber, field: 'phone', message: 'Invalid phone format' });
      }
      
      // Status validation
      const validStatuses = ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiating', 'won', 'lost', 'converted'];
      if (!validStatuses.includes(row.status)) {
        errors.push({ row: rowNumber, field: 'status', message: 'Invalid status value' });
      }
      
      // Budget validation
      if (row.budget && (isNaN(row.budget) || row.budget < 0)) {
        errors.push({ row: rowNumber, field: 'budget', message: 'Budget must be a positive number' });
      }
      
      // Duration validation
      if (row.duration_months && (isNaN(row.duration_months) || row.duration_months < 1)) {
        errors.push({ row: rowNumber, field: 'duration_months', message: 'Duration must be a positive number' });
      }
      
      // Date validation
      if (row.move_in_date && !/^\d{4}-\d{2}-\d{2}$/.test(row.move_in_date)) {
        errors.push({ row: rowNumber, field: 'move_in_date', message: 'Date must be in YYYY-MM-DD format' });
      }
    });
    
    setValidationErrors(errors);
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

    const totalRows = parsedData.length;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < totalRows; i++) {
      try {
        const leadData = parsedData[i];
        
        // Create lead data for API
        const createLeadData = {
          first_name: leadData.first_name.trim(),
          last_name: leadData.last_name.trim(),
          email: leadData.email?.trim() || undefined,
          phone: leadData.phone?.trim() || undefined,
          source_id: leadData.source_id || undefined,
          status: leadData.status,
          budget: leadData.budget || undefined,
          move_in_date: leadData.move_in_date || undefined,
          duration_months: leadData.duration_months || undefined,
          notes: leadData.notes?.trim() || undefined,
          created_by: '1', // Default admin user ID
          academic_year: selectedAcademicYear !== 'all' ? selectedAcademicYear : '2025/2026' // Use selected academic year
        };

        await ApiService.createLead(createLeadData);
        successCount++;
      } catch (error) {
        console.error(`Error importing row ${i + 1}:`, error);
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
      setValidationErrors([]);
    } else {
      toast({
        title: "Import completed with errors",
        description: `Imported ${successCount} leads, ${errorCount} failed.`,
        variant: "destructive",
      });
    }
  };

  const getSourceName = (sourceId: string) => {
    const source = leadSources.find(s => s.id === sourceId);
    return source ? source.name : sourceId;
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Import Leads</h1>
          <p className="text-muted-foreground">Import multiple leads from a CSV file</p>
        </div>
        <Link to="/data">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Data Management
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
              <h4 className="font-medium">Required Columns:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>first_name</strong> (required) - Lead's first name</li>
                <li>• <strong>last_name</strong> (required) - Lead's last name</li>
                <li>• <strong>email</strong> (optional) - Email address</li>
                <li>• <strong>phone</strong> (optional) - Phone number</li>
                <li>• <strong>source_id</strong> (optional) - Lead source ID</li>
                <li>• <strong>status</strong> (required) - Lead status</li>
                <li>• <strong>budget</strong> (optional) - Budget amount</li>
                <li>• <strong>move_in_date</strong> (optional) - Preferred move-in date (YYYY-MM-DD)</li>
                <li>• <strong>duration_months</strong> (optional) - Duration in months</li>
                <li>• <strong>notes</strong> (optional) - Additional notes</li>
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
              Select a CSV file to import leads
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

            {parsedData.length > 0 && validationErrors.length === 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  File parsed successfully! {parsedData.length} leads ready for import.
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
      {parsedData.length > 0 && (
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
                {parsedData.slice(0, 10).map((lead, index) => (
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
                        <span className="font-medium">Source:</span> {lead.source_id ? getSourceName(lead.source_id) : 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Budget:</span> {lead.budget ? `£${lead.budget}` : 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Move-in Date:</span> {lead.move_in_date || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {lead.duration_months ? `${lead.duration_months} months` : 'N/A'}
                      </div>
                    </div>
                    {lead.notes && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Notes:</span> {lead.notes}
                      </div>
                    )}
                  </div>
                ))}
                {parsedData.length > 10 && (
                  <div className="text-center text-sm text-muted-foreground">
                    Showing first 10 of {parsedData.length} leads
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
      {parsedData.length > 0 && validationErrors.length === 0 && !isUploading && (
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={handleImport} 
              className="w-full" 
              size="lg"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import {parsedData.length} Leads
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkImportLeads;
