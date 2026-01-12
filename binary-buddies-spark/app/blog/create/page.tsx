/**
 * Blog Create Page
 * Protected page for creating new blog posts with rich text editor
 */

import { Suspense } from 'react';
import BlogCreateForm from './BlogCreateForm';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
    title: 'Create Blog Post | Binary Buddies',
    description: 'Create a new blog post with our rich text editor',
};

function BlogCreateSkeleton() {
    return (
        <div className="container max-w-4xl py-8 space-y-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-12 w-32" />
        </div>
    );
}

export default function BlogCreatePage() {
    return (
        <Suspense fallback={<BlogCreateSkeleton />}>
            <BlogCreateForm />
        </Suspense>
    );
}
