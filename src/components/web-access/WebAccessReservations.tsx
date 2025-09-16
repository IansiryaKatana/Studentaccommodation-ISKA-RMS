import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WebAccessReservations = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Web Reservations</h1>
          <p className="text-gray-600 mt-1">Manage online reservation system</p>
        </div>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Online Reservation System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Web-based reservation system is under development</p>
            <p className="text-sm mt-2">This will allow customers to make reservations online</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebAccessReservations;
