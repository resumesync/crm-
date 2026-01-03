import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Bell,
  MessageSquare,
  Building2,
  User,
  Plus,
  Trash2,
  Tag,
  Edit2,
  Check,
  X,
  GitBranch,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGroups, useCreateGroup, useUpdateGroup } from '@/hooks/useGroups';
import { useStatuses, useCreateStatus } from '@/hooks/useStatuses';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import groupsService from '@/services/groupsService';
import statusesService from '@/services/statusesService';

const roleColors: Record<string, string> = {
  admin: 'bg-primary text-primary-foreground',
  manager: 'bg-status-meeting text-primary-foreground',
  agent: 'bg-secondary text-secondary-foreground',
};

// Color mapping for display
const hexToTailwind: Record<string, string> = {
  '#3B82F6': 'bg-blue-500',
  '#8B5CF6': 'bg-purple-500',
  '#F59E0B': 'bg-amber-500',
  '#EC4899': 'bg-pink-500',
  '#EF4444': 'bg-red-500',
  '#10B981': 'bg-green-500',
  '#6B7280': 'bg-gray-500',
  '#9CA3AF': 'bg-gray-400',
  '#06B6D4': 'bg-cyan-500',
  '#6366F1': 'bg-indigo-500',
  '#14B8A6': 'bg-teal-500',
  '#F97316': 'bg-orange-500',
};

const tailwindToHex: Record<string, string> = {
  'bg-pink-500': '#EC4899',
  'bg-purple-500': '#8B5CF6',
  'bg-blue-500': '#3B82F6',
  'bg-amber-500': '#F59E0B',
  'bg-rose-500': '#F43F5E',
  'bg-green-500': '#10B981',
  'bg-cyan-500': '#06B6D4',
  'bg-orange-500': '#F97316',
  'bg-indigo-500': '#6366F1',
  'bg-teal-500': '#14B8A6',
  'bg-red-500': '#EF4444',
  'bg-gray-500': '#6B7280',
};

const colorOptions = [
  'bg-pink-500',
  'bg-purple-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-green-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-red-500',
  'bg-gray-500',
];

