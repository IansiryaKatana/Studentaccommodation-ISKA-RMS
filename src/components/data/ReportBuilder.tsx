
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  Play, 
  Save, 
  Download, 
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Home,
  DollarSign,
  ArrowLeft
} from 'lucide-react';


const ReportBuilder = () => {
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportType, setReportType] = useState('');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: 'financial', label: 'Financial Report', icon: DollarSign },
    { value: 'occupancy', label: 'Occupancy Report', icon: Home },
    { value: 'student', label: 'Student Report', icon: Users },
    { value: 'performance', label: 'Performance Report', icon: TrendingUp }
  ];

  const availableFields = {
    financial: ['Revenue', 'Expenses', 'Profit Margin', 'Payment Status', 'Outstanding Invoices'],
    occupancy: ['Room Status', 'Occupancy Rate', 'Available Rooms', 'Maintenance Rooms', 'Check-in/Check-out'],
    student: ['Student Details', 'Academic Info', 'Payment History', 'Document Status', 'Emergency Contacts'],
    performance: ['System Metrics', 'User Activity', 'Data Quality', 'Response Times', 'Error Rates']
  };

  const savedReports = [
    { name: 'Monthly Revenue Report', type: 'Financial', lastRun: '2024-01-15', status: 'Completed' },
    { name: 'Occupancy Analysis', type: 'Occupancy', lastRun: '2024-01-14', status: 'Completed' },
    { name: 'Student Demographics', type: 'Student', lastRun: '2024-01-13', status: 'Scheduled' },
    { name: 'System Performance', type: 'Performance', lastRun: '2024-01-12', status: 'Failed' }
  ];

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      // Here you would typically handle the report generation
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Completed': 'default',
      'Scheduled': 'secondary',
      'Failed': 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report Builder</h1>
          <p className="text-muted-foreground">Create custom reports and analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Builder Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>New Report</CardTitle>
              <CardDescription>Configure your custom report parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reportName">Report Name</Label>
                  <Input
                    id="reportName"
                    placeholder="Enter report name..."
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reportDescription">Description</Label>
                  <Textarea
                    id="reportDescription"
                    placeholder="Describe what this report will show..."
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center">
                            <type.icon className="mr-2 h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-4">
                <Label>Date Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">From Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">To Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateTo && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Field Selection */}
              {reportType && (
                <div className="space-y-4">
                  <Label>Select Fields to Include</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {availableFields[reportType as keyof typeof availableFields]?.map((field) => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox
                          id={field}
                          checked={selectedFields.includes(field)}
                          onCheckedChange={() => handleFieldToggle(field)}
                        />
                        <Label htmlFor={field} className="text-sm">{field}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={handleGenerateReport}
                  disabled={isGenerating || !reportName || !reportType}
                  className="flex-1"
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isGenerating ? 'Generating...' : 'Generate Report'}
                </Button>
                <Button variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Reports */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
              <CardDescription>Your previously created reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedReports.map((report, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{report.name}</h4>
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Type: {report.type}</p>
                      <p>Last run: {report.lastRun}</p>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline">
                        <Play className="mr-1 h-3 w-3" />
                        Run
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="mr-1 h-3 w-3" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Monthly Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <PieChart className="mr-2 h-4 w-4" />
                  Revenue Breakdown
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Student Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Export All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;
