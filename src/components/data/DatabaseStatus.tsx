import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface TableStatus {
  name: string;
  accessible: boolean;
  rowCount: number;
  rlsEnabled: boolean;
}

const DatabaseStatus = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [tables, setTables] = useState<TableStatus[]>([]);
  const [error, setError] = useState<string>('');

  const testTables = [
    'users',
    'leads',
    'lead_sources',
    'reservations',
    'payments',
    'invoices',
    'durations',
    'room_grades',
    'pricing_matrix',
    'installment_plans',
    'maintenance_categories',
    'module_styles',
    'student_option_fields',
    'lead_option_fields'
  ];

  const testDatabase = async () => {
    setStatus('loading');
    setError('');
    
    try {
      const results: TableStatus[] = [];

      for (const tableName of testTables) {
        try {
          // Test basic access
          const { data, error: accessError } = await ApiService.testTableAccess(tableName);

          if (accessError) {
            results.push({
              name: tableName,
              accessible: false,
              rowCount: 0,
              rlsEnabled: true // Assume RLS is enabled if access fails
            });
          } else {
            // Test row count
            const { count, error: countError } = await ApiService.getRowCount(tableName);

            // Check if RLS is enabled (this is a rough check)
            const { data: rlsTest, error: rlsError } = await ApiService.testTableAccess(tableName);

            results.push({
              name: tableName,
              accessible: true,
              rowCount: count || 0,
              rlsEnabled: rlsError?.message?.includes('policy') || false
            });
          }
        } catch (tableError) {
          results.push({
            name: tableName,
            accessible: false,
            rowCount: 0,
            rlsEnabled: true
          });
        }
      }

      setTables(results);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  };

  useEffect(() => {
    testDatabase();
  }, []);

  const getStatusIcon = (accessible: boolean) => {
    return accessible ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (accessible: boolean, rlsEnabled: boolean) => {
    if (!accessible) {
      return <Badge variant="destructive">Access Denied</Badge>;
    }
    if (rlsEnabled) {
      return <Badge variant="secondary">RLS Enabled</Badge>;
    }
    return <Badge variant="default">Accessible</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Connection Status
            </CardTitle>
            <Button onClick={testDatabase} disabled={status === 'loading'}>
              {status === 'loading' && <RefreshCw className="h-4 w-4 animate-spin mr-2" />}
              Refresh Status
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {status === 'loading' && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mr-2" />
              <span>Testing database connection...</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <AlertCircle className="h-4 w-4" />
              <span>Error: {error}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map((table) => (
                  <Card key={table.name} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(table.accessible)}
                        <span className="font-medium">{table.name}</span>
                      </div>
                      {getStatusBadge(table.accessible, table.rlsEnabled)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Rows: {table.rowCount}
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Instructions to Fix RLS Issues:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Go to your Supabase Dashboard</li>
                  <li>Navigate to the SQL Editor</li>
                  <li>Copy and paste the contents of <code className="bg-blue-100 px-1 rounded">disable-rls.sql</code></li>
                  <li>Run the script to disable RLS on all tables</li>
                  <li>Refresh this page to verify the fix</li>
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseStatus; 