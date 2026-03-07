import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface OrganizationSettings {
    agency_name: string;
    contact_email: string;
    contact_phone: string;
    address: string;
    gmb_review_link: string;
    logo_url: string;
    whatsapp_number: string;
    timezone: string;
}

export function useOrganization() {
    return useQuery<OrganizationSettings>({
        queryKey: ['organization'],
        queryFn: async () => {
            return api.get<OrganizationSettings>('/organization');
        },
    });
}

export function useUpdateOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (settings: OrganizationSettings) => {
            return api.put<{ status: string; message: string; settings: OrganizationSettings }>('/organization', settings);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organization'] });
        },
    });
}
