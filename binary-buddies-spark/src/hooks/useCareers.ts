/**
 * useCareers Hook
 * React Query hook for fetching career listings
 */

import { useQuery } from '@tanstack/react-query';
import { fetchCareers, fetchCareer, type FetchCareersOptions } from '../services/api';
import type { ApiCareer } from '../types/api';

// Query keys
export const careerKeys = {
    all: ['careers'] as const,
    lists: () => [...careerKeys.all, 'list'] as const,
    list: (filters?: FetchCareersOptions) => [...careerKeys.lists(), filters] as const,
    details: () => [...careerKeys.all, 'detail'] as const,
    detail: (id: number) => [...careerKeys.details(), id] as const,
};

// Hook to fetch all careers (with optional filters)
export function useCareers(options?: FetchCareersOptions) {
    return useQuery<ApiCareer[], Error>({
        queryKey: careerKeys.list(options),
        queryFn: () => fetchCareers(options),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

// Hook to fetch careers by department
export function useCareersByDepartment(department: string) {
    return useCareers({ department });
}

// Hook to fetch a single career listing
export function useCareer(id: number) {
    return useQuery<ApiCareer, Error>({
        queryKey: careerKeys.detail(id),
        queryFn: () => fetchCareer(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}
