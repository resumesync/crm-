import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { mockCampaigns } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Image, Video, Type, Calendar, Send, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const campaignTypeIcons = {
  image: Image,
  video: Video,
  text: Type,
};

const statusColors = {
  draft: 'bg-muted text-muted-foreground',
  scheduled: 'bg-status-meeting/20 text-status-meeting',
  sent: 'bg-status-converted/20 text-status-converted',
  failed: 'bg-destructive/20 text-destructive',
};

export default function Campaigns() {
  return (
    <Layout>
      <Header title="Campaigns" subtitle="Manage WhatsApp bulk campaigns" />
      
      <div className="p-6">
        {/* Create Campaign Button */}
        <div className="mb-6 flex justify-end">
          <Button onClick={() => toast({ title: "Create Campaign", description: "Campaign creation form coming soon!" })}>
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
          {mockCampaigns.map((campaign, index) => {
            const TypeIcon = campaignTypeIcons[campaign.type];
            const totalRecipients = campaign.sentCount + campaign.failedCount;
            const successRate = totalRecipients > 0 
              ? Math.round((campaign.sentCount / totalRecipients) * 100) 
              : 0;

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
                        <TypeIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{campaign.type} campaign</p>
                      </div>
                    </div>
                    <Badge className={cn('text-xs', statusColors[campaign.status])}>
                      {campaign.status}
                    </Badge>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  {/* Stats */}
                  {campaign.status === 'sent' && (
                    <div className="mb-4">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Success Rate</span>
                        <span className="font-medium text-foreground">{successRate}%</span>
                      </div>
                      <Progress value={successRate} className="h-2" />
                      <div className="mt-2 flex gap-4 text-xs">
                        <span className="text-status-converted">✓ {campaign.sentCount} sent</span>
                        <span className="text-destructive">✗ {campaign.failedCount} failed</span>
                      </div>
                    </div>
                  )}

                  {/* Target Info */}
                  <div className="space-y-2 text-sm">
                    {campaign.targetFilters.groups && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {campaign.targetFilters.groups.length} service groups
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {format(campaign.createdAt, 'PPP')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    {campaign.status === 'draft' && (
                      <Button size="sm" className="flex-1" onClick={() => toast({ title: "Sending Campaign", description: `"${campaign.name}" is being sent to recipients.` })}>
                        <Send className="h-4 w-4" />
                        Send Now
                      </Button>
                    )}
                    {campaign.status === 'scheduled' && (
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => toast({ title: "Edit Schedule", description: `Editing schedule for "${campaign.name}".` })}>
                        Edit Schedule
                      </Button>
                    )}
                    {campaign.status === 'sent' && (
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => toast({ title: "Campaign Report", description: `Viewing report for "${campaign.name}".` })}>
                        View Report
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Empty State / Create New */}
          <Card 
            className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center border-dashed bg-secondary/20 p-6 transition-all hover:border-primary hover:bg-secondary/30"
            onClick={() => toast({ title: "Create Campaign", description: "Campaign creation form coming soon!" })}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <p className="mt-3 font-medium text-foreground">Create New Campaign</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Send bulk WhatsApp messages
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
