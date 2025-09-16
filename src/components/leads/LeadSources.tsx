
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Globe, Phone, Mail, Users, ArrowLeft, Search, Filter } from 'lucide-react';
import { ApiService, Lead } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface LeadSource {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  lead_count: number;
}

const LeadSources = () => {
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [selectedSource, setSelectedSource] = useState<LeadSource | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchLeadSources();
    fetchAllLeads();
  }, []);

  const fetchLeadSources = async () => {
    try {
      setLoading(true);
      
      // Fetch lead sources
      const sourcesData = await ApiService.getLeadSources();

      // Fetch lead counts for each source
      const sourcesWithCounts = await Promise.all(
        sourcesData?.map(async (source) => {
          const { count } = await ApiService.getLeadCountBySource(source.id);
          return { ...source, lead_count: count || 0 };
        }) || []
      );

      setSources(sourcesWithCounts);
    } catch (error) {
      console.error('Error fetching lead sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLeads = async () => {
    try {
      const leadsData = await ApiService.getLeads();
      setAllLeads(leadsData || []);
    } catch (error) {
      console.error('Error fetching all leads:', error);
    }
  };

  const fetchLeadsBySource = async (sourceId: string) => {
    try {
      const leadsData = await ApiService.getLeadsBySource(sourceId);
      setLeads(leadsData || []);
    } catch (error) {
      console.error('Error fetching leads by source:', error);
    }
  };

  const handleSourceClick = async (source: LeadSource) => {
    setSelectedSource(source);
    await fetchLeadsBySource(source.id);
    setShowDetailDialog(true);
  };

  const handleCardClick = (source: LeadSource) => {
    setSelectedSource(source);
    // Filter leads based on selected source
    const filteredLeads = allLeads.filter(lead => 
      (lead as any).source?.name === source.name
    );
    setLeads(filteredLeads);
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

  const getSourceIcon = (name: string) => {
    const icons: Record<string, any> = {
      'Website': Globe,
      'Phone': Phone,
      'Email': Mail,
      'Social Media': Users,
      'Referral': Users,
      'Walk-in': Users,
      'Other': Globe
    };
    return icons[name] || Globe;
  };

  const getSourceColor = (name: string) => {
    const colors: Record<string, string> = {
      'Website': 'from-blue-500 to-blue-600',
      'Phone': 'from-green-500 to-green-600',
      'Email': 'from-purple-500 to-purple-600',
      'Social Media': 'from-pink-500 to-pink-600',
      'Referral': 'from-orange-500 to-orange-600',
      'Walk-in': 'from-indigo-500 to-indigo-600',
      'Other': 'from-gray-500 to-gray-600'
    };
    return colors[name] || 'from-gray-500 to-gray-600';
  };



  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

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

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Sources</h1>
            <p className="text-gray-600">Track and manage lead sources</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Source
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Lead Sources</h1>
          <p className="text-gray-600">Manage and track lead sources</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Source
        </Button>
      </div>

      {/* Source Cards - Responsive grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sources.map((source, index) => {
          const IconComponent = getSourceIcon(source.name);
          return (
            <div
              key={source.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedSource?.id === source.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleCardClick(source)}
            >
              <Card className={`h-32 bg-gradient-to-r ${getSourceColor(source.name)} text-white border-0`}>
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <IconComponent className="h-6 w-6" />
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {source.lead_count}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{source.name}</h3>
                    <p className="text-sm opacity-90 truncate">{source.description}</p>
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
              {selectedSource ? `${selectedSource.name} Leads` : 'All Leads'}
            </h2>
            {selectedSource && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSource(null);
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
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
                    {selectedSource ? `No leads found for ${selectedSource.name}` : 'No leads found'}
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
            <DialogTitle>{selectedSource?.name} - Lead Details</DialogTitle>
            <DialogDescription>
              Detailed view of leads from this source
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{selectedSource?.lead_count}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedSource?.lead_count ? Math.round((selectedSource.lead_count / allLeads.length) * 100) : 0}%
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Active Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={selectedSource?.is_active ? "default" : "secondary"}>
                    {selectedSource?.is_active ? "Active" : "Inactive"}
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

export default LeadSources;
