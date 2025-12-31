import { mockLeads } from '@/data/mockData';
import { STATUS_CONFIG, SOURCE_CONFIG } from '@/types/crm';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function RecentLeads() {
  const recentLeads = [...mockLeads]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

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
        {recentLeads.map((lead, index) => (
          <div
            key={lead.id}
            className="animate-slide-up flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3 transition-all duration-200 hover:bg-secondary/50"
            style={{ animationDelay: `${500 + index * 80}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-semibold text-primary">
                  {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">{lead.name}</p>
                <p className="text-xs text-muted-foreground">{lead.clinicName} • {lead.city}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'status-badge text-primary-foreground',
                  STATUS_CONFIG[lead.status].color
                )}
              >
                {STATUS_CONFIG[lead.status].label}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(lead.createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
