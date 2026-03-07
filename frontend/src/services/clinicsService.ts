/**
 * Clinics Service - API calls for clinic/branch management
 */
import api from '@/lib/api';
import type { ApiClinic } from '@/types/api';

export interface ClinicCreate {
    name: string;
    branch_name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
    email?: string;
    google_maps_link?: string;
    gmb_review_link?: string;
    timing?: string;
}

export const clinicsService = {
    /**
     * Get all clinics
     */
    getClinics: (includeInactive?: boolean): Promise<ApiClinic[]> => {
        return api.get<ApiClinic[]>('/clinics', { include_inactive: includeInactive });
    },

    /**
     * Get a specific clinic
     */
    getClinic: (id: number): Promise<ApiClinic> => {
        return api.get<ApiClinic>(`/clinics/${id}`);
    },

    /**
     * Create a new clinic
     */
    createClinic: (data: ClinicCreate): Promise<ApiClinic> => {
        return api.post<ApiClinic>('/clinics', data);
    },

    /**
     * Update a clinic
     */
    updateClinic: (id: number, data: Partial<ClinicCreate & { is_active?: boolean }>): Promise<ApiClinic> => {
        return api.put<ApiClinic>(`/clinics/${id}`, data);
    },

    /**
     * Delete a clinic
     */
    deleteClinic: (id: number): Promise<{ status: string; clinic_id: number }> => {
        return api.delete(`/clinics/${id}`);
    },
};

export default clinicsService;
