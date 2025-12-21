'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function BlogCardSkeleton() {
    return (
        <Card className="glass overflow-hidden h-full flex flex-col">
            {/* Image Skeleton */}
            <div className="relative h-48 overflow-hidden bg-muted/10">
                <Skeleton className="w-full h-full" />
            </div>

            {/* Content Skeleton */}
            <div className="p-6 flex-1 flex flex-col">
                {/* Category Badge Skeleton */}
                <Skeleton className="w-20 h-6 mb-3 rounded-md" />

                {/* Title Skeleton */}
                <Skeleton className="h-6 w-full mb-2 rounded-md" />
                <Skeleton className="h-6 w-3/4 mb-3 rounded-md" />

                {/* Excerpt Skeleton */}
                <Skeleton className="h-4 w-full mb-2 rounded-md" />
                <Skeleton className="h-4 w-full mb-2 rounded-md" />
                <Skeleton className="h-4 w-5/6 mb-4 rounded-md" />

                {/* Meta Information Skeleton */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-primary/20">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-4 w-20 rounded-md" />
                    <Skeleton className="h-4 w-16 rounded-md" />
                </div>
            </div>
        </Card>
    );
}
