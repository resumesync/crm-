import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Phone, MessageCircle, Users, CheckCircle2, Plus, X, Search, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const initialFollowups = [
    { id: '1', leadName: 'Priya Sharma', phone: '+91 98765 43210', date: '2024-12-31', time: '10:00 AM', type: 'Call', notes: 'Discuss hair transplant options and pricing', status: 'pending', service: 'Hair Transplant' },
    { id: '2', leadName: 'Rahul Kumar', phone: '+91 87654 32109', date: '2024-12-31', time: '11:30 AM', type: 'WhatsApp', notes: 'Send treatment brochure and before/after photos', status: 'pending', service: 'Skin Treatment' },
    { id: '3', leadName: 'Meera Reddy', phone: '+91 76543 21098', date: '2024-12-31', time: '2:00 PM', type: 'Call', notes: 'Follow up on consultation', status: 'completed', service: 'Chemical Peel' },
    { id: '4', leadName: 'Arun Krishnan', phone: '+91 65432 10987', date: '2024-12-31', time: '4:30 PM', type: 'Meeting', notes: 'In-person consultation at clinic', status: 'pending', service: 'Acne Treatment' },
    { id: '5', leadName: 'Sneha Patel', phone: '+91 54321 09876', date: '2025-01-01', time: '9:00 AM', type: 'Call', notes: 'New year discount offer discussion', status: 'pending', service: 'Skin Brightening' },
    { id: '6', leadName: 'Vikram Das', phone: '+91 43210 98765', date: '2025-01-01', time: '3:00 PM', type: 'WhatsApp', notes: 'Send appointment confirmation', status: 'pending', service: 'Hair Transplant' },
    { id: '7', leadName: 'Anita Joshi', phone: '+91 32109 87654', date: '2024-12-30', time: '5:00 PM', type: 'Call', notes: 'Final pricing discussion', status: 'completed', service: 'IVF Consultation' },
];

