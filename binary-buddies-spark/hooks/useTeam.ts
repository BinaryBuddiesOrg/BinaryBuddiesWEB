/**
 * useTeam Hook
 * React Query hook for fetching team members
 */

import { useQuery } from '@tanstack/react-query';
import { fetchTeam, fetchTeamMember } from '../services/api';
import type { ApiTeamMember } from '../types/api';

// Query keys
export const teamKeys = {
    all: ['team'] as const,
    lists: () => [...teamKeys.all, 'list'] as const,
    list: () => [...teamKeys.lists()] as const,
    details: () => [...teamKeys.all, 'detail'] as const,
    detail: (id: number) => [...teamKeys.details(), id] as const,
};

// Hook to fetch all team members
export function useTeam() {
    return useQuery<ApiTeamMember[], Error>({
        queryKey: teamKeys.list(),
        queryFn: fetchTeam,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

// Hook to fetch a single team member
export function useTeamMember(id: number) {
    return useQuery<ApiTeamMember, Error>({
        queryKey: teamKeys.detail(id),
        queryFn: () => fetchTeamMember(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}
