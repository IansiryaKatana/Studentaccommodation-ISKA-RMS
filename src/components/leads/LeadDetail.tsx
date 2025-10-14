
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
import { ApiService, Lead, LeadComment } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface LeadFormData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  source_id: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiating' | 'won' | 'lost' | 'converted';
  estimated_revenue?: number;
  notes?: string;
  assigned_to?: string;
  room_grade_preference_id?: string;
  duration_type_preference_id?: string;
  // Related data
  lead_source?: { name: string };
  assigned_user?: { first_name: string; last_name: string };
  room_grade_preference?: { name: string };
  duration_type_preference?: { name: string };
}

// Remove the old Comment interface since we're using LeadComment from API

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
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Live data from database
  const [leadData, setLeadData] = useState<LeadFormData | null>(null);
  const [leadSources, setLeadSources] = useState<any[]>([]);
  const [leadRoomGrades, setLeadRoomGrades] = useState<any[]>([]);
  const [leadDurationTypes, setLeadDurationTypes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [comments, setComments] = useState<LeadComment[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);

  useEffect(() => {
    if (id) {
      fetchLeadData();
      fetchFormData();
    }
  }, [id]);

  const fetchLeadData = async () => {
    if (!id || id === 'website') {
      navigate('/leads');
      return;
    }
    
    try {
      setIsLoading(true);
      const [lead, leadComments] = await Promise.all([
        ApiService.getLeadById(id),
        ApiService.getLeadComments(id)
      ]);
      
      if (lead) {
        setLeadData({
          first_name: lead.first_name || '',
          last_name: lead.last_name || '',
          phone: lead.phone || '',
          email: lead.email || '',
          source_id: lead.source_id || 'none',
          status: lead.status || 'new',
          estimated_revenue: lead.estimated_revenue || lead.budget || 0,
          notes: lead.notes || '',
          assigned_to: lead.assigned_to || 'none',
          room_grade_preference_id: lead.room_grade_preference_id || 'none',
          duration_type_preference_id: lead.duration_type_preference_id || 'none',
          // Related data
          lead_source: lead.lead_source,
          assigned_user: lead.assigned_user,
          room_grade_preference: lead.room_grade_preference,
          duration_type_preference: lead.duration_type_preference
        });
      }
      
      setComments(leadComments);
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
      const [sourcesData, roomGradesData, durationTypesData, usersData] = await Promise.all([
        ApiService.getLeadSources(),
        ApiService.getLeadRoomGrades(),
        ApiService.getLeadDurationTypes(),
        ApiService.getUsers()
      ]);
      setLeadSources(sourcesData);
      setLeadRoomGrades(roomGradesData);
      setLeadDurationTypes(durationTypesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const form = useForm<LeadFormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      source_id: 'none',
      status: 'new',
      estimated_revenue: 0,
      notes: '',
      assigned_to: 'none',
      room_grade_preference_id: 'none',
      duration_type_preference_id: 'none'
    }
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
        source_id: data.source_id === 'none' ? undefined : data.source_id,
        status: data.status,
        estimated_revenue: data.estimated_revenue || undefined,
        notes: data.notes || undefined,
        assigned_to: data.assigned_to === 'none' ? undefined : data.assigned_to,
        room_grade_preference_id: data.room_grade_preference_id === 'none' ? undefined : data.room_grade_preference_id,
        duration_type_preference_id: data.duration_type_preference_id === 'none' ? undefined : data.duration_type_preference_id
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
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please log in to add a comment.',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    try {
      const newCommentData = await ApiService.createLeadComment(id, newComment);
      setComments(prev => [newCommentData, ...prev]);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  {leadData.first_name.charAt(0)}{leadData.last_name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{`${leadData.first_name} ${leadData.last_name}`}</h1>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {leadSources.find(source => source.id === leadData.source_id)?.name || 'N/A'}
                    </Badge>
                    <Badge 
                      variant="default" 
                      className={`${
                        leadData.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                        leadData.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                        leadData.status === 'qualified' ? 'bg-green-100 text-green-800' :
                        leadData.status === 'won' ? 'bg-emerald-100 text-emerald-800' :
                        leadData.status === 'lost' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {leadData.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isEditing && (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Lead
                </Button>
              )}
              <Button 
                onClick={handleConvertToReservation} 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-xl shadow-lg"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Convert to Reservation
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl border-b border-gray-100">
                <CardTitle className="flex items-center justify-between text-xl">
                  <span className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Edit className="h-4 w-4 text-blue-600" />
                    </div>
                    Lead Information
                  </span>
                  {isEditing && (
                    <div className="flex space-x-3">
                      <Button 
                        size="sm" 
                        onClick={form.handleSubmit(onSubmit)} 
                        disabled={isSaving}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)} 
                        disabled={isSaving}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <SelectItem value="none">None</SelectItem>
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
                      name="estimated_revenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Revenue</FormLabel>
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
                              <SelectItem value="none">None</SelectItem>
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
                    
                    <FormField
                      control={form.control}
                      name="room_grade_preference_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Grade Preference</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!isEditing}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select room grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {leadRoomGrades.map(roomGrade => (
                                <SelectItem key={roomGrade.id} value={roomGrade.id}>
                                  {roomGrade.name}
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
                      name="duration_type_preference_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration Type Preference</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!isEditing}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {leadDurationTypes.map(durationType => (
                                <SelectItem key={durationType.id} value={durationType.id}>
                                  {durationType.name}
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
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl border-b border-gray-100">
                <CardTitle className="flex items-center text-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                  Comments & Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No comments yet</p>
                    <p className="text-sm">Be the first to add a comment about this lead</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {comment.author ? comment.author.first_name.charAt(0) : 'U'}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {comment.author ? `${comment.author.first_name} ${comment.author.last_name}` : 'Unknown User'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 space-y-3">
                  <Textarea
                    placeholder={isAuthenticated ? "Add a comment about this lead..." : "Log in to add a comment"}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    disabled={!isAuthenticated}
                    className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                  <Button 
                    onClick={handleAddComment} 
                    disabled={!isAuthenticated || !newComment.trim() || isSaving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2"
                  >
                    {isAuthenticated ? 'Add Comment' : 'Login to comment'}
                  </Button>
                </div>
            </CardContent>
          </Card>

            {/* Audit Trail */}
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-2xl border-b border-gray-100">
                <CardTitle className="flex items-center text-lg">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  Activity History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {auditTrail.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No activity yet</p>
                    <p className="text-sm">Changes to this lead will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {auditTrail.map((entry) => (
                      <div key={entry.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">{entry.field}</span> changed from{' '}
                          <span className="text-red-600 font-medium">{entry.oldValue}</span> to{' '}
                          <span className="text-green-600 font-medium">{entry.newValue}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          by <span className="font-medium">{entry.changedBy}</span> on{' '}
                          <span>{new Date(entry.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
