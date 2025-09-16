
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench } from 'lucide-react';


const MaintenanceCategoriesManagement = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Maintenance Categories Management</h1>
        <p className="text-muted-foreground">Manage maintenance request categories</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="mr-2 h-5 w-5" />
            Maintenance Categories
          </CardTitle>
          <CardDescription>Configure maintenance request categories</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Maintenance categories management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceCategoriesManagement;
