import { useState } from 'react';
import { STATUS_CONFIG, SOURCE_CONFIG } from '@/types/crm';
import type { ApiLead } from '@/types/api';
import { useLeads } from '@/hooks/useLeads';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Phone, MessageCircle, MoreVertical, Filter, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LeadDetailPanel } from './LeadDetailPanel';
import { Input } from '@/components/ui/input';

// Map API lead source to frontend config key
const mapLeadSource = (source: string): keyof typeof SOURCE_CONFIG => {
  const validSources: (keyof typeof SOURCE_CONFIG)[] = ['meta', 'google', 'manual', 'upload'];
  return validSources.includes(source as keyof typeof SOURCE_CONFIG)
    ? source as keyof typeof SOURCE_CONFIG
    : 'manual';
};

// Map API status to frontend config key
const mapLeadStatus = (status: string): keyof typeof STATUS_CONFIG => {
  const statusMap: Record<string, keyof typeof STATUS_CONFIG> = {
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
  return statusMap[status.toLowerCase()] || 'new';
};

export function LeadTable() {
  const [selectedLead, setSelectedLead] = useState<ApiLead | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch all leads from backend API (no pagination)
  const { data, isLoading, isError, error, refetch } = useLeads({
    page: 1,
    per_page: 10000,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    lead_source: sourceFilter !== 'all' ? sourceFilter : undefined,
    search: searchQuery || undefined,
  });

  const leads = data?.leads || [];
  const totalLeads = data?.total || 0;

  const openWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(`Hi ${name}, `);
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h3 className="text-lg font-semibold">Failed to load leads</h3>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Could not connect to the backend. Please ensure the server is running.'}
          </p>
          <Button onClick={() => refetch()} variant="outline" className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Main Table */}
      <div className={cn('flex-1 overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all duration-300', selectedLead && 'lg:flex-[2]')}>
        {/* Filters */}
        <div className="flex items-center gap-3 border-b border-border p-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {Object.entries(SOURCE_CONFIG).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <span>{totalLeads} leads</span>
            <Button variant="ghost" size="icon-sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto" style={{ maxHeight: 'calc(100% - 65px)' }}>
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg text-muted-foreground">No leads found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {statusFilter !== 'all' || sourceFilter !== 'all' || searchQuery
                  ? 'Try adjusting your filters'
                  : 'Leads will appear here when captured from Meta or added manually'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-secondary/50 backdrop-blur-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Lead
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    City
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {leads.map((lead, index) => {
                  const statusKey = mapLeadStatus(lead.status);
                  const sourceKey = mapLeadSource(lead.lead_source);

                  return (
                    <tr
                      key={lead.id}
                      className={cn(
                        'animate-fade-in cursor-pointer transition-colors hover:bg-secondary/30',
                        selectedLead?.id === lead.id && 'bg-primary/5'
                      )}
                      style={{ animationDelay: `${index * 30}ms` }}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-xs font-semibold text-primary">
                              {(lead.full_name || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{lead.full_name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{lead.email || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">{lead.phone_number || '-'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'status-badge text-primary-foreground',
                            STATUS_CONFIG[statusKey]?.color || 'bg-gray-500'
                          )}
                        >
                          {STATUS_CONFIG[statusKey]?.label || lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className={cn('h-2 w-2 rounded-full', SOURCE_CONFIG[sourceKey]?.color || 'bg-gray-500')} />
                          <span className="text-sm text-muted-foreground">{SOURCE_CONFIG[sourceKey]?.label || lead.lead_source}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">{lead.city || '-'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                          {lead.created_at ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }) : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {lead.phone_number && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => {
                                  window.location.href = `tel:${lead.phone_number}`;
                                }}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="whatsapp"
                                size="icon-sm"
                                onClick={() => {
                                  openWhatsApp(lead.phone_number!, lead.full_name || 'there');
                                }}
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                              <DropdownMenuItem>Change Status</DropdownMenuItem>
                              <DropdownMenuItem>Reassign</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedLead && (
        <LeadDetailPanel lead={selectedLead as any} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  );
}
