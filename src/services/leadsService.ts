/**
 * Leads Service - API calls for lead management
 */
import api from '@/lib/api';
import type {
    ApiLead,
    ApiLeadListResponse,
    ApiLeadStatusUpdate,
    ApiLeadAssignment,
    ApiStatusHistoryEntry,
} from '@/types/api';

export interface LeadFilters {
    page?: number;
    per_page?: number;
    status?: string;
    form_id?: string;
    page_id?: string;
    platform?: string;
    group_id?: number;
    owner_id?: number;
    lead_source?: string;
    city?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
}

export const leadsService = {
    /**
     * Get paginated list of leads with optional filters
     */
    getLeads: (filters: LeadFilters = {}): Promise<ApiLeadListResponse> => {
        return api.get<ApiLeadListResponse>('/leads', {
            page: filters.page || 1,
            per_page: filters.per_page || 20,
            status: filters.status,
            form_id: filters.form_id,
            page_id: filters.page_id,
            platform: filters.platform,
            group_id: filters.group_id,
            owner_id: filters.owner_id,
            lead_source: filters.lead_source,
            city: filters.city,
            search: filters.search,
            date_from: filters.date_from,
            date_to: filters.date_to,
        });
    },

    /**
     * Get a single lead by Meta lead ID
     */
    getLead: (leadId: string): Promise<ApiLead> => {
        return api.get<ApiLead>(`/leads/${leadId}`);
    },

    /**
     * Get a lead by internal database ID
     */
    getLeadById: (id: number): Promise<ApiLead> => {
        return api.get<ApiLead>(`/leads/by-id/${id}`);
    },

    /**
     * Update lead status with audit logging
     */
    updateLeadStatus: (
        leadId: string,
        status: string,
        options?: {
            userId?: number;
            notes?: string;
            triggerAutoResponder?: boolean;
        }
    ): Promise<ApiLead> => {
        const body: ApiLeadStatusUpdate = { status };
        return api.patch<ApiLead>(`/leads/${leadId}/status`, body, {
            user_id: options?.userId,
            notes: options?.notes,
            trigger_auto_responder: options?.triggerAutoResponder,
        });
    },

    /**
     * Get status change history for a lead
     */
    getStatusHistory: (leadId: string): Promise<ApiStatusHistoryEntry[]> => {
        return api.get<ApiStatusHistoryEntry[]>(`/leads/${leadId}/status-history`);
    },

    /**
     * Assign a lead to an owner
     */
    assignLead: (
        leadId: string,
        ownerId: number,
        notes?: string,
        userId?: number
    ): Promise<{ lead_id: string; old_owner_id: number | null; new_owner_id: number; assigned_by: number | null }> => {
        const body: ApiLeadAssignment = { owner_id: ownerId, notes };
        return api.post(`/leads/${leadId}/assign`, body, { user_id: userId });
    },

    /**
     * Trigger review request for a lead
     */
    triggerReviewRequest: (
        leadId: string,
        templateId?: number
    ): Promise<{ lead_id: string; phone_number: string; message: string; whatsapp_link: string }> => {
        return api.post(`/leads/${leadId}/review-request`, undefined, { template_id: templateId });
    },

    /**
     * Delete a lead
     */
    deleteLead: (leadId: string): Promise<{ status: string; lead_id: string }> => {
        return api.delete(`/leads/${leadId}`);
    },

    /**
     * Export leads as CSV/TSV by form
     */
    exportLeads: async (formId: string, fromDate?: number, toDate?: number): Promise<string> => {
        const params = new URLSearchParams({ form_id: formId });
        if (fromDate) params.append('from_date', String(fromDate));
        if (toDate) params.append('to_date', String(toDate));

        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/leads/export?${params}`
        );
        return response.text();
    },
};

export default leadsService;
