import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Phone, Mail, User, Upload, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';

import { Lead } from '@/services/api';
import { StatCardsCarousel } from '@/components/leads/StatCardsCarousel';

export default function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadSources, setLeadSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
    fetchLeadSources();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getLeads();
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to load leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadSources = async () => {
    try {
      const data = await ApiService.getLeadSources();
      setLeadSources(data);
    } catch (error) {
      console.error('Error fetching lead sources:', error);
    }
  };

  const handleDelete = async () => {
    if (!leadToDelete) return;

    try {
      await ApiService.deleteLead(leadToDelete.id);
      setLeads(leads.filter(lead => lead.id !== leadToDelete.id));
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
      toast({
        title: "Success",
        description: "Lead deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: "Error",
        description: "Failed to delete lead. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.phone && lead.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.lead_source?.name === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new': return 'default';
      case 'contacted': return 'secondary';
      case 'qualified': return 'outline';
      case 'proposal_sent': return 'secondary';
      case 'negotiating': return 'outline';
      case 'won': return 'default';
      case 'lost': return 'destructive';
      case 'converted': return 'default';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  // Carousel functions
  const nextSlide = () => {
    const totalStats = 5; // Total number of stat cards
    if (totalStats <= 4) return; // No need to scroll if 4 or fewer cards
    
    setCurrentIndex((prev) => Math.min(prev + 1, totalStats - 4));
    setIsAutoScrolling(false);
  };

  const prevSlide = () => {
    const totalStats = 5; // Total number of stat cards
    if (totalStats <= 4) return; // No need to scroll if 4 or fewer cards
    
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setIsAutoScrolling(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Leads</h2>
          <div className="flex gap-2">
            <Link to="/leads/import">
              <Button variant="outline" disabled>
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
            </Link>
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Leads</h1>
          <p className="text-gray-600">Manage and track all leads</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Navigation arrows - only show when more than 4 stat cards */}
          {5 > 4 && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Link to="/leads/import">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
          </Link>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
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

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {leadSources.map((source) => (
                  <SelectItem key={source.id} value={source.name}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setSourceFilter('all');
            }}>
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <StatCardsCarousel 
        leads={leads} 
        loading={loading} 
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        isAutoScrolling={isAutoScrolling}
        setIsAutoScrolling={setIsAutoScrolling}
      />

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Room Grade</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow 
                  key={lead.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/leads/${lead.id}`)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {lead.first_name} {lead.last_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {lead.email && <div className="text-sm"><Mail className="inline-block h-4 w-4 mr-1" />{lead.email}</div>}
                      {lead.phone && <div className="text-sm text-gray-500"><Phone className="inline-block h-4 w-4 mr-1" />{lead.phone}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {lead.lead_source?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {lead.room_grade_preference?.name || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {lead.duration_type_preference?.name || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(lead.status)}>
                      {lead.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(lead.estimated_revenue || lead.budget)}
                  </TableCell>
                  <TableCell>
                    {lead.assigned_user ? 
                      `${lead.assigned_user.first_name} ${lead.assigned_user.last_name}` : 
                      'Unassigned'
                    }
                  </TableCell>
                  <TableCell>
                    {formatDate(lead.created_at)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/leads/${lead.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/leads/${lead.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setLeadToDelete(lead);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No leads found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {leadToDelete?.first_name} {leadToDelete?.last_name}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
