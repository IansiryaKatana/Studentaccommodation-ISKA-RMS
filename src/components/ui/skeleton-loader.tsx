import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const LoginPageSkeleton = () => {
  return (
    <div className="new-login-theme min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Skeleton */}
      <header className="border-b border-border/40 bg-background">
        <div className="container mx-auto px-8 py-5 max-w-[1600px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-6 w-48" />
            </div>
            
            <div className="flex items-center gap-3">
              <Skeleton className="w-[200px] h-10 rounded-md" />
              <Skeleton className="w-64 h-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-8 max-w-[1600px] py-[100px]">
        <div className="flex gap-8 items-center">
          {/* Hero Section Skeleton */}
          <div className="flex-1 flex items-center">
            <div className="w-full max-w-2xl space-y-6">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-24 w-full max-w-xl" />
              <Skeleton className="h-20 w-full max-w-lg" />
              <Skeleton className="h-12 w-48 rounded-full" />
            </div>
          </div>
          
          {/* Module List Skeleton */}
          <div className="w-[520px] flex-shrink-0">
            <div className="bg-card rounded-xl border border-border/40 p-6">
              <Skeleton className="h-8 w-48 mb-6" />
              
              <div className="space-y-3 max-h-[576px] overflow-y-auto scrollbar-hide pr-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-secondary/30 rounded-lg p-4 border border-border/20">
                    <div className="flex items-start gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardPageSkeleton = () => {
  return (
    <div className="new-dashboard-theme min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Skeleton */}
      <header className="border-b border-border/40 bg-background">
        <div className="container mx-auto px-8 py-5 max-w-[1600px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-6 w-48" />
            </div>
            
            <div className="flex items-center gap-3">
              <Skeleton className="w-[200px] h-10 rounded-md" />
              <Skeleton className="w-64 h-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-8 max-w-[1600px] py-[100px]">
        <div className="flex gap-8 items-center">
          {/* Welcome Section Skeleton */}
          <div className="flex-1 flex items-center">
            <div className="w-full max-w-2xl space-y-6">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-32 w-full max-w-xl" />
              <div className="flex gap-4 mt-6">
                <Skeleton className="h-12 w-40 rounded-full" />
                <Skeleton className="h-12 w-40 rounded-full" />
              </div>
            </div>
          </div>
          
          {/* Module List Skeleton */}
          <div className="w-[520px] flex-shrink-0">
            <div className="bg-card rounded-xl border border-border/40 p-6">
              <Skeleton className="h-8 w-48 mb-6" />
              
              <div className="grid grid-cols-2 gap-4 max-h-[576px] overflow-y-auto scrollbar-hide pr-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl p-4 border-2 border-border/20">
                    <div className="flex items-start gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

