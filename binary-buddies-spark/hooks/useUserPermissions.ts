/**
 * useUserPermissions Hook
 * React Query hook for fetching user permissions and creating blogs
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { fetchUserPermissions, createBlog } from '../services/api';
import type { CreateBlogRequest, UserPermissions, CreateBlogResponse } from '../types/api';

// Query keys
export const userPermissionKeys = {
    all: ['userPermissions'] as const,
    byUser: (googleId: string) => [...userPermissionKeys.all, googleId] as const,
};

// Hook to fetch user permissions
export function useUserPermissions() {
    const { data: session, status } = useSession();
    const googleId = (session?.user as { googleId?: string })?.googleId;

    return useQuery<UserPermissions | null, Error>({
        queryKey: userPermissionKeys.byUser(googleId || ''),
        queryFn: () => fetchUserPermissions(googleId!),
        enabled: status === 'authenticated' && !!googleId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

// Hook to check if user can author blogs
export function useCanAuthorBlogs(): boolean {
    const { data: permissions, isLoading } = useUserPermissions();

    if (isLoading) return false;
    return permissions?.can_author_blogs ?? false;
}

// Mutation hook to create a blog
export function useCreateBlog() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    return useMutation<CreateBlogResponse, Error, CreateBlogRequest>({
        mutationFn: async (request: CreateBlogRequest) => {
            const googleId = (session?.user as { googleId?: string })?.googleId;
            if (!googleId) {
                throw new Error('User not authenticated');
            }
            return createBlog(request, googleId);
        },
        onSuccess: () => {
            // Invalidate blogs cache to show the new blog
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
        },
    });
}
