
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  FileText, 
  Database, 
  Calendar, 
  Users, 
  Home,
  DollarSign,
  CheckCircle,
  Clock,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';


const DataExport = () => {
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportFormats = [
    { value: 'csv', label: 'CSV', description: 'Comma-separated values' },
    { value: 'excel', label: 'Excel', description: 'Microsoft Excel format' },
    { value: 'json', label: 'JSON', description: 'JavaScript Object Notation' },
    { value: 'pdf', label: 'PDF', description: 'Portable Document Format' }
  ];

  const availableTables = [
    { name: 'students', label: 'Students Data', count: 456, icon: Users },
    { name: 'leads', label: 'Leads Data', count: 89, icon: Users },
    { name: 'reservations', label: 'Reservations', count: 234, icon: Calendar },
    { name: 'rooms', label: 'Rooms Data', count: 156, icon: Home },
    { name: 'payments', label: 'Payment Records', count: 789, icon: DollarSign },
    { name: 'invoices', label: 'Invoice Data', count: 345, icon: FileText }
  ];

  const exportHistory = [
    { 
      name: 'Student Data Export', 
      date: '2024-01-15 14:30', 
      format: 'CSV', 
      size: '2.3 MB', 
      status: 'completed' 
    },
    { 
      name: 'Financial Report', 
      date: '2024-01-14 09:15', 
      format: 'Excel', 
      size: '5.1 MB', 
      status: 'completed' 
    },
    { 
      name: 'Full Database Backup', 
      date: '2024-01-13 23:00', 
      format: 'JSON', 
      size: '45.2 MB', 
      status: 'failed' 
    },
    { 
      name: 'Monthly Summary', 
      date: '2024-01-12 16:45', 
      format: 'PDF', 
      size: '1.8 MB', 
      status: 'completed' 
    }
  ];

  const handleTableToggle = (tableName: string) => {
    setSelectedTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  };

  const handleSelectAll = () => {
    if (selectedTables.length === availableTables.length) {
      setSelectedTables([]);
    } else {
      setSelectedTables(availableTables.map(t => t.name));
    }
  };

  const handleExport = () => {
    if (!selectedFormat || selectedTables.length === 0) return;
    
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: { variant: 'default' as const, icon: CheckCircle },
      failed: { variant: 'destructive' as const, icon: AlertCircle },
      processing: { variant: 'secondary' as const, icon: Clock }
    };
    
    const config = variants[status as keyof typeof variants] || variants.processing;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <config.icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Export</h1>
          <p className="text-muted-foreground">Export your data in various formats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Configuration</CardTitle>
              <CardDescription>Select the data and format for your export</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Export Format */}
              <div className="space-y-3">
                <h4 className="font-medium">Export Format</h4>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose export format" />
                  </SelectTrigger>
                  <SelectContent>
                    {exportFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div>
                          <div className="font-medium">{format.label}</div>
                          <div className="text-sm text-muted-foreground">{format.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Table Selection */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Select Tables</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedTables.length === availableTables.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableTables.map((table) => (
                    <div key={table.name} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={table.name}
                        checked={selectedTables.includes(table.name)}
                        onCheckedChange={() => handleTableToggle(table.name)}
                      />
                      <table.icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <label htmlFor={table.name} className="font-medium cursor-pointer">
                          {table.label}
                        </label>
                        <p className="text-sm text-muted-foreground">{table.count} records</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Progress */}
              {isExporting && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Exporting data...</span>
                    <span className="text-sm text-muted-foreground">{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="w-full" />
                </div>
              )}

              {/* Export Button */}
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleExport}
                  disabled={!selectedFormat || selectedTables.length === 0 || isExporting}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? `Exporting... ${exportProgress}%` : 'Start Export'}
                </Button>
                <Button variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Full Backup
                </Button>
              </div>

              {exportProgress === 100 && !isExporting && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Export completed successfully! Your file will be downloaded shortly.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Export History & Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Exports</CardTitle>
              <CardDescription>Your export history and downloads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exportHistory.map((export_, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{export_.name}</h4>
                      {getStatusBadge(export_.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{export_.date}</p>
                      <p>{export_.format} • {export_.size}</p>
                    </div>
                    {export_.status === 'completed' && (
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="mr-2 h-3 w-3" />
                        Download Again
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Exports</CardTitle>
              <CardDescription>Pre-configured export templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Student Records (CSV)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Financial Data (Excel)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Reservations (PDF)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="mr-2 h-4 w-4" />
                  Full Database (JSON)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataExport;
