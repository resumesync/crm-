import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTodayBirthdays, useUpcomingBirthdays, sendBirthdayMessage } from '@/hooks/useBirthdays';
import { format } from 'date-fns';
import { Gift, Send, Calendar, Cake, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function Birthdays() {
  const today = new Date();

  // Fetch birthdays from dedicated API endpoints
  const {
    data: todayData,
    isLoading: todayLoading,
    isError: todayError,
    refetch: refetchToday
  } = useTodayBirthdays();

  const {
    data: upcomingData,
    isLoading: upcomingLoading,
    isError: upcomingError,
    refetch: refetchUpcoming
  } = useUpcomingBirthdays(30); // Get 30 days for this month calculation

  const todayBirthdays = todayData?.leads || [];
  const upcomingBirthdays = (upcomingData?.upcoming || []).filter(l => l.days_until && l.days_until <= 7);
  const thisMonthBirthdays = upcomingData?.upcoming || [];

  const isLoading = todayLoading || upcomingLoading;
  const isError = todayError || upcomingError;

  const refetch = () => {
    refetchToday();
    refetchUpcoming();
  };

  const sendBirthdayWish = async (lead: { id: number; full_name: string; phone_number: string; clinic_name?: string }) => {
    const name = lead.full_name?.split(' ')[0] || 'there';
    const clinicName = lead.clinic_name || 'our clinic';
    const phone = lead.phone_number?.replace(/[^0-9]/g, '') || '';

    if (!phone) {
      toast.error('No phone number available');
      return;
    }

    // Open WhatsApp link
    const message = `Dear ${name}, wishing you a very Happy Birthday! 🎂🎉\n\nMay this special day bring you joy, health, and happiness. Thank you for being a valued member of our ${clinicName} family.\n\nWith warm wishes,\nAbhivrudhi Agency`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    toast.success('Birthday wish sent!');
  };

  if (isLoading) {
    return (
      <Layout>
        <Header title="Birthdays" subtitle="Send personalized birthday wishes to your clients" />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <Header title="Birthdays" subtitle="Send personalized birthday wishes to your clients" />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-muted-foreground">Failed to load birthdays</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="Birthdays" subtitle="Send personalized birthday wishes to your clients" />

      <div className="p-6">
        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Cake className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{todayBirthdays.length}</p>
                <p className="text-sm text-muted-foreground">Today's Birthdays</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-meeting/10">
                <Calendar className="h-5 w-5 text-status-meeting" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcomingBirthdays.length}</p>
                <p className="text-sm text-muted-foreground">Next 7 Days</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{thisMonthBirthdays.length}</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Today's Birthdays */}
        {todayBirthdays.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Cake className="h-5 w-5 text-accent" />
              Today's Birthdays
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {todayBirthdays.map((lead, index) => (
                <Card
                  key={lead.id}
                  className="animate-fade-in border-accent/30 bg-accent/5 p-4"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                      <span className="text-xl">🎂</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{lead.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{lead.clinic_name || '-'}</p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="mt-4 w-full bg-accent hover:bg-accent/90"
                    onClick={() => sendBirthdayWish(lead)}
                    disabled={!lead.phone_number}
                  >
                    <Send className="h-4 w-4" />
                    Send Birthday Wish
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Birthdays */}
        {upcomingBirthdays.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Upcoming (Next 7 Days)</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingBirthdays.map((lead, index) => (
                <Card
                  key={lead.id}
                  className="animate-fade-in p-4 transition-all hover:shadow-medium"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-meeting/10">
                      <Gift className="h-5 w-5 text-status-meeting" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{lead.full_name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{lead.clinic_name || '-'}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    📅 In {lead.days_until} day{lead.days_until !== 1 ? 's' : ''} - {lead.birthday}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => sendBirthdayWish(lead)}
                    disabled={!lead.phone_number}
                  >
                    <Send className="h-4 w-4" />
                    Schedule Wish
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* This Month's Birthdays */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Upcoming Birthdays (Next 30 Days)
          </h3>
          {thisMonthBirthdays.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
              <Gift className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-3 text-muted-foreground">No upcoming birthdays</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {thisMonthBirthdays.map((lead, index) => (
                <Card
                  key={lead.id}
                  className="animate-fade-in p-4"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-medium text-primary">
                        {lead.days_until}d
                      </span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium text-foreground">{lead.full_name || 'Unknown'}</p>
                      <p className="truncate text-xs text-muted-foreground">{lead.birthday}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
