/**
 * useBlogs Hook
 * React Query hook for fetching blog posts
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchBlogs, fetchBlog, type FetchBlogsOptions, type PaginatedBlogResponse } from '../services/api';
import type { ApiBlogPost } from '../types/api';

// Query keys
export const blogKeys = {
    all: ['blogs'] as const,
    lists: () => [...blogKeys.all, 'list'] as const,
    list: (filters?: FetchBlogsOptions) => [...blogKeys.lists(), filters] as const,
    details: () => [...blogKeys.all, 'detail'] as const,
    detail: (id: number) => [...blogKeys.details(), id] as const,
};

// Hook to fetch all blogs (with optional filters) - supports both paginated and non-paginated
export function useBlogs(options?: FetchBlogsOptions) {
    return useQuery<ApiBlogPost[] | PaginatedBlogResponse, Error>({
        queryKey: blogKeys.list(options),
        queryFn: () => fetchBlogs(options),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

// Hook to fetch blogs with infinite scroll
export function useInfiniteBlogs(options?: Omit<FetchBlogsOptions, 'page'> & { limit?: number }) {
    const limit = options?.limit || 12; // Default 12 items per page
    
    return useInfiniteQuery<PaginatedBlogResponse, Error>({
        queryKey: [...blogKeys.list(options), 'infinite'],
        queryFn: (context) => {
            const pageParam = (context.pageParam as number) ?? 1;
            return fetchBlogs({ ...options, page: pageParam, limit }) as Promise<PaginatedBlogResponse>;
        },
        getNextPageParam: (lastPage: PaginatedBlogResponse) => {
            return lastPage.pagination.has_more ? lastPage.pagination.page + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
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
