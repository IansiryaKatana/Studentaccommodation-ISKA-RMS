
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CleanerDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock cleaner data - in real app, fetch based on id
  const [cleanerData, setCleanerData] = useState({
    id: 1,
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '+55 11 99999-0001',
    address: 'Rua das Flores, 123, São Paulo, SP',
    shift: 'Morning (6:00-14:00)',
    hourlyRate: '25.00',
    startDate: '2023-01-15',
    emergencyContact: 'João Silva',
    emergencyPhone: '+55 11 99999-0002',
    status: 'active',
    notes: 'Experienced cleaner with attention to detail. Specializes in deep cleaning.',
    totalTasksCompleted: 1250,
    averageRating: 4.8,
    totalHoursWorked: 2080
  });

  // Mock task history
  const taskHistory = [
    {
      id: 1,
      date: '2024-01-15',
      room: 'A101',
      startTime: '08:00',
      endTime: '09:30',
      status: 'completed',
      rating: 5,
      notes: 'Excellent work, very thorough'
    },
    {
      id: 2,
      date: '2024-01-15',
      room: 'A102',
      startTime: '10:00',
      endTime: '11:15',
      status: 'completed',
      rating: 4,
      notes: 'Good job, minor issues with bathroom'
    },
    {
      id: 3,
      date: '2024-01-14',
      room: 'B205',
      startTime: '08:30',
      endTime: '10:00',
      status: 'completed',
      rating: 5,
      notes: 'Perfect cleaning, student very satisfied'
    }
  ];

  // Mock performance metrics
  const performanceMetrics = [
    { label: 'Tasks Completed', value: cleanerData.totalTasksCompleted, icon: CheckCircle },
    { label: 'Average Rating', value: `${cleanerData.averageRating}/5`, icon: CheckCircle },
    { label: 'Hours Worked', value: cleanerData.totalHoursWorked, icon: Clock },
    { label: 'Complaints', value: '2', icon: AlertTriangle }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Cleaner Updated",
        description: "Cleaner information has been updated successfully.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cleaner information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCleanerData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      'on-leave': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/cleaning')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cleaning
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">{cleanerData.name}</h1>
              <Badge className={`ml-3 ${getStatusBadge(cleanerData.status)}`}>
                {cleanerData.status}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Cleaner
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cleaner Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Cleaner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={cleanerData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={cleanerData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={cleanerData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={cleanerData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="text-sm">{cleanerData.email}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-sm">{cleanerData.phone}</span>
                    </div>
                    
                    <div className="flex items-start text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 mt-1" />
                      <span className="text-sm">{cleanerData.address}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">Started: {cleanerData.startDate}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{cleanerData.shift}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <metric.icon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                      <div className="text-sm text-gray-500">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="tasks" className="space-y-4">
              <TabsList>
                <TabsTrigger value="tasks">Recent Tasks</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="notes">Notes & Comments</TabsTrigger>
              </TabsList>

              {/* Recent Tasks */}
              <TabsContent value="tasks">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Tasks</CardTitle>
                    <CardDescription>
                      Latest cleaning tasks and performance ratings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {taskHistory.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">{task.date}</div>
                            <div>
                              <div className="font-medium">Room {task.room}</div>
                              <div className="text-sm text-gray-600">
                                {task.startTime} - {task.endTime}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${i < task.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Schedule */}
              <TabsContent value="schedule">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Schedule</CardTitle>
                    <CardDescription>
                      Current work schedule and assignments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      Schedule management feature coming soon
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notes */}
              <TabsContent value="notes">
                <Card>
                  <CardHeader>
                    <CardTitle>Notes & Comments</CardTitle>
                    <CardDescription>
                      Additional information and feedback
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        value={cleanerData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows={6}
                        placeholder="Add notes about this cleaner..."
                      />
                    ) : (
                      <div className="text-gray-700">
                        {cleanerData.notes || 'No notes available.'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CleanerDetail;
