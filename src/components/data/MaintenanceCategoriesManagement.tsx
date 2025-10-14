
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


const MaintenanceCategoriesManagement = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        {/* Header Skeleton */}
        <div>
          <Skeleton className="h-8 w-80 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-2" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

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
