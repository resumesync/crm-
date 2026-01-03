/**
 * Dashboard Service - API calls for dashboard statistics
 */
import api from '@/lib/api';

// Types matching backend schemas
export interface DashboardStats {
    total_leads: number;
    leads_today: number;
    leads_this_week: number;
    leads_this_month: number;
    leads_change_percent: number | null;
}

export interface LeadsBySourceItem {
    source: string;
    count: number;
    percentage: number;
}

export interface LeadsBySourceResponse {
    total: number;
    sources: LeadsBySourceItem[];
}

export interface LeadsByStatusItem {
    status_id: number;
    status_name: string;
    count: number;
    color: string;
    percentage: number;
}

export interface LeadsByStatusResponse {
    total: number;
    statuses: LeadsByStatusItem[];
}

export interface RecentLeadItem {
    id: number;
    lead_id: string;
    full_name: string | null;
    email: string | null;
    phone_number: string | null;
    status: string;
    lead_source: string | null;
    created_at: string;
}

export interface RecentLeadsResponse {
    leads: RecentLeadItem[];
}

export interface LeadTrendItem {
    date: string;
    count: number;
}

export interface LeadsTrendResponse {
    period_days: number;
    data: LeadTrendItem[];
}

export const dashboardService = {
    /**
     * Get overall dashboard statistics
     */
    getStats: (): Promise<DashboardStats> => {
        return api.get<DashboardStats>('/dashboard/stats');
    },

    /**
     * Get leads count grouped by source
     */
    getLeadsBySource: (): Promise<LeadsBySourceResponse> => {
        return api.get<LeadsBySourceResponse>('/dashboard/leads-by-source');
    },

    /**
     * Get leads count grouped by status
     */
    getLeadsByStatus: (): Promise<LeadsByStatusResponse> => {
        return api.get<LeadsByStatusResponse>('/dashboard/leads-by-status');
    },

    /**
     * Get recent leads for quick overview
     */
    getRecentLeads: (limit: number = 10): Promise<RecentLeadsResponse> => {
        return api.get<RecentLeadsResponse>('/dashboard/recent-leads', { limit });
    },

    /**
     * Get daily lead counts for trend chart
     */
    getLeadsTrend: (days: number = 7): Promise<LeadsTrendResponse> => {
        return api.get<LeadsTrendResponse>('/dashboard/leads-trend', { days });
    },
};

export default dashboardService;
