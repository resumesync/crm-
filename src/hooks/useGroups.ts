/**
 * React Query hooks for Groups
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import groupsService, { GroupCreate } from '@/services/groupsService';

// Query keys
export const groupsKeys = {
    all: ['groups'] as const,
    list: () => [...groupsKeys.all, 'list'] as const,
    detail: (id: number) => [...groupsKeys.all, id] as const,
};

/**
 * Hook to fetch all groups
 */
export function useGroups(includeInactive = false) {
    return useQuery({
        queryKey: groupsKeys.list(),
        queryFn: () => groupsService.getGroups(includeInactive),
        staleTime: 60000, // 1 minute
    });
}

/**
 * Hook to create a group
 */
export function useCreateGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: GroupCreate) => groupsService.createGroup(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: groupsKeys.list() });
        },
    });
}

/**
 * Hook to update a group
 */
export function useUpdateGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<GroupCreate & { is_active?: boolean }> }) =>
            groupsService.updateGroup(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: groupsKeys.list() });
            queryClient.invalidateQueries({ queryKey: groupsKeys.detail(variables.id) });
        },
    });
}
