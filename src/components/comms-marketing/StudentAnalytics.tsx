import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Map, 
  Users, 
  TrendingUp, 
  Globe, 
  GraduationCap,
  Calendar,
  CreditCard,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AnalyticsData {
  ethnicity: { [key: string]: number };
  gender: { [key: string]: number };
  country: { [key: string]: number };
  town: { [key: string]: number };
  yearOfStudy: { [key: string]: number };
  duration: { [key: string]: number };
  installmentPlans: { [key: string]: number };
  countryRevenue: { [key: string]: number };
  totalStudents: number;
}

const StudentAnalytics = () => {
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [countryCoordinates, setCountryCoordinates] = useState<{ [country: string]: { lat: number; lng: number } }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const [analytics, coordinates] = await Promise.all([
        ApiService.getStudentAnalytics(),
        ApiService.getCountryCoordinates()
      ]);
      
      setAnalyticsData(analytics);
      setCountryCoordinates(coordinates);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalyticsData();
    setIsRefreshing(false);
    toast({
      title: "Success",
      description: "Analytics data refreshed successfully.",
    });
  };

  const createBarChartData = (data: { [key: string]: number }, title: string) => {
    const labels = Object.keys(data);
    const values = Object.values(data);
    
    return {
      labels,
      datasets: [
        {
          label: title,
          data: values,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const getMapMarkers = () => {
    if (!analyticsData) return [];

    return Object.entries(analyticsData.country)
      .filter(([country]) => country !== 'Not Specified')
      .map(([country, studentCount]) => {
        const revenue = analyticsData.countryRevenue[country] || 0;
        const coordinates = countryCoordinates[country];
        
        if (!coordinates || coordinates.lat === 0) return null;

        // Calculate marker size based on student count
        const radius = Math.max(8, Math.min(20, studentCount * 2));
        
        return (
          <CircleMarker
            key={country}
            center={[coordinates.lat, coordinates.lng]}
            radius={radius}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.6,
              weight: 2,
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg">{country}</h3>
                <p className="text-sm text-gray-600">
                  <strong>Students:</strong> {studentCount}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Revenue:</strong> £{revenue.toLocaleString()}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })
      .filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Loading analytics data...</p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No analytics data available.</p>
        <Button onClick={handleRefresh} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into student demographics and behavior</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Active student accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Globe className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(analyticsData.country).filter(c => c !== 'Not Specified').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Different countries represented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{Object.values(analyticsData.countryRevenue).reduce((a, b) => a + b, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From all student bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration Types</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(analyticsData.duration).filter(d => d !== 'Not Specified').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Different duration options
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="demographics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-6">
          <Accordion type="multiple" className="w-full">
            {/* Ethnicity */}
            <AccordionItem value="ethnicity">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Ethnicity Distribution
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-6">
                    <Bar 
                      data={createBarChartData(analyticsData.ethnicity, 'Students')} 
                      options={chartOptions} 
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Gender */}
            <AccordionItem value="gender">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gender Distribution
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-6">
                    <Bar 
                      data={createBarChartData(analyticsData.gender, 'Students')} 
                      options={chartOptions} 
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Country Map */}
            <AccordionItem value="country-map">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Geographic Distribution
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-6">
                    <div className="h-96 w-full">
                      <MapContainer
                        center={[20, 0]}
                        zoom={2}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {getMapMarkers()}
                      </MapContainer>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>• Circle size represents number of students</p>
                      <p>• Click markers to see detailed information</p>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Town Distribution */}
            <AccordionItem value="town">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Town Distribution
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-6">
                    <Bar 
                      data={createBarChartData(analyticsData.town, 'Students')} 
                      options={chartOptions} 
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* Academic Tab */}
        <TabsContent value="academic" className="space-y-6">
          <Accordion type="multiple" className="w-full">
            {/* Year of Study */}
            <AccordionItem value="year-of-study">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Year of Study Distribution
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-6">
                    <Bar 
                      data={createBarChartData(analyticsData.yearOfStudy, 'Students')} 
                      options={chartOptions} 
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Duration */}
            <AccordionItem value="duration">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Duration Preferences
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-6">
                    <Bar 
                      data={createBarChartData(analyticsData.duration, 'Students')} 
                      options={chartOptions} 
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <Accordion type="multiple" className="w-full">
            {/* Installment Plans */}
            <AccordionItem value="installments">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Preferences
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-6">
                    <Bar 
                      data={createBarChartData(analyticsData.installmentPlans, 'Students')} 
                      options={chartOptions} 
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Revenue by Country */}
            <AccordionItem value="revenue">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue by Country
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-6">
                    <Bar 
                      data={createBarChartData(analyticsData.countryRevenue, 'Revenue (£)')} 
                      options={{
                        ...chartOptions,
                        scales: {
                          ...chartOptions.scales,
                          y: {
                            ...chartOptions.scales.y,
                            ticks: {
                              callback: function(value) {
                                return '£' + value.toLocaleString();
                              }
                            }
                          }
                        }
                      }} 
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentAnalytics;
