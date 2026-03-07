/**
 * React Query hooks for Followups
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import followupsService, { FollowupFilters, FollowupCreate, FollowupUpdate } from '@/services/followupsService';

// Query keys
export const followupsKeys = {
    all: ['followups'] as const,
    lists: () => [...followupsKeys.all, 'list'] as const,
    list: (filters: FollowupFilters) => [...followupsKeys.lists(), filters] as const,
    details: () => [...followupsKeys.all, 'detail'] as const,
    detail: (id: number) => [...followupsKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated followups with filters
 */
export function useFollowups(filters: FollowupFilters = {}) {
    return useQuery({
        queryKey: followupsKeys.list(filters),
        queryFn: () => followupsService.getFollowups(filters),
        staleTime: 30000, // 30 seconds
    });
}

/**
 * Hook to fetch a single followup
 */
export function useFollowup(id: number | null) {
    return useQuery({
        queryKey: followupsKeys.detail(id!),
        queryFn: () => followupsService.getFollowup(id!),
        enabled: !!id,
    });
}

/**
 * Hook to create a followup
 */
export function useCreateFollowup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FollowupCreate) => followupsService.createFollowup(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: followupsKeys.lists() });
        },
    });
}

/**
 * Hook to update a followup
 */
export function useUpdateFollowup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: FollowupUpdate }) =>
            followupsService.updateFollowup(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: followupsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: followupsKeys.detail(variables.id) });
        },
    });
}

/**
 * Hook to mark followup as completed
 */
export function useCompleteFollowup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => followupsService.completeFollowup(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: followupsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: followupsKeys.detail(id) });
        },
    });
}

/**
 * Hook to delete a followup
 */
export function useDeleteFollowup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => followupsService.deleteFollowup(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: followupsKeys.lists() });
        },
    });
}
