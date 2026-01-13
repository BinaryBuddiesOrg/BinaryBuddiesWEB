'use client';

/**
 * CommentSkeleton - Loading placeholder for comments
 */

interface CommentSkeletonProps {
    count?: number;
}

export function CommentSkeleton({ count = 3 }: CommentSkeletonProps) {
    return (
        <div className="space-y-4 animate-pulse">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="py-4 border-b border-gray-100 dark:border-gray-800">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
                    </div>

                    {/* Content */}
                    <div className="space-y-2 mb-3">
                        <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                        <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <div className="h-4 w-12 bg-gray-100 dark:bg-gray-800 rounded" />
                        <div className="h-4 w-12 bg-gray-100 dark:bg-gray-800 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}
