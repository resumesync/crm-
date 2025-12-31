import { Lead, STATUS_CONFIG, SERVICE_CONFIG, Activity, CallRecord, MessageRecord, FollowUp, FollowUpPriority } from '@/types/crm';
import { notesApi } from '@/services/notesApi';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';

// Placeholder users until API endpoint is added
const teamMembers = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' as const },
  { id: '2', name: 'Manager User', email: 'manager@example.com', role: 'manager' as const },
];

// Placeholder quick messages until API endpoint is added
const quickMessages = [
  { id: '1', title: 'Follow-up', content: 'Hi {{name}}, just following up on your inquiry about {{service}}.' },
  { id: '2', title: 'Appointment Reminder', content: 'Hi {{name}}, this is a reminder about your upcoming appointment at {{clinic_name}}.' },
];

// Empty placeholder functions until API is integrated
const getLeadActivities = (_leadId: string): Activity[] => [];
const getLeadCalls = (_leadId: string): CallRecord[] => [];
const getLeadMessages = (_leadId: string): MessageRecord[] => [];
const getLeadFollowUps = (_leadId: string): FollowUp[] => [];
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageCircle,
  Send,
  Plus,
  Clock,
  User,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  MessageSquare,
  CheckCheck,
  Check,
  AlertCircle,
  CalendarClock,
  History,
  Bell,
  ArrowUpRight,
  ArrowDownLeft,
  Megaphone,
  Globe,
  Briefcase,
  Languages,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface LeadDetailPanelProps {
  lead: Lead;
  onClose: () => void;
}

const PRIORITY_CONFIG: Record<FollowUpPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-secondary text-secondary-foreground' },
  medium: { label: 'Medium', className: 'bg-amber-500/20 text-amber-600' },
  high: { label: 'High', className: 'bg-orange-500/20 text-orange-600' },
  urgent: { label: 'Urgent', className: 'bg-destructive/20 text-destructive' },
};

