'use client';

/**
 * Likes Hooks
 * React Query hooks for managing likes with optimistic updates.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession, signIn } from 'next-auth/react';
import {
    toggleBlogLike,
    toggleCommentLike,
    fetchBlogEngagement,
} from '@/services/api';
import type { ApiBlogEngagement } from '@/types/api';
import { commentKeys } from './useComments';

// Query keys
export const likeKeys = {
    all: ['likes'] as const,
    blogEngagement: (blogId: number) => [...likeKeys.all, 'engagement', blogId] as const,
};

/**
 * Hook to fetch blog engagement data (likes, comments, views)
 */
export function useBlogEngagement(blogId: number) {
    const { data: session } = useSession();
    const googleId = (session?.user as { googleId?: string })?.googleId;

    return useQuery({
        queryKey: likeKeys.blogEngagement(blogId),
        queryFn: () => fetchBlogEngagement(blogId, googleId),
        staleTime: 30 * 1000, // 30 seconds
        refetchOnWindowFocus: false,
    });
}

/**
 * Hook to toggle like on a blog post with optimistic updates
 */
export function useBlogLike(blogId: number) {
    const queryClient = useQueryClient();
    const { data: session, status } = useSession();
    const googleId = (session?.user as { googleId?: string })?.googleId;

    return useMutation({
        mutationFn: async () => {
            // Check authentication
            if (status !== 'authenticated' || !googleId) {
                // Trigger sign in flow
                signIn('google', { callbackUrl: window.location.href });
                throw new Error('Please sign in to like');
            }
            return toggleBlogLike(blogId, googleId);
        },

        // Optimistic update - UI changes immediately
        onMutate: async () => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: likeKeys.blogEngagement(blogId) });

            // Snapshot previous value
            const previousEngagement = queryClient.getQueryData<ApiBlogEngagement>(
                likeKeys.blogEngagement(blogId)
            );

            // Optimistically update
            if (previousEngagement) {
                queryClient.setQueryData<ApiBlogEngagement>(
                    likeKeys.blogEngagement(blogId),
                    {
                        ...previousEngagement,
                        is_liked: !previousEngagement.is_liked,
                        like_count: previousEngagement.is_liked
                            ? previousEngagement.like_count - 1
                            : previousEngagement.like_count + 1,
                    }
                );
            }

            return { previousEngagement };
        },

        // Rollback on error
        onError: (_err, _variables, context) => {
            if (context?.previousEngagement) {
                queryClient.setQueryData(
                    likeKeys.blogEngagement(blogId),
                    context.previousEngagement
                );
            }
        },

        // Sync with server response
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: likeKeys.blogEngagement(blogId) });
        },
    });
}

/**
 * Hook to toggle like on a comment with optimistic updates
 */
export function useCommentLike(commentId: number, blogId: number) {
    const queryClient = useQueryClient();
    const { data: session, status } = useSession();
    const googleId = (session?.user as { googleId?: string })?.googleId;

    return useMutation({
        mutationFn: async () => {
            if (status !== 'authenticated' || !googleId) {
                signIn('google', { callbackUrl: window.location.href });
                throw new Error('Please sign in to like');
            }
            return toggleCommentLike(commentId, googleId);
        },

        // On success, invalidate comments to update the like count
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: commentKeys.blog(blogId) });
        },
    });
}

/**
 * Debounce helper for preventing rapid like toggles
 */
let likeDebounceTimer: NodeJS.Timeout | null = null;

export function debouncedLike(
    callback: () => void,
    delay = 300
): void {
    if (likeDebounceTimer) {
        clearTimeout(likeDebounceTimer);
    }
    likeDebounceTimer = setTimeout(callback, delay);
}
