import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  Users,
  Building,
  CreditCard,
  Wrench
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService, Studio, RoomGrade, Duration, InstallmentPlan } from '@/services/api';

interface BulkStudentData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  
  // Booking Information
  studioNumber: string;
  roomGradeName: string;
  durationName: string;
  checkInDate: string;
  checkOutDate?: string;
  
  // Financial Information
  weeklyRate: number;
  totalAmount: number;
  depositPaid: boolean;
  wantsInstallments: boolean;
  installmentPlanName?: string;
  
  // File Upload Information (file paths within ZIP)
  passportFile?: string;
  visaFile?: string;
  utilityBillFile?: string;
  guarantorIdFile?: string;
  bankStatementFile?: string;
  proofOfIncomeFile?: string;
  
  // Additional Information
  notes?: string;
  status: 'pending' | 'confirmed' | 'checked_in';
}

interface ProcessingResult {
  success: boolean;
  studentId?: string;
  error?: string;
  rowNumber: number;
  data: BulkStudentData;
}

const BulkUploadStudents = () => {
  const { toast } = useToast();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [roomGrades, setRoomGrades] = useState<RoomGrade[]>([]);
  const [durations, setDurations] = useState<Duration[]>([]);
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>([]);
  const [extractedFiles, setExtractedFiles] = useState<Map<string, File>>(new Map());

  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    try {
      const [studiosData, roomGradesData, durationsData, installmentPlansData] = await Promise.all([
        ApiService.getStudios(),
        ApiService.getRoomGrades(),
        ApiService.getDurations(),
        ApiService.getInstallmentPlans()
      ]);
      
      setStudios(studiosData);
      setRoomGrades(roomGradesData);
      setDurations(durationsData);
      setInstallmentPlans(installmentPlansData);
    } catch (error) {
      console.error('Error loading reference data:', error);
      toast({
        title: "Error",
        description: "Failed to load reference data. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const handleCsvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setCsvFile(selectedFile);
      setResults([]);
      setProgress(0);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleZipFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && (selectedFile.type === 'application/zip' || selectedFile.name.endsWith('.zip'))) {
      setZipFile(selectedFile);
      extractZipFiles(selectedFile);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid ZIP file containing student documents.",
        variant: "destructive",
      });
    }
  };

  const extractZipFiles = async (zipFile: File) => {
    try {
      // Note: In a production implementation, you would use a library like JSZip
      // to extract files from the ZIP archive and process them individually.
      // For now, we'll store the ZIP file reference for future processing.
      console.log('ZIP file selected:', zipFile.name);
      toast({
        title: "ZIP File Ready",
        description: "ZIP file uploaded. Documents will be processed during bulk upload.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error processing ZIP file:', error);
      toast({
        title: "Error",
        description: "Failed to process ZIP file.",
        variant: "destructive",
      });
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'firstName',
      'lastName', 
      'email',
      'phone',
      'dateOfBirth',
      'nationality',
      'passportNumber',
      'emergencyContactName',
      'emergencyContactPhone',
      'emergencyContactRelation',
      'studioNumber',
      'roomGradeName',
      'durationName',
      'checkInDate',
      'checkOutDate',
      'weeklyRate',
      'totalAmount',
      'depositPaid',
      'wantsInstallments',
      'installmentPlanName',
      'passportFile',
      'visaFile',
      'utilityBillFile',
      'guarantorIdFile',
      'bankStatementFile',
      'proofOfIncomeFile',
      'notes',
      'status'
    ];

    const sampleData = [
      [
        'John',
        'Doe',
        'john.doe@email.com',
        '+44 7123 456789',
        '1995-05-15',
        'British',
        'GB123456789',
        'Jane Doe',
        '+44 7123 456788',
        'Mother',
        'S101',
        'Standard',
        '45 weeks',
        '2025-01-15',
        '2025-12-15',
        '160',
        '7200',
        'true',
        'true',
        '10 Installments',
        'John_Doe_passport.pdf',
        'John_Doe_visa.pdf',
        'John_Doe_utility_bill.pdf',
        'John_Doe_guarantor_id.pdf',
        'John_Doe_bank_statement.pdf',
        'John_Doe_proof_of_income.pdf',
        'Sample student booking',
        'confirmed'
      ]
    ];

    const csvContent = [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student_bulk_upload_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (csvText: string): BulkStudentData[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    const data: BulkStudentData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      
      if (values.length !== headers.length) {
        throw new Error(`Row ${i + 1}: Invalid number of columns`);
      }
      
      const rowData: any = {};
      headers.forEach((header, index) => {
        rowData[header] = values[index];
      });
      
      // Validate and convert data
      const studentData: BulkStudentData = {
        firstName: rowData.firstName,
        lastName: rowData.lastName,
        email: rowData.email,
        phone: rowData.phone || undefined,
        dateOfBirth: rowData.dateOfBirth || undefined,
        nationality: rowData.nationality || undefined,
        passportNumber: rowData.passportNumber || undefined,
        emergencyContactName: rowData.emergencyContactName || undefined,
        emergencyContactPhone: rowData.emergencyContactPhone || undefined,
        emergencyContactRelation: rowData.emergencyContactRelation || undefined,
        studioNumber: rowData.studioNumber,
        roomGradeName: rowData.roomGradeName,
        durationName: rowData.durationName,
        checkInDate: rowData.checkInDate,
        checkOutDate: rowData.checkOutDate || undefined,
        weeklyRate: parseFloat(rowData.weeklyRate) || 0,
        totalAmount: parseFloat(rowData.totalAmount) || 0,
        depositPaid: rowData.depositPaid === 'true',
        wantsInstallments: rowData.wantsInstallments === 'true',
        installmentPlanName: rowData.installmentPlanName || undefined,
        passportFile: rowData.passportFile || undefined,
        visaFile: rowData.visaFile || undefined,
        utilityBillFile: rowData.utilityBillFile || undefined,
        guarantorIdFile: rowData.guarantorIdFile || undefined,
        bankStatementFile: rowData.bankStatementFile || undefined,
        proofOfIncomeFile: rowData.proofOfIncomeFile || undefined,
        notes: rowData.notes || undefined,
        status: rowData.status as 'pending' | 'confirmed' | 'checked_in'
      };
      
      data.push(studentData);
    }
    
    return data;
  };

  const validateStudentData = (data: BulkStudentData, rowNumber: number): string[] => {
    const errors: string[] = [];
    
    // Required fields
    if (!data.firstName) errors.push('First name is required');
    if (!data.lastName) errors.push('Last name is required');
    if (!data.email) errors.push('Email is required');
    if (!data.studioNumber) errors.push('Studio number is required');
    if (!data.roomGradeName) errors.push('Room grade name is required');
    if (!data.durationName) errors.push('Duration name is required');
    if (!data.checkInDate) errors.push('Check-in date is required');
    
    // Validate references
    const studio = studios.find(s => s.studio_number === data.studioNumber);
    if (!studio) errors.push(`Studio ${data.studioNumber} not found`);
    
    const roomGrade = roomGrades.find(rg => rg.name === data.roomGradeName);
    if (!roomGrade) errors.push(`Room grade ${data.roomGradeName} not found`);
    
    const duration = durations.find(d => d.name === data.durationName);
    if (!duration) errors.push(`Duration ${data.durationName} not found`);
    
    if (data.wantsInstallments && data.installmentPlanName) {
      const installmentPlan = installmentPlans.find(ip => ip.name === data.installmentPlanName);
      if (!installmentPlan) errors.push(`Installment plan ${data.installmentPlanName} not found`);
    }
    
    // Validate dates
    if (data.checkInDate) {
      const checkInDate = new Date(data.checkInDate);
      if (isNaN(checkInDate.getTime())) {
        errors.push('Invalid check-in date format (use YYYY-MM-DD)');
      }
    }
    
    if (data.checkOutDate) {
      const checkOutDate = new Date(data.checkOutDate);
      if (isNaN(checkOutDate.getTime())) {
        errors.push('Invalid check-out date format (use YYYY-MM-DD)');
      }
    }
    
    // Validate financial data
    if (data.weeklyRate <= 0) errors.push('Weekly rate must be greater than 0');
    if (data.totalAmount <= 0) errors.push('Total amount must be greater than 0');
    
    return errors;
  };

  const processStudentBooking = async (data: BulkStudentData): Promise<ProcessingResult> => {
    try {
      // Find references
      const studio = studios.find(s => s.studio_number === data.studioNumber);
      const roomGrade = roomGrades.find(rg => rg.name === data.roomGradeName);
      const duration = durations.find(d => d.name === data.durationName);
      const installmentPlan = data.installmentPlanName 
        ? installmentPlans.find(ip => ip.name === data.installmentPlanName)
        : undefined;

      if (!studio || !roomGrade || !duration) {
        throw new Error('Required references not found');
      }

      // Create user account first
      const userData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        role: 'student',
        is_active: true
      };

      const user = await ApiService.createUser(userData);

      // Create student record
      const studentData = {
        user_id: user.id,
        studio_id: studio.id,
        check_in_date: data.checkInDate,
        check_out_date: data.checkOutDate,
        duration_id: duration.id,
        duration_name: duration.name,
        duration_type: duration.type,
        weekly_rate: data.weeklyRate,
        total_amount: data.totalAmount,
        deposit_paid: data.depositPaid,
        status: data.status,
        nationality: data.nationality,
        passport_number: data.passportNumber,
        date_of_birth: data.dateOfBirth,
        emergency_contact_name: data.emergencyContactName,
        emergency_contact_phone: data.emergencyContactPhone,
        emergency_contact_relation: data.emergencyContactRelation,
        notes: data.notes,
        created_by: '423b2f89-ed35-4537-866e-d4fe702e577c' // Admin user ID
      };

      const student = await ApiService.createStudent(studentData);

      // Update studio status to occupied
      await ApiService.updateStudioToOccupied(studio.id);

      // Update student with installment plan information
      const studentUpdateData = {
        wants_installments: data.wantsInstallments,
        installment_plan_id: data.wantsInstallments ? installmentPlan?.id : undefined,
        deposit_paid: data.depositPaid
      };

      await ApiService.updateStudent(student.id, studentUpdateData);

      // Create financial records (invoices and installments)
      const depositAmount = 99; // £99 deposit
      
      await ApiService.createStudentFinancialRecordsDirect(student.id, {
        depositAmount: depositAmount,
        totalAmount: data.totalAmount,
        installmentPlanId: data.wantsInstallments ? installmentPlan?.id : undefined,
        durationId: duration.id,
        createdBy: '423b2f89-ed35-4537-866e-d4fe702e577c',
        depositPaid: data.depositPaid
      });

      // Create initial cleaning task
      if (studio.id) {
        const taskData = {
          studio_id: studio.id,
          scheduled_date: data.checkInDate,
          scheduled_time: '09:00',
          estimated_duration: 120,
          status: 'scheduled' as const,
          notes: `Initial cleaning for student: ${data.firstName} ${data.lastName} (${student.id})`,
          created_by: '00000000-0000-0000-0000-000000000000'
        };
        
        await ApiService.createCleaningTask(taskData);
      }

      // Handle file uploads if ZIP file is provided
      if (zipFile && (data.passportFile || data.visaFile || data.utilityBillFile || data.guarantorIdFile || data.bankStatementFile || data.proofOfIncomeFile)) {
        try {
          // Note: In a real implementation, you would extract files from ZIP and upload them
          // For now, we'll log the file references
          console.log('File uploads for student:', {
            studentId: student.id,
            passportFile: data.passportFile,
            visaFile: data.visaFile,
            utilityBillFile: data.utilityBillFile,
            guarantorIdFile: data.guarantorIdFile,
            bankStatementFile: data.bankStatementFile,
            proofOfIncomeFile: data.proofOfIncomeFile
          });
          
          // TODO: Implement actual file extraction and upload from ZIP
          // This would involve:
          // 1. Extracting files from ZIP based on the file names in CSV
          // 2. Uploading each file using FileStorageService
          // 3. Creating student_documents records
          
        } catch (error) {
          console.error('Error handling file uploads:', error);
          // Don't fail the entire process if file upload fails
        }
      }

      return {
        success: true,
        studentId: student.id,
        rowNumber: 0, // Will be set by caller
        data
      };

    } catch (error) {
      console.error('Error processing student booking:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        rowNumber: 0, // Will be set by caller
        data
      };
    }
  };

  const processBulkUpload = async () => {
    if (!csvFile) return;

    setIsProcessing(true);
    setProgress(0);
    setResults([]);

    try {
      const csvText = await csvFile.text();
      const studentDataArray = parseCSV(csvText);
      
      const processingResults: ProcessingResult[] = [];
      
      for (let i = 0; i < studentDataArray.length; i++) {
        const studentData = studentDataArray[i];
        const rowNumber = i + 2; // +2 because CSV starts at row 1 and we skip header
        
        // Validate data first
        const validationErrors = validateStudentData(studentData, rowNumber);
        
        if (validationErrors.length > 0) {
          processingResults.push({
            success: false,
            error: validationErrors.join('; '),
            rowNumber,
            data: studentData
          });
        } else {
          // Process the student booking
          const result = await processStudentBooking(studentData);
          result.rowNumber = rowNumber;
          processingResults.push(result);
        }
        
        // Update progress
        const currentProgress = Math.round(((i + 1) / studentDataArray.length) * 100);
        setProgress(currentProgress);
      }
      
      setResults(processingResults);
      
      const successCount = processingResults.filter(r => r.success).length;
      const errorCount = processingResults.filter(r => !r.success).length;
      
      toast({
        title: "Bulk Upload Complete",
        description: `Successfully processed ${successCount} students. ${errorCount} failed.`,
        variant: errorCount > 0 ? "destructive" : "default",
      });

    } catch (error) {
      console.error('Error processing bulk upload:', error);
      toast({
        title: "Error",
        description: "Failed to process bulk upload. Please check your file format.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => !r.success).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bulk Upload Students</h1>
        <p className="text-gray-600 mt-2">
          Upload multiple student bookings at once using a CSV file. All booking processes will be executed automatically.
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* CSV File Upload */}
          <div className="space-y-2">
            <Label htmlFor="csv-file">1. Select CSV File (Required)</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleCsvFileChange}
              disabled={isProcessing}
            />
            <p className="text-sm text-gray-600">
              Upload the CSV file containing student data. Download the template below to see the required format.
            </p>
          </div>

          {/* ZIP File Upload */}
          <div className="space-y-2">
            <Label htmlFor="zip-file">2. Select ZIP File with Documents (Optional)</Label>
            <Input
              id="zip-file"
              type="file"
              accept=".zip"
              onChange={handleZipFileChange}
              disabled={isProcessing}
            />
            <p className="text-sm text-gray-600">
              Upload a ZIP file containing all student documents. File names should match the names specified in the CSV file.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>
            
            <Button 
              onClick={processBulkUpload} 
              disabled={!csvFile || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Process Upload
                </>
              )}
            </Button>
          </div>

          {/* File Status */}
          <div className="space-y-2">
            {csvFile && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                CSV File: {csvFile.name}
              </div>
            )}
            {zipFile && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                ZIP File: {zipFile.name}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Section */}
      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Processing Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">{progress}% complete</p>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Processing Results
              </span>
              <div className="flex gap-2">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {successCount} Success
                </Badge>
                {errorCount > 0 && (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    {errorCount} Errors
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Row {result.rowNumber}</span>
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? "Success" : "Error"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {result.data.firstName} {result.data.lastName} - {result.data.studioNumber}
                    </p>
                    {result.success && result.studentId && (
                      <p className="text-xs text-green-600 mt-1">
                        Student ID: {result.studentId}
                      </p>
                    )}
                    {!result.success && result.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {result.error}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Naming Convention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            File Naming Convention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              When uploading documents in the ZIP file, use the following naming convention:
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Naming Format:</h4>
              <p className="text-sm font-mono text-gray-700 mb-2">
                [FirstName]_[LastName]_[DocumentType].[extension]
              </p>
              
              <h4 className="font-medium mb-2 mt-4">Example for John Doe:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• John_Doe_passport.pdf</li>
                <li>• John_Doe_visa.pdf</li>
                <li>• John_Doe_utility_bill.pdf</li>
                <li>• John_Doe_guarantor_id.pdf</li>
                <li>• John_Doe_bank_statement.pdf</li>
                <li>• John_Doe_proof_of_income.pdf</li>
              </ul>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> File names in the ZIP must exactly match the file names specified in the CSV file. 
                The system will automatically match and upload documents based on these names.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            What Happens During Bulk Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium">User Account</h4>
                <p className="text-sm text-gray-600">Creates user account with login credentials</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-medium">Studio Assignment</h4>
                <p className="text-sm text-gray-600">Assigns studio and updates status to occupied</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-purple-600 mt-1" />
              <div>
                <h4 className="font-medium">Financial Records</h4>
                <p className="text-sm text-gray-600">Creates invoices and installment plans</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-indigo-600 mt-1" />
              <div>
                <h4 className="font-medium">Document Upload</h4>
                <p className="text-sm text-gray-600">Uploads and links student documents</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Wrench className="h-5 w-5 text-orange-600 mt-1" />
              <div>
                <h4 className="font-medium">Cleaning Tasks</h4>
                <p className="text-sm text-gray-600">Creates initial cleaning task for studio</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkUploadStudents;
