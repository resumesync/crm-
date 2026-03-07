/**
 * Statuses Service - API calls for lead status pipeline management
 */
import api from '@/lib/api';
import type { ApiLeadStatus } from '@/types/api';

export interface StatusCreate {
    name: string;
    display_order?: number;
    color?: string;
    is_default?: boolean;
}

export const statusesService = {
    /**
     * Get all statuses
     */
    getStatuses: (includeInactive?: boolean): Promise<ApiLeadStatus[]> => {
        return api.get<ApiLeadStatus[]>('/statuses', { include_inactive: includeInactive });
    },

    /**
     * Get a specific status
     */
    getStatus: (id: number): Promise<ApiLeadStatus> => {
        return api.get<ApiLeadStatus>(`/statuses/${id}`);
    },

    /**
     * Create a new status
     */
    createStatus: (data: StatusCreate): Promise<ApiLeadStatus> => {
        return api.post<ApiLeadStatus>('/statuses', data);
    },

    /**
     * Update a status
     */
    updateStatus: (id: number, data: Partial<StatusCreate & { is_active?: boolean }>): Promise<ApiLeadStatus> => {
        return api.put<ApiLeadStatus>(`/statuses/${id}`, data);
    },

    /**
     * Delete a status
     */
    deleteStatus: (id: number): Promise<{ status: string; status_id: number }> => {
        return api.delete(`/statuses/${id}`);
    },
};

export default statusesService;
