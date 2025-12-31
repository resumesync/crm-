import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Megaphone, Star, TrendingUp, Calendar, ArrowUpRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLeads } from '@/hooks/useLeads';
import { useCampaigns } from '@/hooks/useCampaigns';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
    // Fetch leads data for stats and recent leads
    const { data: leadsData, isLoading: leadsLoading } = useLeads({ page: 1, per_page: 5 });
    const { data: campaignsData, isLoading: campaignsLoading } = useCampaigns({ limit: 50 });

    const totalLeads = leadsData?.total || 0;
    const recentLeads = leadsData?.leads || [];
    const activeCampaigns = campaignsData?.campaigns?.filter(c =>
        c.status === 'in_progress' || c.status === 'scheduled'
    ).length || 0;

    const isLoading = leadsLoading || campaignsLoading;

    const stats = [
        {
            name: 'Total Leads',
            value: isLoading ? '-' : totalLeads.toLocaleString(),
            change: '+12%',
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            name: 'Messages Sent',
            value: '-',
            change: '+8%',
            icon: MessageCircle,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        },
        {
            name: 'Active Campaigns',
            value: isLoading ? '-' : String(activeCampaigns),
            change: '+2',
            icon: Megaphone,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            name: 'Avg. Rating',
            value: '4.8',
            change: '+0.2',
            icon: Star,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10'
        },
    ];

    return (
        <Layout>
            <Header title="Dashboard" subtitle="Welcome back! Here's your overview." />

            <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <Card key={stat.name} className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                <span className="flex items-center text-sm text-green-600">
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    {stat.change}
                                </span>
                            </div>
                            <div className="mt-4">
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.name}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Link to="/leads">
                        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10">
                                        <Users className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Manage Leads</p>
                                        <p className="text-sm text-muted-foreground">View and manage all leads</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </div>
                        </Card>
                    </Link>

                    <Link to="/campaigns">
                        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-500/10">
                                        <Megaphone className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Create Campaign</p>
                                        <p className="text-sm text-muted-foreground">Send bulk WhatsApp messages</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </div>
                        </Card>
                    </Link>

                    <Link to="/integrations">
                        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-500/10">
                                        <MessageCircle className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">WhatsApp Setup</p>
                                        <p className="text-sm text-muted-foreground">Configure API integration</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </div>
                        </Card>
                    </Link>
                </div>

                {/* Recent Leads */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Recent Leads</h3>
                        <Link to="/leads">
                            <Button variant="ghost" size="sm">View All</Button>
                        </Link>
                    </div>
                    {leadsLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : recentLeads.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No leads yet</p>
                            <p className="text-sm mt-1">Leads will appear here when captured from Meta or added manually</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentLeads.map((lead) => (
                                <div key={lead.id} className="flex items-center justify-between py-3 border-b last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-medium text-primary">
                                                {(lead.full_name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{lead.full_name || 'Unknown'}</p>
                                            <p className="text-sm text-muted-foreground">{lead.service_interested || lead.lead_source}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${lead.status.toLowerCase() === 'new' || lead.status.toLowerCase() === 'new lead'
                                                ? 'bg-blue-100 text-blue-700'
                                                : lead.status.toLowerCase() === 'contacted'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : lead.status.toLowerCase() === 'converted'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {lead.status}
                                        </span>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {lead.created_at
                                                ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })
                                                : '-'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Upcoming */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Today's Follow-ups</h3>
                    </div>
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No follow-ups scheduled for today</p>
                        <Link to="/leads">
                            <Button variant="outline" className="mt-4">Schedule Follow-up</Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </Layout>
    );
}
