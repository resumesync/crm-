import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Building2, Users, CreditCard, Upload, Mail, Trash2, Crown, Shield, Settings, Sparkles, Check, Download, ChevronRight, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/layout/Sidebar';
import { apiFetch } from '@/lib/api';

interface Clinic {
    id: number;
    name: string;
    branch_name: string;
    email: string;
    phone: string;
    address: string;
}

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    avatar: string;
}

export default function OrganizationSettings() {
    const [orgData, setOrgData] = useState<Clinic | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const clinics = await apiFetch('/api/clinics');
            if (clinics && clinics.length > 0) {
                setOrgData(clinics[0]);
            } else {
                // If no clinic exists, we might need to create one, 
                // but for now we set a default state to avoid errors
                setOrgData({
                    id: 0,
                    name: 'New Organization',
                    branch_name: '',
                    email: '',
                    phone: '',
                    address: ''
                });
            }

            const users = await apiFetch('/api/roles/users/all');
            const mappedUsers = users.map((u: any) => ({
                id: u.id.toString(),
                name: u.full_name || u.username,
                email: u.email,
                role: u.role_name || 'agent',
                status: u.is_active ? 'active' : 'inactive',
                avatar: (u.full_name || u.username).substring(0, 2).toUpperCase()
            }));
            setTeamMembers(mappedUsers);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load organization settings');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async () => {
        if (!orgData) return;

        try {
            setIsSaving(true);
            if (orgData.id === 0) {
                // Create new
                await apiFetch('/api/clinics', {
                    method: 'POST',
                    body: JSON.stringify(orgData)
                });
            } else {
                // Update existing
                await apiFetch(`/api/clinics/${orgData.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(orgData)
                });
            }
            toast.success("Settings Saved successfully.");
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-slate-950 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <Sidebar />
            <main className="ml-64 flex-1 overflow-y-auto">
                <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-violet-600/20 via-purple-600/10 to-fuchsia-600/20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2230%22 height=%2230%22 viewBox=%220 0 30 30%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z%22 fill=%22rgba(255,255,255,0.05)%22/%3E%3C/svg%3E')] opacity-40"></div>
                    <div className="container mx-auto max-w-6xl px-6 py-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
                                <Settings className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Organization Settings</h1>
                                <p className="text-slate-400">Manage your organization, team, and billing</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto max-w-6xl px-6 py-8">
                    <Tabs defaultValue="general" className="space-y-8">
                        <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-800/50 p-1.5 backdrop-blur-sm border border-white/10">
                            <TabsTrigger value="general" className="inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-white">
                                <Building2 className="mr-2 h-4 w-4" />
                                General
                            </TabsTrigger>
                            <TabsTrigger value="team" className="inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-white">
                                <Users className="mr-2 h-4 w-4" />
                                Team
                            </TabsTrigger>
                            <TabsTrigger value="billing" className="inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-white">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Billing
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="space-y-6">
                            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-violet-500/30">
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                <div className="relative p-6">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
                                            <Building2 className="h-5 w-5 text-violet-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Organization Details</h3>
                                    </div>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="org-name" className="text-slate-300">Organization Name</Label>
                                            <Input
                                                id="org-name"
                                                value={orgData?.name || ''}
                                                onChange={(e) => setOrgData(prev => prev ? { ...prev, name: e.target.value } : null)}
                                                className="border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="branch-name" className="text-slate-300">Branch Name</Label>
                                            <Input
                                                id="branch-name"
                                                value={orgData?.branch_name || ''}
                                                onChange={(e) => setOrgData(prev => prev ? { ...prev, branch_name: e.target.value } : null)}
                                                className="border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="org-email" className="text-slate-300">Contact Email</Label>
                                            <Input
                                                id="org-email"
                                                type="email"
                                                value={orgData?.email || ''}
                                                onChange={(e) => setOrgData(prev => prev ? { ...prev, email: e.target.value } : null)}
                                                className="border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="org-phone" className="text-slate-300">Phone Number</Label>
                                            <Input
                                                id="org-phone"
                                                value={orgData?.phone || ''}
                                                onChange={(e) => setOrgData(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                                className="border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="org-address" className="text-slate-300">Address</Label>
                                            <Input
                                                id="org-address"
                                                value={orgData?.address || ''}
                                                onChange={(e) => setOrgData(prev => prev ? { ...prev, address: e.target.value } : null)}
                                                className="border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline" className="border-white/20 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-purple-500">
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Save Changes
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="team" className="space-y-6">
                            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm">
                                <div className="relative p-6">
                                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
                                                <Users className="h-5 w-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">Team Members</h3>
                                                <p className="text-sm text-slate-400">
                                                    {teamMembers.length} seats used
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {teamMembers.map((member) => (
                                            <div
                                                key={member.id}
                                                className="group/member flex items-center justify-between rounded-xl border border-white/10 bg-slate-800/30 p-4 transition-all hover:border-violet-500/30 hover:bg-slate-800/50"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 font-semibold text-white shadow-lg shadow-violet-500/20">
                                                            {member.avatar}
                                                        </div>
                                                        {member.status === 'active' && (
                                                            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-800 bg-emerald-500"></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{member.name}</p>
                                                        <p className="text-sm text-slate-400">{member.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge className={member.status === 'active'
                                                        ? 'border-0 bg-emerald-500/20 text-emerald-400'
                                                        : 'border-0 bg-amber-500/20 text-amber-400'}>
                                                        {member.status}
                                                    </Badge>
                                                    <Badge variant="outline" className="border-white/20 bg-transparent capitalize text-slate-300">
                                                        {member.role === 'owner' && <Crown className="mr-1 h-3 w-3 text-amber-400" />}
                                                        {member.role}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="billing" className="space-y-6">
                            <Card className="bg-slate-900/50 border-white/10 p-6">
                                <div className="text-center py-12">
                                    <CreditCard className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white">Billing Information</h3>
                                    <p className="text-slate-400">Subscription details are managed in the main portal.</p>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