export default function Followups() {
    const [followups, setFollowups] = useState(initialFollowups);
    const [isAddFollowupOpen, setIsAddFollowupOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [newFollowup, setNewFollowup] = useState({
        leadName: '',
        phone: '',
        date: '',
        time: '',
        type: 'Call',
        notes: '',
        service: ''
    });

    const markAsCompleted = (id: string) => {
        setFollowups(prev => prev.map(f =>
            f.id === id ? { ...f, status: 'completed' } : f
        ));
        toast.success('Follow-up marked as completed!');
    };

    const removeFollowup = (id: string) => {
        setFollowups(prev => prev.filter(f => f.id !== id));
        toast.success('Follow-up removed');
    };

    const addFollowup = () => {
        if (!newFollowup.leadName || !newFollowup.phone || !newFollowup.time || !newFollowup.date) {
            toast.error('Please fill in required fields');
            return;
        }

        const followup = {
            id: Date.now().toString(),
            leadName: newFollowup.leadName,
            phone: newFollowup.phone,
            date: newFollowup.date,
            time: newFollowup.time,
            type: newFollowup.type,
            notes: newFollowup.notes,
            service: newFollowup.service,
            status: 'pending'
        };

        setFollowups(prev => [...prev, followup]);
        setNewFollowup({ leadName: '', phone: '', date: '', time: '', type: 'Call', notes: '', service: '' });
        setIsAddFollowupOpen(false);
        toast.success('Follow-up scheduled successfully!');
    };

    const today = new Date().toISOString().split('T')[0];
    const todayFollowups = followups.filter(f => f.date === today || f.date === '2024-12-31');
    const upcomingFollowups = followups.filter(f => f.date > today && f.date !== '2024-12-31');
    const pastFollowups = followups.filter(f => f.date < today && f.date !== '2024-12-31');

    const pendingCount = followups.filter(f => f.status === 'pending').length;
    const completedCount = followups.filter(f => f.status === 'completed').length;

    const filteredFollowups = (list: typeof followups) => {
        return list.filter(f => {
            const matchesSearch = f.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.phone.includes(searchQuery) ||
                f.service.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === 'all' || f.type === filterType;
            return matchesSearch && matchesType;
        });
    };

    const FollowupCard = ({ followup }: { followup: typeof followups[0] }) => (
        <div className={`flex items-start justify-between p-4 rounded-lg border ${followup.status === 'completed' ? 'border-border bg-muted/30 opacity-70' : 'border-border bg-card hover:bg-accent/50'} transition-colors`}>
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${followup.type === 'Call' ? 'bg-blue-500/10' :
                    followup.type === 'WhatsApp' ? 'bg-green-500/10' :
                        'bg-purple-500/10'
                    }`}>
                    {followup.type === 'Call' ? (
                        <Phone className={`h-5 w-5 text-blue-500`} />
                    ) : followup.type === 'WhatsApp' ? (
                        <MessageCircle className={`h-5 w-5 text-green-500`} />
                    ) : (
                        <Users className={`h-5 w-5 text-purple-500`} />
                    )}
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <p className={`font-semibold ${followup.status === 'completed' ? 'line-through' : ''}`}>
                            {followup.leadName}
                        </p>
                        <Badge variant="secondary" className="text-xs">{followup.service}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{followup.phone}</p>
                    <p className="text-sm text-muted-foreground">{followup.notes}</p>
                    <div className="flex items-center gap-3 pt-1">
                        <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(followup.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {followup.time}
                        </Badge>
                        <Badge variant={followup.type === 'Call' ? 'default' : followup.type === 'WhatsApp' ? 'secondary' : 'outline'} className="text-xs">
                            {followup.type}
                        </Badge>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                {followup.status === 'pending' ? (
                    <div className="flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => markAsCompleted(followup.id)}
                        >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Done
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFollowup(followup.id)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                    </Badge>
                )}
            </div>
        </div>
    );

    return (
        <Layout>
            <Header title="Follow-ups" subtitle="Manage your scheduled follow-ups and reminders" />

            <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Calendar className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{todayFollowups.length}</p>
                                <p className="text-sm text-muted-foreground">Today</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-500/10">
                                <Clock className="h-5 w-5 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{pendingCount}</p>
                                <p className="text-sm text-muted-foreground">Pending</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{completedCount}</p>
                                <p className="text-sm text-muted-foreground">Completed</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <Users className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{upcomingFollowups.length}</p>
                                <p className="text-sm text-muted-foreground">Upcoming</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters and Add Button */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex gap-3 flex-1">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, phone, or service..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-[140px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Call">📞 Call</SelectItem>
                                <SelectItem value="WhatsApp">💬 WhatsApp</SelectItem>
                                <SelectItem value="Meeting">👥 Meeting</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={() => setIsAddFollowupOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Follow-up
                    </Button>
                </div>

                {/* Tabs for Today / Upcoming / Past */}
                <Tabs defaultValue="today" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="today" className="gap-2">
                            Today
                            <Badge variant="secondary" className="ml-1">{todayFollowups.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="upcoming" className="gap-2">
                            Upcoming
                            <Badge variant="secondary" className="ml-1">{upcomingFollowups.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="past" className="gap-2">
                            Past
                            <Badge variant="secondary" className="ml-1">{pastFollowups.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="all" className="gap-2">
                            All
                            <Badge variant="secondary" className="ml-1">{followups.length}</Badge>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="today" className="space-y-3">
                        {filteredFollowups(todayFollowups).length === 0 ? (
                            <Card className="p-8 text-center">
                                <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                                <p className="text-muted-foreground">No follow-ups scheduled for today</p>
                                <Button variant="outline" className="mt-4" onClick={() => setIsAddFollowupOpen(true)}>
                                    Schedule Follow-up
                                </Button>
                            </Card>
                        ) : (
                            filteredFollowups(todayFollowups).map(f => <FollowupCard key={f.id} followup={f} />)
                        )}
                    </TabsContent>

                    <TabsContent value="upcoming" className="space-y-3">
                        {filteredFollowups(upcomingFollowups).length === 0 ? (
                            <Card className="p-8 text-center">
                                <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                                <p className="text-muted-foreground">No upcoming follow-ups</p>
                            </Card>
                        ) : (
                            filteredFollowups(upcomingFollowups).map(f => <FollowupCard key={f.id} followup={f} />)
                        )}
                    </TabsContent>

                    <TabsContent value="past" className="space-y-3">
                        {filteredFollowups(pastFollowups).length === 0 ? (
                            <Card className="p-8 text-center">
                                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                                <p className="text-muted-foreground">No past follow-ups</p>
                            </Card>
                        ) : (
                            filteredFollowups(pastFollowups).map(f => <FollowupCard key={f.id} followup={f} />)
                        )}
                    </TabsContent>

                    <TabsContent value="all" className="space-y-3">
                        {filteredFollowups(followups).map(f => <FollowupCard key={f.id} followup={f} />)}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Add Follow-up Dialog */}
            <Dialog open={isAddFollowupOpen} onOpenChange={setIsAddFollowupOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Schedule Follow-up</DialogTitle>
                        <DialogDescription>
                            Add a new follow-up reminder for a lead.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
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
                                <Label htmlFor="service">Service</Label>
                                <Select value={newFollowup.service} onValueChange={(v) => setNewFollowup(prev => ({ ...prev, service: v }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hair Transplant">Hair Transplant</SelectItem>
                                        <SelectItem value="Skin Treatment">Skin Treatment</SelectItem>
                                        <SelectItem value="Chemical Peel">Chemical Peel</SelectItem>
                                        <SelectItem value="Acne Treatment">Acne Treatment</SelectItem>
                                        <SelectItem value="Skin Brightening">Skin Brightening</SelectItem>
                                        <SelectItem value="IVF Consultation">IVF Consultation</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={newFollowup.date}
                                    onChange={(e) => setNewFollowup(prev => ({ ...prev, date: e.target.value }))}
                                />
                            </div>
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
                            <Plus className="h-4 w-4 mr-2" />
                            Schedule Follow-up
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
