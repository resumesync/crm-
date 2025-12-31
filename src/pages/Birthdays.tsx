import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockLeads } from '@/data/mockData';
import { format, isSameMonth, isSameDay, addDays } from 'date-fns';
import { Gift, Send, Calendar, Cake } from 'lucide-react';
import { toast } from 'sonner';

export default function Birthdays() {
  const today = new Date();
  
  const leadsWithBirthdays = mockLeads.filter(l => l.birthday);
  
  const todayBirthdays = leadsWithBirthdays.filter(l => 
    l.birthday && isSameDay(
      new Date(today.getFullYear(), l.birthday.getMonth(), l.birthday.getDate()),
      today
    )
  );

  const upcomingBirthdays = leadsWithBirthdays.filter(l => {
    if (!l.birthday) return false;
    const thisYearBday = new Date(today.getFullYear(), l.birthday.getMonth(), l.birthday.getDate());
    const diff = thisYearBday.getTime() - today.getTime();
    return diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000;
  });

  const thisMonthBirthdays = leadsWithBirthdays.filter(l =>
    l.birthday && isSameMonth(l.birthday, today)
  );

  const sendBirthdayWish = (lead: typeof mockLeads[0]) => {
    const message = `Dear ${lead.name.split(' ')[0]}, wishing you a very Happy Birthday! 🎂🎉\n\nMay this special day bring you joy, health, and happiness. Thank you for being a valued member of our ${lead.clinicName} family.\n\nWith warm wishes,\nAbhivrudhi Agency`;
    window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    toast.success('Birthday wish sent!');
  };

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
                      <p className="font-semibold text-foreground">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.clinicName}</p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="mt-4 w-full bg-accent hover:bg-accent/90"
                    onClick={() => sendBirthdayWish(lead)}
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
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.clinicName}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    📅 {lead.birthday && format(new Date(today.getFullYear(), lead.birthday.getMonth(), lead.birthday.getDate()), 'EEEE, MMMM d')}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => sendBirthdayWish(lead)}
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
            All Birthdays in {format(today, 'MMMM')}
          </h3>
          {thisMonthBirthdays.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
              <Gift className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-3 text-muted-foreground">No birthdays this month</p>
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
                        {lead.birthday?.getDate()}
                      </span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium text-foreground">{lead.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{lead.clinicName}</p>
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
