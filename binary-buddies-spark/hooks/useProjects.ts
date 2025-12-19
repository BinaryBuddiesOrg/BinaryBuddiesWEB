/**
 * useProjects Hook
 * React Query hook for fetching featured projects
 */

import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchProject } from '../services/api';
import type { ApiFeaturedProject } from '../types/api';

// Query keys
export const projectKeys = {
    all: ['projects'] as const,
    lists: () => [...projectKeys.all, 'list'] as const,
    list: () => [...projectKeys.lists()] as const,
    details: () => [...projectKeys.all, 'detail'] as const,
    detail: (id: number) => [...projectKeys.details(), id] as const,
};

// Hook to fetch all projects
export function useProjects() {
    return useQuery<ApiFeaturedProject[], Error>({
        queryKey: projectKeys.list(),
        queryFn: fetchProjects,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    });
}

// Hook to fetch a single project
export function useProject(id: number) {
    return useQuery<ApiFeaturedProject, Error>({
        queryKey: projectKeys.detail(id),
        queryFn: () => fetchProject(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}
