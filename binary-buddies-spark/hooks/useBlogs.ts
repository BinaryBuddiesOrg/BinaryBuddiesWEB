/**
 * useBlogs Hook
 * React Query hook for fetching blog posts
 */

import { useQuery } from '@tanstack/react-query';
import { fetchBlogs, fetchBlog, type FetchBlogsOptions } from '../services/api';
import type { ApiBlogPost } from '../types/api';

// Query keys
export const blogKeys = {
    all: ['blogs'] as const,
    lists: () => [...blogKeys.all, 'list'] as const,
    list: (filters?: FetchBlogsOptions) => [...blogKeys.lists(), filters] as const,
    details: () => [...blogKeys.all, 'detail'] as const,
    detail: (id: number) => [...blogKeys.details(), id] as const,
};

// Hook to fetch all blogs (with optional filters)
export function useBlogs(options?: FetchBlogsOptions) {
    return useQuery<ApiBlogPost[], Error>({
        queryKey: blogKeys.list(options),
        queryFn: () => fetchBlogs(options),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

// Hook to fetch featured blogs
export function useFeaturedBlogs() {
    return useBlogs({ featured: true });
}

// Hook to fetch blogs by category
export function useBlogsByCategory(category: string) {
    return useBlogs({ category });
}

// Hook to fetch a single blog post
export function useBlog(id: number) {
    return useQuery<ApiBlogPost, Error>({
        queryKey: blogKeys.detail(id),
        queryFn: () => fetchBlog(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}
