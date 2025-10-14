
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  ArrowLeft,
  Edit,
  Loader2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


const PricingMatrixManagement = () => {
  const { toast } = useToast();
  const [pricingMatrix, setPricingMatrix] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPricingMatrix();
  }, []);

  const fetchPricingMatrix = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getPricingMatrix();
      setPricingMatrix(data);
    } catch (error) {
      console.error('Error fetching pricing matrix:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pricing matrix. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pricing Matrix Management</h1>
          <p className="text-muted-foreground">Configure pricing for room and duration combinations</p>
        </div>
      </div>

      {/* Pricing Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Matrix</CardTitle>
          <CardDescription>Set weekly rates for different room grades and durations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {/* Table Header Skeleton */}
              <div className="grid grid-cols-4 gap-4 p-3 border-b">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              
              {/* Table Rows Skeleton */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 p-3 border-b">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Room Grade</th>
                    <th className="text-left p-3">Duration</th>
                    <th className="text-left p-3">Weekly Rate</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingMatrix.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <Badge variant="outline">{item.room_grade_id}</Badge>
                      </td>
                      <td className="p-3">{item.duration_id}</td>
                      <td className="p-3">
                        <span className="font-medium">£{item.weekly_rate || 'N/A'}</span>
                      </td>
                      <td className="p-3">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingMatrixManagement;
