import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Building2, Users, CreditCard, Upload, Mail, Trash2, Crown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function OrganizationSettings() {
    const [orgData, setOrgData] = useState({
        name: 'Acme Medical Center',
        slug: 'acme-medical',
        email: 'admin@acmemedical.com',
        phone: '+91 98765 43210',
        address: '123 Main St, Mumbai, Maharashtra'
    });

    const [teamMembers] = useState([
        { id: '1', name: 'Dr. Rajesh Kumar', email: 'rajesh@acme.com', role: 'owner', status: 'active' },
        { id: '2', name: 'Priya Sharma', email: 'priya@acme.com', role: 'admin', status: 'active' },
        { id: '3', name: 'Amit Patel', email: 'amit@acme.com', role: 'agent', status: 'pending' }
    ]);

    const handleSave = () => {
        toast({
            title: "Settings Saved",
            description: "Your organization settings have been updated successfully.",
        });
    };

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Organization Settings</h1>
                <p className="text-muted-foreground">Manage your organization and team members</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">
                        <Building2 className="mr-2 h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="team">
                        <Users className="mr-2 h-4 w-4" />
                        Team
                    </TabsTrigger>
                    <TabsTrigger value="billing">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Billing
                    </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                    <div className="rounded-lg border bg-card p-6">
                        <h3 className="mb-4 text-lg font-semibold">Organization Details</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="org-name">Organization Name</Label>
                                <Input
                                    id="org-name"
                                    value={orgData.name}
                                    onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="org-slug">URL Slug</Label>
                                <div className="flex gap-2">
                                    <span className="flex items-center rounded-md bg-secondary px-3 text-sm text-muted-foreground">
                                        clientcare.io/
                                    </span>
                                    <Input
                                        id="org-slug"
                                        value={orgData.slug}
                                        onChange={(e) => setOrgData({ ...orgData, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="org-email">Contact Email</Label>
                                <Input
                                    id="org-email"
                                    type="email"
                                    value={orgData.email}
                                    onChange={(e) => setOrgData({ ...orgData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="org-phone">Phone Number</Label>
                                <Input
                                    id="org-phone"
                                    value={orgData.phone}
                                    onChange={(e) => setOrgData({ ...orgData, phone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="org-address">Address</Label>
                                <Input
                                    id="org-address"
                                    value={orgData.address}
                                    onChange={(e) => setOrgData({ ...orgData, address: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <h3 className="mb-4 text-lg font-semibold">Branding</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Organization Logo</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed bg-secondary">
                                        <Building2 className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <Button variant="outline">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Logo
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Recommended: 400x400px, PNG or JPG
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </TabsContent>

                {/* Team Management */}
                <TabsContent value="team" className="space-y-6">
                    <div className="rounded-lg border bg-card p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Team Members</h3>
                                <p className="text-sm text-muted-foreground">
                                    3 of 5 seats used on Pro plan
                                </p>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Invite Member
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Invite Team Member</DialogTitle>
                                        <DialogDescription>
                                            Send an invitation to a new team member to join your organization.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" placeholder="Dr. Sarah Jones" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" placeholder="sarah@example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="role">Role</Label>
                                            <Select defaultValue="agent">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="manager">Manager</SelectItem>
                                                    <SelectItem value="agent">Agent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline">Cancel</Button>
                                        <Button onClick={() => {
                                            toast({
                                                title: "Invitation Sent",
                                                description: "An email and SMS invitation has been sent to the user.",
                                            });
                                        }}>Send Invitation</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-3">
                            {teamMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-medium">{member.name}</p>
                                            <p className="text-sm text-muted-foreground">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                                            {member.status}
                                        </Badge>
                                        <Badge variant="outline" className="capitalize">
                                            {member.role === 'owner' && <Crown className="mr-1 h-3 w-3" />}
                                            {member.role}
                                        </Badge>
                                        {member.role !== 'owner' && (
                                            <Button variant="ghost" size="icon">
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
                        <h4 className="mb-2 font-semibold text-amber-600">Role Permissions</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• <strong>Owner:</strong> Full access to all features and settings</li>
                            <li>• <strong>Admin:</strong> Manage leads, team, and integrations</li>
                            <li>• <strong>Manager:</strong> Manage leads and view reports</li>
                            <li>• <strong>Agent:</strong> View and update assigned leads only</li>
                        </ul>
                    </div>
                </TabsContent>

                {/* Billing */}
                <TabsContent value="billing" className="space-y-6">
                    <div className="rounded-lg border bg-card p-6">
                        <h3 className="mb-4 text-lg font-semibold">Current Plan</h3>
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <h4 className="text-2xl font-bold">Pro Plan</h4>
                                    <Badge>Active</Badge>
                                </div>
                                <p className="text-muted-foreground">₹3,999/month • Renews on Jan 15, 2025</p>
                            </div>
                            <Button variant="outline">Change Plan</Button>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">Leads This Month</p>
                                <p className="text-2xl font-bold">324 <span className="text-sm font-normal text-muted-foreground">/ 500</span></p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">Team Members</p>
                                <p className="text-2xl font-bold">3 <span className="text-sm font-normal text-muted-foreground">/ 5</span></p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">Storage Used</p>
                                <p className="text-2xl font-bold">1.2 GB <span className="text-sm font-normal text-muted-foreground">/ 10 GB</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <h3 className="mb-4 text-lg font-semibold">Payment Method</h3>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-14 items-center justify-center rounded bg-secondary">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">•••• •••• •••• 4242</p>
                                    <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                                </div>
                            </div>
                            <Button variant="outline">Update</Button>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <h3 className="mb-4 text-lg font-semibold">Billing History</h3>
                        <div className="space-y-2">
                            {[
                                { date: 'Dec 15, 2024', amount: '₹3,999', status: 'Paid', invoice: 'INV-001' },
                                { date: 'Nov 15, 2024', amount: '₹3,999', status: 'Paid', invoice: 'INV-002' },
                                { date: 'Oct 15, 2024', amount: '₹3,999', status: 'Paid', invoice: 'INV-003' }
                            ].map((invoice, i) => (
                                <div key={i} className="flex items-center justify-between border-b py-3 last:border-0">
                                    <div>
                                        <p className="font-medium">{invoice.invoice}</p>
                                        <p className="text-sm text-muted-foreground">{invoice.date}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="font-medium">{invoice.amount}</p>
                                        <Badge variant="outline">{invoice.status}</Badge>
                                        <Button variant="ghost" size="sm">Download</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
