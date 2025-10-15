
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, PieChart, FileText, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReportsModule = () => {
  const reportCards = [
    {
      title: 'Analytics Dashboard',
      description: 'Comprehensive overview of system performance and key metrics',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/reports/analytics'
    },
    {
      title: 'Revenue Forecasting',
      description: 'Predict future revenue based on current bookings and trends',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/reports/forecasting'
    },
    {
      title: 'Occupancy Reports',
      description: 'Detailed analysis of studio occupancy and utilization',
      icon: PieChart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/reports/occupancy'
    },
    {
      title: 'Financial Reports',
      description: 'Revenue, expenses, and financial performance analysis',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      href: '/reports/financial'
    },
    {
      title: 'Performance Metrics',
      description: 'Key performance indicators and system efficiency metrics',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/reports/performance'
    },
    {
      title: 'Cleaning Reports',
      description: 'Cleaning schedules, tasks, and maintenance reports',
      icon: Calendar,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      href: '/studios/cleaning'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={
          <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Reports & Forecasting</h1>
                  <p className="text-gray-600 mt-1">Analytics, insights, and predictive reporting for your business</p>
                </div>
              </div>

              {/* Reports Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportCards.map((report, index) => {
                  const IconComponent = report.icon;
                  return (
                    <Link key={index} to={report.href}>
                      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${report.bgColor}`}>
                              <IconComponent className={`h-6 w-6 ${report.color}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{report.title}</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm text-gray-600">
                            {report.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {/* Coming Soon Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Coming Soon</CardTitle>
                  <CardDescription>
                    Additional reporting features are being developed to provide even more insights into your business performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Custom Dashboards</h4>
                      <p className="text-sm text-gray-600">Create personalized dashboards with your preferred metrics and visualizations.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Automated Reports</h4>
                      <p className="text-sm text-gray-600">Schedule and receive automated reports via email on a regular basis.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Data Export</h4>
                      <p className="text-sm text-gray-600">Export your data in various formats for external analysis and reporting.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Advanced Analytics</h4>
                      <p className="text-sm text-gray-600">Deep dive into your data with advanced statistical analysis and insights.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        } />
      </Routes>
    </div>
  );
};

export default ReportsModule;
