import { STATUS_CONFIG, LeadStatus } from '@/types/crm';
import { useLeads } from '@/hooks/useLeads';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
    'not interested': 'not_interested',
    'not_interested': 'not_interested',
    'no response': 'no_response',
    'no_response': 'no_response',
  };
  return statusMap[apiStatus.toLowerCase()] || 'new';
};

export function RecentLeads() {
  const { data, isLoading } = useLeads({ page: 1, per_page: 5 });
  const leads = data?.leads || [];

  if (isLoading) {
    return (
      <div className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-soft" style={{ animationDelay: '400ms' }}>
        <h3 className="text-lg font-semibold text-foreground">Recent Leads</h3>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-soft" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Leads</h3>
          <p className="text-sm text-muted-foreground">Latest incoming leads</p>
        </div>
        <Link to="/leads">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {leads.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No leads yet</p>
        ) : (
          leads.map((lead, index) => {
            const statusKey = mapStatus(lead.status);
            return (
              <div
                key={lead.id}
                className="animate-slide-up flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3 transition-all duration-200 hover:bg-secondary/50"
                style={{ animationDelay: `${500 + index * 80}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-semibold text-primary">
                      {(lead.full_name || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{lead.full_name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.clinic_name || lead.service_interested || '-'} • {lead.city || '-'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'status-badge text-primary-foreground',
                      STATUS_CONFIG[statusKey]?.color || 'bg-gray-500'
                    )}
                  >
                    {STATUS_CONFIG[statusKey]?.label || lead.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {lead.created_at ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }) : '-'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
