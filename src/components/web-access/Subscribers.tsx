import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ApiService } from '@/services/api';

interface Subscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  source: string;
  created_at: string;
}

const Subscribers: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await ApiService.getSubscribers();
        setSubscribers(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleExport = () => {
    const header = ['Email', 'First Name', 'Last Name', 'Source', 'Created At'];
    const rows = subscribers.map(s => [s.email, s.first_name || '', s.last_name || '', s.source, new Date(s.created_at).toISOString()]);
    const csv = [header, ...rows].map(r => r.map(f => `"${String(f).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Subscribers</h1>
        <Button onClick={handleExport} disabled={loading}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Newsletter Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
                ) : subscribers.length === 0 ? (
                  <TableRow><TableCell colSpan={5}>No subscribers yet</TableCell></TableRow>
                ) : (
                  subscribers.map(sub => (
                    <TableRow key={sub.id}>
                      <TableCell>{sub.email}</TableCell>
                      <TableCell>{sub.first_name || '-'}</TableCell>
                      <TableCell>{sub.last_name || '-'}</TableCell>
                      <TableCell>{sub.source}</TableCell>
                      <TableCell>{new Date(sub.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscribers;


