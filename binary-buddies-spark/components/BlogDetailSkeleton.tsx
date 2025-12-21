'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

export function BlogDetailSkeleton() {
    return (
        <div className="relative min-h-screen bg-background">
            {/* Header Section Skeleton */}
            <section className="relative pt-28 pb-12 border-b border-border/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Breadcrumbs Skeleton */}
                        <Skeleton className="h-4 w-48 mb-4 rounded-md" />
                        
                        {/* Back Link Skeleton */}
                        <div className="flex items-center gap-2 mb-8">
                            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                            <Skeleton className="h-5 w-32 rounded-md" />
                        </div>

                        {/* Preview Image Skeleton */}
                        <Skeleton className="w-full h-64 md:h-96 mb-8 rounded-lg" />

                        {/* Meta Info Skeleton */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <Skeleton className="h-6 w-24 rounded-md" />
                            <Skeleton className="h-4 w-32 rounded-md" />
                            <Skeleton className="h-4 w-24 rounded-md" />
                            <Skeleton className="h-4 w-20 rounded-md" />
                        </div>

                        {/* Title Skeleton */}
                        <Skeleton className="h-10 w-full mb-4 rounded-md" />
                        <Skeleton className="h-10 w-3/4 mb-6 rounded-md" />

                        {/* Tags Skeleton */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <Skeleton className="h-6 w-20 rounded-md" />
                            <Skeleton className="h-6 w-24 rounded-md" />
                            <Skeleton className="h-6 w-16 rounded-md" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section Skeleton */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Article Content Skeleton */}
                        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                            <Skeleton className="h-4 w-full mb-4 rounded-md" />
                            <Skeleton className="h-4 w-full mb-4 rounded-md" />
                            <Skeleton className="h-4 w-full mb-4 rounded-md" />
                            <Skeleton className="h-4 w-5/6 mb-6 rounded-md" />
                            
                            <Skeleton className="h-4 w-full mb-4 rounded-md" />
                            <Skeleton className="h-4 w-full mb-4 rounded-md" />
                            <Skeleton className="h-4 w-4/5 mb-6 rounded-md" />
                            
                            <Skeleton className="h-64 w-full mb-6 rounded-md" />
                            
                            <Skeleton className="h-4 w-full mb-4 rounded-md" />
                            <Skeleton className="h-4 w-full mb-4 rounded-md" />
                            <Skeleton className="h-4 w-3/4 mb-6 rounded-md" />
                        </div>

                        {/* Share Section Skeleton */}
                        <div className="border-t border-border/50 pt-8 mb-12">
                            <Skeleton className="h-10 w-48 mb-4 rounded-md" />
                            <div className="flex gap-4">
                                <Skeleton className="h-10 w-10 rounded-md" />
                                <Skeleton className="h-10 w-10 rounded-md" />
                                <Skeleton className="h-10 w-10 rounded-md" />
                                <Skeleton className="h-10 w-10 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Articles Skeleton */}
            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <Skeleton className="h-8 w-64 mb-8 mx-auto rounded-md" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Skeleton className="h-96 rounded-lg" />
                            <Skeleton className="h-96 rounded-lg" />
                            <Skeleton className="h-96 rounded-lg" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
