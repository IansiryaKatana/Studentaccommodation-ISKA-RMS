
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiService, CleanerWithUser } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Download,
  Users,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CleanerManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cleaners, setCleaners] = useState<CleanerWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCleaners();
  }, []);

  const fetchCleaners = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getCleaners();
      setCleaners(data);
    } catch (error) {
      console.error('Error fetching cleaners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cleaners. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'secondary' as const, color: 'bg-green-100 text-green-800' },
      break: { variant: 'secondary' as const, color: 'bg-orange-100 text-orange-800' },
      inactive: { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' }
    };

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle>Cleaner Management</CardTitle>
            <CardDescription>
              Manage cleaner profiles and daily assignments
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Cleaner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Loading cleaners...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cleaners.map((cleaner) => (
                <Card key={cleaner.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{cleaner.user.first_name} {cleaner.user.last_name}</h3>
                      <Badge className={getStatusBadge(cleaner.is_active ? 'active' : 'inactive').color}>
                        {cleaner.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Hourly Rate:</span> £{cleaner.hourly_rate}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {cleaner.user.phone || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {cleaner.user.email}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Status: {cleaner.is_active ? 'Available' : 'Unavailable'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CleanerManagement;
