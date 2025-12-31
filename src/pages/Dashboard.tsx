import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Users, MessageCircle, Megaphone, Star, TrendingUp, Calendar, ArrowUpRight, Loader2, Phone, Clock, CheckCircle2, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLeads } from '@/hooks/useLeads';
import { useCampaigns } from '@/hooks/useCampaigns';
import { formatDistanceToNow } from 'date-fns';

interface Followup {
    id: string;
    leadName: string;
    phone: string;
    time: string;
    type: string;
    notes: string;
    status: 'pending' | 'completed';
}

const initialFollowups: Followup[] = [
    { id: '1', leadName: 'Priya Sharma', phone: '+91 98765 43210', time: '10:00 AM', type: 'Call', notes: 'Discuss hair transplant options', status: 'pending' },
    { id: '2', leadName: 'Rahul Kumar', phone: '+91 87654 32109', time: '11:30 AM', type: 'WhatsApp', notes: 'Send treatment brochure', status: 'pending' },
    { id: '3', leadName: 'Meera Reddy', phone: '+91 76543 21098', time: '2:00 PM', type: 'Call', notes: 'Follow up on consultation', status: 'completed' },
    { id: '4', leadName: 'Arun Krishnan', phone: '+91 65432 10987', time: '4:30 PM', type: 'Meeting', notes: 'In-person consultation at clinic', status: 'pending' },
];

export default function Dashboard() {
    // Fetch leads data for stats and recent leads
    const { data: leadsData, isLoading: leadsLoading } = useLeads({ page: 1, per_page: 5 });
    const { data: campaignsData, isLoading: campaignsLoading } = useCampaigns({ limit: 50 });

    // Follow-ups state
    const [followups, setFollowups] = useState<Followup[]>(initialFollowups);
    const [isAddFollowupOpen, setIsAddFollowupOpen] = useState(false);
    const [newFollowup, setNewFollowup] = useState({
        leadName: '',
        phone: '',
        time: '',
        type: 'Call',
        notes: '',
    });

    // Derived state for pending and completed followups
    const pendingFollowups = followups.filter(f => f.status === 'pending');
    const completedFollowups = followups.filter(f => f.status === 'completed');

    // Handler functions
    const markAsCompleted = (id: string) => {
        setFollowups(prev =>
            prev.map(f => f.id === id ? { ...f, status: 'completed' as const } : f)
        );
    };

    const removeFollowup = (id: string) => {
        setFollowups(prev => prev.filter(f => f.id !== id));
    };

    const addFollowup = () => {
        if (!newFollowup.leadName || !newFollowup.phone || !newFollowup.time) return;

        const followup: Followup = {
            id: Date.now().toString(),
            leadName: newFollowup.leadName,
            phone: newFollowup.phone,
            time: newFollowup.time,
            type: newFollowup.type,
            notes: newFollowup.notes,
            status: 'pending',
        };

        setFollowups(prev => [...prev, followup]);
        setNewFollowup({ leadName: '', phone: '', time: '', type: 'Call', notes: '' });
        setIsAddFollowupOpen(false);
    };

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
                                                        <Phone className={`h-4 w-4 text-blue-500`} />
                                                    ) : followup.type === 'WhatsApp' ? (
                                                        <MessageCircle className={`h-4 w-4 text-green-500`} />
                                                    ) : (
                                                        <Users className={`h-4 w-4 text-purple-500`} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{followup.leadName}</p>
                                                    <p className="text-sm text-muted-foreground">{followup.phone}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{followup.notes}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Clock className="h-3 w-3" />
                                                    <span className="font-medium">{followup.time}</span>
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
                                                            <p className="font-medium line-through">{followup.leadName}</p>
                                                            <p className="text-sm text-muted-foreground">{followup.phone}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">{followup.time}</span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </Card>
                </div>

            {/* Add Follow-up Dialog */ }
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
            </Dialog>
        </Layout>
    );
}
