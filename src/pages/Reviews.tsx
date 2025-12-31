import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, ExternalLink, Send, Settings } from 'lucide-react';
import { mockLeads } from '@/data/mockData';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Reviews() {
  const [gmbLink, setGmbLink] = useState('https://g.page/r/your-clinic-review');
  
  const convertedLeads = mockLeads.filter(l => l.status === 'converted').slice(0, 6);

  const sendReviewRequest = (lead: typeof mockLeads[0]) => {
    const message = `Hi ${lead.name.split(' ')[0]}, thank you for visiting ${lead.clinicName}! 🙏\n\nYour feedback helps us serve patients better. Please share your experience here:\n${gmbLink}`;
    window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    toast.success('Review request sent!');
  };

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
                    <p className="font-medium text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.clinicName}</p>
                  </div>
                </div>
                
                <p className="mt-3 text-sm text-muted-foreground">
                  Converted on {format(lead.updatedAt, 'PP')}
                </p>

                <Button
                  variant="whatsapp"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => sendReviewRequest(lead)}
                >
                  <Send className="h-4 w-4" />
                  Send Review Request
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