export function LeadDetailPanel({ lead, onClose }: LeadDetailPanelProps) {
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState(lead);

  // Dialog states
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);

  // Form states
  const [callNotes, setCallNotes] = useState('');
  const [callDuration, setCallDuration] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [messageChannel, setMessageChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [followUpTitle, setFollowUpTitle] = useState('');
  const [followUpDescription, setFollowUpDescription] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpPriority, setFollowUpPriority] = useState<FollowUpPriority>('medium');

  const assignedUser = teamMembers.find((u) => u.id === editedLead.assignedTo);
  const activities = getLeadActivities(lead.id);
  const calls = getLeadCalls(lead.id);
  const messages = getLeadMessages(lead.id);
  const followUps = getLeadFollowUps(lead.id);

  // Initialize editedLead with lead prop and load notes from localStorage
  useEffect(() => {
    // First, set the base lead data
    let updatedLead = { ...lead };

    // Then, try to load notes from localStorage
    try {
      const savedNotes = localStorage.getItem(`notes_${lead.id}`);
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        // Convert date strings back to Date objects
        const notesWithDates = parsedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
        }));
        updatedLead.notes = notesWithDates;
      }
    } catch (error) {
      console.error('Failed to load notes from localStorage:', error);
    }

    // Set the final state
    setEditedLead(updatedLead);
  }, [lead.id, lead]);


  const handleSave = () => {
    // In production, this would call an API to save changes
    toast({
      title: "Lead Updated",
      description: `Successfully updated ${editedLead.name}'s information.`,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedLead(lead);
    setIsEditing(false);
  };

  const updateField = (field: keyof Lead, value: any) => {
    setEditedLead({ ...editedLead, [field]: value });
  };

  const handleSaveCall = () => {
    toast({
      title: "Call Logged",
      description: `Call logged successfully${callNotes ? ' with notes' : ''}.`,
    });
    setCallNotes('');
    setCallDuration('');
    setShowCallDialog(false);
  };

  const handleSendMessage = () => {
    toast({
      title: "Message Sent",
      description: `${messageChannel.toUpperCase()} message sent to ${editedLead.name}.`,
    });
    setMessageContent('');
    setShowMessageDialog(false);
  };

  const handleAddFollowUp = () => {
    toast({
      title: "Follow-up Added",
      description: `"${followUpTitle}" scheduled successfully.`,
    });
    setFollowUpTitle('');
    setFollowUpDescription('');
    setFollowUpDate('');
    setShowFollowUpDialog(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    // Create new note object
    const newNoteObject = {
      id: `note-${Date.now()}`,
      content: newNote.trim(),
      createdAt: new Date(),
      createdBy: teamMembers[0].id, // Current user
    };

    // Store in localStorage for persistence (frontend-only for now)
    try {
      const existingNotes = JSON.parse(localStorage.getItem(`notes_${lead.id}`) || '[]');
      existingNotes.unshift(newNoteObject);
      localStorage.setItem(`notes_${lead.id}`, JSON.stringify(existingNotes));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }

    // Update local state with a completely new object to trigger re-render
    setEditedLead((prevLead) => ({
      ...prevLead,
      notes: [newNoteObject, ...prevLead.notes],
    }));

    toast({
      title: "Note Added",
      description: "Your note has been saved locally.",
    });
    setNewNote('');

    // TODO: When backend is ready, replace above with:
    // const createdNote = await notesApi.createNote(lead.id, newNote.trim());
    // setEditedLead({ ...editedLead, notes: [createdNote, ...editedLead.notes] });
  };

  const openWhatsApp = (message: string) => {
    const filledMessage = message
      .replace('{{name}}', lead.name.split(' ')[0])
      .replace('{{service}}', SERVICE_CONFIG[lead.service].label)
      .replace('{{clinic_name}}', lead.clinicName);
    const encoded = encodeURIComponent(filledMessage);
    const phone = lead.whatsappNumber || lead.phone;
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallIcon = (call: CallRecord) => {
    if (call.status === 'missed' || call.status === 'no_answer') {
      return <PhoneMissed className="h-4 w-4 text-destructive" />;
    }
    if (call.direction === 'inbound') {
      return <PhoneIncoming className="h-4 w-4 text-green-500" />;
    }
    return <PhoneOutgoing className="h-4 w-4 text-primary" />;
  };

  const getMessageStatusIcon = (status: MessageRecord['status']) => {
    switch (status) {
      case 'read':
        return <CheckCheck className="h-3.5 w-3.5 text-primary" />;
      case 'delivered':
        return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />;
      case 'sent':
        return <Check className="h-3.5 w-3.5 text-muted-foreground" />;
      case 'failed':
        return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
    }
  };

  const getChannelIcon = (channel: MessageRecord['channel']) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4 text-whatsapp" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4 text-primary" />;
      case 'email':
        return <Mail className="h-4 w-4 text-primary" />;
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return <PhoneCall className="h-4 w-4" />;
      case 'message':
        return <MessageCircle className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'note':
        return <MessageSquare className="h-4 w-4" />;
      case 'status_change':
        return <History className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'follow_up':
        return <Bell className="h-4 w-4" />;
    }
  };

  const stats = {
    totalCalls: calls.length,
    completedCalls: calls.filter(c => c.status === 'completed').length,
    totalMessages: messages.length,
    pendingFollowUps: followUps.filter(f => f.status === 'pending' || f.status === 'overdue').length,
  };

  return (
    <div className="animate-slide-up w-[420px] overflow-hidden rounded-xl border border-border bg-card shadow-elevated lg:block">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-3">
        <h3 className="font-semibold text-foreground">Lead Details</h3>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSave}>
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lead Info Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <span className="text-lg font-bold text-primary">
              {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editedLead.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="h-8 font-semibold"
                  placeholder="Lead name"
                />
                <Input
                  value={editedLead.clinicName}
                  onChange={(e) => updateField('clinicName', e.target.value)}
                  className="h-7 text-sm"
                  placeholder="Clinic/Organization name"
                />
              </div>
            ) : (
              <>
                <h4 className="font-semibold text-foreground">{editedLead.name}</h4>
                <p className="text-sm text-muted-foreground">{editedLead.clinicName}</p>
              </>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          <div className="rounded-lg bg-secondary/50 p-2 text-center">
            <p className="text-lg font-bold text-foreground">{stats.totalCalls}</p>
            <p className="text-xs text-muted-foreground">Calls</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2 text-center">
            <p className="text-lg font-bold text-foreground">{stats.totalMessages}</p>
            <p className="text-xs text-muted-foreground">Messages</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2 text-center">
            <p className="text-lg font-bold text-foreground">{activities.length}</p>
            <p className="text-xs text-muted-foreground">Activities</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2 text-center">
            <p className="text-lg font-bold text-foreground">{stats.pendingFollowUps}</p>
            <p className="text-xs text-muted-foreground">Follow-ups</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => (window.location.href = `tel:${lead.phone}`)}
          >
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button
            variant="whatsapp"
            size="sm"
            className="flex-1"
            onClick={() => openWhatsApp(`Hi ${lead.name.split(' ')[0]}, `)}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-5 gap-0 bg-secondary/30 p-1">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          <TabsTrigger value="calls" className="text-xs">Calls</TabsTrigger>
          <TabsTrigger value="messages" className="text-xs">Messages</TabsTrigger>
          <TabsTrigger value="followups" className="text-xs">Follow-ups</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-380px)]">
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0 p-4 space-y-4">
            {/* Contact Info */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold uppercase text-muted-foreground">Contact Info</h5>
              <div className="space-y-2">
                {/* Phone */}
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  {isEditing ? (
                    <Input
                      value={editedLead.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="h-8 text-sm flex-1"
                      placeholder="Phone number"
                    />
                  ) : (
                    <span className="text-foreground">{editedLead.phone}</span>
                  )}
                </div>

                {/* Alternate Phone */}
                {(isEditing || editedLead.alternatePhone) && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    {isEditing ? (
                      <Input
                        value={editedLead.alternatePhone || ''}
                        onChange={(e) => updateField('alternatePhone', e.target.value)}
                        className="h-8 text-sm flex-1"
                        placeholder="Alternate phone (optional)"
                      />
                    ) : (
                      <>
                        <span className="text-foreground">{editedLead.alternatePhone}</span>
                        <Badge variant="outline" className="text-[10px]">Alt</Badge>
                      </>
                    )}
                  </div>
                )}

                {/* WhatsApp */}
                {(isEditing || editedLead.whatsappNumber) && (
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="h-4 w-4 text-whatsapp flex-shrink-0" />
                    {isEditing ? (
                      <Input
                        value={editedLead.whatsappNumber || ''}
                        onChange={(e) => updateField('whatsappNumber', e.target.value)}
                        className="h-8 text-sm flex-1"
                        placeholder="WhatsApp number (optional)"
                      />
                    ) : (
                      <>
                        <span className="text-foreground">{editedLead.whatsappNumber}</span>
                        <Badge variant="outline" className="text-[10px]">WhatsApp</Badge>
                      </>
                    )}
                  </div>
                )}

                {/* Email */}
                {(isEditing || editedLead.email) && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    {isEditing ? (
                      <Input
                        value={editedLead.email || ''}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="h-8 text-sm flex-1"
                        placeholder="Email (optional)"
                        type="email"
                      />
                    ) : (
                      <span className="text-foreground">{editedLead.email}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold uppercase text-muted-foreground">Location</h5>
              <div className="space-y-2">
                {isEditing ? (
                  <>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <Input
                          value={editedLead.city || ''}
                          onChange={(e) => updateField('city', e.target.value)}
                          className="h-8 text-sm"
                          placeholder="City"
                        />
                        <Input
                          value={editedLead.state || ''}
                          onChange={(e) => updateField('state', e.target.value)}
                          className="h-8 text-sm"
                          placeholder="State"
                        />
                      </div>
                    </div>
                    <Input
                      value={editedLead.pincode || ''}
                      onChange={(e) => updateField('pincode', e.target.value)}
                      className="h-8 text-sm"
                      placeholder="PIN Code"
                    />
                    <Textarea
                      value={editedLead.address || ''}
                      onChange={(e) => updateField('address', e.target.value)}
                      className="text-xs resize-none min-h-[60px]"
                      placeholder="Full address"
                    />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{editedLead.city}{editedLead.state ? `, ${editedLead.state}` : ''}</span>
                    </div>
                    {editedLead.pincode && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-xs text-muted-foreground">PIN:</span>
                        <span className="text-foreground">{editedLead.pincode}</span>
                      </div>
                    )}
                    {editedLead.address && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-foreground text-xs">{editedLead.address}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Personal Details */}
            {(isEditing || lead.age || lead.gender || lead.birthday) && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold uppercase text-muted-foreground">Personal Details</h5>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Age</label>
                      <Input
                        type="number"
                        value={editedLead.age || ''}
                        onChange={(e) => updateField('age', parseInt(e.target.value) || undefined)}
                        className="h-8 text-sm mt-1"
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Gender</label>
                      <Select
                        value={editedLead.gender || 'not_specified'}
                        onValueChange={(value) => updateField('gender', value)}
                      >
                        <SelectTrigger className="h-8 text-sm mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="not_specified">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {editedLead.age && (
                      <div className="rounded-lg border border-border/50 bg-secondary/20 p-2">
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Age</label>
                        <p className="text-sm font-medium text-foreground">{editedLead.age} years</p>
                      </div>
                    )}
                    {editedLead.gender && (
                      <div className="rounded-lg border border-border/50 bg-secondary/20 p-2">
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Gender</label>
                        <p className="text-sm font-medium text-foreground capitalize">{editedLead.gender}</p>
                      </div>
                    )}
                    {editedLead.birthday && (
                      <div className="rounded-lg border border-border/50 bg-secondary/20 p-2 col-span-2">
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Birthday</label>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <p className="text-sm font-medium text-foreground">{format(editedLead.birthday, 'PPP')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Professional */}
            {(lead.occupation || lead.companyName) && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold uppercase text-muted-foreground">Professional Info</h5>
                <div className="space-y-2">
                  {lead.occupation && (
                    <div className="rounded-lg border border-border/50 bg-secondary/20 p-2">
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> Occupation
                      </label>
                      <p className="text-sm font-medium text-foreground">{lead.occupation}</p>
                    </div>
                  )}
                  {lead.companyName && (
                    <div className="rounded-lg border border-border/50 bg-secondary/20 p-2">
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Company</label>
                      <p className="text-sm font-medium text-foreground">{lead.companyName}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preferences */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold uppercase text-muted-foreground">Preferences</h5>
              <div className="grid gap-2">
                {lead.bestTimeToCall && (
                  <div className="rounded-lg border border-border/50 bg-secondary/20 p-2">
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Best Time to Call
                    </label>
                    <p className="text-sm font-medium text-foreground">{lead.bestTimeToCall}</p>
                  </div>
                )}
                {lead.languagePreference && (
                  <div className="rounded-lg border border-border/50 bg-secondary/20 p-2">
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Languages className="h-3 w-3" /> Language
                    </label>
                    <p className="text-sm font-medium text-foreground">{lead.languagePreference}</p>
                  </div>
                )}
                {lead.budget && (
                  <div className="rounded-lg border border-border/50 bg-secondary/20 p-2">
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Budget</label>
                    <p className="text-sm font-medium text-foreground">{lead.budget}</p>
                  </div>
                )}
                {lead.urgency && (
                  <div className="rounded-lg border border-border/50 bg-secondary/20 p-2">
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Urgency</label>
                    <Badge variant={lead.urgency === 'immediate' ? 'destructive' : 'secondary'} className="capitalize mt-1">
                      {lead.urgency.replace('_', ' ')}
                    </Badge>
                  </div>
                )}
                {lead.referredBy && (
                  <div className="rounded-lg border border-border/50 bg-secondary/20 p-2">
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <UserCheck className="h-3 w-3" /> Referred By
                    </label>
                    <p className="text-sm font-medium text-foreground">{lead.referredBy}</p>
                  </div>
                )}
                {lead.previousClinicVisited !== undefined && (
                  <div className="rounded-lg border border-border/50 bg-secondary/20 p-2">
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Previous Clinic Visit</label>
                    <p className="text-sm font-medium text-foreground">{lead.previousClinicVisited ? 'Yes' : 'No'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Meta/Google Ads Data Preview */}
            {(lead.metaData || lead.googleData) && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {lead.metaData ? <Megaphone className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground">
                      {lead.metaData ? 'Meta Ads Lead' : 'Google Ads Lead'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      View full campaign details in the respective tab
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Status & Assignment */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
              <div>
                <label className="text-xs font-medium uppercase text-muted-foreground">Status</label>
                <Select
                  value={editedLead.status}
                  onValueChange={(value) => updateField('status', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium uppercase text-muted-foreground">Assigned</label>
                <Select
                  value={editedLead.assignedTo}
                  onValueChange={(value) => updateField('assignedTo', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="pt-2 border-t">
              <h5 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Notes</h5>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="min-h-[60px] resize-none"
              />
              <Button
                size="sm"
                className="mt-2 w-full"
                disabled={!newNote.trim()}
                onClick={handleAddNote}
              >
                <Plus className="h-4 w-4" />
                Add Note
              </Button>

              {lead.notes.length > 0 && (
                <div className="mt-3 space-y-2">
                  {lead.notes.slice(0, 2).map((note) => {
                    const author = teamMembers.find((u) => u.id === note.createdBy);
                    return (
                      <div key={note.id} className="rounded-lg border border-border/50 bg-secondary/20 p-2">
                        <p className="text-xs text-foreground">{note.content}</p>
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{author?.name}</span>
                          <span className="mx-1">•</span>
                          <span>{format(note.createdAt, 'PP')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Activity Timeline Tab */}
          <TabsContent value="activity" className="mt-0 p-4">
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-px bg-border" />
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No activities yet</p>
                ) : (
                  activities.map((activity) => {
                    const author = teamMembers.find((u) => u.id === activity.createdBy);
                    return (
                      <div key={activity.id} className="relative pl-10">
                        <div className="absolute left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="rounded-lg border border-border/50 bg-secondary/20 p-3">
                          <div className="flex items-start justify-between">
                            <h6 className="text-sm font-medium text-foreground">{activity.title}</h6>
                            <span className="text-[10px] text-muted-foreground">
                              {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                            </span>
                          </div>
                          {activity.description && (
                            <p className="mt-1 text-xs text-muted-foreground">{activity.description}</p>
                          )}
                          <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{author?.name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </TabsContent>

          {/* Calls Tab */}
          <TabsContent value="calls" className="mt-0 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h5 className="text-xs font-semibold uppercase text-muted-foreground">Call History</h5>
              <Button size="sm" variant="outline" onClick={() => setShowCallDialog(true)}>
                <Plus className="h-3.5 w-3.5" />
                Log Call
              </Button>
            </div>

            <div className="space-y-3">
              {calls.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No calls recorded</p>
              ) : (
                calls.map((call) => {
                  const caller = teamMembers.find((u) => u.id === call.createdBy);
                  return (
                    <div key={call.id} className="rounded-lg border border-border/50 bg-secondary/20 p-3">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-full',
                          call.status === 'completed' ? 'bg-green-500/10' : 'bg-destructive/10'
                        )}>
                          {getCallIcon(call)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {call.direction === 'inbound' ? 'Incoming' : 'Outgoing'} Call
                              </span>
                              <Badge variant={call.status === 'completed' ? 'default' : 'destructive'} className="text-[10px]">
                                {call.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDuration(call.duration)}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{format(call.createdAt, 'PPp')}</span>
                          </div>
                          {call.notes && (
                            <p className="mt-2 text-xs text-muted-foreground">{call.notes}</p>
                          )}
                          <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{caller?.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="mt-0 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h5 className="text-xs font-semibold uppercase text-muted-foreground">Message History</h5>
              <Button size="sm" variant="outline" onClick={() => setShowMessageDialog(true)}>
                <Plus className="h-3.5 w-3.5" />
                Send Message
              </Button>
            </div>

            <div className="space-y-3">
              {messages.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No messages yet</p>
              ) : (
                messages.map((msg) => {
                  const sender = teamMembers.find((u) => u.id === msg.createdBy);
                  return (
                    <div key={msg.id} className={cn(
                      'rounded-lg border border-border/50 p-3',
                      msg.direction === 'outbound' ? 'bg-primary/5 ml-4' : 'bg-secondary/20 mr-4'
                    )}>
                      <div className="flex items-start gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary">
                          {getChannelIcon(msg.channel)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium capitalize text-foreground">{msg.channel}</span>
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              {msg.direction === 'outbound' ? (
                                <ArrowUpRight className="h-3 w-3" />
                              ) : (
                                <ArrowDownLeft className="h-3 w-3" />
                              )}
                              {msg.direction}
                            </span>
                            {getMessageStatusIcon(msg.status)}
                          </div>
                          <p className="mt-1 text-xs text-foreground">{msg.content}</p>
                          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{format(msg.createdAt, 'PPp')}</span>
                            {sender && (
                              <>
                                <span className="mx-1">•</span>
                                <User className="h-3 w-3" />
                                <span>{sender.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Follow-ups Tab */}
          <TabsContent value="followups" className="mt-0 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h5 className="text-xs font-semibold uppercase text-muted-foreground">Follow-ups</h5>
              <Button size="sm" variant="outline" onClick={() => setShowFollowUpDialog(true)}>
                <Plus className="h-3.5 w-3.5" />
                Add Follow-up
              </Button>
            </div>

            <div className="space-y-3">
              {followUps.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No follow-ups scheduled</p>
              ) : (
                followUps.map((followUp) => {
                  const creator = teamMembers.find((u) => u.id === followUp.createdBy);
                  const isOverdue = followUp.status === 'overdue';
                  const isPending = followUp.status === 'pending';

                  return (
                    <div key={followUp.id} className={cn(
                      'rounded-lg border p-3',
                      isOverdue ? 'border-destructive/50 bg-destructive/5' :
                        isPending ? 'border-primary/50 bg-primary/5' :
                          'border-border/50 bg-secondary/20'
                    )}>
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-full',
                          isOverdue ? 'bg-destructive/10 text-destructive' :
                            isPending ? 'bg-primary/10 text-primary' :
                              'bg-secondary text-muted-foreground'
                        )}>
                          <CalendarClock className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h6 className="text-sm font-medium text-foreground">{followUp.title}</h6>
                            <Badge className={cn('text-[10px]', PRIORITY_CONFIG[followUp.priority].className)}>
                              {PRIORITY_CONFIG[followUp.priority].label}
                            </Badge>
                          </div>

                          {followUp.description && (
                            <p className="mt-1 text-xs text-muted-foreground">{followUp.description}</p>
                          )}

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {followUp.type}
                            </Badge>
                            <Badge
                              variant={isOverdue ? 'destructive' : isPending ? 'default' : 'secondary'}
                              className="text-[10px] capitalize"
                            >
                              {followUp.status}
                            </Badge>
                          </div>

                          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {isOverdue ? 'Was due' : 'Due'}: {format(followUp.scheduledFor, 'PPp')}
                            </span>
                          </div>

                          <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>Created by {creator?.name}</span>
                          </div>

                          {isPending && (
                            <div className="mt-3 flex gap-2">
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast({ title: "Follow-up Completed", description: `"${followUp.title}" marked as complete.` })}>
                                Complete
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast({ title: "Reschedule", description: "Reschedule dialog coming soon!" })}>
                                Reschedule
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Log Call Dialog */}
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Call</DialogTitle>
            <DialogDescription>Record details about this call with {editedLead.name}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="call-duration">Duration (minutes)</Label>
              <Input
                id="call-duration"
                type="number"
                placeholder="e.g. 5"
                value={callDuration}
                onChange={(e) => setCallDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="call-notes">Call Notes</Label>
              <Textarea
                id="call-notes"
                placeholder="What was discussed..."
                className="min-h-[100px]"
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCallDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveCall}>Save Call</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>Send a message to {editedLead.name}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message-channel">Channel</Label>
              <Select value={messageChannel} onValueChange={(value: any) => setMessageChannel(value)}>
                <SelectTrigger id="message-channel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message-content">Message</Label>
              <Textarea
                id="message-content"
                placeholder="Type your message..."
                className="min-h-[120px]"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>Cancel</Button>
            <Button onClick={handleSendMessage} disabled={!messageContent.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Follow-up Dialog */}
      <Dialog open={showFollowUpDialog} onOpenChange={setShowFollowUpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Follow-up</DialogTitle>
            <DialogDescription>Schedule a follow-up task for {editedLead.name}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="followup-title">Title</Label>
              <Input
                id="followup-title"
                placeholder="e.g. Follow up on quotation"
                value={followUpTitle}
                onChange={(e) => setFollowUpTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="followup-date">Date & Time</Label>
              <Input
                id="followup-date"
                type="datetime-local"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="followup-priority">Priority</Label>
              <Select value={followUpPriority} onValueChange={(value: any) => setFollowUpPriority(value)}>
                <SelectTrigger id="followup-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="followup-description">Description (Optional)</Label>
              <Textarea
                id="followup-description"
                placeholder="Additional details..."
                className="min-h-[80px]"
                value={followUpDescription}
                onChange={(e) => setFollowUpDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFollowUpDialog(false)}>Cancel</Button>
            <Button onClick={handleAddFollowUp} disabled={!followUpTitle.trim() || !followUpDate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Follow-up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}