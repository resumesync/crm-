import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Users,
    MessageCircle,
    Megaphone,
    Star,
    TrendingUp,
    Calendar,
    ArrowUpRight,
    Clock,
    Phone,
    CheckCircle2,
    Plus,
    X,
    Globe,
    Facebook,
    Instagram,
    Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useDashboardStats, useDashboardRecentLeads } from '@/hooks/useDashboard';
import { useFollowups, useCreateFollowup, useCompleteFollowup, useDeleteFollowup } from '@/hooks/useFollowups';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

interface DashboardStats {
    total_leads: number;
    today_leads: number;
    status_distribution: Record<string, number>;
    source_distribution: Record<string, number>;
    recent_leads: Array<{
        id: number;
        name: string;
        phone: string;
        status: string;
        source: string;
        created_at: string;
    }>;
}

export default function Dashboard() {
    const { user } = useAuth();
    const [realStats, setRealStats] = useState<DashboardStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [followups, setFollowups] = useState<any[]>([]);
    const [isAddFollowupOpen, setIsAddFollowupOpen] = useState(false);
    const [newFollowup, setNewFollowup] = useState({
        leadName: '',
        phone: '',
        time: '',
        type: 'Call',
        notes: '',
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await apiFetch('/api/dashboard/stats');
                setRealStats(data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setIsLoadingStats(false);
            }
        };

        const fetchFollowups = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const data = await apiFetch('/api/leads?per_page=1000');
                const mapped = data.leads
                    .filter((l: any) => {
                        const fDate = l.followup_date ? l.followup_date.split('T')[0] : l.created_at.split('T')[0];
                        return fDate === today && l.status !== 'converted';
                    })
                    .map((l: any) => ({
                        id: l.id.toString(),
                        leadName: l.full_name || 'Unknown',
                        phone: l.phone_number || '',
                        time: l.followup_date ? l.followup_date.split('T')[1].substring(0, 5) : l.created_at.split('T')[1].substring(0, 5),
                        type: l.followup_type || (l.status?.toLowerCase() === 'meeting_booked' ? 'Meeting' : 'Call'),
                        notes: l.notes && l.notes.length > 0 ? l.notes[0].content : '',
                        status: 'pending'
                    }));
                setFollowups(mapped);
            } catch (error) {
                console.error('Error fetching dashboard followups:', error);
            }
        };

        fetchStats();
        fetchFollowups();
    }, []);

    const markAsCompleted = async (id: string) => {
        try {
            await apiFetch(`/api/leads/by-id/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'converted' })
            });
            setFollowups(prev => prev.filter(f => f.id !== id));
            toast.success('Follow-up marked as completed!');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const removeFollowup = async (id: string) => {
        try {
            await apiFetch(`/api/leads/by-id/${id}`, { method: 'DELETE' });
            setFollowups(prev => prev.filter(f => f.id !== id));
            toast.success('Follow-up removed');
        } catch (error) {
            toast.error('Failed to remove followup');
        }
    };

    const addFollowup = async () => {
        if (!newFollowup.leadName || !newFollowup.phone || !newFollowup.time) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await apiFetch('/api/import/manual', {
                method: 'POST',
                body: JSON.stringify({
                    full_name: newFollowup.leadName,
                    phone_number: newFollowup.phone,
                    notes: newFollowup.notes,
                    status: 'followup_required',
                    followup_date: `${today}T${newFollowup.time}:00`,
                    followup_type: newFollowup.type
                })
            });

            const followup = {
                id: response.id.toString(),
                leadName: newFollowup.leadName,
                phone: newFollowup.phone,
                time: newFollowup.time,
                type: newFollowup.type,
                notes: newFollowup.notes,
                status: 'pending'
            };

            setFollowups(prev => [...prev, followup]);
            setNewFollowup({ leadName: '', phone: '', date: '', time: '', type: 'Call', notes: '' });
            setIsAddFollowupOpen(false);
            toast.success('Follow-up scheduled successfully!');
        } catch (error) {
            toast.error('Failed to schedule follow-up');
        }
    };

    // Extract data from hooks
    const { data: statsData, isLoading: statsLoading } = useDashboardStats();
    const { data: recentLeadsData, isLoading: recentLeadsLoading } = useDashboardRecentLeads();
    const { data: campaignsData, isLoading: campaignsLoading } = useCampaigns();

    const pendingFollowups = followups.filter(f => f.status === 'pending');
    const completedFollowups = followups.filter(f => f.status === 'completed');

    const totalLeads = statsData?.total_leads || 0;
    const leadsChangePercent = statsData?.leads_change_percent;
    const recentLeads = recentLeadsData?.leads || [];
    const activeCampaigns = campaignsData?.campaigns?.filter(c =>
        c.status === 'in_progress' || c.status === 'scheduled'
    ).length || 0;

    const isLoading = statsLoading || campaignsLoading;

    // Format change percentage for display
    const formatChange = (percent: number | null | undefined): string => {
        if (percent === null || percent === undefined) return '-';
        const sign = percent >= 0 ? '+' : '';
        return `${sign}${percent}%`;
    };

    const stats = [
        {
            name: 'Total Leads',
            value: isLoading ? '-' : totalLeads.toLocaleString(),
            change: formatChange(leadsChangePercent),
            changePositive: leadsChangePercent === null ? true : leadsChangePercent >= 0,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            name: 'Leads This Month',
            value: isLoading ? '-' : (statsData?.leads_this_month || 0).toLocaleString(),
            change: formatChange(leadsChangePercent),
            changePositive: leadsChangePercent === null ? true : leadsChangePercent >= 0,
            icon: MessageCircle,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        },
        {
            name: 'Active Campaigns',
            value: isLoading ? '-' : String(activeCampaigns),
            change: '-',
            changePositive: true,
            icon: Megaphone,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            name: 'Leads Today',
            value: isLoading ? '-' : (statsData?.leads_today || 0).toLocaleString(),
            change: '-',
            changePositive: true,
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
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Users className="h-5 w-5 text-blue-500" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold">{realStats?.total_leads || 0}</p>
                            <p className="text-sm text-muted-foreground">Total Leads</p>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold">{realStats?.today_leads || 0}</p>
                            <p className="text-sm text-muted-foreground">Today's Leads</p>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <Globe className="h-5 w-5 text-purple-500" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold">{realStats?.source_distribution?.['google'] || 0}</p>
                            <p className="text-sm text-muted-foreground">Google Ads/Sheets</p>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg bg-pink-500/10">
                                <Facebook className="h-5 w-5 text-pink-500" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold">{realStats?.source_distribution?.['meta'] || 0}</p>
                            <p className="text-sm text-muted-foreground">Meta (FB/IG)</p>
                        </div>
                    </Card>
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

                    {user?.role === 'admin' && (
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
                    )}

                    {user?.role === 'admin' && (
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
                    )}
                </div>

                {/* Recent Leads */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Recent Leads</h3>
                        <Link to="/leads">
                            <Button variant="ghost" size="sm">View All</Button>
                        </Link>
                    </div>
                    {recentLeadsLoading ? (
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
                            {realStats?.recent_leads.length === 0 ? (
                                <p className="text-center py-4 text-muted-foreground">No leads found</p>
                            ) : (
                                realStats?.recent_leads.map((lead, index) => (
                                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-medium text-primary">
                                                    {lead.name?.split(' ').map(n => n[0]).join('') || 'L'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{lead.name || 'Anonymous'}</p>
                                                <p className="text-sm text-muted-foreground font-mono">{lead.phone}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                                lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {lead.status}
                                            </span>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {lead.source === 'google' ? 'Google' : 'Meta'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </Card>

                {/* Follow-ups Section */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">Today's Follow-ups</h3>
                            <Badge variant="secondary" className="ml-2">{pendingFollowups.length} pending</Badge>
                        </div>
                        <Button size="sm" onClick={() => setIsAddFollowupOpen(true)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                        </Button>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {pendingFollowups.length === 0 && completedFollowups.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>No follow-ups scheduled for today</p>
                                <Button variant="outline" className="mt-4" onClick={() => setIsAddFollowupOpen(true)}>
                                    Schedule Follow-up
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Pending Follow-ups */}
                                {pendingFollowups.map((followup) => (
                                    <div key={followup.id} className="flex items-start justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${followup.type === 'Call' ? 'bg-blue-500/10' :
                                                followup.type === 'WhatsApp' ? 'bg-green-500/10' :
                                                    'bg-purple-500/10'
                                                }`}>
                                                {followup.type === 'Call' ? (
                                                    <Phone className="h-4 w-4 text-blue-500" />
                                                ) : followup.type === 'WhatsApp' ? (
                                                    <MessageCircle className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Users className="h-4 w-4 text-purple-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{followup.lead_name}</p>
                                                <p className="text-sm text-muted-foreground">{followup.phone}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{followup.notes}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex items-center gap-1 text-sm">
                                                <Clock className="h-3 w-3" />
                                                <span className="font-medium">{followup.scheduled_time}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => markAsCompleted(followup.id)}
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => removeFollowup(followup.id)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Completed Follow-ups */}
                                {completedFollowups.length > 0 && (
                                    <>
                                        <div className="flex items-center gap-2 pt-2">
                                            <div className="flex-1 h-px bg-border"></div>
                                            <span className="text-xs text-muted-foreground">Completed</span>
                                            <div className="flex-1 h-px bg-border"></div>
                                        </div>
                                        {completedFollowups.map((followup) => (
                                            <div key={followup.id} className="flex items-start justify-between p-3 rounded-lg border border-border bg-muted/30 opacity-60">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 rounded-lg bg-green-500/10">
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium line-through">{followup.lead_name}</p>
                                                        <p className="text-sm text-muted-foreground">{followup.phone || '-'}</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm text-muted-foreground">{followup.scheduled_time}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </Card>
            </div>

            {/* Add Follow-up Dialog */}
            <Dialog open={isAddFollowupOpen} onOpenChange={setIsAddFollowupOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Schedule Follow-up</DialogTitle>
                        <DialogDescription>
                            Add a new follow-up reminder for a lead.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="leadName">Lead Name *</Label>
                            <Input
                                id="leadName"
                                placeholder="e.g., Priya Sharma"
                                value={newFollowup.leadName}
                                onChange={(e) => setNewFollowup(prev => ({ ...prev, leadName: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                                id="phone"
                                placeholder="+91 98765 43210"
                                value={newFollowup.phone}
                                onChange={(e) => setNewFollowup(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="time">Time *</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={newFollowup.time}
                                    onChange={(e) => setNewFollowup(prev => ({ ...prev, time: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={newFollowup.type} onValueChange={(v) => setNewFollowup(prev => ({ ...prev, type: v }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Call">📞 Call</SelectItem>
                                        <SelectItem value="WhatsApp">💬 WhatsApp</SelectItem>
                                        <SelectItem value="Meeting">👥 Meeting</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                placeholder="Add any notes about this follow-up..."
                                value={newFollowup.notes}
                                onChange={(e) => setNewFollowup(prev => ({ ...prev, notes: e.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddFollowupOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={addFollowup}>
                            Schedule Follow-up
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </Layout >
    );
}
