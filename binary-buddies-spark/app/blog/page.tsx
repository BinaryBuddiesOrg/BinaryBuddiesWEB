import { Suspense } from 'react';
import BlogContent from './BlogContent';
import { BlogCardSkeleton } from '@/components/BlogCardSkeleton';

function BlogSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <BlogCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export default function BlogPage() {
    return (
        <Suspense fallback={<BlogSkeleton />}>
            <BlogContent />
        </Suspense>
    );
}
