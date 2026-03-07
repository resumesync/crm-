import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Building2, Users, CreditCard, Upload, Mail, Trash2, Crown, Shield, Settings, Sparkles, Check, Download, ChevronRight, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/layout/Sidebar';
import { useOrganization, useUpdateOrganization } from '@/hooks/useOrganization';
import { useUsers } from '@/hooks/useUsers';

export default function OrganizationSettings() {
    // Fetch organization settings from API
    const { data: orgSettings, isLoading: orgLoading, refetch: refetchOrg } = useOrganization();
    const updateOrgMutation = useUpdateOrganization();

    // Fetch team members from API
    const { data: usersData, isLoading: usersLoading } = useUsers();

    const [orgData, setOrgData] = useState({
        name: '',
        slug: '',
        email: '',
        phone: '',
        address: ''
    });

    // Load organization data when fetched
    useEffect(() => {
        if (orgSettings) {
            setOrgData({
                name: orgSettings.agency_name || '',
                slug: orgSettings.agency_name?.toLowerCase().replace(/\s+/g, '-') || '',
                email: orgSettings.contact_email || '',
                phone: orgSettings.contact_phone || '',
                address: orgSettings.address || ''
            });
        }
    }, [orgSettings]);

    // Transform users data for display
    const teamMembers = (usersData?.users || []).map((u, idx) => ({
        id: String(u.id),
        name: u.full_name || u.username,
        email: u.email,
        role: u.role_name || 'agent',
        status: u.is_active ? 'active' : 'inactive',
        avatar: (u.full_name || u.username).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }));

    const handleSave = async () => {
        try {
            await updateOrgMutation.mutateAsync({
                agency_name: orgData.name,
                contact_email: orgData.email,
                contact_phone: orgData.phone,
                address: orgData.address,
                gmb_review_link: orgSettings?.gmb_review_link || '',
                logo_url: orgSettings?.logo_url || '',
                whatsapp_number: orgSettings?.whatsapp_number || '',
                timezone: orgSettings?.timezone || 'Asia/Kolkata'
            });
            toast({
                title: "Settings Saved",
                description: "Your organization settings have been updated successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save organization settings.",
                variant: "destructive"
            });
        }
    };

    if (orgLoading) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <Sidebar />
                <main className="ml-64 flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <Sidebar />
            <main className="ml-64 flex-1 overflow-y-auto">
                {/* Header with gradient */}
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

                        {/* General Settings */}
                        <TabsContent value="general" className="space-y-6">
                            {/* Organization Details Card */}
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
                                                value={orgData.name}
                                                onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                                                className="border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="org-slug" className="text-slate-300">URL Slug</Label>
                                            <div className="flex gap-2">
                                                <span className="flex items-center rounded-lg border border-white/10 bg-slate-800 px-3 text-sm text-slate-400">
                                                    clientcare.io/
                                                </span>
                                                <Input
                                                    id="org-slug"
                                                    value={orgData.slug}
                                                    onChange={(e) => setOrgData({ ...orgData, slug: e.target.value })}
                                                    className="border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="org-email" className="text-slate-300">Contact Email</Label>
                                            <Input
                                                id="org-email"
                                                type="email"
                                                value={orgData.email}
                                                onChange={(e) => setOrgData({ ...orgData, email: e.target.value })}
                                                className="border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="org-phone" className="text-slate-300">Phone Number</Label>
                                            <Input
                                                id="org-phone"
                                                value={orgData.phone}
                                                onChange={(e) => setOrgData({ ...orgData, phone: e.target.value })}
                                                className="border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="org-address" className="text-slate-300">Address</Label>
                                            <Input
                                                id="org-address"
                                                value={orgData.address}
                                                onChange={(e) => setOrgData({ ...orgData, address: e.target.value })}
                                                className="border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Branding Card */}
                            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-violet-500/30">
                                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                <div className="relative p-6">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/20">
                                            <Sparkles className="h-5 w-5 text-fuchsia-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Branding</h3>
                                    </div>
                                    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                                        <div className="group/logo relative">
                                            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-slate-800/50 transition-colors group-hover/logo:border-violet-500/50">
                                                <Building2 className="h-10 w-10 text-slate-500 transition-colors group-hover/logo:text-violet-400" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white shadow-lg">
                                                <Upload className="h-3 w-3" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-violet-500/20 hover:border-violet-500/50 hover:text-white">
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Logo
                                            </Button>
                                            <p className="text-sm text-slate-500">
                                                Recommended: 400x400px, PNG or JPG
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline" className="border-white/20 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} className="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-purple-500">
                                    Save Changes
                                </Button>
                            </div>
                        </TabsContent>

                        {/* Team Management */}
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
                                                    3 of 5 seats used on Pro plan
                                                </p>
                                            </div>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-500">
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Invite Member
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="border-white/10 bg-slate-900 text-white">
                                                <DialogHeader>
                                                    <DialogTitle className="text-white">Invite Team Member</DialogTitle>
                                                    <DialogDescription className="text-slate-400">
                                                        Send an invitation to a new team member to join your organization.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                                                        <Input id="name" placeholder="Dr. Sarah Jones" className="border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                                                        <Input id="email" type="email" placeholder="sarah@example.com" className="border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                                                        <Input id="phone" type="tel" placeholder="+91 98765 43210" className="border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="role" className="text-slate-300">Role</Label>
                                                        <Select defaultValue="agent">
                                                            <SelectTrigger className="border-white/10 bg-slate-800/50 text-white">
                                                                <SelectValue placeholder="Select a role" />
                                                            </SelectTrigger>
                                                            <SelectContent className="border-white/10 bg-slate-900 text-white">
                                                                <SelectItem value="admin">Admin</SelectItem>
                                                                <SelectItem value="manager">Manager</SelectItem>
                                                                <SelectItem value="agent">Agent</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" className="border-white/20 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">Cancel</Button>
                                                    <Button onClick={() => {
                                                        toast({
                                                            title: "Invitation Sent",
                                                            description: "An email and SMS invitation has been sent to the user.",
                                                        });
                                                    }} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">Send Invitation</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
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
                                                    {member.role !== 'owner' && (
                                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-red-500/20 hover:text-red-400">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Role Permissions Card */}
                            <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
                                        <Shield className="h-5 w-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <h4 className="mb-3 font-semibold text-amber-300">Role Permissions</h4>
                                        <ul className="space-y-2 text-sm text-slate-300">
                                            <li className="flex items-center gap-2">
                                                <Crown className="h-4 w-4 text-amber-400" />
                                                <strong className="text-amber-300">Owner:</strong> Full access to all features and settings
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-violet-400" />
                                                <strong className="text-violet-300">Admin:</strong> Manage leads, team, and integrations
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-emerald-400" />
                                                <strong className="text-emerald-300">Manager:</strong> Manage leads and view reports
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-sky-400" />
                                                <strong className="text-sky-300">Agent:</strong> View and update assigned leads only
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Billing */}
                        <TabsContent value="billing" className="space-y-6">
                            {/* Current Plan Card */}
                            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-purple-600/5 to-fuchsia-600/10"></div>
                                <div className="relative p-6">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
                                            <Sparkles className="h-5 w-5 text-violet-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Current Plan</h3>
                                    </div>
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <div className="mb-2 flex items-center gap-3">
                                                <h4 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Pro Plan</h4>
                                                <Badge className="border-0 bg-emerald-500/20 text-emerald-400">Active</Badge>
                                            </div>
                                            <p className="text-slate-400">₹3,999/month • Renews on Jan 15, 2025</p>
                                        </div>
                                        <Button variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 hover:text-violet-200">
                                            Change Plan
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                        <div className="group/stat rounded-xl border border-white/10 bg-slate-800/30 p-4 transition-all hover:border-violet-500/30">
                                            <p className="text-sm text-slate-400">Leads This Month</p>
                                            <div className="mt-1 flex items-baseline gap-1">
                                                <span className="text-2xl font-bold text-white">324</span>
                                                <span className="text-sm text-slate-500">/ 500</span>
                                            </div>
                                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700">
                                                <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-violet-500 to-purple-500"></div>
                                            </div>
                                        </div>
                                        <div className="group/stat rounded-xl border border-white/10 bg-slate-800/30 p-4 transition-all hover:border-emerald-500/30">
                                            <p className="text-sm text-slate-400">Team Members</p>
                                            <div className="mt-1 flex items-baseline gap-1">
                                                <span className="text-2xl font-bold text-white">3</span>
                                                <span className="text-sm text-slate-500">/ 5</span>
                                            </div>
                                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700">
                                                <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                                            </div>
                                        </div>
                                        <div className="group/stat rounded-xl border border-white/10 bg-slate-800/30 p-4 transition-all hover:border-sky-500/30">
                                            <p className="text-sm text-slate-400">Storage Used</p>
                                            <div className="mt-1 flex items-baseline gap-1">
                                                <span className="text-2xl font-bold text-white">1.2 GB</span>
                                                <span className="text-sm text-slate-500">/ 10 GB</span>
                                            </div>
                                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700">
                                                <div className="h-full w-[12%] rounded-full bg-gradient-to-r from-sky-500 to-cyan-500"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Card */}
                            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-violet-500/30">
                                <div className="relative p-6">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20">
                                            <CreditCard className="h-5 w-5 text-sky-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Payment Method</h3>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-800/30 p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30">
                                                <CreditCard className="h-6 w-6 text-sky-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">•••• •••• •••• 4242</p>
                                                <p className="text-sm text-slate-400">Expires 12/2025</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="border-white/20 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">
                                            Update
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Billing History Card */}
                            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm">
                                <div className="relative p-6">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/20">
                                            <Download className="h-5 w-5 text-fuchsia-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Billing History</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {[
                                            { date: 'Dec 15, 2024', amount: '₹3,999', status: 'Paid', invoice: 'INV-001' },
                                            { date: 'Nov 15, 2024', amount: '₹3,999', status: 'Paid', invoice: 'INV-002' },
                                            { date: 'Oct 15, 2024', amount: '₹3,999', status: 'Paid', invoice: 'INV-003' }
                                        ].map((invoice, i) => (
                                            <div key={i} className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-800/20 p-4 transition-all hover:border-white/10 hover:bg-slate-800/40">
                                                <div>
                                                    <p className="font-medium text-white">{invoice.invoice}</p>
                                                    <p className="text-sm text-slate-400">{invoice.date}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p className="font-semibold text-white">{invoice.amount}</p>
                                                    <Badge className="border-0 bg-emerald-500/20 text-emerald-400">{invoice.status}</Badge>
                                                    <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-violet-500/20 hover:text-violet-300">
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
