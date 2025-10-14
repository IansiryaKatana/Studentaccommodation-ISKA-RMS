import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
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
import { ApiService, Lead } from '@/services/api';
import { useAcademicYear } from '@/contexts/AcademicYearContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatCardsCarousel } from '@/components/leads/StatCardsCarousel';

const GetCallbackLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const navigate = useNavigate();

  const { selectedAcademicYear } = useAcademicYear();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getLeads(selectedAcademicYear);
      // Filter only leads from "Websites" source (Get a Callback leads)
      // Exclude viewing booking leads (those with "Viewing booking requested for:" in notes)
      const callbackLeads = data.filter(lead => 
        lead.lead_source?.name === 'Websites' && 
        (!lead.notes || !lead.notes.includes('Viewing booking requested for:'))
      );
      setLeads(callbackLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [selectedAcademicYear]);

  const handleDelete = async () => {
    if (!leadToDelete) return;

    try {
      await ApiService.deleteLead(leadToDelete.id);
      setLeads(leads.filter(lead => lead.id !== leadToDelete.id));
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Get a Callback Leads</h1>
            <p className="text-gray-600 mt-2">Leads from website callback forms</p>
          </div>
        </div>
        
        <StatCardsCarousel leads={[]} loading={true} />
        
        <Card>
          <CardHeader>
            <CardTitle>Callback Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Get a Callback Leads</h1>
          <p className="text-gray-600 mt-2">Leads from website callback forms</p>
        </div>
      </div>

      <StatCardsCarousel leads={leads} loading={false} />

      <Card>
        <CardHeader>
          <CardTitle>Callback Leads ({leads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No callback leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Room Grade</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow 
                      key={lead.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/leads/${lead.id}`)}
                    >
                      <TableCell className="font-medium">
                        {lead.first_name} {lead.last_name}
                      </TableCell>
                      <TableCell>{lead.email || 'N/A'}</TableCell>
                      <TableCell>{lead.phone || 'N/A'}</TableCell>
                      <TableCell>{lead.room_grade_preference?.name || 'N/A'}</TableCell>
                      <TableCell>{lead.duration_type_preference?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(lead.estimated_revenue || lead.budget)}</TableCell>
                      <TableCell>
                        {lead.assigned_user ? 
                          `${lead.assigned_user.first_name} ${lead.assigned_user.last_name}` : 
                          'Unassigned'
                        }
                      </TableCell>
                      <TableCell>{formatDate(lead.created_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/leads/${lead.id}`);
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/leads/${lead.id}`);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
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
};

export default GetCallbackLeads;
