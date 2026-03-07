import { useState, useEffect } from 'react';
import { STATUS_CONFIG, SOURCE_CONFIG, SERVICE_CONFIG } from '@/types/crm';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Phone, MessageCircle, MoreVertical, Filter, Loader2 } from 'lucide-react';
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
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

// Backend lead shape
interface BackendLead {
  id: number;
  lead_id: string;
  full_name: string | null;
  phone_number: string | null;
  email: string | null;
  status: string;
  lead_source: string | null;
  service_interested: string | null;
  clinic_name: string | null;
  city: string | null;
  assigned_owner_id: number | null;
  created_at: string;
  updated_at: string;
  platform: string;
  birthday: string | null;
}

// Map backend lead to frontend-compatible shape
function mapLead(b: BackendLead) {
  return {
    id: String(b.id),
    metaLeadId: b.lead_id,
    name: b.full_name || 'Anonymous',
    phone: b.phone_number || '',
    email: b.email || '',
    service: (b.service_interested || 'custom') as any,
    clinicName: b.clinic_name || '',
    city: b.city || '',
    source: (b.lead_source || 'manual') as any,
    status: (b.status || 'new') as any,
    assignedTo: b.assigned_owner_id ? String(b.assigned_owner_id) : '',
    createdAt: new Date(b.created_at),
    updatedAt: new Date(b.updated_at),
    notes: [],
    birthday: b.birthday ? new Date(b.birthday) : undefined,
  };
}

export function LeadTable() {
  const [leads, setLeads] = useState<ReturnType<typeof mapLead>[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<ReturnType<typeof mapLead> | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ per_page: '10000' });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (sourceFilter !== 'all') params.set('lead_source', sourceFilter);

      const data = await apiFetch(`/api/leads?${params.toString()}`);
      setLeads((data.leads || []).map(mapLead));
    } catch (error: any) {
      console.error('Failed to load leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, sourceFilter]);

  const handleDeleteLead = async (leadId: string) => {
    try {
      await apiFetch(`/api/leads/by-id/${leadId}`, { method: 'DELETE' });
      toast.success('Lead deleted');
      fetchLeads();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(`Hi ${name}, `);
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <div className="ml-auto text-sm text-muted-foreground">
            {leads.length} leads
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto" style={{ maxHeight: 'calc(100% - 65px)' }}>
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <p className="text-lg font-medium">No leads found</p>
              <p className="text-sm">Leads will appear here when added via the CRM or webhooks</p>
            </div>
          ) : (
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="sticky top-0 z-20 bg-background/95 border-b border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md min-w-[220px]">Lead</th>
                  <th className="sticky top-0 z-20 bg-background/95 border-b border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md min-w-[150px]">Service</th>
                  <th className="sticky top-0 z-20 bg-background/95 border-b border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md min-w-[120px]">Status</th>
                  <th className="sticky top-0 z-20 bg-background/95 border-b border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md min-w-[120px]">Source</th>
                  <th className="sticky top-0 z-20 bg-background/95 border-b border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md min-w-[120px]">City</th>
                  <th className="sticky top-0 z-20 bg-background/95 border-b border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md min-w-[120px]">Created</th>
                  <th className="sticky top-0 z-20 bg-background/95 border-b border-border px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {leads.map((lead, index) => (
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
                            {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">
                        {SERVICE_CONFIG[lead.service as keyof typeof SERVICE_CONFIG]?.label || lead.service}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'status-badge text-primary-foreground',
                        STATUS_CONFIG[lead.status]?.color || 'bg-gray-500'
                      )}>
                        {STATUS_CONFIG[lead.status]?.label || lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className={cn('h-2 w-2 rounded-full', SOURCE_CONFIG[lead.source]?.color || 'bg-gray-400')} />
                        <span className="text-sm text-muted-foreground">{SOURCE_CONFIG[lead.source]?.label || lead.source}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">{lead.city || '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(lead.createdAt, { addSuffix: true })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon-sm" onClick={() => { window.location.href = `tel:${lead.phone}`; }}>
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="whatsapp" size="icon-sm" onClick={() => { openWhatsApp(lead.phone, lead.name); }}>
                          <MessageCircle className="h-4 w-4" />
                        </Button>
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
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteLead(lead.id)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
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
