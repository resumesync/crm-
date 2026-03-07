/**
 * Followups Service - API calls for follow-up management
 */
import api from '@/lib/api';

export interface Followup {
    id: number;
    lead_id?: number | null;
    lead_name: string;
    phone?: string | null;
    scheduled_date: string;  // YYYY-MM-DD
    scheduled_time: string;  // e.g., "10:00 AM"
    type: string;  // Call, WhatsApp, Meeting
    service?: string | null;
    notes?: string | null;
    status: string;  // pending, completed
    created_by?: number | null;
    created_at: string;
    updated_at: string;
    completed_at?: string | null;
}

export interface FollowupListResponse {
    total: number;
    page: number;
    per_page: number;
    followups: Followup[];
}

export interface FollowupCreate {
    lead_id?: number;
    lead_name: string;
    phone?: string;
    scheduled_date: string;
    scheduled_time: string;
    type: string;
    service?: string;
    notes?: string;
}

export interface FollowupUpdate {
    lead_name?: string;
    phone?: string;
    scheduled_date?: string;
    scheduled_time?: string;
    type?: string;
    service?: string;
    notes?: string;
    status?: string;
}

export interface FollowupFilters {
    page?: number;
    per_page?: number;
    status?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
}

export const followupsService = {
    /**
     * Get paginated list of follow-ups
     */
    getFollowups: (filters: FollowupFilters = {}): Promise<FollowupListResponse> => {
        return api.get<FollowupListResponse>('/followups', {
            page: filters.page || 1,
            per_page: filters.per_page || 100,
            status: filters.status,
            type: filters.type,
            date_from: filters.date_from,
            date_to: filters.date_to,
            search: filters.search,
        });
    },

    /**
     * Get a single follow-up
     */
    getFollowup: (id: number): Promise<Followup> => {
        return api.get<Followup>(`/followups/${id}`);
    },

    /**
     * Create a new follow-up
     */
    createFollowup: (data: FollowupCreate): Promise<Followup> => {
        return api.post<Followup>('/followups', data);
    },

    /**
     * Update a follow-up
     */
    updateFollowup: (id: number, data: FollowupUpdate): Promise<Followup> => {
        return api.put<Followup>(`/followups/${id}`, data);
    },

    /**
     * Mark a follow-up as completed
     */
    completeFollowup: (id: number): Promise<Followup> => {
        return api.patch<Followup>(`/followups/${id}/complete`);
    },

    /**
     * Delete a follow-up
     */
    deleteFollowup: (id: number): Promise<{ status: string; followup_id: number }> => {
        return api.delete(`/followups/${id}`);
    },
};

export default followupsService;
