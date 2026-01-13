'use client';

/**
 * LikeButton - Reusable like button for blog posts
 * Features optimistic updates and authentication check.
 */

import { Heart } from 'lucide-react';
import { useBlogEngagement, useBlogLike, debouncedLike } from '@/hooks/useLikes';

interface LikeButtonProps {
    blogId: number;
    showCount?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LikeButton({
    blogId,
    showCount = true,
    size = 'md',
    className = '',
}: LikeButtonProps) {
    const { data: engagement, isLoading } = useBlogEngagement(blogId);
    const likeMutation = useBlogLike(blogId);

    const isLiked = engagement?.is_liked ?? false;
    const likeCount = engagement?.like_count ?? 0;

    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    const handleClick = () => {
        debouncedLike(() => {
            likeMutation.mutate();
        });
    };

    if (isLoading) {
        return (
            <button
                disabled
                className={`flex items-center gap-2 text-gray-400 ${className}`}
            >
                <Heart className={`${sizeClasses[size]} animate-pulse`} />
                {showCount && <span className="animate-pulse">—</span>}
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={likeMutation.isPending}
            className={`group flex items-center gap-2 transition-all duration-200 ${isLiked
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-500 hover:text-red-500'
                } ${likeMutation.isPending ? 'opacity-70' : ''} ${className}`}
            aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
        >
            <Heart
                className={`${sizeClasses[size]} transition-transform duration-200 ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'
                    }`}
            />
            {showCount && (
                <span className="font-medium tabular-nums">
                    {likeCount > 0 ? likeCount : ''}
                </span>
            )}
        </button>
    );
}
