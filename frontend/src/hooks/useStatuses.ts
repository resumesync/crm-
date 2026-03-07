/**
 * React Query hooks for Statuses
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import statusesService, { StatusCreate } from '@/services/statusesService';

// Query keys
export const statusesKeys = {
    all: ['statuses'] as const,
    list: () => [...statusesKeys.all, 'list'] as const,
};

/**
 * Hook to fetch all statuses
 */
export function useStatuses(includeInactive = false) {
    return useQuery({
        queryKey: statusesKeys.list(),
        queryFn: () => statusesService.getStatuses(includeInactive),
        staleTime: 60000, // 1 minute
    });
}

/**
 * Hook to create a status
 */
export function useCreateStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: StatusCreate) => statusesService.createStatus(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: statusesKeys.list() });
        },
    });
}
