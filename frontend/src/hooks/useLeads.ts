/**
 * React Query hooks for Leads
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import leadsService, { LeadFilters } from '@/services/leadsService';
import type { ApiLead, ApiLeadListResponse } from '@/types/api';

// Query keys
export const leadsKeys = {
    all: ['leads'] as const,
    lists: () => [...leadsKeys.all, 'list'] as const,
    list: (filters: LeadFilters) => [...leadsKeys.lists(), filters] as const,
    details: () => [...leadsKeys.all, 'detail'] as const,
    detail: (id: string) => [...leadsKeys.details(), id] as const,
    statusHistory: (id: string) => [...leadsKeys.detail(id), 'history'] as const,
};

/**
 * Hook to fetch paginated leads with filters
 */
export function useLeads(filters: LeadFilters = {}) {
    return useQuery({
        queryKey: leadsKeys.list(filters),
        queryFn: () => leadsService.getLeads(filters),
        staleTime: 30000, // 30 seconds
    });
}

/**
 * Hook to fetch a single lead
 */
export function useLead(leadId: string, enabled = true) {
    return useQuery({
        queryKey: leadsKeys.detail(leadId),
        queryFn: () => leadsService.getLead(leadId),
        enabled: enabled && !!leadId,
    });
}

/**
 * Hook to fetch lead status history
 */
export function useLeadStatusHistory(leadId: string, enabled = true) {
    return useQuery({
        queryKey: leadsKeys.statusHistory(leadId),
        queryFn: () => leadsService.getStatusHistory(leadId),
        enabled: enabled && !!leadId,
    });
}

/**
 * Hook to update lead status
 */
export function useUpdateLeadStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            leadId,
            status,
            options,
        }: {
            leadId: string;
            status: string;
            options?: { userId?: number; notes?: string; triggerAutoResponder?: boolean };
        }) => leadsService.updateLeadStatus(leadId, status, options),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: leadsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: leadsKeys.detail(variables.leadId) });
            queryClient.invalidateQueries({ queryKey: leadsKeys.statusHistory(variables.leadId) });
        },
    });
}

/**
 * Hook to assign a lead
 */
export function useAssignLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            leadId,
            ownerId,
            notes,
            userId,
        }: {
            leadId: string;
            ownerId: number;
            notes?: string;
            userId?: number;
        }) => leadsService.assignLead(leadId, ownerId, notes, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: leadsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: leadsKeys.detail(variables.leadId) });
        },
    });
}

/**
 * Hook to delete a lead
 */
export function useDeleteLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (leadId: string) => leadsService.deleteLead(leadId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: leadsKeys.lists() });
        },
    });
}

/**
 * Hook to trigger review request
 */
export function useTriggerReviewRequest() {
    return useMutation({
        mutationFn: ({ leadId, templateId }: { leadId: string; templateId?: number }) =>
            leadsService.triggerReviewRequest(leadId, templateId),
    });
}
