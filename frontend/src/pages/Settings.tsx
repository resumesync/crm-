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
import { apiFetch } from '@/lib/api';

const roleColors: Record<string, string> = {
  admin: 'bg-primary text-primary-foreground',
  manager: 'bg-status-meeting text-primary-foreground',
  agent: 'bg-secondary text-secondary-foreground',
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

interface ServiceGroup {
  id: string;
  name: string;
  color: string;
}

interface LeadStatus {
  id: string;
  name: string;
  color: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function Settings() {
  const [isLoading, setIsLoading] = useState(true);

  // Service Groups state
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState(colorOptions[0]);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupColor, setEditGroupColor] = useState('');

  // Lead Statuses state
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([]);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusColor, setNewStatusColor] = useState(colorOptions[0]);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [editStatusName, setEditStatusName] = useState('');
  const [editStatusColor, setEditStatusColor] = useState('');

  // Team state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'agent'
  });

  const handleAddMember = async () => {
    if (!newMember.username || !newMember.password || !newMember.email) {
      toast.error('Required fields: Username, Password, Email');
      return;
    }
    try {
      const resp = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: newMember.username,
          password: newMember.password,
          email: newMember.email,
          full_name: newMember.name
        })
      });

      // Update role if not default
      if (newMember.role !== 'agent') {
        const roles = await apiFetch('/api/roles');
        const roleObj = roles.find((r: any) => r.name === newMember.role);
        if (roleObj) {
          await apiFetch(`/api/roles/users/${resp.id}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role_id: roleObj.id })
          });
        }
      }

      setTeamMembers([...teamMembers, {
        id: resp.id.toString(),
        name: newMember.name || newMember.username,
        email: newMember.email,
        role: newMember.role,
        status: 'active'
      }]);

      setNewMember({ name: '', email: '', username: '', password: '', role: 'agent' });
      setIsAddMemberOpen(false);
      toast.success('Team member added successfully');
    } catch (error) {
      toast.error('Failed to add team member');
    }
  };

  // WhatsApp Automation state
  const [autoResponders, setAutoResponders] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [groups, statuses, users, responders] = await Promise.all([
        apiFetch('/api/groups'),
        apiFetch('/api/statuses'),
        apiFetch('/api/roles/users/all'),
        apiFetch('/api/whatsapp/auto-responders')
      ]);

      setServiceGroups(groups.map((g: any) => ({
        id: g.id.toString(),
        name: g.name,
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)] // Fallback since backend has no color for groups
      })));

      setLeadStatuses(statuses.map((s: any) => ({
        id: s.id.toString(),
        name: s.name,
        color: s.color.startsWith('#') ? s.color : colorOptions[Math.floor(Math.random() * colorOptions.length)]
      })));

      setTeamMembers(users.map((u: any) => ({
        id: u.id.toString(),
        name: u.full_name || u.username,
        email: u.email,
        role: u.role_name || 'agent',
        status: u.is_active ? 'active' : 'inactive'
      })));

      setAutoResponders(responders);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAutoResponder = async (triggerType: string, isEnabled: boolean) => {
    try {
      // Find existing responder for this trigger
      const existing = autoResponders.find(r => r.trigger_type === triggerType);

      await apiFetch('/api/whatsapp/auto-responders', {
        method: 'POST',
        body: JSON.stringify({
          trigger_type: triggerType,
          is_enabled: isEnabled,
          template_id: existing?.template_id || 1, // Fallback to a default template if not set
          group_id: existing?.group_id || null
        })
      });

      setAutoResponders(prev => {
        const index = prev.findIndex(r => r.trigger_type === triggerType);
        if (index > -1) {
          const newResponders = [...prev];
          newResponders[index] = { ...newResponders[index], is_enabled: isEnabled };
          return newResponders;
        }
        return [...prev, { trigger_type: triggerType, is_enabled: isEnabled, template_id: 1 }];
      });

      toast.success(`${triggerType.replace('_', ' ')} auto-responder ${isEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update auto-responder');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Service Group handlers
  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }
    try {
      const g = await apiFetch('/api/groups', {
        method: 'POST',
        body: JSON.stringify({ name: newGroupName.trim(), description: '' })
      });
      setServiceGroups([...serviceGroups, { id: g.id.toString(), name: g.name, color: newGroupColor }]);
      setNewGroupName('');
      toast.success('Service group created');
    } catch (error) {
      toast.error('Failed to create group');
    }
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      await apiFetch(`/api/groups/${id}`, { method: 'DELETE' });
      setServiceGroups(serviceGroups.filter((g) => g.id !== id));
      toast.success('Service group deleted');
    } catch (error) {
      toast.error('Failed to delete group');
    }
  };

  const handleStartEditGroup = (group: ServiceGroup) => {
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
      await apiFetch(`/api/groups/${editingGroupId}`, {
        method: 'PUT',
        body: JSON.stringify({ name: editGroupName.trim(), description: '' })
      });
      setServiceGroups(
        serviceGroups.map((g) =>
          g.id === editingGroupId ? { ...g, name: editGroupName.trim(), color: editGroupColor } : g
        )
      );
      setEditingGroupId(null);
      toast.success('Service group updated');
    } catch (error) {
      toast.error('Failed to update group');
    }
  };

  // Lead Status handlers
  const handleAddStatus = async () => {
    if (!newStatusName.trim()) {
      toast.error('Please enter a status name');
      return;
    }
    try {
      const s = await apiFetch('/api/statuses', {
        method: 'POST',
        body: JSON.stringify({ name: newStatusName.trim(), color: newStatusColor })
      });
      setLeadStatuses([...leadStatuses, { id: s.id.toString(), name: s.name, color: s.color }]);
      setNewStatusName('');
      toast.success('Lead status created');
    } catch (error) {
      toast.error('Failed to create status');
    }
  };

  const handleDeleteStatus = async (id: string) => {
    try {
      await apiFetch(`/api/statuses/${id}`, { method: 'DELETE' });
      setLeadStatuses(leadStatuses.filter((s) => s.id !== id));
      toast.success('Lead status deleted');
    } catch (error) {
      toast.error('Failed to delete status');
    }
  };

  const handleStartEditStatus = (status: LeadStatus) => {
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
      await apiFetch(`/api/statuses/${editingStatusId}`, {
        method: 'PUT',
        body: JSON.stringify({ name: editStatusName.trim(), color: editStatusColor })
      });
      setLeadStatuses(
        leadStatuses.map((s) =>
          s.id === editingStatusId ? { ...s, name: editStatusName.trim(), color: editStatusColor } : s
        )
      );
      setEditingStatusId(null);
      toast.success('Lead status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

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
                <Label>Color (UI Only)</Label>
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
                        <Button variant="ghost" size="icon-sm" onClick={() => setEditingGroupId(null)}>
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
                        <Button variant="ghost" size="icon-sm" onClick={() => setEditingStatusId(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div
                          className={cn('h-4 w-4 rounded-full', !status.color.startsWith('#') && status.color)}
                          style={status.color.startsWith('#') ? { backgroundColor: status.color } : {}}
                        />
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
              <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                    <DialogDescription>Create a new user account for your team.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username *</Label>
                        <Input id="username" placeholder="johndoe" value={newMember.username} onChange={e => setNewMember({ ...newMember, username: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="john@example.com" value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input id="password" type="password" value={newMember.password} onChange={e => setNewMember({ ...newMember, password: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={newMember.role} onValueChange={v => setNewMember({ ...newMember, role: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddMember}>Create Account</Button>
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
                    <Badge className={cn('capitalize', roleColors[user.role] || 'bg-secondary')}>
                      {user.role}
                    </Badge>
                  </div>
                </div>
              ))}
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
                <p className="text-sm text-muted-foreground">Auto-responder counts: {autoResponders.length}</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Auto-reply on New Lead</p>
                  <p className="text-sm text-muted-foreground">Send confirmation when lead is captured</p>
                </div>
                <Switch
                  checked={autoResponders.some(r => r.trigger_type === 'new_lead' && r.is_enabled)}
                  onCheckedChange={(checked) => handleToggleAutoResponder('new_lead', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Auto-reply on Status Change</p>
                  <p className="text-sm text-muted-foreground">Notify leads when their status updates</p>
                </div>
                <Switch
                  checked={autoResponders.some(r => r.trigger_type === 'status_change' && r.is_enabled)}
                  onCheckedChange={(checked) => handleToggleAutoResponder('status_change', checked)}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
