import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, ExternalLink, Send, Settings, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

interface ConvertedLead {
  id: number;
  lead_id: string;
  full_name: string | null;
  phone_number: string | null;
  clinic_name: string | null;
  updated_at: string;
}

export default function Reviews() {
  const [gmbLink, setGmbLink] = useState('https://g.page/r/your-clinic-review');
  const [leads, setLeads] = useState<ConvertedLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinicData = async () => {
      try {
        const clinics = await apiFetch('/api/clinics');
        if (clinics && clinics.length > 0) {
          if (clinics[0].gmb_review_link) {
            setGmbLink(clinics[0].gmb_review_link);
          }
        }
      } catch (error) {
        console.error('Failed to load clinic data:', error);
      }
    };

    const fetchConverted = async () => {
      try {
        const data = await apiFetch('/api/leads?status=converted&per_page=50');
        setLeads(data.leads || []);
      } catch (error) {
        console.error('Failed to load converted leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClinicData();
    fetchConverted();
  }, []);

  const handleSaveGmbLink = async () => {
    try {
      const clinics = await apiFetch('/api/clinics');
      if (clinics && clinics.length > 0) {
        await apiFetch(`/api/clinics/${clinics[0].id}`, {
          method: 'PUT',
          body: JSON.stringify({
            ...clinics[0],
            gmb_review_link: gmbLink
          })
        });
        toast.success('GMB review link saved successfully');
      } else {
        toast.error('No clinic found to update');
      }
    } catch (error) {
      toast.error('Failed to save GMB link');
    }
  };

  const sendReviewRequest = (lead: ConvertedLead) => {
    const name = (lead.full_name || 'there').split(' ')[0];
    const clinic = lead.clinic_name || 'our clinic';
    const message = `Hi ${name}, thank you for visiting ${clinic}! 🙏\n\nYour feedback helps us serve patients better. Please share your experience here:\n${gmbLink}`;
    const phone = (lead.phone_number || '').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
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
                <Button variant="default" onClick={handleSaveGmbLink}>
                  <Settings className="h-4 w-4" />
                  Save Link
                </Button>
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
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : leads.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-3 text-muted-foreground">No converted leads yet. Convert leads first to send review requests.</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {leads.map((lead, index) => (
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
                      <p className="font-medium text-foreground">{lead.full_name || 'Anonymous'}</p>
                      <p className="text-xs text-muted-foreground">{lead.clinic_name || '-'}</p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">
                    Converted on {format(new Date(lead.updated_at), 'PP')}
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
          )}
        </div>
      </div>
    </Layout>
  );
}
