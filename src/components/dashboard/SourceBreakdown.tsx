import { SOURCE_CONFIG, LeadSource } from '@/types/crm';
import { useLeads } from '@/hooks/useLeads';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function SourceBreakdown() {
  const { data, isLoading } = useLeads({ page: 1, per_page: 1000 });
  const leads = data?.leads || [];

  const sources: LeadSource[] = ['meta', 'google', 'manual', 'upload'];

  const sourceData = sources.map((source) => ({
    source,
    count: leads.filter((l) => l.lead_source === source).length,
    ...SOURCE_CONFIG[source],
  }));

  const total = Math.max(sourceData.reduce((sum, s) => sum + s.count, 0), 1);

  if (isLoading) {
    return (
      <div className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-soft" style={{ animationDelay: '350ms' }}>
        <h3 className="text-lg font-semibold text-foreground">Lead Sources</h3>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-soft" style={{ animationDelay: '350ms' }}>
      <h3 className="text-lg font-semibold text-foreground">Lead Sources</h3>
      <p className="text-sm text-muted-foreground">Where your leads come from</p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {sourceData.map(({ source, count, label, color }, index) => (
          <div
            key={source}
            className="animate-scale-in rounded-lg border border-border/50 bg-secondary/30 p-4 transition-all duration-200 hover:bg-secondary/50"
            style={{ animationDelay: `${450 + index * 80}ms` }}
          >
            <div className="flex items-center gap-2">
              <div className={cn('h-3 w-3 rounded-full', color)} />
              <span className="text-sm font-medium text-foreground">{label}</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{count}</span>
              <span className="text-xs text-muted-foreground">
                ({Math.round((count / total) * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
