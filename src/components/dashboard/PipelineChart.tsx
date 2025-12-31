import { STATUS_CONFIG, LeadStatus } from '@/types/crm';
import { useLeads } from '@/hooks/useLeads';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const statusOrder: LeadStatus[] = [
  'new',
  'contacted',
  'meeting_booked',
  'proposal_sent',
  'followup_required',
  'converted',
];

// Map API status to frontend status key
const mapStatus = (apiStatus: string): LeadStatus => {
  const statusMap: Record<string, LeadStatus> = {
    'new': 'new',
    'new lead': 'new',
    'contacted': 'contacted',
    'meeting booked': 'meeting_booked',
    'meeting_booked': 'meeting_booked',
    'proposal sent': 'proposal_sent',
    'proposal_sent': 'proposal_sent',
    'follow-up required': 'followup_required',
    'followup_required': 'followup_required',
    'converted': 'converted',
  };
  return statusMap[apiStatus.toLowerCase()] || 'new';
};

export function PipelineChart() {
  const { data, isLoading } = useLeads({ page: 1, per_page: 1000 });
  const leads = data?.leads || [];

  const statusCounts = statusOrder.map((status) => ({
    status,
    count: leads.filter((l) => mapStatus(l.status) === status).length,
    ...STATUS_CONFIG[status],
  }));

  const maxCount = Math.max(...statusCounts.map((s) => s.count), 1);

  if (isLoading) {
    return (
      <div className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-soft" style={{ animationDelay: '300ms' }}>
        <h3 className="text-lg font-semibold text-foreground">Pipeline Overview</h3>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-soft" style={{ animationDelay: '300ms' }}>
      <h3 className="text-lg font-semibold text-foreground">Pipeline Overview</h3>
      <p className="text-sm text-muted-foreground">Lead distribution by status</p>

      <div className="mt-6 space-y-4">
        {statusCounts.map(({ status, count, label, color }, index) => (
          <div key={status} className="animate-slide-up" style={{ animationDelay: `${400 + index * 50}ms` }}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{label}</span>
              <span className="text-sm font-semibold text-foreground">{count}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn('h-full rounded-full transition-all duration-700 ease-out', color)}
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
