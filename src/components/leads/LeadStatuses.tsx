import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, ArrowLeft, Search, Filter, Circle, CheckCircle, Clock, AlertCircle, XCircle, TrendingUp } from 'lucide-react';
import { ApiService, Lead } from '@/services/api';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface LeadStatus {
  status: string;
  count: number;
  color: string;
  icon: any;
}



const LeadStatuses = () => {
  const { selectedAcademicYear } = useAcademicYear();
  const [statusStats, setStatusStats] = useState<LeadStatus[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchLeadStatusStats();
    fetchAllLeads();
  }, [selectedAcademicYear]);

  const fetchLeadStatusStats = async () => {
    try {
      setLoading(true);
      
      // Fetch leads grouped by status
      const { data: leadsData, error: leadsError } = await ApiService.getLeadsByStatus();

      if (leadsError) throw leadsError;

      // Count leads by status
      const statusCounts = leadsData?.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Create status stats with icons and colors
      const stats: LeadStatus[] = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count: count as number,
        ...getStatusConfig(status)
      }));

      setStatusStats(stats);
    } catch (error) {
      console.error('Error fetching lead status stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLeads = async () => {
    try {
      const leadsData = await ApiService.getLeads(selectedAcademicYear);
      setAllLeads(leadsData || []);
    } catch (error) {
      console.error('Error fetching all leads:', error);
    }
  };

  const fetchLeadsByStatus = async (status: string) => {
    try {
      const { data: leadsData, error: leadsError } = await ApiService.getLeadsByStatus(status);
      if (leadsError) throw leadsError;
      setLeads(leadsData || []);
    } catch (error) {
      console.error('Error fetching leads by status:', error);
    }
  };

  const handleStatusClick = async (status: LeadStatus) => {
    setSelectedStatus(status);
    await fetchLeadsByStatus(status.status);
    setShowDetailDialog(true);
  };

  const handleCardClick = (status: LeadStatus) => {
    setSelectedStatus(status);
    // Filter leads based on selected status
    const filteredLeads = allLeads.filter(lead => lead.status === status.status);
    setLeads(filteredLeads);
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: any }> = {
      new: {
        color: 'from-blue-500 to-blue-600',
        icon: Circle
      },
      contacted: {
        color: 'from-yellow-500 to-yellow-600',
        icon: Clock
      },
      qualified: {
        color: 'from-green-500 to-green-600',
        icon: CheckCircle
      },
      proposal_sent: {
        color: 'from-purple-500 to-purple-600',
        icon: AlertCircle
      },
      negotiating: {
        color: 'from-orange-500 to-orange-600',
        icon: TrendingUp
      },
      won: {
        color: 'from-emerald-500 to-emerald-600',
        icon: CheckCircle
      },
      lost: {
        color: 'from-red-500 to-red-600',
        icon: XCircle
      },
      converted: {
        color: 'from-teal-500 to-teal-600',
        icon: CheckCircle
      }
    };
    return configs[status] || { color: 'from-gray-500 to-gray-600', icon: Circle };
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      proposal_sent: 'bg-purple-100 text-purple-800',
      negotiating: 'bg-orange-100 text-orange-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
      converted: 'bg-emerald-100 text-emerald-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };



  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);

    const matchesSource = sourceFilter === 'all' || (lead as any).source?.name === sourceFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const leadDate = new Date(lead.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - leadDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (dateFilter) {
        case 'today':
          matchesDate = diffDays <= 1;
          break;
        case 'week':
          matchesDate = diffDays <= 7;
          break;
        case 'month':
          matchesDate = diffDays <= 30;
          break;
      }
    }

    return matchesSearch && matchesSource && matchesDate;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Statuses</h1>
            <p className="text-gray-600">Loading lead status data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
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
          <h1 className="text-2xl font-bold text-gray-900">Lead Statuses</h1>
          <p className="text-gray-600">Track and manage lead statuses</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Status
        </Button>
      </div>

      {/* Status Cards - Responsive grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statusStats.map((status, index) => {
          const IconComponent = status.icon;
          return (
            <div
              key={status.status}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedStatus?.status === status.status ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleCardClick(status)}
            >
              <Card className={`h-32 bg-gradient-to-r ${status.color} text-white border-0`}>
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <IconComponent className="h-6 w-6" />
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {status.count}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg capitalize">
                      {status.status.replace('_', ' ')}
                    </h3>
                    <p className="text-sm opacity-90">
                      {status.count} lead{status.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {selectedStatus ? `${selectedStatus.status.replace('_', ' ')} Leads` : 'All Leads'}
            </h2>
            {selectedStatus && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedStatus(null);
                  setLeads(allLeads);
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Show All
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Phone">Phone</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Social Media">Social Media</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Walk-in">Walk-in</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Move-in Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    {selectedStatus ? `No leads found for ${selectedStatus.status.replace('_', ' ')}` : 'No leads found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {lead.first_name} {lead.last_name}
                    </TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>£{lead.budget?.toLocaleString()}</TableCell>
                    <TableCell>
                      {lead.move_in_date ? new Date(lead.move_in_date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>{lead.duration_months} months</TableCell>
                    <TableCell>{(lead as any).source?.name || '-'}</TableCell>
                    <TableCell>
                      {(lead as any).assigned_to ? `${(lead as any).assigned_to.first_name} ${(lead as any).assigned_to.last_name}` : '-'}
                    </TableCell>
                    <TableCell>
                      {new Date(lead.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedStatus?.status.replace('_', ' ')} - Lead Details
            </DialogTitle>
            <DialogDescription>
              Detailed view of leads with this status
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{selectedStatus?.count}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Percentage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedStatus?.count ? Math.round((selectedStatus.count / allLeads.length) * 100) : 0}%
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={getStatusColor(selectedStatus?.status || '')}>
                    {selectedStatus?.status.replace('_', ' ')}
                  </Badge>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Recent Leads</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {leads.slice(0, 10).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{lead.first_name} {lead.last_name}</p>
                      <p className="text-sm text-gray-600">{lead.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status.replace('_', ' ')}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadStatuses; 