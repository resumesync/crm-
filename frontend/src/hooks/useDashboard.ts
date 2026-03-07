/**
 * React Query hooks for Dashboard data
 */
import { useQuery } from '@tanstack/react-query';
import dashboardService, {
    DashboardStats,
    LeadsBySourceResponse,
    LeadsByStatusResponse,
    RecentLeadsResponse,
    LeadsTrendResponse,
} from '@/services/dashboardService';

// Query keys
export const dashboardKeys = {
    all: ['dashboard'] as const,
    stats: () => [...dashboardKeys.all, 'stats'] as const,
    leadsBySource: () => [...dashboardKeys.all, 'leads-by-source'] as const,
    leadsByStatus: () => [...dashboardKeys.all, 'leads-by-status'] as const,
    recentLeads: (limit: number) => [...dashboardKeys.all, 'recent-leads', limit] as const,
    trend: (days: number) => [...dashboardKeys.all, 'trend', days] as const,
};

/**
 * Hook to fetch overall dashboard statistics
 */
export function useDashboardStats() {
    return useQuery<DashboardStats>({
        queryKey: dashboardKeys.stats(),
        queryFn: () => dashboardService.getStats(),
        staleTime: 60000, // 1 minute
        refetchInterval: 60000, // Auto-refresh every minute
        retry: 1, // Only retry once on failure
        retryDelay: 1000,
    });
}

/**
 * Hook to fetch leads grouped by source
 */
export function useDashboardLeadsBySource() {
    return useQuery<LeadsBySourceResponse>({
        queryKey: dashboardKeys.leadsBySource(),
        queryFn: () => dashboardService.getLeadsBySource(),
        staleTime: 60000,
    });
}

/**
 * Hook to fetch leads grouped by status
 */
export function useDashboardLeadsByStatus() {
    return useQuery<LeadsByStatusResponse>({
        queryKey: dashboardKeys.leadsByStatus(),
        queryFn: () => dashboardService.getLeadsByStatus(),
        staleTime: 60000,
    });
}

/**
 * Hook to fetch recent leads
 */
export function useDashboardRecentLeads(limit: number = 5) {
    return useQuery<RecentLeadsResponse>({
        queryKey: dashboardKeys.recentLeads(limit),
        queryFn: () => dashboardService.getRecentLeads(limit),
        staleTime: 30000, // 30 seconds for recent data
        retry: 1,
        retryDelay: 1000,
    });
}

/**
 * Hook to fetch leads trend data
 */
export function useDashboardTrend(days: number = 7) {
    return useQuery<LeadsTrendResponse>({
        queryKey: dashboardKeys.trend(days),
        queryFn: () => dashboardService.getLeadsTrend(days),
        staleTime: 60000,
    });
}
