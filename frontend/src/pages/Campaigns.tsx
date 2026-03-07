import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Image, Video, Type, Calendar, Send, Users, Loader2, MessageSquare, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiFetch } from '@/lib/api';

interface BackendCampaign {
  id: number;
  name: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  status: string;
  filter_group_id: number | null;
  filter_status: string | null;
  sent_count: number;
  failed_count: number;
  total_recipients: number;
  created_at: string;
  scheduled_at: string | null;
}

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  scheduled: 'bg-status-meeting/20 text-status-meeting',
  sent: 'bg-status-converted/20 text-status-converted',
  completed: 'bg-status-converted/20 text-status-converted',
  failed: 'bg-destructive/20 text-destructive',
  cancelled: 'bg-muted text-muted-foreground',
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<BackendCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [scheduleType, setScheduleType] = useState('now');
  const [groups, setGroups] = useState<any[]>([]);
  const [leadStatuses, setLeadStatuses] = useState<any[]>([]);
  const [filterGroupId, setFilterGroupId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchCampaigns = async () => {
    try {
      const data = await apiFetch('/api/campaigns');
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();

    // Fetch filter data
    const fetchFilters = async () => {
      try {
        const groupsData = await apiFetch('/api/groups');
        setGroups(groupsData || []);

        const statusesData = await apiFetch('/api/leads/statuses');
        setLeadStatuses(statusesData || []);
      } catch (error) {
        console.error('Failed to load filter data:', error);
      }
    };
    fetchFilters();
  }, []);

  const handleCreateCampaign = async () => {
    if (!campaignName.trim()) {
      toast({ title: "Error", description: "Please enter a campaign name.", variant: "destructive" });
      return;
    }
    if (!campaignMessage.trim()) {
      toast({ title: "Error", description: "Please enter a campaign message.", variant: "destructive" });
      return;
    }

    try {
      await apiFetch('/api/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          name: campaignName,
          content: campaignMessage,
          media_type: 'text',
          filter_group_id: filterGroupId === 'all' ? null : parseInt(filterGroupId),
          filter_status: filterStatus === 'all' ? null : filterStatus
        }),
      });

      toast({
        title: "Campaign Created!",
        description: `"${campaignName}" has been created successfully.`
      });

      setCampaignName('');
      setCampaignMessage('');
      setScheduleType('now');
      setIsCreateDialogOpen(false);
      fetchCampaigns();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create campaign", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <Layout>
        <Header title="Campaigns" subtitle="Manage WhatsApp bulk campaigns" />
        <div className="flex items-center justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="Campaigns" subtitle="Manage WhatsApp bulk campaigns" />

      <div className="p-6">
        {/* Create Campaign Button */}
        <div className="mb-6 flex justify-end">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        {/* Safety Notice */}
        <Card className="mb-6 border-status-meeting/30 bg-status-meeting/5 p-4">
          <h4 className="font-medium text-foreground">⚠️ Campaign Safety Rules</h4>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>• Daily send limit applies to prevent spam flagging</li>
            <li>• Opt-out requests are tracked and respected</li>
            <li>• All campaigns are logged for compliance</li>
          </ul>
        </Card>

        {/* Campaigns Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign, index) => {
            const totalRecipients = campaign.sent_count + campaign.failed_count;
            const successRate = totalRecipients > 0 ? Math.round((campaign.sent_count / totalRecipients) * 100) : 0;

            return (
              <Card
                key={campaign.id}
                className="animate-fade-in overflow-hidden transition-all duration-200 hover:shadow-medium"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Header */}
                <div className="border-b border-border bg-secondary/30 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Type className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{campaign.media_type || 'text'} campaign</p>
                      </div>
                    </div>
                    <Badge className={cn('text-xs', statusColors[campaign.status] || 'bg-muted text-muted-foreground')}>
                      {campaign.status}
                    </Badge>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  {(campaign.status === 'sent' || campaign.status === 'completed') && totalRecipients > 0 && (
                    <div className="mb-4">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Success Rate</span>
                        <span className="font-medium text-foreground">{successRate}%</span>
                      </div>
                      <Progress value={successRate} className="h-2" />
                      <div className="mt-2 flex gap-4 text-xs">
                        <span className="text-status-converted">✓ {campaign.sent_count} sent</span>
                        <span className="text-destructive">✗ {campaign.failed_count} failed</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {format(new Date(campaign.created_at), 'PPP')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {campaign.status === 'draft' && (
                      <Button size="sm" className="flex-1" onClick={async () => {
                        try {
                          await apiFetch(`/api/campaigns/${campaign.id}/execute`, { method: 'POST' });
                          toast({ title: "Sending Campaign", description: `"${campaign.name}" is being sent.` });
                          fetchCampaigns();
                        } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
                      }}>
                        <Send className="h-4 w-4" />
                        Send Now
                      </Button>
                    )}
                    {campaign.status === 'sent' || campaign.status === 'completed' ? (
                      <Button size="sm" variant="outline" className="flex-1">View Report</Button>
                    ) : null}
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Empty State / Create New */}
          <Card
            className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center border-dashed bg-secondary/20 p-6 transition-all hover:border-primary hover:bg-secondary/30"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <p className="mt-3 font-medium text-foreground">Create New Campaign</p>
            <p className="mt-1 text-sm text-muted-foreground">Send bulk WhatsApp messages</p>
          </Card>
        </div>
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Create New Campaign
            </DialogTitle>
            <DialogDescription>
              Set up a new WhatsApp bulk messaging campaign.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name *</Label>
              <Input id="campaign-name" placeholder="e.g., Summer Sale Announcement" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-message">Message *</Label>
              <Textarea id="campaign-message" placeholder="Enter your campaign message here..." className="min-h-[100px]" value={campaignMessage} onChange={(e) => setCampaignMessage(e.target.value)} />
              <p className="text-xs text-muted-foreground">{campaignMessage.length}/1000 characters</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Filter by Group</Label>
                <Select value={filterGroupId} onValueChange={setFilterGroupId}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Groups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    {groups.map(g => (
                      <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Filter by Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {leadStatuses.map(s => (
                      <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Schedule</Label>
              <div className="flex gap-2">
                <Button type="button" variant={scheduleType === 'now' ? 'default' : 'outline'} className="flex-1" onClick={() => setScheduleType('now')}>
                  <Send className="mr-2 h-4 w-4" /> Send Now
                </Button>
                <Button type="button" variant={scheduleType === 'later' ? 'default' : 'outline'} className="flex-1" onClick={() => setScheduleType('later')}>
                  <Clock className="mr-2 h-4 w-4" /> Schedule Later
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCampaign}>
              {scheduleType === 'now' ? (<><Send className="mr-2 h-4 w-4" /> Create & Send</>) : (<><Clock className="mr-2 h-4 w-4" /> Schedule Campaign</>)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
