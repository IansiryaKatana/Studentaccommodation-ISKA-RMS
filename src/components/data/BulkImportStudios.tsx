import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Download, Upload, FileText, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

interface StudioImportData {
  studio_number: string;
  room_grade_name: string;
  floor?: number;
  status?: 'vacant' | 'occupied' | 'dirty' | 'cleaning' | 'maintenance';
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const BulkImportStudios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedData, setParsedData] = useState<StudioImportData[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [roomGrades, setRoomGrades] = useState<any[]>([]);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  }>({ success: 0, failed: 0, errors: [] });

  React.useEffect(() => {
    fetchRoomGrades();
  }, []);

  const fetchRoomGrades = async () => {
    try {
      const grades = await ApiService.getRoomGrades();
      setRoomGrades(grades);
    } catch (error) {
      console.error('Error fetching room grades:', error);
      toast({
        title: "Error",
        description: "Failed to fetch room grades. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        studio_number: 'S101',
        room_grade_name: 'Silver',
        floor: '1',
        status: 'vacant'
      },
      {
        studio_number: 'S102',
        room_grade_name: 'Gold',
        floor: '1',
        status: 'vacant'
      }
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'studios_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validateStudioData = (data: StudioImportData, index: number): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    if (!data.studio_number || data.studio_number.trim() === '') {
      errors.push('Studio number is required');
    } else if (!/^[A-Z]\d{3}$/.test(data.studio_number.trim())) {
      errors.push('Studio number must be in format: Letter + 3 digits (e.g., S101)');
    }

    if (!data.room_grade_name || data.room_grade_name.trim() === '') {
      errors.push('Room grade name is required');
    } else {
      const gradeExists = roomGrades.some(grade => 
        grade.name.toLowerCase() === data.room_grade_name.toLowerCase()
      );
      if (!gradeExists) {
        errors.push(`Room grade "${data.room_grade_name}" does not exist`);
      }
    }

    // Optional field validation
    if (data.floor !== undefined && (isNaN(Number(data.floor)) || Number(data.floor) < 0)) {
      warnings.push('Floor should be a positive number');
    }

    if (data.status && !['vacant', 'occupied', 'dirty', 'cleaning', 'maintenance'].includes(data.status)) {
      warnings.push('Status should be one of: vacant, occupied, dirty, cleaning, maintenance');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as StudioImportData[];
        setParsedData(data);

        // Validate all data
        const validations = data.map((row, index) => validateStudioData(row, index));
        setValidationResults(validations);

        const totalErrors = validations.reduce((sum, v) => sum + v.errors.length, 0);
        const totalWarnings = validations.reduce((sum, v) => sum + v.warnings.length, 0);

        if (totalErrors > 0) {
          toast({
            title: "Validation Errors",
            description: `${totalErrors} error(s) found. Please fix them before importing.`,
            variant: "destructive",
          });
        } else if (totalWarnings > 0) {
          toast({
            title: "Validation Warnings",
            description: `${totalWarnings} warning(s) found. You can proceed with import.`,
            variant: "default",
          });
        } else {
          toast({
            title: "Validation Successful",
            description: "All data is valid and ready for import.",
            variant: "default",
          });
        }
      },
      error: (error) => {
        toast({
          title: "File Parse Error",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const importStudios = async () => {
    if (parsedData.length === 0) return;

    setIsLoading(true);
    setUploadProgress(0);
    setImportResults({ success: 0, failed: 0, errors: [] });

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < parsedData.length; i++) {
      const data = parsedData[i];
      const progress = ((i + 1) / parsedData.length) * 100;
      setUploadProgress(progress);

      try {
        // Find room grade ID
        const roomGrade = roomGrades.find(grade => 
          grade.name.toLowerCase() === data.room_grade_name.toLowerCase()
        );

        if (!roomGrade) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: Room grade "${data.room_grade_name}" not found`);
          continue;
        }

        // Create studio data
        const studioData = {
          studio_number: data.studio_number.trim(),
          room_grade_id: roomGrade.id,
          floor: data.floor ? Number(data.floor) : undefined,
          status: data.status || 'vacant',
          is_active: true
        };

        await ApiService.createStudio(studioData);
        results.success++;

        // Small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error: any) {
        results.failed++;
        const errorMessage = error.message || 'Unknown error';
        results.errors.push(`Row ${i + 1}: ${errorMessage}`);
      }
    }

    setImportResults(results);
    setIsLoading(false);

    if (results.success > 0) {
      toast({
        title: "Import Completed",
        description: `Successfully imported ${results.success} studios. ${results.failed} failed.`,
        variant: results.failed > 0 ? "default" : "default",
      });
    } else {
      toast({
        title: "Import Failed",
        description: "No studios were imported. Please check the errors and try again.",
        variant: "destructive",
      });
    }
  };

  const canImport = parsedData.length > 0 && validationResults.every(v => v.isValid) && !isLoading;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
        </div>

        {/* Template Download Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-2" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>

        {/* File Upload Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-2" />
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
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Import Studios</h1>
          <p className="text-muted-foreground">Import multiple studios from a CSV file</p>
        </div>
      </div>

      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Download Template
          </CardTitle>
          <CardDescription>
            Download the CSV template to see the required format for importing studios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={downloadTemplate} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Download Template CSV
          </Button>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload CSV File
          </CardTitle>
          <CardDescription>
            Select a CSV file containing studio data to import
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-file">CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="mt-1"
              />
            </div>
            {parsedData.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Found {parsedData.length} records</span>
                  <div className="flex space-x-2">
                    <Badge variant={validationResults.every(v => v.isValid) ? "default" : "destructive"}>
                      {validationResults.filter(v => v.isValid).length} Valid
                    </Badge>
                    <Badge variant="secondary">
                      {validationResults.filter(v => !v.isValid).length} Invalid
                    </Badge>
                  </div>
                </div>
                {isLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Importing studios...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Table */}
      {parsedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>
              Review the data before importing. Invalid rows are highlighted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Row</TableHead>
                    <TableHead>Studio Number</TableHead>
                    <TableHead>Room Grade</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Validation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.map((row, index) => {
                    const validation = validationResults[index];
                    return (
                      <TableRow 
                        key={index}
                        className={!validation.isValid ? 'bg-red-50' : ''}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.studio_number}</TableCell>
                        <TableCell>{row.room_grade_name}</TableCell>
                        <TableCell>{row.floor || '-'}</TableCell>
                        <TableCell>{row.status || 'vacant'}</TableCell>
                        <TableCell>
                          {validation.isValid ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">Valid</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">{validation.errors.length} errors</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Results */}
      {importResults.success > 0 || importResults.failed > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  {importResults.success} Successfully Imported
                </Badge>
                <Badge variant="destructive">
                  {importResults.failed} Failed
                </Badge>
              </div>
              {importResults.errors.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Import Errors:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {importResults.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => {
            setParsedData([]);
            setValidationResults([]);
            setImportResults({ success: 0, failed: 0, errors: [] });
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
        >
          Clear Data
        </Button>
        <Button
          onClick={importStudios}
          disabled={!canImport}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            'Import Studios'
          )}
        </Button>
      </div>
    </div>
  );
};

export default BulkImportStudios; 