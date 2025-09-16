
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';

interface AddLeadFormData {
  name: string;
  phone: string;
  email: string;
  source: string;
  roomGrade: string;
  duration: string;
  revenue: number;
  responseCategory: string;
  followUpStage: string;
  assignedTo: string;
  notes: string;
}

const AddLead = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [leadSources, setLeadSources] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [roomGrades, setRoomGrades] = useState<any[]>([]);
  const [durations, setDurations] = useState<any[]>([]);
  const [leadOptionFields, setLeadOptionFields] = useState<any[]>([]);

  const form = useForm<AddLeadFormData>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      source: '',
      roomGrade: '',
      duration: '',
      revenue: 0,
      responseCategory: 'warm',
      followUpStage: 'initial-contact',
      assignedTo: '',
      notes: ''
    }
  });

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const [sourcesData, usersData, roomGradesData, durationsData, optionFieldsData] = await Promise.all([
        ApiService.getLeadSources(),
        ApiService.getUsers(),
        ApiService.getRoomGrades(),
        ApiService.getDurations('student'),
        ApiService.getLeadOptionFields()
      ]);
      setLeadSources(sourcesData);
      setUsers(usersData);
      setRoomGrades(roomGradesData);
      setDurations(durationsData);
      setLeadOptionFields(optionFieldsData);
    } catch (error) {
      console.error('Error fetching form data:', error);
      toast({
        title: "Error",
        description: "Failed to load form data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper functions to get options from database
  const getRoomGradeOptions = () => {
    return roomGrades.map(grade => ({
      value: grade.id,
      label: grade.name
    }));
  };

  const getDurationOptions = () => {
    return durations.map(duration => ({
      value: duration.id,
      label: duration.name
    }));
  };

  const getResponseCategoryOptions = () => {
    const field = leadOptionFields.find(f => f.field_name === 'response_category');
    return field?.options?.map((option: string) => ({
      value: option.toLowerCase(),
      label: option
    })) || [];
  };

  const getFollowUpStageOptions = () => {
    const field = leadOptionFields.find(f => f.field_name === 'follow_up_stage');
    return field?.options?.map((option: string) => ({
      value: option.toLowerCase().replace(/\s+/g, '-'),
      label: option
    })) || [];
  };

  const onSubmit = async (data: AddLeadFormData) => {
    try {
      setIsLoading(true);
      
      // Split the name into first and last name
      const nameParts = data.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const leadData = {
        first_name: firstName,
        last_name: lastName,
        email: data.email,
        phone: data.phone,
        source_id: data.source,
        assigned_to: data.assignedTo,
        budget: data.revenue,
        move_in_date: null, // Will be set later
        duration_months: null, // Will be set later
        notes: data.notes,
        status: 'new' as const,
        created_by: data.assignedTo // Use assigned user as creator for now
      };

      await ApiService.createLead(leadData);
      
      toast({
        title: "Lead Created",
        description: "New lead has been successfully created.",
      });
      navigate('/leads');
    } catch (error) {
      console.error('Error creating lead:', error);
      toast({
        title: "Error",
        description: "Failed to create lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Lead</h1>
        <p className="text-gray-600">Create a new lead record</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Full name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  rules={{ 
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Enter email address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter phone number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="source"
                  rules={{ required: "Source is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {leadSources.map((source) => (
                            <SelectItem key={source.id} value={source.id}>
                              {source.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="roomGrade"
                  rules={{ required: "Room grade is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Room Grade *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select room grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getRoomGradeOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  rules={{ required: "Duration is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Duration *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getDurationOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="revenue"
                  rules={{ 
                    required: "Expected revenue is required",
                    min: { value: 1, message: "Revenue must be greater than 0" }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Revenue (£) *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          placeholder="Enter expected revenue"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="assignedTo"
                  rules={{ required: "Assignment is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign To *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.first_name} {user.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="responseCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue="warm">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getResponseCategoryOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="followUpStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Follow-up Stage</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue="initial-contact">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getFollowUpStageOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Enter any additional notes about this lead..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center space-x-2 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Creating...' : 'Create Lead'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/leads')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddLead;
