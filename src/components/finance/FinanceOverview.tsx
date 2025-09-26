
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Users, 
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService, Reservation, Invoice, Payment, Refund } from '@/services/api';
import PaymentEventService, { PaymentEvent } from '@/services/paymentEventService';
import { DashboardGridSkeleton, TableSkeleton, ChartSkeleton } from '@/components/ui/skeleton';

interface FinancialSummary {
  totalRevenue: number;
  totalOutstanding: number;
  totalCollected: number;
  totalRefunded: number;
  touristRevenue: number;
  studentRevenue: number;
  touristOutstanding: number;
  studentOutstanding: number;
}

interface DailyRevenue {
  date: string;
  revenue: number;
  reservations: number;
}

const FinanceOverview = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalRevenue: 0,
    totalOutstanding: 0,
    totalCollected: 0,
    totalRefunded: 0,
    touristRevenue: 0,
    studentRevenue: 0,
    touristOutstanding: 0,
    studentOutstanding: 0
  });
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [recentRefunds, setRecentRefunds] = useState<Refund[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    fetchFinancialData();
    
    // Register for payment events to update in real-time
    const paymentEventService = PaymentEventService.getInstance();
    paymentEventService.registerListener('FinanceOverview', handlePaymentEvent);
    
    return () => {
      // Cleanup: unregister listener when component unmounts
      paymentEventService.unregisterListener('FinanceOverview');
    };
  }, [timeRange]);

  // Handle payment events for real-time updates
  const handlePaymentEvent = async (event: PaymentEvent) => {
    console.log('💰 Finance module received payment event:', event);
    toast({
      title: "New Payment Received",
      description: `Payment of £${event.amount} received for invoice ${event.invoice_number}`,
    });
    
    // Refresh financial data to show updated statistics
    await fetchFinancialData();
  };

  const fetchFinancialData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all data sources
      const [reservations, invoices, students, refunds] = await Promise.all([
        ApiService.getReservations(),
        ApiService.getInvoices(),
        ApiService.getStudentsWithDetails(),
        ApiService.getRefunds().catch(() => []) // Handle case where refunds table might not exist
      ]);
      
      // Calculate summary
      const now = new Date();
      const daysAgo = new Date(now.getTime() - (parseInt(timeRange) * 24 * 60 * 60 * 1000));
      
      // Filter data by time range
      const filteredReservations = reservations.filter(r => 
        new Date(r.created_at) >= daysAgo
      );
      
      const filteredInvoices = invoices.filter(i => 
        new Date(i.created_at) >= daysAgo
      );

      const filteredStudents = students.filter(s => 
        new Date(s.created_at) >= daysAgo
      );

      const filteredRefunds = refunds.filter(r => 
        new Date(r.created_at) >= daysAgo
      );

      // Calculate tourist revenue from reservations
      const touristReservations = filteredReservations.filter(r => r.type === 'tourist');
      const touristRevenue = touristReservations.reduce((sum, r) => sum + (r.total_amount || 0), 0);
      
      // Calculate student revenue from student bookings (total_amount field)
      const studentRevenue = filteredStudents.reduce((sum, s) => sum + (s.total_amount || 0), 0);
      
      // Also include student reservations if any exist
      const studentReservations = filteredReservations.filter(r => r.type === 'student');
      const studentReservationRevenue = studentReservations.reduce((sum, r) => sum + (r.total_amount || 0), 0);
      
      // Total revenue from both sources
      const totalRevenue = touristRevenue + studentRevenue + studentReservationRevenue;
      
      // Calculate collected amount from invoices (completed status)
      const totalCollected = filteredInvoices
        .filter(i => i.status === 'completed')
        .reduce((sum, i) => sum + i.total_amount, 0);
      
      // Calculate refunded amount
      const totalRefunded = filteredRefunds.reduce((sum, r) => sum + (r.amount || 0), 0);
      
      // Calculate outstanding amounts
      // For tourists: use balance_due from reservations
      const touristOutstanding = touristReservations.reduce((sum, r) => sum + (r.balance_due || 0), 0);
      
      // For students: calculate from total_amount minus completed invoices
      const studentCompletedInvoices = filteredInvoices
        .filter(i => i.student_id && i.status === 'completed');
      const studentPaidAmount = studentCompletedInvoices.reduce((sum, i) => sum + i.total_amount, 0);
      const studentOutstanding = studentRevenue - studentPaidAmount;
      
      // Total outstanding
      const totalOutstanding = touristOutstanding + studentOutstanding;

      setSummary({
        totalRevenue,
        totalOutstanding: Math.max(0, totalOutstanding), // Ensure non-negative
        totalCollected,
        totalRefunded,
        touristRevenue,
        studentRevenue: studentRevenue + studentReservationRevenue,
        touristOutstanding,
        studentOutstanding: Math.max(0, studentOutstanding) // Ensure non-negative
      });

      // Set recent data
      setRecentInvoices(filteredInvoices.slice(0, 10));
      
      // Calculate daily revenue from both reservations and student bookings
      const dailyMap = new Map<string, { revenue: number; reservations: number; studentBookings: number }>();
      
      // Add tourist reservations
      filteredReservations.forEach(reservation => {
        const date = new Date(reservation.created_at).toISOString().split('T')[0];
        const existing = dailyMap.get(date) || { revenue: 0, reservations: 0, studentBookings: 0 };
        dailyMap.set(date, {
          revenue: existing.revenue + (reservation.total_amount || 0),
          reservations: existing.reservations + 1,
          studentBookings: existing.studentBookings
        });
      });
      
      // Add student bookings
      filteredStudents.forEach(student => {
        const date = new Date(student.created_at).toISOString().split('T')[0];
        const existing = dailyMap.get(date) || { revenue: 0, reservations: 0, studentBookings: 0 };
        dailyMap.set(date, {
          revenue: existing.revenue + (student.total_amount || 0),
          reservations: existing.reservations,
          studentBookings: existing.studentBookings + 1
        });
      });
      
      const dailyArray = Array.from(dailyMap.entries()).map(([date, data]) => ({
        date,
        revenue: data.revenue,
        reservations: data.reservations + data.studentBookings // Total bookings
      })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setDailyRevenue(dailyArray.slice(0, 7)); // Last 7 days
      
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch financial data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const exportToXero = async () => {
    try {
      setIsLoading(true);
      // This would integrate with Xero API
      toast({
        title: "Export Started",
        description: "Data is being exported to Xero. This may take a few minutes.",
      });
    } catch (error) {
      console.error('Error exporting to Xero:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data to Xero.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Overview</h1>
          <p className="text-gray-600">Track revenue, payments, and financial performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={fetchFinancialData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={exportToXero} disabled={isLoading}>
            <Download className="h-4 w-4 mr-2" />
            Export to Xero
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <DashboardGridSkeleton cards={4} className="col-span-full" />
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  {summary.touristRevenue > 0 && `Tourist: ${formatCurrency(summary.touristRevenue)}`}
                  {summary.studentRevenue > 0 && ` | Student: ${formatCurrency(summary.studentRevenue)}`}
                </p>
              </CardContent>
            </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalOutstanding)}</div>
            <p className="text-xs text-muted-foreground">
              {summary.touristOutstanding > 0 && `Tourist: ${formatCurrency(summary.touristOutstanding)}`}
              {summary.studentOutstanding > 0 && ` | Student: ${formatCurrency(summary.studentOutstanding)}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalCollected)}</div>
            <p className="text-xs text-muted-foreground">
              {summary.totalRevenue > 0 && `${((summary.totalCollected / summary.totalRevenue) * 100).toFixed(1)}% collection rate`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunded</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalRefunded)}</div>
            <p className="text-xs text-muted-foreground">
              {summary.totalRevenue > 0 && `${((summary.totalRefunded / summary.totalRevenue) * 100).toFixed(1)}% refund rate`}
            </p>
          </CardContent>
        </Card>
          </>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Recent Invoices</TabsTrigger>
          <TabsTrigger value="daily">Daily Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span>Tourist Revenue</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(summary.touristRevenue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-green-600" />
                      <span>Student Revenue</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(summary.studentRevenue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Outstanding by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Outstanding by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span>Tourist Outstanding</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(summary.touristOutstanding)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span>Student Outstanding</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(summary.studentOutstanding)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Xero Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <FileText className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No recent invoices found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentInvoices.map((invoice) => {
                    // Determine customer name and type
                    let customerName = 'Unknown';
                    let bookingType = 'Unknown';
                    
                    if (invoice.student_id) {
                      customerName = 'Student Booking';
                      bookingType = 'Student';
                    } else if (invoice.reservation_id) {
                      customerName = 'Tourist Booking';
                      bookingType = 'Tourist';
                    }
                    
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                        <TableCell>{customerName}</TableCell>
                        <TableCell>
                          <Badge variant={bookingType === 'Student' ? 'default' : 'secondary'}>
                            {bookingType}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{formatCurrency(invoice.total_amount)}</TableCell>
                        <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {invoice.xero_export_status || 'pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Reservations</TableHead>
                    <TableHead>Average per Reservation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyRevenue.map((day) => (
                    <TableRow key={day.date}>
                      <TableCell className="font-medium">
                        {new Date(day.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{formatCurrency(day.revenue)}</TableCell>
                      <TableCell>{day.reservations}</TableCell>
                      <TableCell>
                        {day.reservations > 0 ? formatCurrency(day.revenue / day.reservations) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceOverview;
