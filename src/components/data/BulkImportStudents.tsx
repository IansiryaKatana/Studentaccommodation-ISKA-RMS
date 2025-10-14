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
import { ApiService, Student } from '@/services/api';
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
  RefreshCw,
  GraduationCap
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';

interface StudentImportData {
  // User fields
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  
  // Student fields
  birthday?: string;
  ethnicity?: string;
  gender?: string;
  ucas_id?: string;
  country?: string;
  address_line1?: string;
  post_code?: string;
  town?: string;
  academic_year?: string;
  year_of_study?: string;
  field_of_study?: string;
  guarantor_name?: string;
  guarantor_email?: string;
  guarantor_phone?: string;
  guarantor_relationship?: string;
  wants_installments?: boolean;
  installment_plan_id?: string;
  deposit_paid?: boolean;
  studio_id?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const BulkImportStudents = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<StudentImportData[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [installmentPlans, setInstallmentPlans] = useState<Array<{ id: string; name: string }>>([]);
  const [studios, setStudios] = useState<Array<{ id: string; studio_number: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReferenceData();
  }, []);

  const fetchReferenceData = async () => {
    try {
      const [plans, studioData] = await Promise.all([
        ApiService.getInstallmentPlans(),
        ApiService.getStudios()
      ]);
      setInstallmentPlans(plans);
      setStudios(studioData);
    } catch (error) {
      console.error('Error fetching reference data:', error);
    }
  };

