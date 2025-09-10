"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-muted rounded w-24 animate-pulse"></div>
              <div className="h-10 bg-muted rounded w-24 animate-pulse"></div>
              <div className="h-10 bg-muted rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-5 bg-muted rounded w-3/4 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/3 animate-pulse mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="h-5 bg-muted rounded w-3/4 animate-pulse mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
