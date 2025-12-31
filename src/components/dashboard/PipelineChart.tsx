import { mockLeads } from '@/data/mockData';
import { STATUS_CONFIG, LeadStatus } from '@/types/crm';
import { cn } from '@/lib/utils';

const statusOrder: LeadStatus[] = [
  'new',
  'contacted',
  'meeting_booked',
  'proposal_sent',
  'followup_required',
  'converted',
];

export function PipelineChart() {
  const statusCounts = statusOrder.map((status) => ({
    status,
    count: mockLeads.filter((l) => l.status === status).length,
    ...STATUS_CONFIG[status],
  }));

  const maxCount = Math.max(...statusCounts.map((s) => s.count));

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
