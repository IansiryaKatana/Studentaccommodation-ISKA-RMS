import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Globe, Calendar, FileText } from 'lucide-react';

const WebAccessOverview = () => {
  const quickActions = [
    {
      title: 'Reservations',
      description: 'Manage web-based reservations',
      icon: Calendar,
      path: '/web-access/reservations',
      color: 'bg-blue-500'
    },
    {
      title: 'Grade Pages',
      description: 'Manage grade-specific web pages',
      icon: FileText,
      path: '/web-access/grade-pages',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Web Access Overview</h1>
          <p className="text-gray-600 mt-1">Manage web-based access and public pages</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Web Access</p>
                <p className="text-2xl font-bold">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reservations</p>
                <p className="text-2xl font-bold">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Grade Pages</p>
                <p className="text-2xl font-bold">Ready</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} to={action.path}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-3 rounded-full ${action.color} mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Web Access Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Web access features are being developed</p>
            <p className="text-sm mt-2">This module will handle public-facing web pages and online reservations</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebAccessOverview;