export default function Settings() {
  // Fetch data from database
  const { data: groupsData, isLoading: groupsLoading, refetch: refetchGroups } = useGroups();
  const { data: statusesData, isLoading: statusesLoading, refetch: refetchStatuses } = useStatuses();
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useUsers();
  const createGroupMutation = useCreateGroup();
  const updateGroupMutation = useUpdateGroup();
  const createStatusMutation = useCreateStatus();
  const deleteUserMutation = useDeleteUser();

  // Transform API data to display format
  const teamMembers = (usersData?.users || []).map(u => ({
    id: String(u.id),
    name: u.full_name || u.username,
    email: u.email,
    role: (u.role_name || 'agent') as 'admin' | 'manager' | 'agent',
  }));

  // Transform API data to display format
  const serviceGroups = (groupsData || []).map(g => ({
    id: String(g.id),
    name: g.name,
    color: 'bg-purple-500', // Default color since API doesn't store colors
  }));

  const leadStatuses = (statusesData || []).map(s => ({
    id: String(s.id),
    name: s.name,
    color: hexToTailwind[s.color] || 'bg-blue-500',
  }));

  // Service Groups state
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState(colorOptions[0]);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupColor, setEditGroupColor] = useState('');

  // Lead Statuses state
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusColor, setNewStatusColor] = useState(colorOptions[0]);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [editStatusName, setEditStatusName] = useState('');
  const [editStatusColor, setEditStatusColor] = useState('');

  // Service Group handlers
  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }
    try {
      await createGroupMutation.mutateAsync({
        name: newGroupName.trim(),
        description: '',
        is_custom: true,
      });
      setNewGroupName('');
      setNewGroupColor(colorOptions[0]);
      toast.success('Service group created');
    } catch (error) {
      toast.error('Failed to create group');
    }
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      await groupsService.deleteGroup(parseInt(id));
      refetchGroups();
      toast.success('Service group deleted');
    } catch (error) {
      toast.error('Failed to delete group');
    }
  };

  const handleStartEditGroup = (group: typeof serviceGroups[0]) => {
    setEditingGroupId(group.id);
    setEditGroupName(group.name);
    setEditGroupColor(group.color);
  };

  const handleSaveEditGroup = async () => {
    if (!editGroupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }
    try {
      await updateGroupMutation.mutateAsync({
        id: parseInt(editingGroupId!),
        data: { name: editGroupName.trim() },
      });
      setEditingGroupId(null);
      toast.success('Service group updated');
    } catch (error) {
      toast.error('Failed to update group');
    }
  };

  const handleCancelEditGroup = () => {
    setEditingGroupId(null);
  };

  // Lead Status handlers
  const handleAddStatus = async () => {
    if (!newStatusName.trim()) {
      toast.error('Please enter a status name');
      return;
    }
    try {
      await createStatusMutation.mutateAsync({
        name: newStatusName.trim(),
        color: tailwindToHex[newStatusColor] || '#3B82F6',
        display_order: leadStatuses.length + 1,
      });
      setNewStatusName('');
      setNewStatusColor(colorOptions[0]);
      toast.success('Lead status created');
    } catch (error) {
      toast.error('Failed to create status');
    }
  };

  const handleDeleteStatus = async (id: string) => {
    try {
      await statusesService.deleteStatus(parseInt(id));
      refetchStatuses();
      toast.success('Lead status deleted');
    } catch (error) {
      toast.error('Failed to delete status');
    }
  };

  const handleStartEditStatus = (status: typeof leadStatuses[0]) => {
    setEditingStatusId(status.id);
    setEditStatusName(status.name);
    setEditStatusColor(status.color);
  };

  const handleSaveEditStatus = async () => {
    if (!editStatusName.trim()) {
      toast.error('Please enter a status name');
      return;
    }
    try {
      await statusesService.updateStatus(parseInt(editingStatusId!), {
        name: editStatusName.trim(),
        color: tailwindToHex[editStatusColor] || '#3B82F6',
      });
      refetchStatuses();
      setEditingStatusId(null);
      toast.success('Lead status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCancelEditStatus = () => {
    setEditingStatusId(null);
  };

  return (
    <Layout>
      <Header title="Settings" subtitle="Configure your CRM preferences" />

      <div className="p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Service Groups */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Service Groups</h3>
                  <p className="text-sm text-muted-foreground">Segment leads by treatment/service</p>
                </div>
              </div>
            </div>
            <Separator className="my-4" />

            {/* Add New Group */}
            <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-border bg-secondary/20 p-4">
              <div className="flex-1 min-w-[200px] space-y-2">
                <Label>Group Name</Label>
                <Input
                  placeholder="e.g., Laser Treatment"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewGroupColor(color)}
                      className={cn(
                        'h-8 w-8 rounded-full transition-all',
                        color,
                        newGroupColor === color
                          ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
                          : 'opacity-50 hover:opacity-100'
                      )}
                    />
                  ))}
                </div>
              </div>
              <Button onClick={handleAddGroup}>
                <Plus className="mr-1 h-4 w-4" />
                Add Group
              </Button>
            </div>

            {/* Groups List */}
            <div className="space-y-2">
              {serviceGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/20 p-3"
                >
                  {editingGroupId === group.id ? (
                    <>
                      <div className="flex flex-1 flex-wrap items-center gap-3">
                        <Input
                          value={editGroupName}
                          onChange={(e) => setEditGroupName(e.target.value)}
                          className="max-w-[200px]"
                        />
                        <div className="flex flex-wrap gap-1">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              onClick={() => setEditGroupColor(color)}
                              className={cn(
                                'h-6 w-6 rounded-full transition-all',
                                color,
                                editGroupColor === color
                                  ? 'ring-2 ring-foreground ring-offset-1 ring-offset-background'
                                  : 'opacity-50 hover:opacity-100'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={handleSaveEditGroup} className="text-status-converted">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={handleCancelEditGroup}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className={cn('h-4 w-4 rounded-full', group.color)} />
                        <span className="font-medium text-foreground">{group.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleStartEditGroup(group)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Lead Statuses */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <GitBranch className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Lead Statuses</h3>
                  <p className="text-sm text-muted-foreground">Manage your lead pipeline stages</p>
                </div>
              </div>
            </div>
            <Separator className="my-4" />

            {/* Add New Status */}
            <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-border bg-secondary/20 p-4">
              <div className="flex-1 min-w-[200px] space-y-2">
                <Label>Status Name</Label>
                <Input
                  placeholder="e.g., Qualified Lead"
                  value={newStatusName}
                  onChange={(e) => setNewStatusName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewStatusColor(color)}
                      className={cn(
                        'h-8 w-8 rounded-full transition-all',
                        color,
                        newStatusColor === color
                          ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
                          : 'opacity-50 hover:opacity-100'
                      )}
                    />
                  ))}
                </div>
              </div>
              <Button onClick={handleAddStatus}>
                <Plus className="mr-1 h-4 w-4" />
                Add Status
              </Button>
            </div>

            {/* Statuses List */}
            <div className="space-y-2">
              {leadStatuses.map((status) => (
                <div
                  key={status.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/20 p-3"
                >
                  {editingStatusId === status.id ? (
                    <>
                      <div className="flex flex-1 flex-wrap items-center gap-3">
                        <Input
                          value={editStatusName}
                          onChange={(e) => setEditStatusName(e.target.value)}
                          className="max-w-[200px]"
                        />
                        <div className="flex flex-wrap gap-1">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              onClick={() => setEditStatusColor(color)}
                              className={cn(
                                'h-6 w-6 rounded-full transition-all',
                                color,
                                editStatusColor === color
                                  ? 'ring-2 ring-foreground ring-offset-1 ring-offset-background'
                                  : 'opacity-50 hover:opacity-100'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={handleSaveEditStatus} className="text-status-converted">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={handleCancelEditStatus}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className={cn('h-4 w-4 rounded-full', status.color)} />
                        <span className="font-medium text-foreground">{status.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleStartEditStatus(status)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive"
                          onClick={() => handleDeleteStatus(status.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Organization Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Organization</h3>
                <p className="text-sm text-muted-foreground">Manage your agency details</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Agency Name</Label>
                <Input defaultValue="Abhivrudhi Agency" />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input defaultValue="contact@abhivrudhi.com" />
              </div>
            </div>
          </Card>

          {/* Team Members */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Team Members</h3>
                  <p className="text-sm text-muted-foreground">Manage sub-teams & access control</p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Member
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
                      toast.success("Invitation Sent: An email and SMS invitation has been sent to the user.");
                    }}>Send Invitation</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Separator className="my-4" />
            <div className="space-y-3">
              {teamMembers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/20 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn('capitalize', roleColors[user.role])}>
                      {user.role}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive"
                      onClick={async () => {
                        if (confirm(`Are you sure you want to deactivate ${user.name}?`)) {
                          try {
                            await deleteUserMutation.mutateAsync(parseInt(user.id));
                            toast.success(`${user.name} has been deactivated`);
                          } catch (error) {
                            toast.error('Failed to deactivate user');
                          }
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Role Permissions */}
            <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4">
              <h4 className="mb-3 font-medium text-foreground">Role Permissions</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="pb-2">Permission</th>
                      <th className="pb-2 text-center">Admin</th>
                      <th className="pb-2 text-center">Manager</th>
                      <th className="pb-2 text-center">Agent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-2">View all leads</td>
                      <td className="py-2 text-center text-status-converted">✓</td>
                      <td className="py-2 text-center text-status-converted">✓</td>
                      <td className="py-2 text-center text-muted-foreground">—</td>
                    </tr>
                    <tr>
                      <td className="py-2">Edit leads</td>
                      <td className="py-2 text-center text-status-converted">✓</td>
                      <td className="py-2 text-center text-status-converted">✓</td>
                      <td className="py-2 text-center text-status-converted">✓</td>
                    </tr>
                    <tr>
                      <td className="py-2">Send bulk campaigns</td>
                      <td className="py-2 text-center text-status-converted">✓</td>
                      <td className="py-2 text-center text-status-converted">✓</td>
                      <td className="py-2 text-center text-muted-foreground">—</td>
                    </tr>
                    <tr>
                      <td className="py-2">Edit templates</td>
                      <td className="py-2 text-center text-status-converted">✓</td>
                      <td className="py-2 text-center text-muted-foreground">—</td>
                      <td className="py-2 text-center text-muted-foreground">—</td>
                    </tr>
                    <tr>
                      <td className="py-2">Manage team</td>
                      <td className="py-2 text-center text-status-converted">✓</td>
                      <td className="py-2 text-center text-muted-foreground">—</td>
                      <td className="py-2 text-center text-muted-foreground">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <p className="text-sm text-muted-foreground">Configure alert preferences</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">New Lead Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when a new lead arrives</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Follow-up Reminders</p>
                  <p className="text-sm text-muted-foreground">Daily summary of leads needing follow-up</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Campaign Reports</p>
                  <p className="text-sm text-muted-foreground">Receive campaign performance summaries</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          {/* WhatsApp Automation */}
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-whatsapp/10">
                <MessageSquare className="h-5 w-5 text-whatsapp" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">WhatsApp Automation</h3>
                <p className="text-sm text-muted-foreground">Auto-responder settings</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Auto-reply on New Lead</p>
                  <p className="text-sm text-muted-foreground">Send confirmation when lead is captured</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Auto-reply on Status Change</p>
                  <p className="text-sm text-muted-foreground">Notify leads when their status updates</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}