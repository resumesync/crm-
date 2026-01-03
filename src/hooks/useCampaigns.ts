/**
 * React Query hooks for Campaigns
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import campaignsService, { CampaignFilters } from '@/services/campaignsService';
import type { ApiCampaignCreate } from '@/types/api';

// Query keys
export const campaignsKeys = {
    all: ['campaigns'] as const,
    lists: () => [...campaignsKeys.all, 'list'] as const,
    list: (filters: CampaignFilters) => [...campaignsKeys.lists(), filters] as const,
    details: () => [...campaignsKeys.all, 'detail'] as const,
    detail: (id: number) => [...campaignsKeys.details(), id] as const,
    stats: (id: number) => [...campaignsKeys.detail(id), 'stats'] as const,
    logs: (id: number) => [...campaignsKeys.detail(id), 'logs'] as const,
    recipients: (id: number) => [...campaignsKeys.detail(id), 'recipients'] as const,
    dailyLimit: () => [...campaignsKeys.all, 'daily-limit'] as const,
};

/**
 * Hook to fetch campaigns
 */
export function useCampaigns(filters: CampaignFilters = {}) {
    return useQuery({
        queryKey: campaignsKeys.list(filters),
        queryFn: () => campaignsService.getCampaigns(filters),
        staleTime: 30000,
        retry: 1,
        retryDelay: 1000,
    });
}

/**
 * Hook to fetch a single campaign
 */
export function useCampaign(id: number, enabled = true) {
    return useQuery({
        queryKey: campaignsKeys.detail(id),
        queryFn: () => campaignsService.getCampaign(id),
        enabled: enabled && !!id,
    });
}

/**
 * Hook to fetch campaign stats
 */
export function useCampaignStats(id: number, enabled = true) {
    return useQuery({
        queryKey: campaignsKeys.stats(id),
        queryFn: () => campaignsService.getCampaignStats(id),
        enabled: enabled && !!id,
    });
}

/**
 * Hook to fetch campaign recipients preview
 */
export function useCampaignRecipients(id: number, enabled = true) {
    return useQuery({
        queryKey: campaignsKeys.recipients(id),
        queryFn: () => campaignsService.getCampaignRecipients(id),
        enabled: enabled && !!id,
    });
}

/**
 * Hook to fetch daily limit
 */
export function useDailyLimit() {
    return useQuery({
        queryKey: campaignsKeys.dailyLimit(),
        queryFn: () => campaignsService.getDailyLimit(),
        staleTime: 60000, // 1 minute
    });
}

/**
 * Hook to create a campaign
 */
export function useCreateCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ApiCampaignCreate) => campaignsService.createCampaign(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: campaignsKeys.lists() });
        },
    });
}

/**
 * Hook to update a campaign
 */
export function useUpdateCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<ApiCampaignCreate> }) =>
            campaignsService.updateCampaign(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: campaignsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: campaignsKeys.detail(variables.id) });
        },
    });
}

/**
 * Hook to execute a campaign
 */
export function useExecuteCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => campaignsService.executeCampaign(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: campaignsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: campaignsKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: campaignsKeys.stats(id) });
            queryClient.invalidateQueries({ queryKey: campaignsKeys.dailyLimit() });
        },
    });
}

/**
 * Hook to cancel a campaign
 */
export function useCancelCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => campaignsService.cancelCampaign(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: campaignsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: campaignsKeys.detail(id) });
        },
    });
}

/**
 * Hook to delete a campaign
 */
export function useDeleteCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => campaignsService.deleteCampaign(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: campaignsKeys.lists() });
        },
    });
}
