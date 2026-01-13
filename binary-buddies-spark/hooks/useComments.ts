'use client';

/**
 * Comments Hooks
 * React Query hooks for managing blog comments with infinite scroll.
 */

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
    fetchComments,
    fetchReplies,
    createComment,
    editComment,
    deleteComment,
} from '@/services/api';
import type { ApiComment, PaginatedComments } from '@/types/api';

// Query keys
export const commentKeys = {
    all: ['comments'] as const,
    blog: (blogId: number) => [...commentKeys.all, 'blog', blogId] as const,
    replies: (commentId: number) => [...commentKeys.all, 'replies', commentId] as const,
};

/**
 * Hook to fetch comments for a blog post with infinite scroll
 */
export function useComments(blogId: number) {
    const { data: session } = useSession();
    const googleId = (session?.user as { googleId?: string })?.googleId;

    return useInfiniteQuery({
        queryKey: commentKeys.blog(blogId),
        queryFn: ({ pageParam }) =>
            fetchComments(blogId, {
                cursor: pageParam,
                limit: 20,
                googleId,
            }),
        getNextPageParam: (lastPage: PaginatedComments) =>
            lastPage.pagination.has_more ? lastPage.pagination.next_cursor : undefined,
        initialPageParam: undefined as string | undefined,
        staleTime: 30 * 1000, // 30 seconds
        refetchOnWindowFocus: false,
    });
}

/**
 * Hook to fetch replies for a comment (lazy loaded)
 */
export function useReplies(commentId: number, enabled = false) {
    const { data: session } = useSession();
    const googleId = (session?.user as { googleId?: string })?.googleId;

    return useInfiniteQuery({
        queryKey: commentKeys.replies(commentId),
        queryFn: ({ pageParam }) =>
            fetchReplies(commentId, {
                cursor: pageParam,
                limit: 10,
                googleId,
            }),
        getNextPageParam: (lastPage: PaginatedComments) =>
            lastPage.pagination.has_more ? lastPage.pagination.next_cursor : undefined,
        initialPageParam: undefined as string | undefined,
        enabled, // Only fetch when user expands replies
        staleTime: 30 * 1000,
    });
}

/**
 * Hook to create a new comment
 */
export function useCreateComment(blogId: number) {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const googleId = (session?.user as { googleId?: string })?.googleId;

    return useMutation({
        mutationFn: (data: { content: string; parentId?: number }) => {
            if (!googleId) {
                throw new Error('Authentication required');
            }
            return createComment(blogId, googleId, data.content, data.parentId);
        },
        onSuccess: (response, variables) => {
            if (response.status === 'success') {
                // Invalidate comments to refetch
                queryClient.invalidateQueries({ queryKey: commentKeys.blog(blogId) });

                // If this is a reply, also invalidate the parent's replies
                if (variables.parentId) {
                    queryClient.invalidateQueries({
                        queryKey: commentKeys.replies(variables.parentId),
                    });
                }
            }
        },
    });
}

/**
 * Hook to edit an existing comment
 */
export function useEditComment(blogId: number) {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const googleId = (session?.user as { googleId?: string })?.googleId;

    return useMutation({
        mutationFn: (data: { commentId: number; content: string }) => {
            if (!googleId) {
                throw new Error('Authentication required');
            }
            return editComment(data.commentId, googleId, data.content);
        },
        onSuccess: (response) => {
            if (response.status === 'success') {
                // Invalidate to refetch with updated content
                queryClient.invalidateQueries({ queryKey: commentKeys.blog(blogId) });
            }
        },
    });
}

/**
 * Hook to delete a comment
 */
export function useDeleteComment(blogId: number) {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const googleId = (session?.user as { googleId?: string })?.googleId;

    return useMutation({
        mutationFn: (commentId: number) => {
            if (!googleId) {
                throw new Error('Authentication required');
            }
            return deleteComment(commentId, googleId);
        },
        onSuccess: () => {
            // Invalidate to show "[deleted]" state
            queryClient.invalidateQueries({ queryKey: commentKeys.blog(blogId) });
        },
    });
}

/**
 * Helper to flatten paginated comments for rendering
 */
export function flattenComments(
    data: { pages: PaginatedComments[] } | undefined
): ApiComment[] {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.comments);
}

/**
 * Get total comment count from paginated data
 */
export function getCommentCount(
    data: { pages: PaginatedComments[] } | undefined
): number {
    if (!data?.pages?.[0]) return 0;
    return data.pages[0].pagination.total_count;
}
