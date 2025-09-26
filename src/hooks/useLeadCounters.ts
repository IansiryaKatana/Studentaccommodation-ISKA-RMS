import { useState, useEffect } from 'react';
import { ApiService, Lead } from '@/services/api';

interface LeadCounters {
  callbackCount: number;
  viewingCount: number;
}

export const useLeadCounters = () => {
  const [counters, setCounters] = useState<LeadCounters>({ callbackCount: 0, viewingCount: 0 });
  const [lastVisit, setLastVisit] = useState<{ callback: string | null; viewing: string | null }>({
    callback: localStorage.getItem('lastCallbackVisit'),
    viewing: localStorage.getItem('lastViewingVisit')
  });

  const fetchCounters = async () => {
    try {
      const allLeads = await ApiService.getLeads();
      
      // Filter callback leads (Websites source, not viewing bookings)
      const callbackLeads = allLeads.filter(lead => 
        lead.lead_source?.name === 'Websites' && 
        (!lead.notes || !lead.notes.includes('Viewing booking requested for:'))
      );
      
      // Filter viewing booking leads
      const viewingLeads = allLeads.filter(lead => 
        lead.notes && lead.notes.includes('Viewing booking requested for:')
      );
      
      // Count new leads since last visit
      const callbackCount = callbackLeads.filter(lead => {
        if (!lastVisit.callback) return lead.status === 'new';
        return new Date(lead.created_at) > new Date(lastVisit.callback);
      }).length;
      
      const viewingCount = viewingLeads.filter(lead => {
        if (!lastVisit.viewing) return lead.status === 'new';
        return new Date(lead.created_at) > new Date(lastVisit.viewing);
      }).length;
      
      setCounters({ callbackCount, viewingCount });
    } catch (error) {
      console.error('Error fetching lead counters:', error);
    }
  };

  const markCallbackVisited = () => {
    const now = new Date().toISOString();
    localStorage.setItem('lastCallbackVisit', now);
    setLastVisit(prev => ({ ...prev, callback: now }));
    setCounters(prev => ({ ...prev, callbackCount: 0 }));
  };

  const markViewingVisited = () => {
    const now = new Date().toISOString();
    localStorage.setItem('lastViewingVisit', now);
    setLastVisit(prev => ({ ...prev, viewing: now }));
    setCounters(prev => ({ ...prev, viewingCount: 0 }));
  };

  useEffect(() => {
    fetchCounters();
    
    // Refresh counters every 30 seconds
    const interval = setInterval(fetchCounters, 30000);
    return () => clearInterval(interval);
  }, [lastVisit]);

  return {
    counters,
    markCallbackVisited,
    markViewingVisited,
    refreshCounters: fetchCounters
  };
};