  const generateTemplate = () => {
    const template: StudentImportData[] = [
      {
        email: 'john.doe@student.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+44 20 1234 5678',
        birthday: '2000-05-15',
        ethnicity: 'White British',
        gender: 'Male',
        ucas_id: 'UCAS123456',
        country: 'United Kingdom',
        address_line1: '123 Main Street',
        post_code: 'SW1A 1AA',
        town: 'London',
        academic_year: '2024/2025',
        year_of_study: '1st',
        field_of_study: 'Computer Science',
        guarantor_name: 'Jane Doe',
        guarantor_email: 'jane.doe@email.com',
        guarantor_phone: '+44 20 8765 4321',
        guarantor_relationship: 'Parent',
        wants_installments: true,
        installment_plan_id: '1',
        deposit_paid: false,
        studio_id: '1'
      },
      {
        email: 'jane.smith@student.com',
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '+44 20 8765 4321',
        birthday: '2001-08-22',
        ethnicity: 'Asian British',
        gender: 'Female',
        ucas_id: 'UCAS789012',
        country: 'United Kingdom',
        address_line1: '456 High Street',
        post_code: 'M1 1AA',
        town: 'Manchester',
        academic_year: '2024/2025',
        year_of_study: '2nd',
        field_of_study: 'Business Management',
        guarantor_name: 'John Smith',
        guarantor_email: 'john.smith@email.com',
        guarantor_phone: '+44 20 1234 5678',
        guarantor_relationship: 'Parent',
        wants_installments: false,
        deposit_paid: true,
        studio_id: '2'
      }
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'students_import_template.csv');
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
        const data = results.data as StudentImportData[];
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

  const validateData = (data: StudentImportData[]) => {
    const errors: ValidationError[] = [];
    
    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because of 0-based index and header row
      
      // Required fields
      if (!row.email?.trim()) {
        errors.push({ row: rowNumber, field: 'email', message: 'Email is required' });
      }
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
      
      // Date validation
      if (row.birthday && !/^\d{4}-\d{2}-\d{2}$/.test(row.birthday)) {
        errors.push({ row: rowNumber, field: 'birthday', message: 'Birthday must be in YYYY-MM-DD format' });
      }
      
      // Gender validation
      if (row.gender && !['Male', 'Female', 'Other', 'Prefer not to say'].includes(row.gender)) {
        errors.push({ row: rowNumber, field: 'gender', message: 'Invalid gender value' });
      }
      
      // Year of study validation
      if (row.year_of_study && !['1st', '2nd', '3rd', '4+'].includes(row.year_of_study)) {
        errors.push({ row: rowNumber, field: 'year_of_study', message: 'Invalid year of study' });
      }
      
      // Academic year validation
      if (row.academic_year && !/^\d{4}\/\d{4}$/.test(row.academic_year)) {
        errors.push({ row: rowNumber, field: 'academic_year', message: 'Academic year must be in YYYY/YYYY format' });
      }
      
      // Boolean validation
      if (row.wants_installments !== undefined && !['true', 'false', '1', '0', ''].includes(row.wants_installments.toString().toLowerCase())) {
        errors.push({ row: rowNumber, field: 'wants_installments', message: 'wants_installments must be true/false' });
      }
      if (row.deposit_paid !== undefined && !['true', 'false', '1', '0', ''].includes(row.deposit_paid.toString().toLowerCase())) {
        errors.push({ row: rowNumber, field: 'deposit_paid', message: 'deposit_paid must be true/false' });
      }
      
      // Reference validation
      if (row.installment_plan_id && !installmentPlans.find(p => p.id === row.installment_plan_id)) {
        errors.push({ row: rowNumber, field: 'installment_plan_id', message: 'Invalid installment plan ID' });
      }
      if (row.studio_id && !studios.find(s => s.id === row.studio_id)) {
        errors.push({ row: rowNumber, field: 'studio_id', message: 'Invalid studio ID' });
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
        const studentData = parsedData[i];
        
        // First create user
        const userData = {
          email: studentData.email.trim(),
          first_name: studentData.first_name.trim(),
          last_name: studentData.last_name.trim(),
          phone: studentData.phone?.trim() || undefined,
          role: 'student' as const,
          is_active: true
        };

        const user = await ApiService.createUser(userData);
        
        // Then create student record
        const createStudentData = {
          user_id: user.id,
          birthday: studentData.birthday || undefined,
          ethnicity: studentData.ethnicity?.trim() || undefined,
          gender: studentData.gender || undefined,
          ucas_id: studentData.ucas_id?.trim() || undefined,
          country: studentData.country?.trim() || undefined,
          address_line1: studentData.address_line1?.trim() || undefined,
          post_code: studentData.post_code?.trim() || undefined,
          town: studentData.town?.trim() || undefined,
          academic_year: studentData.academic_year || undefined,
          year_of_study: studentData.year_of_study || undefined,
          field_of_study: studentData.field_of_study?.trim() || undefined,
          guarantor_name: studentData.guarantor_name?.trim() || undefined,
          guarantor_email: studentData.guarantor_email?.trim() || undefined,
          guarantor_phone: studentData.guarantor_phone?.trim() || undefined,
          guarantor_relationship: studentData.guarantor_relationship?.trim() || undefined,
          wants_installments: typeof studentData.wants_installments === 'boolean' ? studentData.wants_installments : 
            studentData.wants_installments === 'true' || studentData.wants_installments === '1',
          installment_plan_id: studentData.installment_plan_id || undefined,
          deposit_paid: typeof studentData.deposit_paid === 'boolean' ? studentData.deposit_paid : 
            studentData.deposit_paid === 'true' || studentData.deposit_paid === '1',
          studio_id: studentData.studio_id || undefined
        };

        await ApiService.createStudent(createStudentData);
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
        description: `Successfully imported ${successCount} students.`,
      });
      // Reset form
      setFile(null);
      setParsedData([]);
      setValidationErrors([]);
    } else {
      toast({
        title: "Import completed with errors",
        description: `Imported ${successCount} students, ${errorCount} failed.`,
        variant: "destructive",
      });
    }
  };

  const getInstallmentPlanName = (planId: string) => {
    const plan = installmentPlans.find(p => p.id === planId);
    return plan ? plan.name : planId;
  };

  const getStudioName = (studioId: string) => {
    const studio = studios.find(s => s.id === studioId);
    return studio ? studio.studio_number : studioId;
  };

  const getGenderBadge = (gender: string) => {
    const genderColors = {
      'Male': 'bg-blue-100 text-blue-800',
      'Female': 'bg-pink-100 text-pink-800',
      'Other': 'bg-purple-100 text-purple-800',
      'Prefer not to say': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={genderColors[gender as keyof typeof genderColors] || 'bg-gray-100 text-gray-800'}>
        {gender}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-80 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template Download Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <div className="space-y-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-3 w-full" />
                  ))}
                </div>
              </div>
              <Skeleton className="h-10 w-40" />
            </CardContent>
          </Card>

          {/* File Upload Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Skeleton className="h-8 w-8 mx-auto mb-2" />
                <Skeleton className="h-4 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
              <Skeleton className="h-10 w-32" />
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
          <h1 className="text-3xl font-bold tracking-tight">Bulk Import Students</h1>
          <p className="text-muted-foreground">Import multiple students from a CSV file</p>
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
                <li>• <strong>email</strong> (required) - Student's email address</li>
                <li>• <strong>first_name</strong> (required) - Student's first name</li>
                <li>• <strong>last_name</strong> (required) - Student's last name</li>
                <li>• <strong>phone</strong> (optional) - Phone number</li>
                <li>• <strong>birthday</strong> (optional) - Date of birth (YYYY-MM-DD)</li>
                <li>• <strong>ethnicity</strong> (optional) - Ethnicity</li>
                <li>• <strong>gender</strong> (optional) - Gender (Male/Female/Other/Prefer not to say)</li>
                <li>• <strong>ucas_id</strong> (optional) - UCAS ID</li>
                <li>• <strong>country</strong> (optional) - Country</li>
                <li>• <strong>address_line1</strong> (optional) - Address line 1</li>
                <li>• <strong>post_code</strong> (optional) - Postal code</li>
                <li>• <strong>town</strong> (optional) - Town/City</li>
                <li>• <strong>academic_year</strong> (optional) - Academic year (YYYY/YYYY)</li>
                <li>• <strong>year_of_study</strong> (optional) - Year of study (1st/2nd/3rd/4+)</li>
                <li>• <strong>field_of_study</strong> (optional) - Field of study</li>
                <li>• <strong>guarantor_name</strong> (optional) - Guarantor name</li>
                <li>• <strong>guarantor_email</strong> (optional) - Guarantor email</li>
                <li>• <strong>guarantor_phone</strong> (optional) - Guarantor phone</li>
                <li>• <strong>guarantor_relationship</strong> (optional) - Relationship to guarantor</li>
                <li>• <strong>wants_installments</strong> (optional) - Wants installments (true/false)</li>
                <li>• <strong>installment_plan_id</strong> (optional) - Installment plan ID</li>
                <li>• <strong>deposit_paid</strong> (optional) - Deposit paid (true/false)</li>
                <li>• <strong>studio_id</strong> (optional) - Studio ID</li>
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
              Select a CSV file to import students
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
                  File parsed successfully! {parsedData.length} students ready for import.
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
                {parsedData.slice(0, 10).map((student, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">
                        {student.first_name} {student.last_name}
                      </h4>
                      {student.gender && getGenderBadge(student.gender)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Email:</span> {student.email}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {student.phone || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">UCAS ID:</span> {student.ucas_id || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Country:</span> {student.country || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Academic Year:</span> {student.academic_year || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Year of Study:</span> {student.year_of_study || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Field of Study:</span> {student.field_of_study || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Studio:</span> {student.studio_id ? getStudioName(student.studio_id) : 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Installments:</span> {student.wants_installments ? 'Yes' : 'No'}
                      </div>
                      <div>
                        <span className="font-medium">Deposit Paid:</span> {student.deposit_paid ? 'Yes' : 'No'}
                      </div>
                    </div>
                    {student.guarantor_name && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Guarantor:</span> {student.guarantor_name} ({student.guarantor_relationship})
                      </div>
                    )}
                  </div>
                ))}
                {parsedData.length > 10 && (
                  <div className="text-center text-sm text-muted-foreground">
                    Showing first 10 of {parsedData.length} students
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
              Importing Students...
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
              Import {parsedData.length} Students
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkImportStudents;
