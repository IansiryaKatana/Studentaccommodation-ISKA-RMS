
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Phone, Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApiService, Lead } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface FollowUp {
  id: string;
  lead_id: string;
  lead: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: string;
  };
  type: 'call' | 'email' | 'meeting' | 'message';
  due_date: string;
  due_time: string;
  priority: 'high' | 'medium' | 'low';
  notes: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

const FollowUps = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      
      // For now, we'll create follow-ups from leads data since we don't have a dedicated follow-ups table
      // In a real implementation, you would have a follow_ups table in the database
      const leads = await ApiService.getLeads();
      
      // Create mock follow-ups from leads data for demonstration
      const mockFollowUps: FollowUp[] = leads?.slice(0, 10).map((lead, index) => ({
        id: `followup-${lead.id}`,
        lead_id: lead.id,
        lead: {
          first_name: lead.first_name,
          last_name: lead.last_name,
          email: lead.email || '',
          phone: lead.phone || '',
          status: lead.status
        },
        type: ['call', 'email', 'meeting', 'message'][index % 4] as 'call' | 'email' | 'meeting' | 'message',
        due_date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        due_time: `${9 + (index % 8)}:${index % 2 === 0 ? '00' : '30'} ${index % 2 === 0 ? 'AM' : 'PM'}`,
        priority: ['high', 'medium', 'low'][index % 3] as 'high' | 'medium' | 'low',
        notes: `Follow up on ${lead.status} status - ${lead.notes || 'No additional notes'}`,
        status: 'pending' as 'pending' | 'completed' | 'cancelled',
        created_at: lead.created_at,
        updated_at: lead.updated_at
      })) || [];

      setFollowUps(mockFollowUps);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
      toast({
        title: "Error",
        description: "Failed to load follow-ups",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteFollowUp = async (followUpId: string) => {
    try {
      // In a real implementation, you would update the follow-up status in the database
      setFollowUps(prev => prev.map(followUp => 
        followUp.id === followUpId 
          ? { ...followUp, status: 'completed' as const }
          : followUp
      ));
      
      toast({
        title: "Success",
        description: "Follow-up marked as completed",
      });
    } catch (error) {
      console.error('Error completing follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to complete follow-up",
        variant: "destructive"
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return User;
      case 'meeting': return User;
      case 'message': return User;
      default: return User;
    }
  };

  const filteredFollowUps = followUps.filter(followUp => {
    const matchesSearch = 
      followUp.lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.lead.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.notes.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || followUp.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || followUp.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Follow-ups</h1>
          <p className="text-gray-600">Manage scheduled follow-up activities</p>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Follow-ups</h1>
          <p className="text-gray-600">Manage scheduled follow-up activities</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Follow-up
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search follow-ups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Follow-ups List */}
      <div className="space-y-4">
        {filteredFollowUps.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No follow-ups found</p>
            </CardContent>
          </Card>
        ) : (
          filteredFollowUps.map((followUp) => {
            const IconComponent = getTypeIcon(followUp.type);
            return (
              <Card key={followUp.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {followUp.lead.first_name} {followUp.lead.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">{followUp.notes}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {followUp.lead.email} • {followUp.lead.phone}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(followUp.due_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {followUp.due_time}
                      </div>
                      <Badge className={getPriorityColor(followUp.priority)}>
                        {followUp.priority}
                      </Badge>
                      <Badge className={getStatusColor(followUp.status)}>
                        {followUp.status}
                      </Badge>
                      {followUp.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleCompleteFollowUp(followUp.id)}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FollowUps;
