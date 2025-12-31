import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, ExternalLink, Send, Settings, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Reviews() {
  const [gmbLink, setGmbLink] = useState('https://g.page/r/your-clinic-review');

  // Fetch converted leads from API
  const { data, isLoading, isError, refetch } = useLeads({
    status: 'converted',
    page: 1,
    per_page: 20
  });

  const convertedLeads = data?.leads || [];

  const sendReviewRequest = (lead: typeof convertedLeads[0]) => {
    const name = lead.full_name?.split(' ')[0] || 'there';
    const clinicName = lead.clinic_name || 'our clinic';
    const phone = lead.phone_number?.replace(/[^0-9]/g, '') || '';

    if (!phone) {
      toast.error('No phone number available');
      return;
    }

    const message = `Hi ${name}, thank you for visiting ${clinicName}! 🙏\n\nYour feedback helps us serve patients better. Please share your experience here:\n${gmbLink}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    toast.success('Review request sent!');
  };

  if (isLoading) {
    return (
      <Layout>
        <Header title="Reviews" subtitle="Collect Google My Business reviews from converted leads" />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <Header title="Reviews" subtitle="Collect Google My Business reviews from converted leads" />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-muted-foreground">Failed to load converted leads</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="Reviews" subtitle="Collect Google My Business reviews from converted leads" />

      <div className="p-6">
        {/* GMB Link Configuration */}
        <Card className="mb-6 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Google My Business Review Link</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure your GMB review link. This will be included in review request messages.
              </p>
              <div className="mt-4 flex gap-3">
                <Input
                  value={gmbLink}
                  onChange={(e) => setGmbLink(e.target.value)}
                  placeholder="https://g.page/r/your-clinic-review"
                  className="max-w-md"
                />
                <Button variant="outline" onClick={() => window.open(gmbLink, '_blank')}>
                  <ExternalLink className="h-4 w-4" />
                  Test Link
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Review Message Preview */}
        <Card className="mb-6 border-whatsapp/20 bg-whatsapp/5 p-6">
          <h4 className="font-medium text-foreground">📱 Review Request Message Preview</h4>
          <div className="mt-3 rounded-lg bg-card p-4 text-sm">
            <p className="whitespace-pre-wrap text-foreground">
              Hi <span className="font-medium text-primary">{'{{name}}'}</span>, thank you for visiting <span className="font-medium text-primary">{'{{clinic_name}}'}</span>! 🙏
              {'\n\n'}
              Your feedback helps us serve patients better. Please share your experience here:
              {'\n'}
              <span className="text-primary underline">{gmbLink}</span>
            </p>
          </div>
        </Card>

        {/* Converted Leads - Ready for Review */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">Converted Leads - Ready for Review</h3>

          {convertedLeads.length === 0 ? (
            <Card className="p-12 text-center">
              <Star className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-4 text-lg text-muted-foreground">No converted leads yet</p>
              <p className="text-sm text-muted-foreground">When leads are converted, they'll appear here for review requests</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {convertedLeads.map((lead, index) => (
                <Card
                  key={lead.id}
                  className="animate-fade-in p-4 transition-all hover:shadow-medium"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-converted/10">
                      <Star className="h-5 w-5 text-status-converted" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{lead.full_name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{lead.clinic_name || '-'}</p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">
                    Converted on {lead.updated_at ? format(new Date(lead.updated_at), 'PP') : '-'}
                  </p>

                  <Button
                    variant="whatsapp"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => sendReviewRequest(lead)}
                    disabled={!lead.phone_number}
                  >
                    <Send className="h-4 w-4" />
                    Send Review Request
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
