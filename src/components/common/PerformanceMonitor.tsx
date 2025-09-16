import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Database, Zap, AlertTriangle } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  queryCount: number;
  cacheHitRate: number;
  memoryUsage: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    queryCount: 0,
    cacheHitRate: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    const startTime = performance.now();
    
    // Monitor performance
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const loadTime = entries.find(entry => entry.name === 'load')?.duration || 0;
      
      setMetrics(prev => ({
        ...prev,
        loadTime: Math.round(loadTime)
      }));
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    // Monitor memory usage
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
        }));
      }
    };

    updateMemoryUsage();
    const memoryInterval = setInterval(updateMemoryUsage, 5000);

    return () => {
      observer.disconnect();
      clearInterval(memoryInterval);
    };
  }, []);

  const getPerformanceStatus = (loadTime: number) => {
    if (loadTime < 1000) return { status: 'excellent', color: 'bg-green-500' };
    if (loadTime < 3000) return { status: 'good', color: 'bg-yellow-500' };
    return { status: 'needs improvement', color: 'bg-red-500' };
  };

  const performanceStatus = getPerformanceStatus(metrics.loadTime);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Performance Monitor
        </CardTitle>
        <CardDescription>Real-time performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Load Time</span>
          <Badge className={performanceStatus.color}>
            {metrics.loadTime}ms
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Memory Usage</span>
          <Badge variant="outline">
            {metrics.memoryUsage}MB
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <Badge className={performanceStatus.color}>
            {performanceStatus.status}
          </Badge>
        </div>

        {metrics.loadTime > 3000 && (
          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-md">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Consider implementing pagination or caching
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

