/**
 * React Query hooks for WhatsApp Templates
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import whatsappService from '@/services/whatsappService';
import type { ApiWhatsAppTemplateCreate } from '@/types/api';

// Query keys
export const templatesKeys = {
    all: ['templates'] as const,
    list: (type?: string) => [...templatesKeys.all, 'list', type] as const,
    quick: (groupId?: number) => [...templatesKeys.all, 'quick', groupId] as const,
    detail: (id: number) => [...templatesKeys.all, id] as const,
};

/**
 * Hook to fetch all templates
 */
export function useTemplates(options?: { template_type?: string; group_id?: number }) {
    return useQuery({
        queryKey: templatesKeys.list(options?.template_type),
        queryFn: () => whatsappService.getTemplates(options),
        staleTime: 60000,
    });
}

/**
 * Hook to fetch quick message templates
 */
export function useQuickTemplates(groupId?: number) {
    return useQuery({
        queryKey: templatesKeys.quick(groupId),
        queryFn: () => whatsappService.getQuickTemplates(groupId),
        staleTime: 60000,
    });
}

/**
 * Hook to create a template
 */
export function useCreateTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ApiWhatsAppTemplateCreate) => whatsappService.createTemplate(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: templatesKeys.all });
        },
    });
}

/**
 * Hook to update a template
 */
export function useUpdateTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<ApiWhatsAppTemplateCreate & { is_active?: boolean }> }) =>
            whatsappService.updateTemplate(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: templatesKeys.all });
            queryClient.invalidateQueries({ queryKey: templatesKeys.detail(variables.id) });
        },
    });
}

/**
 * Hook to delete a template
 */
export function useDeleteTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => whatsappService.deleteTemplate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: templatesKeys.all });
        },
    });
}
