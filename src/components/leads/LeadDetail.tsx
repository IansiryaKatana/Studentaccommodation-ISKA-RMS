
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Edit, Save, X, MessageSquare, Clock, UserCheck, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ApiService, Lead } from '@/services/api';

interface LeadFormData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  source_id: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiating' | 'won' | 'lost' | 'converted';
  budget: number;
  move_in_date: string;
  duration_months: number;
  notes: string;
  assigned_to: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface AuditEntry {
  id: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  timestamp: string;
}

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Live data from database
  const [leadData, setLeadData] = useState<LeadFormData | null>(null);
  const [leadSources, setLeadSources] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);

  useEffect(() => {
    if (id) {
      fetchLeadData();
      fetchFormData();
    }
  }, [id]);

  const fetchLeadData = async () => {
    try {
      setIsLoading(true);
      const lead = await ApiService.getLeadById(id!);
      if (lead) {
        setLeadData({
          first_name: lead.first_name,
          last_name: lead.last_name,
          phone: lead.phone || '',
          email: lead.email || '',
          source_id: lead.source_id || '',
          status: lead.status,
          budget: lead.budget || 0,
          move_in_date: lead.move_in_date || '',
          duration_months: lead.duration_months || 0,
          notes: lead.notes || '',
          assigned_to: lead.assigned_to || ''
        });
      }
    } catch (error) {
      console.error('Error fetching lead:', error);
      toast({
        title: "Error",
        description: "Failed to load lead details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFormData = async () => {
    try {
      const [sourcesData, usersData] = await Promise.all([
        ApiService.getLeadSources(),
        ApiService.getUsers()
      ]);
      setLeadSources(sourcesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const form = useForm<LeadFormData>({
    defaultValues: leadData || {}
  });

  // Update form when leadData changes
  useEffect(() => {
    if (leadData) {
      form.reset(leadData);
    }
  }, [leadData, form]);

  const onSubmit = async (data: LeadFormData) => {
    if (!id) return;
    
    try {
      setIsSaving(true);
      
      // Map form data to Lead interface
      const updateData: Partial<Lead> = {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone || undefined,
        email: data.email || undefined,
        source_id: data.source_id || undefined,
        status: data.status,
        budget: data.budget || undefined,
        move_in_date: data.move_in_date || undefined,
        duration_months: data.duration_months || undefined,
        notes: data.notes || undefined,
        assigned_to: data.assigned_to || undefined
      };
      
      await ApiService.updateLead(id, updateData);
      
      toast({
        title: "Lead Updated",
        description: "Lead information has been successfully updated.",
      });
      
      setIsEditing(false);
      fetchLeadData(); // Refresh data
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: "Error",
        description: "Failed to update lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !id) return;

    try {
      // Add comment logic here - you'll need to create a comments table
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Current User', // Get from auth context
        content: newComment,
        timestamp: new Date().toISOString()
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      
      toast({
        title: "Comment Added",
        description: "Comment has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConvertToReservation = () => {
    if (!id) return;
    
    // Navigate to reservation creation with lead data
    navigate(`/ota-bookings/tourists/new?leadId=${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading lead details...</span>
      </div>
    );
  }

  if (!leadData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Lead not found</h2>
          <Button onClick={() => navigate('/leads')} className="mt-4">
            Back to Leads
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/leads')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{`${leadData.first_name} ${leadData.last_name}`}</h1>
            <p className="text-gray-600">Lead ID: {id}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-red-600 border-red-200">
            {/* Assuming source_id maps to a source name */}
            {leadSources.find(source => source.id === leadData.source_id)?.name || 'N/A'}
          </Badge>
          <Badge variant="default">
            {leadData.status}
          </Badge>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          <Button onClick={handleConvertToReservation} className="bg-green-600 hover:bg-green-700">
            <UserCheck className="h-4 w-4 mr-2" />
            Convert to Reservation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Lead Information
                {isEditing && (
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="source_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!isEditing}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {leadSources.map(source => (
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
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!isEditing}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="qualified">Qualified</SelectItem>
                              <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                              <SelectItem value="negotiating">Negotiating</SelectItem>
                              <SelectItem value="won">Won</SelectItem>
                              <SelectItem value="lost">Lost</SelectItem>
                              <SelectItem value="converted">Converted</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              disabled={!isEditing}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="move_in_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Move-in Date</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="date" 
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="duration_months"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (Months)</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            value={field.value.toString()}
                            disabled={!isEditing}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 Month</SelectItem>
                              <SelectItem value="2">2 Months</SelectItem>
                              <SelectItem value="3">3 Months</SelectItem>
                              <SelectItem value="4">4 Months</SelectItem>
                              <SelectItem value="5">5 Months</SelectItem>
                              <SelectItem value="6">6 Months</SelectItem>
                              <SelectItem value="7">7 Months</SelectItem>
                              <SelectItem value="8">8 Months</SelectItem>
                              <SelectItem value="9">9 Months</SelectItem>
                              <SelectItem value="10">10 Months</SelectItem>
                              <SelectItem value="11">11 Months</SelectItem>
                              <SelectItem value="12">12 Months</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="assigned_to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assigned To</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!isEditing}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select user" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {users.map(user => (
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
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea {...field} disabled={!isEditing} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-l-2 border-blue-200 pl-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{comment.author}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              ))}
              
              <div className="mt-4 space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                />
                <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim() || isSaving}>
                  Add Comment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audit Trail */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {auditTrail.map((entry) => (
                <div key={entry.id} className="text-sm">
                  <div className="font-medium text-gray-900">
                    {entry.field} changed
                  </div>
                  <div className="text-gray-600">
                    From "{entry.oldValue}" to "{entry.newValue}"
                  </div>
                  <div className="text-xs text-gray-500">
                    by {entry.changedBy} on {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
