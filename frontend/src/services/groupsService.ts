/**
 * Groups Service - API calls for lead group management
 */
import api from '@/lib/api';
import type { ApiLeadGroup } from '@/types/api';

export interface GroupCreate {
    name: string;
    description?: string;
    is_custom?: boolean;
}

export const groupsService = {
    /**
     * Get all lead groups
     */
    getGroups: (includeInactive?: boolean): Promise<ApiLeadGroup[]> => {
        return api.get<ApiLeadGroup[]>('/groups', { include_inactive: includeInactive });
    },

    /**
     * Get a specific group
     */
    getGroup: (id: number): Promise<ApiLeadGroup> => {
        return api.get<ApiLeadGroup>(`/groups/${id}`);
    },

    /**
     * Create a new group
     */
    createGroup: (data: GroupCreate): Promise<ApiLeadGroup> => {
        return api.post<ApiLeadGroup>('/groups', data);
    },

    /**
     * Update a group
     */
    updateGroup: (id: number, data: Partial<GroupCreate & { is_active?: boolean }>): Promise<ApiLeadGroup> => {
        return api.put<ApiLeadGroup>(`/groups/${id}`, data);
    },

    /**
     * Delete a group
     */
    deleteGroup: (id: number): Promise<{ status: string; group_id: number }> => {
        return api.delete(`/groups/${id}`);
    },
};

export default groupsService;
