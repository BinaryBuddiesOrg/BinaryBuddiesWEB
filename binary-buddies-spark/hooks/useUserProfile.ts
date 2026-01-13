'use client';

/**
 * User Profile Hooks
 * React Query hooks for fetching user profile data.
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
    fetchUserProfile,
    fetchUserComments,
    fetchUserLikedBlogs,
} from '@/services/api';
import type { PaginatedUserComments, PaginatedLikedBlogs } from '@/types/api';

// Query keys
export const profileKeys = {
    all: ['profile'] as const,
    user: (googleId: string) => [...profileKeys.all, googleId] as const,
    comments: (googleId: string) => [...profileKeys.all, googleId, 'comments'] as const,
    likedBlogs: (googleId: string) => [...profileKeys.all, googleId, 'liked-blogs'] as const,
};

/**
 * Hook to fetch user profile data
 */
export function useUserProfile(googleId?: string) {
    return useQuery({
        queryKey: profileKeys.user(googleId || ''),
        queryFn: () => {
            if (!googleId) throw new Error('No googleId provided');
            return fetchUserProfile(googleId);
        },
        enabled: !!googleId,
        staleTime: 60 * 1000, // 1 minute
    });
}

/**
 * Hook to fetch current user's profile
 */
export function useCurrentUserProfile() {
    const { data: session } = useSession();
    const googleId = (session?.user as { googleId?: string })?.googleId;

    return useUserProfile(googleId);
}

/**
 * Hook to fetch user's comments with pagination
 */
export function useUserComments(googleId?: string) {
    return useInfiniteQuery({
        queryKey: profileKeys.comments(googleId || ''),
        queryFn: ({ pageParam = 1 }) => {
            if (!googleId) throw new Error('No googleId provided');
            return fetchUserComments(googleId, pageParam, 20);
        },
        getNextPageParam: (lastPage: PaginatedUserComments) =>
            lastPage.pagination.has_more ? lastPage.pagination.page + 1 : undefined,
        initialPageParam: 1,
        enabled: !!googleId,
        staleTime: 30 * 1000,
    });
}

/**
 * Hook to fetch user's liked blogs with pagination
 */
export function useUserLikedBlogs(googleId?: string) {
    return useInfiniteQuery({
        queryKey: profileKeys.likedBlogs(googleId || ''),
        queryFn: ({ pageParam = 1 }) => {
            if (!googleId) throw new Error('No googleId provided');
            return fetchUserLikedBlogs(googleId, pageParam, 10);
        },
        getNextPageParam: (lastPage: PaginatedLikedBlogs) =>
            lastPage.pagination.has_more ? lastPage.pagination.page + 1 : undefined,
        initialPageParam: 1,
        enabled: !!googleId,
        staleTime: 30 * 1000,
    });
}
