import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  Users, 
  Eye, 
  MousePointer,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';

interface EmailAnalytics {
  daily_data: any[];
  totals: {
    sent_count: number;
    delivered_count: number;
    opened_count: number;
    clicked_count: number;
    bounced_count: number;
    payment_conversions: number;
  };
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  conversion_rate: number;
}

interface EmailCampaign {
  id: string;
  name: string;
  status: string;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  bounced_count: number;
  email_templates?: {
    name: string;
    category: string;
  };
}

const EmailAnalytics = () => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<EmailAnalytics | null>(null);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [dateRange, setDateRange] = useState('30'); // days
  const [refreshing, setRefreshing] = useState(false);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchData();
  }, [selectedCampaign, dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [campaignsData, analyticsData] = await Promise.all([
        ApiService.getEmailCampaigns(),
        ApiService.getEmailAnalytics(
          selectedCampaign === 'all' ? undefined : selectedCampaign,
          getDateRange()
        )
      ]);
      
      setCampaigns(campaignsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(dateRange));
    
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast({
      title: "Success",
      description: "Analytics data refreshed"
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const getPerformanceColor = (rate: number, type: 'delivery' | 'open' | 'click' | 'conversion') => {
    const thresholds = {
      delivery: { good: 95, warning: 90 },
      open: { good: 25, warning: 15 },
      click: { good: 5, warning: 2 },
      conversion: { good: 10, warning: 5 }
    };
    
    const threshold = thresholds[type];
    if (rate >= threshold.good) return 'text-green-600';
    if (rate >= threshold.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (rate: number, type: 'delivery' | 'open' | 'click' | 'conversion') => {
    const thresholds = {
      delivery: { good: 95, warning: 90 },
      open: { good: 25, warning: 15 },
      click: { good: 5, warning: 2 },
      conversion: { good: 10, warning: 5 }
    };
    
    const threshold = thresholds[type];
    if (rate >= threshold.good) return <TrendingUp className="h-4 w-4" />;
    if (rate >= threshold.warning) return <TrendingUp className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const prepareChartData = () => {
    if (!analytics?.daily_data) return [];
    
    return analytics.daily_data.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
      sent: day.sent_count || 0,
      delivered: day.delivered_count || 0,
      opened: day.opened_count || 0,
      clicked: day.clicked_count || 0,
      conversions: day.payment_conversions || 0
    }));
  };

  const preparePieData = () => {
    if (!analytics?.totals) return [];
    
    return [
      { name: 'Delivered', value: analytics.totals.delivered_count, color: '#00C49F' },
      { name: 'Opened', value: analytics.totals.opened_count, color: '#0088FE' },
      { name: 'Clicked', value: analytics.totals.clicked_count, color: '#FFBB28' },
      { name: 'Converted', value: analytics.totals.payment_conversions, color: '#FF8042' },
      { name: 'Bounced', value: analytics.totals.bounced_count, color: '#FF6B6B' }
    ].filter(item => item.value > 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Analytics</h1>
          <p className="text-gray-600">Track email campaign performance and engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Campaign</label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="All campaigns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All campaigns</SelectItem>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
              <Mail className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analytics.totals.sent_count)}</div>
              <p className="text-xs text-muted-foreground">
                Emails sent in selected period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
              <div className={`flex items-center gap-1 ${getPerformanceColor(analytics.delivery_rate, 'delivery')}`}>
                {getPerformanceIcon(analytics.delivery_rate, 'delivery')}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getPerformanceColor(analytics.delivery_rate, 'delivery')}`}>
                {formatPercentage(analytics.delivery_rate)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(analytics.totals.delivered_count)} delivered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
              <div className={`flex items-center gap-1 ${getPerformanceColor(analytics.open_rate, 'open')}`}>
                {getPerformanceIcon(analytics.open_rate, 'open')}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getPerformanceColor(analytics.open_rate, 'open')}`}>
                {formatPercentage(analytics.open_rate)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(analytics.totals.opened_count)} opened
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <div className={`flex items-center gap-1 ${getPerformanceColor(analytics.conversion_rate, 'conversion')}`}>
                {getPerformanceIcon(analytics.conversion_rate, 'conversion')}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getPerformanceColor(analytics.conversion_rate, 'conversion')}`}>
                {formatPercentage(analytics.conversion_rate)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(analytics.totals.payment_conversions)} payments
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sent" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="delivered" stroke="#00C49F" strokeWidth={2} />
                <Line type="monotone" dataKey="opened" stroke="#0088FE" strokeWidth={2} />
                <Line type="monotone" dataKey="clicked" stroke="#FFBB28" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={preparePieData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {preparePieData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Delivered</TableHead>
                  <TableHead>Opened</TableHead>
                  <TableHead>Clicked</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Delivery Rate</TableHead>
                  <TableHead>Open Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => {
                  const deliveryRate = campaign.sent_count > 0 ? (campaign.delivered_count / campaign.sent_count) * 100 : 0;
                  const openRate = campaign.delivered_count > 0 ? (campaign.opened_count / campaign.delivered_count) * 100 : 0;
                  
                  return (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.email_templates?.name || 'Unknown'}</div>
                          <Badge variant="outline" className="text-xs">
                            {campaign.email_templates?.category || 'Unknown'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={campaign.status === 'sent' ? 'default' : 'secondary'}
                          className="flex items-center gap-1 w-fit"
                        >
                          {campaign.status === 'sent' ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatNumber(campaign.total_recipients)}</TableCell>
                      <TableCell>{formatNumber(campaign.sent_count)}</TableCell>
                      <TableCell>{formatNumber(campaign.delivered_count)}</TableCell>
                      <TableCell>{formatNumber(campaign.opened_count)}</TableCell>
                      <TableCell>{formatNumber(campaign.clicked_count)}</TableCell>
                      <TableCell>{formatNumber(campaign.clicked_count)}</TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${getPerformanceColor(deliveryRate, 'delivery')}`}>
                          {getPerformanceIcon(deliveryRate, 'delivery')}
                          <span className="text-sm">{formatPercentage(deliveryRate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${getPerformanceColor(openRate, 'open')}`}>
                          {getPerformanceIcon(openRate, 'open')}
                          <span className="text-sm">{formatPercentage(openRate)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                What's Working Well
              </h4>
              <ul className="space-y-2 text-sm">
                {analytics && analytics.delivery_rate >= 95 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Excellent delivery rate of {formatPercentage(analytics.delivery_rate)}</span>
                  </li>
                )}
                {analytics && analytics.open_rate >= 25 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Strong open rate of {formatPercentage(analytics.open_rate)}</span>
                  </li>
                )}
                {analytics && analytics.conversion_rate >= 10 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>High conversion rate of {formatPercentage(analytics.conversion_rate)}</span>
                  </li>
                )}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-orange-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Areas for Improvement
              </h4>
              <ul className="space-y-2 text-sm">
                {analytics && analytics.delivery_rate < 95 && (
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Delivery rate could be improved (currently {formatPercentage(analytics.delivery_rate)})</span>
                  </li>
                )}
                {analytics && analytics.open_rate < 25 && (
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Consider improving subject lines (open rate: {formatPercentage(analytics.open_rate)})</span>
                  </li>
                )}
                {analytics && analytics.conversion_rate < 10 && (
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Optimize call-to-action buttons (conversion rate: {formatPercentage(analytics.conversion_rate)})</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailAnalytics;
