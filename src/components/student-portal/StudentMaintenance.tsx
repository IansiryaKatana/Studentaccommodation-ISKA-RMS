
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, Wrench, Calendar, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';

interface StudentMaintenanceProps {
  studentId: string;
}

const StudentMaintenance = ({ studentId }: StudentMaintenanceProps) => {
  const { toast } = useToast();
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: ''
  });

  useEffect(() => {
    fetchMaintenanceRequests();
  }, [studentId]);

  const fetchMaintenanceRequests = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getStudentMaintenanceRequests(studentId);
      setMaintenanceRequests(data);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch maintenance requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitRequest = async () => {
    // Validate form
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a request title.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a description.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.priority) {
      toast({
        title: "Validation Error",
        description: "Please select a priority.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert priority string to integer
      const priorityMap: { [key: string]: number } = {
        'low': 1,
        'medium': 2,
        'high': 3,
        'urgent': 3 // Treat urgent as high priority
      };

      const requestData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: priorityMap[formData.priority] || 1,
        student_id: studentId
      };

      await ApiService.createMaintenanceRequest(requestData);

      toast({
        title: "Success",
        description: "Maintenance request submitted successfully!",
      });

      // Reset form and close
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: ''
      });
      setShowNewRequest(false);

      // Refresh the requests list
      await fetchMaintenanceRequests();

    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      toast({
        title: "Error",
        description: "Failed to submit maintenance request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number | string) => {
    // Handle both integer and string priorities for backward compatibility
    const priorityValue = typeof priority === 'number' ? priority : 
      priority === 'High' ? 3 : priority === 'Medium' ? 2 : priority === 'Low' ? 1 : 1;
    
    switch (priorityValue) {
      case 3: return 'bg-red-100 text-red-800'; // High
      case 2: return 'bg-yellow-100 text-yellow-800'; // Medium
      case 1: return 'bg-green-100 text-green-800'; // Low
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: number | string) => {
    // Handle both integer and string priorities for backward compatibility
    const priorityValue = typeof priority === 'number' ? priority : 
      priority === 'High' ? 3 : priority === 'Medium' ? 2 : priority === 'Low' ? 1 : 1;
    
    switch (priorityValue) {
      case 3: return 'High';
      case 2: return 'Medium';
      case 1: return 'Low';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'In Progress': return <Clock className="h-4 w-4" />;
      case 'Pending': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Loading maintenance requests...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-600">Submit and track maintenance requests for your studio</p>
        </div>
        <Button onClick={() => setShowNewRequest(!showNewRequest)}>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* New Maintenance Request Form */}
      {showNewRequest && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Submit New Maintenance Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Request Title *</label>
                <Input 
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="appliances">Appliances</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <Textarea 
                  placeholder="Please provide detailed information about the maintenance issue..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  onClick={handleSubmitRequest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowNewRequest(false);
                    setFormData({
                      title: '',
                      description: '',
                      category: '',
                      priority: ''
                    });
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Maintenance Requests List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="h-5 w-5 mr-2" />
            Your Maintenance Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maintenanceRequests.length === 0 ? (
              <div className="text-center py-8">
                <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance requests</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't submitted any maintenance requests yet.
                </p>
              </div>
            ) : (
              maintenanceRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(request.status)}
                      <h3 className="font-medium">{request.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Submitted: {new Date(request.created_at).toLocaleDateString()}
                      </span>
                      {request.completed_at && (
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed: {new Date(request.completed_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    <Badge className={getPriorityColor(request.priority)} variant="outline">
                      {getPriorityText(request.priority)} Priority
                    </Badge>
                    <span className="text-sm text-gray-500">{request.category}</span>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentMaintenance;
