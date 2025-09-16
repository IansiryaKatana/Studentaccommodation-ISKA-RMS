
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Database, 
  Download, 
  Upload, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Play,
  ArrowLeft,
  Trash2,
  RotateCcw
} from 'lucide-react';


const BackupManagement = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const backupHistory = [
    {
      id: 1,
      name: 'Automatic Backup',
      date: '2024-01-15 23:00:00',
      size: '45.2 MB',
      type: 'automatic',
      status: 'completed',
      duration: '3m 45s'
    },
    {
      id: 2,
      name: 'Manual Backup',
      date: '2024-01-14 16:30:00',
      size: '44.8 MB',
      type: 'manual',
      status: 'completed',
      duration: '3m 12s'
    },
    {
      id: 3,
      name: 'Scheduled Backup',
      date: '2024-01-13 23:00:00',
      size: '44.1 MB',
      type: 'automatic',
      status: 'failed',
      duration: '0m 15s'
    },
    {
      id: 4,
      name: 'Pre-Update Backup',
      date: '2024-01-12 10:15:00',
      size: '43.9 MB',
      type: 'manual',
      status: 'completed',
      duration: '3m 58s'
    },
    {
      id: 5,
      name: 'Automatic Backup',
      date: '2024-01-11 23:00:00',
      size: '43.5 MB',
      type: 'automatic',
      status: 'completed',
      duration: '3m 33s'
    }
  ];

  const backupStats = [
    { label: 'Total Backups', value: '24', icon: Database },
    { label: 'Successful', value: '22', icon: CheckCircle },
    { label: 'Failed', value: '2', icon: AlertCircle },
    { label: 'Storage Used', value: '1.2 GB', icon: Database }
  ];

  const handleCreateBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleRestore = () => {
    if (!selectedFile) return;
    
    setIsRestoring(true);
    // Simulate restore process
    setTimeout(() => {
      setIsRestoring(false);
      setSelectedFile(null);
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: { variant: 'default' as const, icon: CheckCircle, text: 'Completed' },
      failed: { variant: 'destructive' as const, icon: AlertCircle, text: 'Failed' },
      running: { variant: 'secondary' as const, icon: Clock, text: 'Running' }
    };
    
    const config = variants[status as keyof typeof variants] || variants.running;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <config.icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    return type === 'automatic' ? (
      <Badge variant="outline">Auto</Badge>
    ) : (
      <Badge variant="secondary">Manual</Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backup Management</h1>
          <p className="text-muted-foreground">Create, restore, and manage database backups</p>
        </div>
        <div className="flex space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Restore Backup
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Restore Database Backup</DialogTitle>
                <DialogDescription>
                  Select a backup file to restore your database. This will overwrite all current data.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-file">Select Backup File</Label>
                  <Input
                    id="backup-file"
                    type="file"
                    accept=".sql,.dump,.backup"
                    onChange={handleFileSelect}
                  />
                </div>
                {selectedFile && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This will restore from: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex space-x-2">
                  <Button
                    onClick={handleRestore}
                    disabled={!selectedFile || isRestoring}
                    variant="destructive"
                    className="flex-1"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {isRestoring ? 'Restoring...' : 'Restore Database'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleCreateBackup} disabled={isBackingUp}>
            <Database className="mr-2 h-4 w-4" />
            {isBackingUp ? 'Creating...' : 'Create Backup'}
          </Button>
        </div>
      </div>

      {/* Backup Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {backupStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Backup Progress */}
      {isBackingUp && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Creating Database Backup</h3>
                <span className="text-sm text-muted-foreground">{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Backing up tables and data... This may take a few minutes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Backup History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>All database backups and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backupHistory.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{backup.name}</h4>
                        {getTypeBadge(backup.type)}
                        {getStatusBadge(backup.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {backup.date}
                        </div>
                        <div className="flex items-center">
                          <Database className="mr-1 h-3 w-3" />
                          {backup.size}
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {backup.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {backup.status === 'completed' && (
                        <>
                          <Button size="sm" variant="outline">
                            <Download className="mr-1 h-3 w-3" />
                            Download
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <RotateCcw className="mr-1 h-3 w-3" />
                                Restore
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Restore from {backup.name}?</DialogTitle>
                                <DialogDescription>
                                  This will restore your database to the state from {backup.date}. 
                                  All current data will be replaced.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex space-x-2">
                                <Button variant="destructive" className="flex-1">
                                  <RotateCcw className="mr-2 h-4 w-4" />
                                  Confirm Restore
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Backup Settings & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Settings</CardTitle>
              <CardDescription>Automatic backup configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Automatic Backups</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Frequency</span>
                  <span className="text-sm text-muted-foreground">Daily at 23:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Retention</span>
                  <span className="text-sm text-muted-foreground">30 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Next Backup</span>
                  <span className="text-sm text-muted-foreground">Tonight at 23:00</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Database className="mr-2 h-4 w-4" />
                Configure Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Storage</span>
                  <span className="text-sm text-muted-foreground">10 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Used Storage</span>
                  <span className="text-sm text-muted-foreground">1.2 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Available</span>
                  <span className="text-sm text-muted-foreground">8.8 GB</span>
                </div>
              </div>
              <Progress value={12} className="w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Play className="mr-2 h-4 w-4" />
                Run Manual Backup
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export All Backups
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Trash2 className="mr-2 h-4 w-4" />
                Cleanup Old Backups
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BackupManagement;
