/**
 * Campaigns Service - API calls for WhatsApp campaign management
 */
import api from '@/lib/api';
import type {
    ApiCampaign,
    ApiCampaignListResponse,
    ApiCampaignCreate,
    ApiCampaignStats,
    ApiCampaignLog,
    ApiDailyLimit,
} from '@/types/api';

export interface CampaignFilters {
    status?: string;
    limit?: number;
    offset?: number;
}

export const campaignsService = {
    /**
     * Get all campaigns
     */
    getCampaigns: (filters: CampaignFilters = {}): Promise<ApiCampaignListResponse> => {
        return api.get<ApiCampaignListResponse>('/campaigns', {
            status: filters.status,
            limit: filters.limit || 50,
            offset: filters.offset || 0,
        });
    },

    /**
     * Get daily message limit status
     */
    getDailyLimit: (): Promise<ApiDailyLimit> => {
        return api.get<ApiDailyLimit>('/campaigns/daily-limit');
    },

    /**
     * Get a specific campaign by ID
     */
    getCampaign: (id: number): Promise<ApiCampaign> => {
        return api.get<ApiCampaign>(`/campaigns/${id}`);
    },

    /**
     * Get campaign statistics
     */
    getCampaignStats: (id: number): Promise<ApiCampaignStats> => {
        return api.get<ApiCampaignStats>(`/campaigns/${id}/stats`);
    },

    /**
     * Get campaign recipients preview
     */
    getCampaignRecipients: (id: number): Promise<{
        campaign_id: number;
        total_recipients: number;
        recipients: Array<{ lead_id: number; name: string; phone_number: string }>;
    }> => {
        return api.get(`/campaigns/${id}/recipients`);
    },

    /**
     * Get campaign logs
     */
    getCampaignLogs: (
        id: number,
        options?: { status?: string; limit?: number; offset?: number }
    ): Promise<{ total: number; logs: ApiCampaignLog[] }> => {
        return api.get(`/campaigns/${id}/logs`, {
            status: options?.status,
            limit: options?.limit || 100,
            offset: options?.offset || 0,
        });
    },

    /**
     * Create a new campaign
     */
    createCampaign: (data: ApiCampaignCreate): Promise<ApiCampaign> => {
        return api.post<ApiCampaign>('/campaigns', data);
    },

    /**
     * Update a campaign
     */
    updateCampaign: (id: number, data: Partial<ApiCampaignCreate>): Promise<ApiCampaign> => {
        return api.put<ApiCampaign>(`/campaigns/${id}`, data);
    },

    /**
     * Execute a campaign (generate WhatsApp links)
     */
    executeCampaign: (id: number): Promise<{
        campaign_id: number;
        status: string;
        total_recipients: number;
        sent_count: number;
        failed_count: number;
        whatsapp_links: Array<{ lead_id: number; phone_number: string; whatsapp_link: string }>;
    }> => {
        return api.post(`/campaigns/${id}/execute`);
    },

    /**
     * Cancel a campaign
     */
    cancelCampaign: (id: number): Promise<{ status: string; campaign_id: number }> => {
        return api.post(`/campaigns/${id}/cancel`);
    },

    /**
     * Delete a campaign
     */
    deleteCampaign: (id: number): Promise<{ status: string; campaign_id: number }> => {
        return api.delete(`/campaigns/${id}`);
    },
};

export default campaignsService;
